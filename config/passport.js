const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");
module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ userName: username });
        if (!user) {
          return done(null, false, "Could not find the user.");
        }
        const matchingPassword = await bcrypt.compare(password, user.password);
        if (!matchingPassword) {
          return done(null, false, "Password does not match");
        }
        return done(null, user);
      } catch (err) {
        console.log(err);
      }
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id, "You have been logged in");
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
