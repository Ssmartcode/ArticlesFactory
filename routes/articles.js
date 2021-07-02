const express = require("express");

const router = express.Router();

const {
  getArticles,
  getEntertainmentArticles,
  getTechnologyArticles,
  getFamilyArticles,
  getHealthArticles,
  getArticle,
} = require("../controllers/articles");

router.get("/all", getArticles);

router.get("/entertainment", getEntertainmentArticles);

router.get("/technology", getTechnologyArticles);
router.get("/health", getHealthArticles);
router.get("/family", getFamilyArticles);

//Get article from DB
router.get("/article/:id", getArticle);

module.exports = router;
