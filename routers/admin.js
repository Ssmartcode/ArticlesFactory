const express = require("express");
const { findByIdAndRemove } = require("../models/article");

const router = express.Router();
const Article = require("../models/article");

router.get("/", (req, res) => {
  res.send(200);
});
// ADD
router.get("/add", (req, res) => {
  res.render("admin-add");
});
router.post("/add", async (req, res) => {
  const { title, author, category, content } = req.body;
  const article = new Article({ title, author, category, content });
  await article.save();
  res.redirect("/admin/add");
});

// GET ARTICLES
router.get("/articles", async (req, res) => {
  const articles = await Article.find();
  res.render("admin-articles", { articles });
});

// UPDATE ARTICLES
router.get("/articles/update/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("admin-update", { article });
});
router.post("/articles/update/:id", async (req, res) => {
  const { title, author, category, content } = req.body;
  let article = await Article.findById(req.params.id);
  article.title = title;
  article.author = author;
  article.category = category;
  article.content = content;
  await article.save();
  res.redirect("/admin/articles");
});
// DELETE ARTICLE
router.delete("/articles/delete/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
});
module.exports = router;
