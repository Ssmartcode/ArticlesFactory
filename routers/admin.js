const express = require("express");
const { body, validationResult } = require("express-validator");

const router = express.Router();

const Article = require("../models/article");

// FORM VALIDATION
const addValidation = [
  body("title")
    .isLength({ min: 10, max: 100 })
    .withMessage("Title must be shorter than 100 and longer than 10"),
  body("content")
    .isLength({ min: 50 })
    .withMessage("Content must be longer than 50 "),
];

router.get("/", (req, res) => {
  res.send(200);
});
// ADD
router.get("/add", async (req, res) => {
  res.render("admin-add");
});
router.post("/add", addValidation, async (req, res) => {
  const { title, author, category, content } = req.body;
  const article = new Article({ title, author, category, content });
  const errors = validationResult(req);
  if (errors.isEmpty())
    try {
      await article.save();
      req.flash("success", "Article has been added");
      res.redirect("/admin/add");
    } catch (err) {
      console.log(err);
    }
  else {
    res.render("admin-add", errors);
  }
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
  article = Object.assign(article, { title, author, category, content });
  try {
    await article.save();
    req.flash("success", "Article updated");
  } catch (err) {
    console.log(err);
  }
  res.redirect("/admin/articles");
});
// DELETE ARTICLE
router.delete("/articles/delete/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
});
module.exports = router;
