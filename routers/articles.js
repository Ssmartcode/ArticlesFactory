const express = require("express");
const moment = require("moment");

const router = express.Router();
const Article = require("../models/article");

router.get("/", (req, res) => {
  res.send("hello there");
});
router.get("/article/:id", async (req, res) => {
  const id = req.params.id;
  const article = await Article.findById(id);
  const date = new Date(article.createdAt);
  const formatedDate = moment(date).format("DD/MM/YYYY-hh:mm:ss a");
  console.log(formatedDate);
  res.render("article", { article, formatedDate });
});
router.get("/esports", async (req, res) => {
  const articles = await Article.find({ category: "esports" });
  res.render("category", { articles, category: "esports" });
});
router.get("/technology", async (req, res) => {
  const articles = await Article.find({ category: "technology" });
  res.render("category", { articles, category: "technology" });
});
router.get("/science", async (req, res) => {
  const articles = await Article.find({ category: "science" });
  res.render("category", { articles, category: "science" });
});
router.get("/nature", async (req, res) => {
  const articles = await Article.find({ category: "nature" });
  res.render("category", { articles, category: "nature" });
});
module.exports = router;
