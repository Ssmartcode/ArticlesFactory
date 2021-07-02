module.exports = (articles) => {
  articles.sort(
    (article1, article2) => article2.createdAt - article1.createdAt
  );
  return articles;
};
