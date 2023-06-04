import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

declare global {
  var getAuthCookie: () => string;
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_ACCESS_TOKEN = "asdfasdf";

  mongo = await MongoMemoryServer.create();

  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
  await app.close();
});

// global.getAuthCookie = () => {
//   const payload = {
//     id: "543534",
//     username: "testerica",
//     sessionId: "r432r3543",
//   };

//   const token = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN!);

//   return token;
// };
