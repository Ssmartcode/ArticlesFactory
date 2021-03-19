const express = require("express");
const mongoose = require("mongoose");

const app = express();

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

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ useNewUrlParser: true }));

const articles = require("./routers/articles");
const admin = require("./routers/admin");
app.use("/articles", articles);
app.use("/admin", admin);

app.get("/", async (req, res) => {
  const Article = require("./models/article");
  const articles = await Article.find();
  console.log(articles);
  res.render("index", { articles });
});

app.listen(3000, () => console.log("Opened on port 3000"));
