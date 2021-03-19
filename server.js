const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

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
mongoose.connect(
  "mongodb+srv://andrei-admin:MamaTata@2@cluster0.zapps.mongodb.net/portofolioDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.once("open", () => console.log("Connected to the data base"));
db.on("error", (err) => console.log(err));

// VIEWS
app.set("views", __dirname + "/views");
app.set("view engine", "pug");

// STATIC FILES
app.use(express.static(__dirname + "/public"));
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
const articles = require("./routers/articles");
const admin = require("./routers/admin");
const user = require("./routers/user");
app.use("/articles", articles);
app.use("/admin", admin);
app.use("/user", user);

app.get("/", async (req, res) => {
  const Article = require("./models/article");
  const articles = await Article.find();
  res.render("index", { articles });
});

app.listen(process.env.PORT || 3000, () => console.log("Opened on port 3000"));
