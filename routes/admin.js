const express = require("express");

const router = express.Router();

const {
  addAdminGET,
  addAdminPOST,
  getArticles,
  updateArticlePOST,
  updateArticleGET,
  deleteArticle,
} = require("../controllers/admin");

const multer = require("multer");
const { body, validationResult } = require("express-validator");
const { v4 } = require("uuid");

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
const fileMimTypes = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, v4() + "." + fileMimTypes[file.mimetype]);
  },
});
const upload = multer({
  storage,
});

// ADD
router.get("/add", addAdminGET);
router.post("/add", upload.single("image"), addValidation, addAdminPOST);

// GET ARTICLES
router.get("/articles/:sort", getArticles);

// UPDATE ARTICLES
router.get("/articles/update/:id", updateArticleGET);
router.post(
  "/articles/update/:id",
  upload.single("image"),
  updateValidation,
  updateArticlePOST
);
// DELETE ARTICLE
router.delete("/articles/delete/:id", deleteArticle);

module.exports = router;
