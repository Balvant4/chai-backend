//it is also working but we use another code for production level coding
//require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express";

import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB();

/*
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("Error in express ", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`app is listining on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("ERROR: ", error);
    throw error;
  }
})();
*/
