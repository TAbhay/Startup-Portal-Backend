const express = require("express");
const router = express.Router();
const { userById, isLoggedIn, isAdmin } = require("../controllers/loggedIn");

const {
  createJob,
  getJobsList,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/job");

router.get("/job", isLoggedIn, getJobsList);

router.get("/job/:jobId", isLoggedIn, getJobById);

router.put("/job/:jobId", isLoggedIn, isAdmin, updateJob);

router.post("/job/new", isLoggedIn, isAdmin, createJob);

router.delete("/job/:jobId", isLoggedIn, isAdmin, deleteJob);

router.param("userId", userById);
module.exports = router;
