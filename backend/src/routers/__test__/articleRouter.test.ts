import { app } from "../../app";
import { ArticleDoc, ArticleStatus } from "../../models/Article";

const createArticle = async () => {
  const content = {
    test: "Some old content",
  };
  const response = await app.inject({
    method: "POST",
    url: "/api/article",
    payload: {
      title: JSON.stringify(content),
    },
  });
  return response;
};
it("Expect 201 Article Created", async () => {
  const article = await createArticle();
  expect(article.statusCode).toEqual(201);
});

it("Expect articles to be found", async () => {
  await createArticle();
  await createArticle();
  const response = await app.inject({
    method: "GET",
    url: `/api/article`,
  });
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body).length).toEqual(2);
});

it("Updates article status from unpublished to published", async () => {
  const article = JSON.parse((await createArticle()).body) as ArticleDoc;

  expect(article.status).toEqual(ArticleStatus.Unpublished);
  const updated_response = await app.inject({
    method: "PUT",
    url: `/api/article/${article.id}`,
    payload: {
      status: ArticleStatus.Published,
    },
  });
  expect(updated_response.statusCode).toEqual(204);
  const response = await app.inject({
    method: "GET",
    url: `/api/article/${article.id}`,
  });
  expect(response.statusCode).toEqual(200);
  expect(JSON.parse(response.body).status).toEqual(ArticleStatus.Published);
});
it("updates article content successfully", async () => {
  const article = JSON.parse((await createArticle()).body) as ArticleDoc;

  const content = "TRALALALALALA";

  const updated_response = await app.inject({
    method: "PUT",
    url: `/api/article/${article.id}`,
    payload: {
      document: JSON.stringify(content),
      content: content,
    },
  });
  expect(updated_response.statusCode).toEqual(204);
});
it("Expect articles to be found", async () => {
  const article = await createArticle();
  const id = JSON.parse(article.body).id;
  const response = await app.inject({
    method: "GET",
    url: `/api/article/${id}`,
  });
  expect(response.statusCode).toEqual(200);
  // expect(JSON.parse(response.body)).toEqual(2);
});
