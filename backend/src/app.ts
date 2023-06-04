import fastify, { FastifyRequest } from "fastify";
import { articleRouter } from "./routers/articleRouter";
import cors from "@fastify/cors";
import { contentParser } from "fastify-multer";
import fastifySession from "@fastify/secure-session";
import config from "./config/config";
// import BearerStrategy from "passport-http-bearer";

// import fastifyPassport from "@fastify/passport";
// import fastifySecureSession from "@fastify/secure-session";
// import config from "./config";
const app = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

app.register(fastifySession, {
  cookieName: "session-cookie",
  cookie: {
    path: "/",
  },
  key: [config.COOKIE_KEY],
});

app.register(cors, { origin: "http://localhost:3000" });
app.addContentTypeParser(
  "multipart/form-data",
  function (_req: FastifyRequest, _payload: any, done: any) {
    done();
  }
);
// app.register(mediaRouter);

app.register(articleRouter);
app.register(contentParser);

export { app };
