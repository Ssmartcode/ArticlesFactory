const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const User = require("../models/user");

const {
  registerGET,
  registerPOST,
  loginGET,
  loginPOST,
  logoutPOST,
} = require("../controllers/user");

const userValidation = [
  body("fullName")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 3 characters long"),
  body("userName")
    .isLength({ min: 2 })
    .withMessage("User must be at least 2 characters long"),
  body("password")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 5 characters long"),
  body("role").not().isEmpty(),
];

// USER REGISTER
router.get("/register", registerGET);
router.post("/register", userValidation, registerPOST);

// USERR LOGIN
router.get("/login", loginGET);
router.post("/login", loginPOST);

// USER LOGOUT
router.get("/logout", logoutPOST);
module.exports = router;
