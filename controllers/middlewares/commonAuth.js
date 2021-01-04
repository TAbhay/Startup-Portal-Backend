// This is for viewing resume. Only admin and user can view
export default (req, res, next) => {
  if (req.user._id == req.profile._id || req.user.role == 1) {
    console.log("not Admin");
    return res.status(403).json({
      message: "You can't view other's resume. Mind your own business",
    });
  }
  next();
};
