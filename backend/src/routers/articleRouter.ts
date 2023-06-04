import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { upload } from "../config/multer";
import { ArticleStatus } from "../models/Article";
import {
  createArticle,
  createAudio,
  deleteArticle,
  getArticleById,
  getArticles,
  grantReadingAccess,
  updateArticleContent,
  updateProperty,
} from "../services/article-service";
import { File } from "fastify-multer/lib/interfaces";
import { attachImages, signMediaLink } from "../services/S3";

type CreateRequest = FastifyRequest<{ Body: { title: string } }> & {
  file: File;
};
type GetByIdRequest = FastifyRequest<{ Params: { id: string } }>;
type GetAllRequest = FastifyRequest<{ Querystring: { before?: number } }>;
type UpdateRequest = FastifyRequest<{
  Body: {
    document?: string;
    title?: string;
    status?: ArticleStatus;
  };
  Params: { id: string };
}> & { files?: File[] };

// function isJsonString(str: string) {
//   try {
//     JSON.parse(str);
//   } catch (e) {
//     return false;
//   }
//   return true;
// }
function articleRouter(app: FastifyInstance, _options: any, done: any) {
  app.post(
    "/api/article",
    { preHandler: upload.single("banner") },
    async (req: CreateRequest, res: FastifyReply) => {
      const { title } = req.body;
      const file = req.file;

      const article = await createArticle({
        title: title,
        author: "Test",
        bannerImg: file,
      });
      res.status(201).send(article);
    }
  );

  app.put(
    "/api/article/:id",
    { preHandler: upload.array("images", 20) },
    async (req: UpdateRequest, res: FastifyReply) => {
      const { id } = req.params;
      if (!req.body) {
        throw new Error("Bad Request");
      }
      const { title, status, document } = req.body;
      const files = req.files;

      if (document !== undefined) {
        // if (!isJsonString(document)) throw new Error("Bad Request");
        // console.log(document);

        const article = await updateArticleContent(id, document, files);
        console.log(article);
        if (!article) throw new Error("Not Found");
        res.code(204).send();
        return;
      } else if (title !== undefined) {
        const article = await updateProperty(id, title, "title");
        if (!article) throw new Error("Not Found");
        res.code(204).send();
        return;
      } else if (status !== undefined) {
        const article = await updateProperty(id, status, "status");
        if (!article) throw new Error("Not Found");

        res.code(204).send();
      } else throw new Error("Bad Request");
    }
  );
  app.get("/api/article/:id", async (req: GetByIdRequest) => {
    const { id } = req.params;
    const article = await getArticleById(id);

    if (article === null) throw new Error("Not Found");
    if (article.document) {
      article.document = await grantReadingAccess(article.document!);
    }
    article.bannerImg = await signMediaLink(article.bannerImg);
    console.log(article.document);
    return article;
  });

  app.get("/api/article/:id/audio", async (req: GetByIdRequest) => {
    const { id } = req.params;
    return await signMediaLink({ articleId: id, media_name: "audio" });
  });

  app.post(
    "/api/article/:id/audio",
    { preHandler: upload.single("audio") },
    async (req: GetByIdRequest) => {
      const { id } = req.params;

      await createAudio(id);
      return await signMediaLink({ articleId: id, media_name: "audio" });
    }
  );

  app.get("/api/article", async (req: GetAllRequest) => {
    const { before } = req.query;
    const articles = await attachImages(await getArticles(before), "bannerImg");
    // const articles = await getArticles(before);

    return articles;
  });
  app.delete(
    "/api/article/:id",
    async (req: GetByIdRequest, res: FastifyReply) => {
      const { id } = req.params;
      const article = await deleteArticle(id);
      if (article === null) throw new Error("Not Found");
      console.log(article.document);
      console.log(JSON.stringify(article));
      res.status(204).send();
    }
  );
  done();
}
export { articleRouter };
