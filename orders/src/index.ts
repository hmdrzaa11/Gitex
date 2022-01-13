import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

let start = async () => {
  //check for Env Vars
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("NATS_CLIENT_ID must be defined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID must be defined");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to MongoDB!");
    natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGTERM", () => natsWrapper.client.close());
    process.on("SIGINT", () => natsWrapper.client.close());
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Orders listening on 3000!!!");
  });
};

start();