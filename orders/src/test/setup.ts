import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock("../nats-wrapper.ts");

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
  jest.clearAllMocks();
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

global.signin = () => {
  // build a JWT payload {id,email}
  let payload = { id: new mongoose.Types.ObjectId(), email: "asdf@asf.com" };
  //create JWT
  let token = jwt.sign(payload, process.env.JWT_KEY!);
  // build session obj
  let session = { jwt: token };
  //turn it into json
  let sessionJSON = JSON.stringify(session);
  //encode it as Base64
  let base64 = Buffer.from(sessionJSON).toString("base64");
  //return a string as the cookie template
  return [`session=${base64}`];
};
