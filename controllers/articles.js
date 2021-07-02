const sortFromRecent = require("../config/sorting");
const Article = require("../models/article");
const moment = require("moment");

const getArticles = async (req, res) => {
  let articles = await Article.find();
  articles = sortFromRecent(articles);
  res.render("category", { articles, category: "all" });
};

const getEntertainmentArticles = async (req, res) => {
  let articles = await Article.find({ category: "entertainment" });
  articles = sortFromRecent(articles);
  res.render("category", { articles, category: "entertainment" });
};

const getTechnologyArticles = async (req, res) => {
  let articles = await Article.find({ category: "technology" });
  articles = sortFromRecent(articles);
  res.render("category", { articles, category: "technology" });
};

const getFamilyArticles = async (req, res) => {
  if (req.isAuthenticated()) {
    let articles = await Article.find({ category: "family" });
    articles = sortFromRecent(articles);
    res.render("category", { articles, category: "family" });
  } else {
    req.flash("warning", "You need an account to access these articles.");
    res.redirect("/user/login");
  }
};

const getHealthArticles = async (req, res) => {
  let articles = await Article.find({ category: "health" });
  articles = sortFromRecent(articles);
  res.render("category", { articles, category: "health" });
};

const getArticle = async (req, res) => {
  const id = req.params.id;
  try {
    const article = await Article.findById(id);
    const categoryArticles = await Article.find({ category: article.category });

    if (!article) return res.render("page404");
    // Redirect if visitors try to access a premium article
    if (article.category === "family" && !req.isAuthenticated()) {
      req.flash("warning", "You need an account to read this article");
      res.redirect("/user/login");
    } else {
      const date = new Date(article.createdAt);
      const formatedDate = moment(date).format("DD/MM/YYYY-hh:mm:ss a");
      res.render("article", { article, categoryArticles, formatedDate });
    }
  } catch (err) {
    res.status(404).render("page404", { error: "Could not find this article" });
  }
};

module.exports = {
  getArticles,
  getEntertainmentArticles,
  getTechnologyArticles,
  getFamilyArticles,
  getHealthArticles,
  getArticle,
};
