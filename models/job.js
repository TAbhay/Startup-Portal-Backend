const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company_name: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  package: {
    type: Number,
    default: "",
  },
  skills: {
    type: String, // array
  },
  job_role: {
    type: String,
    default: "",
  },
  job_type: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "active",
  },
});

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
