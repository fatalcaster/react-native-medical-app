const config = {
  createArticleURL: `${process.env.REACT_APP_BACKEND_URL}/api/article`,
  articlesURL: `${process.env.REACT_APP_BACKEND_URL}/api/article`,
  articleURL: (id) => `${process.env.REACT_APP_BACKEND_URL}/api/article/${id}`,
  updateArticleURL: (id) =>
    `${process.env.REACT_APP_BACKEND_URL}/api/article/${id}`,
  // imgUploadURL: `${proces.env.REACT_APP_BACKEND_URL}/api/image`,
  audioURL: (id) =>
    `${process.env.REACT_APP_BACKEND_URL}/api/article/${id}/audio`,
};

export default config;
