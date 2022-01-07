import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

let mongod: any;
beforeAll(async () => {
  //setup mongo
  mongod = await MongoMemoryServer.create();
  let mongoUri = mongod.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

beforeEach(async () => {
  //we are going to delete and reset all the data
  let collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  //delete connection
  await mongod.stop();
  await mongoose.connection.close();
});
