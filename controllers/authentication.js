const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");
const logger = require("../logger");

exports.signup = (req, res) => {
  const { username, email, rollno, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) {
      res.status(404).json({ message: "Internal Server Error" });
      logger.error("Error in finding user %o", {
        username: username,
        email: email,
        rollno: rollno,
        password: password,
      });
      return;
    }
    if (user) {
      res.status(409).json({
        message: "Email already registered. Please choose another email.",
      });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const token = randomstring.generate(12);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Ecell Gmail email id for sending Verification mail
        pass: process.env.PASSWD, // Password of same Ecell email id
      },
    });

    const mailOptions = {
      from: "noreply@ecell-iitp.org", // from something like noreply@..... /ecelliitp@gmail.com
      to: req.body.email,
      subject: "E-cell Email Verification",
      text:
        "You have registered successfully at Ecell IIT Patna . Click the link to activate your account and login",
      html: `<p>You have registered successfully at Ecell IIT Patna . Click the below link to activate your account and login </p>
                 <h4><a href="${process.env.CLIENT_URL}/auth/verify/${token}/${email}">Verify Email Address</h4>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(503).json({
          message: "Sorry, Please try again after couple of minutes.",
        });
        logger.error(
          "May be email and password are wrong. Check them once %o",
          {
            Email: process.env.EMAIL,
            Password: process.env.PASSWD,
            Error: error,
          }
        );
        return;
      }
      User.create(
        {
          username: username,
          email: email,
          rollNo: rollno,
          pass_salt: salt,
          hashed_pass: hash,
          secret_token: token,
          is_verified: false,
        },
        (err, obj) => {
          if (err) {
            res.status(400).json({
              message: "Couln't create User. Please contact administrator.",
            });
            logger.error("Error in creating user %o", {
              username: username,
              email: email,
              rollNo: rollno,
              pass_salt: salt,
              hashed_pass: hash,
              secret_token: token,
              is_verified: false,
            });
            return;
          }
        }
      );
      res.status(200).json({
        message: "A mail has been sent to your email address.",
      });
    });
  });
};

exports.verify = (req, res) => {
  const { token, email } = req.query;
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      res.status(500).json({
        message: "User couldn't be verified. Please try again later.",
      });
      logger.error("Verification failed %o", {
        token: token,
        email: email,
      });
      return;
    }
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }
    if (user.is_verified) {
      res.status(304).json({
        message: "User already verified.",
      });
      return;
    }
    if (user.secret_token != token) {
      res.status(401).json({
        message: "Invalid Token",
      });
      return;
    }
    if (user.secret_token == token) {
      user.is_verified = true;
      user.secret_token = null;

      user.save((err, ans) => {
        if (err) {
          res.status(500).json({
            message: "User cannot be verified. Please contact administrator.",
          });
          logger.error("Verification failed %o", {
            token: token,
            email: email,
          });
          return;
        }
      });
      res.status(200).json({
        message:
          "Verified successfully, Now, You can login with your credentials.",
      });
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      res.status(404).json({ message: "Please try again." });
      logger.error("User couln't login %o", {
        email: email,
        password: password,
      });
      return;
    }
    if (!user) {
      res.status(404).json({
        message: "Email/Password in Incorrect.",
      });
      return;
    }
    if (!user.is_verified) {
      res.status(400).json({
        message: "Please verify your account",
      });
      return;
    }
    bcrypt.compare(password, user.hashed_pass, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Please try again." });
        logger.error("Can't compare hashes %o", {
          password: password,
          hashed_pass: user.hashed_pass,
        });
        return;
      }
      if (result) {
        const token = jwt.sign(
          {
            _id: user._id,
            username: user.username,
            role: user.role,
          },
          process.env.TokenJwt
        );
        //
        res.cookie("session_token", token, {
          maxAge: 10 * 60 * 1000, // 10 minutes
          sameSite: "None",
          secure: true,
        });
        //    res.header("token",token).send(token);
        const { _id, email, username, role } = user;
        res.status(200).json({
          token,
          user: {
            _id,
            email,
            username,
            role,
          },
        });
      } else {
        res.status(401).json({
          message: "Incorrect Password!",
        });
      }
    });
  });
};

exports.logout = (req, res) => {
  res.clearCookie("session_token");
  res.json({
    success: true,
    message: "Logged out Succesfully!",
  });
};

exports.userType = (req, res) => {
  const token = req.cookies.session_token;
  if (!token) {
    res.status(401).json({ message: "You have to login" });
    return;
  }
  const decodedToken = jwt.verify(token, process.env.TokenJwt);
  const userId = decodedToken._id;
  User.findById(userId, (err, result) => {
    if (err) {
      res.status(400).json({
        message: "Error in retrieving user role",
      });
      return;
    }
    if (!result) {
      res.status(401).json({ message: "You have to login" });
      return;
    }
    res.status(200).json({ role: result.role, username: result.username });
  });
};
