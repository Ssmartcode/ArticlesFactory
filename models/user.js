const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  adminRequest: { type: Boolean, required: false },
});

const User = (module.exports = mongoose.model("User", userSchema));
