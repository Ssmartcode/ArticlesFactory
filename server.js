require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const sortFromRecent = require("./config/sorting");

const app = express();

// SESSION
app.use(
  session({
    secret: "I love cats",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

// FLASH MIDDLEWARE
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("Connected to the data base"));
db.on("error", (err) => console.log(err));

// VIEWS
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

// STATIC FILES
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ useNewUrlParser: true, extended: true }));

// PASSPORT
require("./config/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});
// ROUTES
const articles = require("./routes/articles");
const admin = require("./routes/admin");
const user = require("./routes/user");
app.use("/articles", articles);
app.use("/admin", admin);
app.use("/user", user);

app.get("/", async (req, res) => {
  const Article = require("./models/article");
  let articles = await Article.find();

  // filter articles from newest to oldest
  articles = sortFromRecent(articles);
  res.render("index", { articles });
});

app.use((req, res, next) => {
  res
    .status(404)
    .render("page404", { error: "The page has not been found", message: "" });
});
app.listen(process.env.PORT || 3001, () => console.log("Opened on port 3000"));
