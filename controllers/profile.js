const Profile = require("../models/profile");
const fs = require("fs");
const formidable = require("formidable");
const logger = require("../logger");

exports.profileById = (req, res, next, id) => {
  Profile.findById(id).exec((err, profile) => {
    if (err) {
      return res.status(500).json({
        message: "Error in finding profile.",
      });
    }
    if (!profile) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    req.userProfile = profile;
    next();
  });
};

exports.getProfile = (req, res) => {
  const userId = req.user._id;
  logger.info("Got into the getProfile()");
  Profile.findOne({ user: userId }, (err, profile) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Error in finding profile. Please try again later" });
      logger.error("Error in finding Profile %o", err);
      return;
    }
    if (!profile) {
      logger.info("Profile not found. So creating one.");
      Profile.create(
        {
          user: userId,
          username: req.user.username,
        },
        (err, obj) => {
          if (err) {
            logger.error("Error in creating profile %o", err);
            res.status(500).json({
              message: "Error creating profile. Please try again later",
            });
            return;
          }
          logger.info("Successfully created profile");
          res.status(200).json(obj);
        }
      );
    } else {
      res.status(200).json(profile);
    }
  });
};

exports.getAllProfiles = (req, res) => {
  Profile.find({}, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error in getting list of profiles. Please try again later",
      });
      return;
    }
    res.status(200).json({ result });
  });
};

exports.viewProfile = (req, res) => {
  Profile.findById(req.params.profileId, (err, foundprofile) => {
    if (err) {
      res.status(500).json({
        message: "Error in finding profile. Please try again later",
      });
      return;
    }
    res.status(200).json({
      user: foundprofile.user,
      branch: foundprofile.branch,
      about: foundprofile.about,
      contact: foundprofile.contact,
    });
  });
};

exports.resume = (req, res, next) => {
  if (req.userProfile.resume.data) {
    res.set("ContentisAuth-Type", req.userProfile.resume.contentType);
    return res.send(req.userProfile.resume.data);
  }
  next();
};

exports.updateProfile = (req, res) => {
  Profile.findOne({ user: req.user._id }, (err, profile) => {
    if (err) {
      res.status(500).json({
        message: "Please try again later.",
      });
      return;
    }
    const { about, first_name, last_name, contact, branch, number } = req.body;
    profile.about = about;
    profile.first_name = first_name;
    profile.last_name = last_name;
    profile.contact = contact;
    profile.branch = branch;
    profile.number = number;
    profile.save((err, obj) => {
      if (err) {
        res.status(500).json({
          message: "Can't save",
        });
        logger.error("Profile can't be Updated. Error: %o", err);
      }
    });
    res.status(200).json({
      message: "Profile Updated Successfully",
    });
  });

  // let form = new formidable.IncomingForm();
  // form.keepExtensions = true;
  // form.parse(req, (err, fields, files) => {
  //   // if (err) {
  //   //   return res.status(400).json({
  //   //     error: "Image could not be uploaded",
  //   //   });
  //   // }
  //   Profile.findOne({ user: req.user._id }, (err, profile) => {
  //     // 1kb = 1000
  //     // 1mb = 1000000
  //     if (err) {
  //       res.status(404).json({
  //         message: "Error in finding profile. Please try again later",
  //       });
  //       return;
  //     }

  //     const { about, first_name, last_name, contact, branch, number } = fields;
  //     profile.about = about;
  //     profile.first_name = first_name;
  //     profile.last_name = last_name;
  //     profile.contact = contact;
  //     profile.branch = branch;
  //     profile.number = number;
  //     console.log(about);
  //     if (files.resume) {
  //       if (files.resume.size > 1000000) {
  //         return res.status(400).json({
  //           error: "Image should be less than 1mb in size",
  //         });
  //       }
  //       profile.resume.data = fs.readFileSync(files.resume.path);
  //       profile.resume.contentType = files.resume.type;
  //     }

  //     profile.save((err, result) => {
  //       if (err || !result) {
  //         return res.status(400).json({ message: "Error saving profile" });
  //       }
  //       res.status(200).json(result);
  //     });
  //   });
  // });
};
