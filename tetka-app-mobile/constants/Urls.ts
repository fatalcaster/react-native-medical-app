const base = "http://localhost:5000";

const URLs = {
  getArticles: `${base}/api/article`,
  getTheArticle: (id: string) => `${base}/api/article/${id}`,
  getAudio: (id: string) => `${base}/api/article/${id}/audio`,
};

export default URLs;
