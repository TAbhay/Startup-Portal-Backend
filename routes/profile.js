const express = require("express");
const router = express.Router();
const { userById, isLoggedIn, commonAuth } = require("../controllers/loggedIn");

const {
  profileById,
  getProfile,
  viewProfile,
  resume,
  updateProfile,
  getAllProfiles,
} = require("../controllers/profile");

// instead of deleting account we can use deactivate or hidden profile

router.get("/profile", isLoggedIn, getProfile);

// router.get('/profile/:profileId',isLoggedIn,viewprofile);
router.get("/allProfiles", isLoggedIn, getAllProfiles);

router.get("/profile/:userId/:profileId", isLoggedIn, commonAuth, resume);

//router.get('/profile/edit',editprofile);

router.put("/profile/edit", isLoggedIn, updateProfile);

router.param("userId", userById);
router.param("profileId", profileById);

module.exports = router;
