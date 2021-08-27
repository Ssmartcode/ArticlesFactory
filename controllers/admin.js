const Article = require("../models/article");
const { validationResult } = require("express-validator");

const addAdminGET = async (req, res) => {
  res.render("admin-add");
};

const addAdminPOST = async (req, res) => {
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
};

const getArticles = async (req, res) => {
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
};

const updateArticleGET = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (article.createdBy !== req.user.userName && req.user.role !== "admin") {
    req.flash("warning", "You dont own this article");
    res.redirect("/admin/articles/new");
  } else res.render("admin-update", { article });
};

const updateArticlePOST = async (req, res) => {
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
};

const deleteArticle = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
};

module.exports = {
  addAdminGET,
  addAdminPOST,
  getArticles,
  updateArticlePOST,
  updateArticleGET,
  deleteArticle,
};
