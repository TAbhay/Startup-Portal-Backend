const jwt = require("jsonwebtoken");

export default (req, res, next) => {
  const token = req.cookies.session_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized Request" });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Login Session Expired",
      });
    }
    req.user = user;
    next();
  });
};
