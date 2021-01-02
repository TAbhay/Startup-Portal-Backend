const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "can't be blank"],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "can't be blank"],
    minlength: 16, // minimum length setup for webmail of ...@iitp.ac.in
  },
  rollNo: {
    type: String,
  },
  pass_salt: {
    type: String,
  },
  role: {
    type: Number,
    default: 0,
  },
  hashed_pass: {
    type: String,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  secret_token: {
    type: String,
  },
  /*  Job: [
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
      }
    ]  */
});

const User = mongoose.model("User", userSchema);
module.exports = User;
