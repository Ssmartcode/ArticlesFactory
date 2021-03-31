const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const passport = require("passport");

const router = express.Router();

const User = require("../models/user");

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

const alreadyUser = async (userName) => {
  try {
    const dbUser = await User.findOne({ userName: userName });
    if (dbUser) return true;
  } catch (err) {
    req.flash("danger", err.message);
    req.redirect("/user/login");
  }
  return false;
};

// USER REGISTER
router.get("/register", (req, res) => {
  res.render("user-register");
});
router.post("/register", userValidation, async (req, res) => {
  const { userName, fullName, password, role } = req.body;

  if (await alreadyUser(userName)) {
    req.flash("error", "User name is taken");
    res.redirect("/user/register");
    return;
  }

  let user = new User();
  if (role === "admin")
    user = Object.assign(user, {
      userName,
      fullName,
      password,
      role: "author",
      adminRequest: true,
    });
  else user = Object.assign(user, { userName, fullName, password, role });

  const errors = await validationResult(req);
  if (errors.isEmpty())
    try {
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      if (user.adminRequest)
        req.flash(
          "warning",
          "Your account has author role untill you get approval"
        );
      req.flash("success", "Account has been created, you can login now");
      res.redirect("/user/login");
    } catch (err) {
      console.log(err);
    }
  else {
    res.render("user-register", errors);
  }
});

// USERR LOGIN
router.get("/login", (req, res) => {
  res.render("user-login");
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
});

// USER LOGOUT
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
