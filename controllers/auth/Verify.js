const User = require("../../models/user");

export default (req, res) => {
  const { verificationToken, email } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    if (user.isVerified) {
      return res.status(304).json({
        message: "User already verified.",
      });
    }
    if (user.verificationToken != verificationToken) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
    if (user.verificationToken == verificationToken) {
      user.isVerified = true;
      user.verificationToken = null;

      user.save();
      return res.status(200).json({
        message:
          "Verified successfully, Now, You can login with your credentials.",
      });
    }
  });
};
