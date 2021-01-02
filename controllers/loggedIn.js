const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isLoggedIn = (req, res, next) => {
  const token = req.cookies.session_token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "I can't allow you further, if you don't login." });
  }
  const decodedToken = jwt.verify(token, process.env.TokenJwt);
  req.user = decodedToken;
  next();
};

exports.isAuth = (req, res, next) => {
  let user = req.user._id == req.profile._id;
  if (!user) {
    return res.status(403).json({
      message: "Access denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  var user = req.user.role;
  console.log(user);
  if (user != 1) {
    res.json({ message: "Are you admin? I don't think so." });
  }
  next();
};

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

// this is for viewing resume.. only admin and correct user can see
exports.commonAuth = (req, res, next) => {
  let user = req.user._id == req.profile._id || req.user.role == 1;
  if (user != 1) {
    console.log("not Admin");
    res.json({ message: "You cannot view resume." });
  }
  next();
};
