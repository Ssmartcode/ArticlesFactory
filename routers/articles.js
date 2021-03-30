const express = require("express");
const { flash } = require("express-flash-message");
const moment = require("moment");

const router = express.Router();
const Article = require("../models/article");
router.get("/all", (req, res) => {
  res.redirect("/");
});
router.get("/entertainment", async (req, res) => {
  const articles = await Article.find({ category: "entertainment" });
  res.render("category", { articles, category: "entertainment" });
});
router.get("/technology", async (req, res) => {
  const articles = await Article.find({ category: "technology" });
  res.render("category", { articles, category: "technology" });
});
router.get("/health", async (req, res) => {
  const articles = await Article.find({ category: "health" });
  res.render("category", { articles, category: "health" });
});
router.get("/family", async (req, res) => {
  if (req.isAuthenticated()) {
    const articles = await Article.find({ category: "family" });
    res.render("category", { articles, category: "family" });
  } else {
    req.flash("warning", "You need an account to access these articles.");
    res.redirect("/user/login");
  }
});

//Get article from DB
router.get("/article/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const article = await Article.findById(id);
    // Redirect if anonym user tries to access a premium article
    if (article.category === "family" && !req.isAuthenticated()) {
      req.flash("warning", "You need an account to read this article");
      res.redirect("/user/login");
    } else {
      const date = new Date(article.createdAt);
      const formatedDate = moment(date).format("DD/MM/YYYY-hh:mm:ss a");
      res.render("article", { article, formatedDate });
    }
  } catch (err) {
    req.flash("danger", err.message);
    res.redirect("/");
  }
});

module.exports = router;
