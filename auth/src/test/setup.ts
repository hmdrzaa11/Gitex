import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  var signin: () => Promise<string[]>;
}

let mongod: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
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

global.signin = async () => {
  let email = "asdf@asdf.com";
  let password = "asdf";
  let response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  let cookie = response.get("Set-Cookie");
  return cookie;
};
