//it is also working but we use another code for production level coding
//require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express";

import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection Faild", err);
  });

//second way to connect atlas

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
