const mongoose = require("mongoose");

const articleSchema = mongoose.Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: false },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Article = (module.exports = mongoose.model("Article", articleSchema));
