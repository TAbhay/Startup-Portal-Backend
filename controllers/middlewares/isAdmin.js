export default (req, res, next) => {
  const userRole = req.user.role;
  if (userRole != 1) {
    res.json({ message: "Are you admin? I don't think so." });
  }
  next();
};
