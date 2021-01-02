const express = require("express");
const router = express.Router();
const { userById, isLoggedIn, isAdmin } = require("../controllers/loggedIn");

const {
  apply,
  getApplicationsByJobId,
  getApplictionsByUserId,
} = require("../controllers/application");

router.get("/applyJob/:jobId", isLoggedIn, apply);
router.get(
  "/job/:jobId/application",
  isLoggedIn,
  isAdmin,
  getApplicationsByJobId
);

router.get("/job/:userId/applied", isLoggedIn, getApplictionsByUserId);

router.param("userId", userById);
module.exports = router;
