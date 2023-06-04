import dotenv from "dotenv";

dotenv.config();

export default {
  COOKIE_KEY: Buffer.from(process.env.COOKIE_KEY!, "hex"),
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
};
