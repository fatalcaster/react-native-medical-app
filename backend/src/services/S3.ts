import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  ObjectIdentifier,
  ListObjectsCommand,
  ListObjectsCommandInput,
} from "@aws-sdk/client-s3";
import config from "../config/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const s3 = new S3Client({
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY!,
    secretAccessKey: config.AWS_SECRET_KEY!,
  },
  region: config.AWS_BUCKET_REGION!,
});

async function uploadMedia(
  prefix: string,
  name: string,
  file: { buffer?: any; mimetype: string }
) {
  const params = {
    Bucket: config.AWS_BUCKET_NAME!,
    Body: file.buffer,
    Key: `${prefix}/${name}`,
    ContentType: file.mimetype,
  };
  const command = new PutObjectCommand(params);
  const response = await s3.send(command);
  return response;
}

async function uploadBuffer(
  prefix: string,
  name: string,
  buffer: Uint8Array | string,
  bufferType: string
) {
  const params = {
    Bucket: config.AWS_BUCKET_NAME!,
    Body: buffer,
    Key: `${prefix}/${name}`,
    ContentType: bufferType,
  };
  const command = new PutObjectCommand(params);
  const response = await s3.send(command);
  return response;
}

async function signMediaLink(
  data: { articleId: string; media_name: string } | string
) {
  const getObjectParams = {
    Bucket: config.AWS_BUCKET_NAME!,
    Key:
      typeof data === "string" ? data : `${data.articleId}/${data.media_name}`,
  };
  const command = new GetObjectCommand(getObjectParams);
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
}

// async function getFileStream(articleId: string, image_name: string) {
//   const downloadParams: GetObjectCommandInput = {
//     Key: `${articleId}/${image_name}`,
//     Bucket: config.AWS_BUCKET_NAME!,
//   };
//   const command = new GetObjectCommand(downloadParams);
//   return s3.send(command);
// }

async function attachImages<T, K extends keyof T>(arr: T[], key: K) {
  for (const element of arr) {
    const getObjectParams = {
      Bucket: config.AWS_BUCKET_NAME!,
      Key: element[key] as string,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    (element[key] as string) = url;
  }
  return arr;
}
async function deleteArticleMedia(id: string) {
  console.log("PROSO I OVDE");
  const listObjectsParams: ListObjectsCommandInput = {
    Bucket: config.AWS_BUCKET_NAME!,
    Prefix: id,
  };
  const listCommand = new ListObjectsCommand(listObjectsParams);
  const listedObjects = await s3.send(listCommand);
  if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

  const deleteObjectsParams: DeleteObjectsCommandInput = {
    Bucket: config.AWS_BUCKET_NAME!,
    Delete: {
      Objects: listedObjects.Contents.map((content) => {
        return { Key: content.Key };
      }),
    },
  };
  const deleteCommand = new DeleteObjectsCommand(deleteObjectsParams);
  await s3.send(deleteCommand);
  if (listedObjects.IsTruncated === true) {
    await deleteArticleMedia(id);
    console.log("IMA JOS");
  }
}

async function deleteImages(images: string[]) {
  const imageKeys: ObjectIdentifier[] = images.map(function (image) {
    return { Key: image };
  });

  const deleteObjectsParams: DeleteObjectsCommandInput = {
    Bucket: config.AWS_BUCKET_NAME!,
    Delete: {
      Objects: imageKeys,
    },
  };
  const command = new DeleteObjectsCommand(deleteObjectsParams);
  const response = await s3.send(command);
  return response;
}
function isAWSLink(link: string) {
  return link.includes("aws");
}
function extractIdFromAWSLink(link: string) {
  const articleId = link.split("/", 5);
  const imageId = articleId[4].split("?", 2);
  console.log(imageId[0]);
  console.log(articleId[3]);
  return `${articleId[3]}/${imageId[0]}`;
}
export {
  uploadMedia,
  uploadBuffer,
  attachImages,
  deleteImages,
  deleteArticleMedia,
  signMediaLink,
  isAWSLink,
  extractIdFromAWSLink,
};
