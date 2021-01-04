const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export default async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email: email }, async (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "Email/Password in Incorrect.",
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your account",
      });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign(
          {
            email: user.email,
            _id: user._id,
            role: user.role,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" } // 1 hour
        );
        user.accessToken = accessToken;
        user.save();
        return res.status(200).json({
          accessToken: accessToken,
        });
      } else {
        return res.status(403).json({
          message: "Email/Password is Incorrect.",
        });
      }
    } catch {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  });
};
