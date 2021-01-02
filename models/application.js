const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  Status: {
    Pending: Number,
    Shortlisted: Number,
    Rejected: Number,
  },
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
