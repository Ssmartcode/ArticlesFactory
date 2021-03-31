const express = require("express");
const multer = require("multer");
const path = require("path");
const { body, validationResult } = require("express-validator");
const { v4 } = require("uuid");
const router = express.Router();

const Article = require("../models/article");
const sortFromRecent = require("../config/sorting");
const { request } = require("https");

// Check if user is authenticated
router.use((req, res, next) => {
  if (
    req.isAuthenticated() &&
    (req?.user.role === "admin" || req?.user.role === "author")
  )
    next();
  else {
    req.flash(
      "warning",
      "You need to be authenticated as author or admin to access this page"
    );
    res.render("user-login");
  }
});

// FORM VALIDATION - ADD
const addValidation = [
  body("title")
    .isLength({ min: 10, max: 100 })
    .withMessage("Title must be shorter than 100 and longer than 10"),
  body("content")
    .isLength({ min: 50 })
    .withMessage("Content must be longer than 50 "),
  body("image")
    .custom((value, { req }) => {
      if (!req.file) return false;
      if (req.file.mimetype === "image/jpeg") return true;
      return false;
    })
    .withMessage("Your file must be an image"),
];
// FORM VALIDATION - UPDATE
const updateValidation = [
  body("title")
    .isLength({ min: 10, max: 100 })
    .withMessage("Title must be shorter than 100 and longer than 10"),
  body("content")
    .isLength({ min: 50 })
    .withMessage("Content must be longer than 50 "),
  body("image")
    .custom((value, { req }) => {
      if (!req.file) return true;
      if (req.file.mimetype === "image/jpeg") return true;
      return false;
    })
    .withMessage("Your file must be an image"),
];
// MULTER MIDDLEWARE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, v4() + ".jpg");
  },
});
const upload = multer({
  storage,
});

router.get("/", (req, res) => {
  res.send(200);
});

// ADD
router.get("/add", async (req, res) => {
  res.render("admin-add");
});
router.post("/add", upload.single("image"), addValidation, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty())
    try {
      const imagePath = req.file.filename;
      const { title, author, category, content } = req.body;
      const article = new Article({
        title,
        author,
        category,
        content,
        imagePath,
        createdBy: req.user.userName,
      });
      await article.save();
      req.flash("success", "Article has been added");
      res.redirect("/admin/add");
    } catch (err) {
      req.flash("danger", err.message);
    }
  else {
    res.render("admin-add", errors);
  }
});

// GET ARTICLES
router.get("/articles/:sort", async (req, res) => {
  const user = req.user;
  const userRole = user.role;
  let articles;

  // if user is admin get all. else get only those created by the author
  if (userRole === "admin") articles = await Article.find();
  if (userRole === "author")
    articles = await Article.find({ createdBy: user.userName });

  // sort by new or old
  if (req.params.sort === "new") {
    articles.sort((a1, a2) => a2.createdAt - a1.createdAt);
  }
  if (req.params.sort === "old") {
    articles.sort((a1, a2) => a1.createdAt - a2.createdAt);
  }
  res.render("admin-articles", { articles });
});

// UPDATE ARTICLES
router.get("/articles/update/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (article.createdBy !== req.user.userName && req.user.role !== "admin") {
    req.flash("warning", "You dont own this article");
    res.redirect("/admin/articles/new");
  } else res.render("admin-update", { article });
});
router.post(
  "/articles/update/:id",
  upload.single("image"),
  updateValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty())
      try {
        // console.log(req?.file?.filename || "no file");
        let article = await Article.findById(req.params.id);
        const imagePath = req?.file?.filename || article.imagePath;
        const { title, author, category, content } = req.body;
        article = Object.assign(article, {
          title,
          author,
          category,
          content,
          imagePath,
          createdBy: req.user.userName,
        });
        await article.save();
        req.flash("success", "Article updated");
      } catch (err) {
        req.flash("danger", err.message);
      }
    res.redirect("/admin/articles/new");
  }
);
// DELETE ARTICLE
router.delete("/articles/delete/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
});
module.exports = router;
