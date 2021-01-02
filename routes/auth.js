const express = require("express");
const router = express.Router();
const {
  signup,
  verify,
  login,
  logout,
  userType,
} = require("../controllers/authentication");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", verify);
router.get("/logout", logout);
router.get("/userType", userType);
module.exports = router;
