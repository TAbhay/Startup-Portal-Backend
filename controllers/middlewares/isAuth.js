export default (req, res, next) => {
  const user = req.user._id == req.profile._id;
  if (!user) {
    return res.status(403).json({
      message: "Access denied",
    });
  }
  next();
};
