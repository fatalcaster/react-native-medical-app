import { extractIdFromAWSLink } from "../services/S3";

function replaceImagesWithId(
  JSONDocument: any,
  imgUrls: { name: string; url: string }[]
) {
  const document = JSON.parse(JSONDocument);

  const content = document.content;
  for (let i = 0; i < content.length; i++) {
    // if the media type is image...
    if (content[i].type === "image") {
      if (content[i].attrs.alt === null) {
        content[i].attrs.src = extractIdFromAWSLink(content[i].attrs.src);
        continue;
      }
      for (let j = 0; j < imgUrls.length; j++) {
        // ... and its name matches one of the images
        if (content[i].attrs.alt === imgUrls[j].name) {
          // set src to id in the bucket
          content[i].attrs.src = imgUrls[j].url;
          // clean up the alt as we don't need it  anymore
          content[i].attrs.alt = null;
          break;
        }
      }
      // if there's content within content, call the function again
      // if (content[i].content !== undefined)
      //   replaceImagesWithId(content[i].content, imgUrls);
    }
  }

  return document;
}

export { replaceImagesWithId };
