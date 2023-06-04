import { Article, ArticleDoc, ArticleProps } from "./../models/Article";
import { Types } from "mongoose";
import { deleteArticleMedia, signMediaLink, uploadMedia } from "./S3";
import { File } from "fastify-multer/lib/interfaces";
import { v4 as uuidv4 } from "uuid";
import { replaceImagesWithId } from "../helpers/document-parser";
import readText from "./text-to-speech";
const PAGE_LIMIT = 50;

async function createArticle(
  new_article: Omit<ArticleProps, "bannerImg"> & { bannerImg: File }
) {
  const article = Article.build(new_article);
  const image_name = `banner-${article.id}`;
  await uploadMedia(article.id, image_name, new_article.bannerImg);
  article.bannerImg = `${article.id}/${image_name}`;
  await article.save();
  return article;
}
async function updateProperty<T extends keyof ArticleDoc>(
  id: string,
  newValue: ArticleDoc[T],
  key: T
) {
  if (!Types.ObjectId.isValid(id)) return null;
  const article = await Article.findByIdAndUpdate(id, { [key]: newValue });
  return article;
}

const uploadSingleImage = async (articleId: string, file: File) => {
  const fileName = uuidv4();
  await uploadMedia(articleId, fileName, file);
  return { name: file.originalname, url: `${articleId}/${fileName}` };
};
const extractText = (document: any) => {
  let str = "";
  document.forEach((element: any) => {
    if (element.text) str = str.concat(element.text);
    if (element.content) str = str.concat(extractText(element.content), " ");
  });
  return str;
};

const getAndExtractText = async (id: string) => {
  const article = await getArticleById(id);

  if (!article || !article.document || !article.document) return null;
  const document = JSON.parse(article.document);

  if (!document.content) return null;
  const text = extractText(document.content);
  return text;
};
const createAudio = async (id: string) => {
  // Extract text from the article
  const text = await getAndExtractText(id);
  if (text === null) return null;

  const audio_array = (await readText(text)) as Uint8Array;
  const file = await uploadMedia(id, "audio", {
    buffer: audio_array,
    mimetype: "audio/mp3",
  });
  const article = await Article.findByIdAndUpdate(id, { hasAudio: true });
  if (!article) {
    throw new Error("Internal Error");
  }
  return file;
  // const response = await uploadMedia(id, "audio", audio_array);
};

async function updateArticleContent(
  id: string,
  document: string,
  files?: File[]
) {
  if (!Types.ObjectId.isValid(id)) return null;

  const summary = extractText(JSON.parse(document).content).substring(0, 50);
  if (files === undefined || files.length === 0) {
    const new_document = replaceImagesWithId(document, []);
    const article = await Article.findByIdAndUpdate(id, {
      document: JSON.stringify(new_document),
      summary: summary,
    });
    return article;
  }

  // Instead of waiting for every promise to finish we execute them concurently
  const promises: Promise<{ name: string; url: string }>[] = [];
  files.forEach((file) => promises.push(uploadSingleImage(id, file)));
  const fileNames = await Promise.all(promises);

  // replaces every img tag source with articleId/file_name
  const new_document = replaceImagesWithId(document, fileNames);
  const article = await Article.findByIdAndUpdate(id, {
    document: JSON.stringify(new_document),
    summary: summary,
  });
  return article;
}

async function grantReadingAccess(JSONDocument: string) {
  const document = JSON.parse(JSONDocument);
  const content = document.content;
  for (let i = 0; i < content.length; i++) {
    // if the media type is image...
    if (content[i].type === "image" && !!content[i].attrs.src) {
      const p = await signMediaLink(content[i].attrs.src);
      content[i].attrs.src = p;
      // if there's content within content, call the function again
      // if (content[i].content !== undefined)
      //   grantReadingAccess(content[i].content);
    }
  }
  return JSON.stringify(document);
}

async function getArticleById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  const article = await Article.findById(id);
  return article;
}
async function getArticles(before?: number) {
  const article = await Article.find(
    {
      createdAt: { $lte: before || new Date() },
    },
    { id: 1, bannerImg: 1, author: 1, status: 1, title: 1, hasAudio: 1 }
  )
    .limit(PAGE_LIMIT)
    .sort("-createdAt");
  return article;
}
async function deleteArticle(id: string) {
  // if the id is not valid return null
  if (!Types.ObjectId.isValid(id)) return null;
  // delete the article, retrieve it for further use
  await deleteArticleMedia(id);

  const article = await Article.findByIdAndDelete(id);
  return article;
}
export {
  createArticle,
  getArticleById,
  getArticles,
  deleteArticle,
  updateProperty,
  updateArticleContent,
  grantReadingAccess,
  createAudio,
};
