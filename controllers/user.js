const bcrypt = require("bcrypt");
const passport = require("passport");
const { validationResult } = require("express-validator");

const alreadyUser = async (userName) => {};

const registerGET = (req, res) => {
  res.render("user-register");
};

const registerPOST = async (req, res) => {
  const { userName, fullName, password, role } = req.body;
  try {
    const dbUser = await User.findOne({ userName: userName });
    if (dbUser) throw "User name is taken";
  } catch (err) {
    req.flash("error", "User name is taken");
    return res.redirect("/user/register");
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
};

const loginGET = (req, res) => {
  res.render("user-login");
};

const loginPOST = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true,
  })(req, res, next);
};

const logoutPOST = (req, res) => {
  req.logout();
  res.redirect("/");
};

module.exports = {
  registerGET,
  registerPOST,
  loginGET,
  loginPOST,
  logoutPOST,
};
