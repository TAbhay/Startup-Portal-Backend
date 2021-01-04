const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
  },
  rollNo: {
    type: String,
    unique: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  accessToken: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
