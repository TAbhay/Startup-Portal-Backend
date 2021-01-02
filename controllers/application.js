const Application = require("../models/application");
const logger = require("../logger");

exports.apply = (req, res) => {
  const userId = req.user._id;
  const jobId = req.params.jobId;
  Application.findOne({ Job: jobId, User: userId }, (err, application) => {
    if (err) {
      res
        .status(404)
        .json({ message: "Error in finding application. Please try again." });
      logger.error("Finding application failed %o", {
        jobId: jobId,
        userId: userId,
      });
      return;
    }
    if (application) {
      res.status(400).json({ message: "Already Applied" });
      return;
    }
    if (!application) {
      Application.create(
        {
          User: userId,
          Job: jobId,
          Status: {
            Pending: 1,
            Shortlisted: 0,
            Rejected: 0,
          },
        },
        (err, obj) => {
          if (err) {
            res.status(500).json({
              message: "Error creating application. Please try again later",
            });
            logger.error("Finding application failed %o", {
              jobId: jobId,
              userId: userId,
            });
            return;
          }
          res.status(200).json(obj);
        }
      );
    }
  });
};

exports.getApplicationsByJobId = (req, res) => {
  const jobId = req.params.jobId;
  Application.find({ Job: jobId }, (err, foundapplication) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Error finding application. Please try again later" });
      logger.error("Finding application failed %o", {
        jobId: jobId,
      });
      return;
    }
    res.status(200).json(foundapplication);
  });
};

exports.getApplictionsByUserId = (req, res) => {
  const userId = req.user._id;
  Application.find({ User: userId }, (err, foundapplication) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Error finding application. Please try again later" });
      logger.error("Finding application failed %o", {
        userId: userId,
      });
      return;
    }
    res.status(200).json(foundapplication);
  });
};
exports.status = function (req, res) {};
