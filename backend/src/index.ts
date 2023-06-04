import { app } from "./app";
import mongoose from "mongoose";
import config from "./config/config";

const start = async () => {
  Object.keys(config).forEach((key: keyof typeof config) => {
    if (config[key] === undefined) throw new Error(`${key} MUST BE DEFINED`);
  });

  await mongoose.connect(config.MONGO_URI!);
  console.log("MONGO CONNECTED");
  try {
    await app.listen({
      port: parseInt(config.PORT),
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
