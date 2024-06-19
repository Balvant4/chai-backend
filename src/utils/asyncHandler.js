//it simply make method and export for uses

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// Using try catch
/*
const asyncHandler = (fn) => async (req,res,next) => {
  try {
  } catch (error) {
    res.status(err.code || 500).json({
      succes: false,
      message: err.message,
    });
  }
};
*/
