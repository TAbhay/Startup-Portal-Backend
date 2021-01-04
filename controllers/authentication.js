const User = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  const { username, email, rollno, password } = req.body;
  User.findOne({ email: email }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
    if (user) {
      return res.status(409).json({
        message: "Email already registered. Please choose another email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
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
        return res.status(503).json({
          message: "Sorry, Please try again after couple of minutes.",
        });
      }
      User.create(
        {
          username: username,
          email: email,
          rollNo: rollno,
          password: hashedPassword,
          secret_token: token,
          is_verified: false,
        },
        (err, _obj) => {
          if (err) {
            return res.status(400).json({
              message: "Couln't create User. Please contact administrator.",
            });
          }
        }
      );
      return res.status(200).json({
        message: "A mail has been sent to your email address.",
      });
    });
  });
};

exports.verify = (req, res) => {
  const { token, email } = req.query;
  User.findOne({ email: email }, (err, _obj) => {
    if (err) {
      return res.status(500).json({
        message: "User couldn't be verified. Please try again later.",
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    if (user.is_verified) {
      return res.status(304).json({
        message: "User already verified.",
      });
    }
    if (user.secret_token != token) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
    if (user.secret_token == token) {
      user.is_verified = true;
      user.secret_token = null;

      user.save((err, ans) => {
        if (err) {
          return res.status(500).json({
            message: "User cannot be verified. Please contact administrator.",
          });
        }
      });
      return res.status(200).json({
        message:
          "Verified successfully, Now, You can login with your credentials.",
      });
    }
  });
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email: email }, (err, obj) => {
    if (err) {
      return res.status(500).json({
        message: "Please try again.",
      });
    }
    if (!obj) {
      return res.status(404).json({
        message: "Email/Password in Incorrect.",
      });
    }
    if (!obj.is_verified) {
      return res.status(400).json({
        message: "Please verify your account",
      });
    }
    try {
      if (await bcrypt.compare(password, obj.password)) {
        return res.status(200).json({
          user: {
            _id,
            email,
            username,
            role,
          },
        });
      }
    } catch {
      return res.status(500).json({
        message: "Please try again later."
      });
    }
  });
};

exports.signOut = (req, res) => {
  res.clearCookie("session_token");
  return res.json({
    success: true,
    message: "Logged out Succesfully!",
  });
};

exports.userType = (req, res) => {
  const token = req.cookies.session_token;
  if (!token) {
    return res.status(401).json({
      message: "You have to login",
    });
  }
  const decodedToken = jwt.verify(token, process.env.TokenJwt);
  const userId = decodedToken._id;
  User.findById(userId, (err, result) => {
    if (err) {
      return res.status(400).json({
        message: "Error in retrieving user role",
      });
    }
    if (!result) {
      return res.status(401).json({
        message: "You have to login",
      });
    }
    return res.status(200).json({
      role: result.role,
      username: result.username,
    });
  });
};
