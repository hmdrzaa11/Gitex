import mongoose from "mongoose";
import { app } from "./app";

let start = async () => {
  //check for Env Vars
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Auth listening on 3000!!!");
  });
};

start();
