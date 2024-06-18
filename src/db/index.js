import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import e from "express";

const connectDB = async () => {
  try {
    const connenctionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `\n MONGODB connected !! DB HOST: ${connenctionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILD", error);
    process.exit(1);
  }
};

export default connectDB;
