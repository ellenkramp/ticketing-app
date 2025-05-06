import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

jest.mock("../nats-wrapper.ts");

declare global {
  var signin: () => string[];
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "whatever";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // JWT payload {id, email}
  const id = new mongoose.Types.ObjectId().toHexString();

  const payload = {
    id,
    email: "test@tester.com",
  };
  // create JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // create session object
  const session = { jwt: token };
  // turn session into json
  const sessionJSON = JSON.stringify(session);
  // encode json as b64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  // return string encoded cookie data
  return [`session=${base64}`];
};
