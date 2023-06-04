import multer from "fastify-multer/lib";

const storage = multer.memoryStorage();
const upload = multer({ storage });
export { upload };
