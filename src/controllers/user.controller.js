import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refereshToken = user.generateRefereshToken();

    user.refereshToken = refereshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refereshToken };
    //
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get user details from front end
  //validation - not empty
  //check if user already exist: check username or email se bhi
  //check for images, or avtar
  //upload them to cloudniary, avtar check
  //create user object - create entry in db
  //remove password and referesh token field from response
  //check for user creation
  //return response if not create retun error

  const { username, email, fullname, password } = req.body;
  console.log("email", email);

  if (
    [fullname, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //check if user already exist: check username or email se bhi

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  const avatarLocalPath = req.files?.avtar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avtar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refershToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registring the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register succesfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //req body se data le aoo
  //username or email
  //find the user
  //check password
  //access and refresh token
  //send cookie

  const { email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refereshToken } = await generateAccessAndRefereshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refershToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refereshToken", refereshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refereshToken,
        },
        "User logged In succesfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refershToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refereshToken")
    .json(new ApiResponse(200, {}, "user logged out"));
});
export { registerUser, loginUser, logoutUser };
