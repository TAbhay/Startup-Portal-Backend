const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/job");
const profileRoutes = require("./routes/profile");
const applicationRoutes = require("./routes/application");
const cookieParser = require("cookie-parser");
const logger = require("./logger");

// expressValidator = require ("express-validator")
require("dotenv").config();

const app = express();
// app.use(expressValidator());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
mongoose.connect(process.env.mongoDBUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);
app.set("view engine", "ejs");
mongoose.connection
  .once("open", () => logger.info("MongoDB connected successfully"))
  .on("error", (error) => logger.error("Error in connecting MongoDB: ", error));
app.use(authRoutes);
app.use(profileRoutes);
app.use(jobRoutes);
app.use(applicationRoutes);
const port = process.env.port || 8000;
app.listen(port, function () {
  logger.info(`Server Listening on http://localhost:${port}`);
});
