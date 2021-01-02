const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  username: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  about: {
    type: String,
  },
  branch: {
    type: String,
  },
  //  roles_pref:{
  //    type:String
  //  },
  contact: {
    type: String,
  },
  // TODO: Resume and Profile Picture
  // resume: {
  //   data: Buffer,
  //   contentType: String,
  // },
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
