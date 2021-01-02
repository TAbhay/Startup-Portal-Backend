const Job = require("../models/job");
const logger = require("../logger");

exports.createJob = (req, res) => {
  const {
    companyname,
    description,
    package,
    skills,
    jobrole,
    jobtype,
    status,
  } = req.body;

  Job.create(
    {
      company_name: companyname,
      description: description,
      package: package,
      skills: skills,
      job_role: jobrole,
      job_type: jobtype,
      status: status,
    },
    (err, obj) => {
      if (err) {
        res.status(500).json({
          message: "Error in creating new job",
        });
        logger.error("Error in creating new job %o", {
          company_name: companyname,
          description: description,
          package: package,
          skills: skills,
          job_role: jobrole,
          job_type: jobtype,
          status: status,
        });
        return;
      }
    }
  );
  res.status(200).json({ message: "New Job Added successfully." });
};

exports.getJobsList = (req, res) => {
  Job.find({}, (err, jobs) => {
    if (err) {
      res.status(500).json({ message: "Error in getting Jobs list" });
      logger.error("Error in fetching all jobs list");
      return;
    }
    res.status(200).json(jobs);
  });
};

exports.getJobById = (req, res) => {
  const jobId = req.params.jobId;
  Job.findById(jobId, (err, job) => {
    if (err) {
      res.status(500).json({ message: "Error in getting Job" });
      logger.error("Error in getting Job %o", {
        jobId: jobId,
      });
      return;
    }
    res.status(200).json(job);
  });
};

exports.updateJob = (req, res) => {
  const {
    companyname,
    description,
    package,
    skills,
    jobrole,
    jobtype,
    status,
  } = req.body;
  Job.findByIdAndUpdate(
    req.params.jobId,
    {
      company_name: companyname,
      description: description,
      package: package,
      skills: skills,
      job_role: jobrole,
      job_type: jobtype,
      status: status,
    },
    (err, updatedjob) => {
      if (err || !updatedjob) {
        res
          .status(500)
          .json({ message: "Can't update job. Please try again later" });
        logger.error("Job Update failed %o", {
          company_name: companyname,
          description: description,
          package: package,
          skills: skills,
          job_role: jobrole,
          job_type: jobtype,
          status: status,
        });
        return;
      }
      res.status(200).json(updatedjob);
    }
  );
};
exports.deleteJob = (req, res) => {
  const id = req.params.jobId;
  Job.findByIdAndRemove(id, (err) => {
    if (err) {
      res.status(500).json({ message: "Not Found" });
      logger.error("Error in finding job %o", {
        jobId: id,
      });
      return;
    }
    res.json({ message: "Job is deleted boom!" });
  });
};
