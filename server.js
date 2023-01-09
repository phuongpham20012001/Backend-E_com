const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
dotenv.config({ path: "./config.env" });
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const userRouters = require("./routes/userRouters");
const hpp = require("hpp");
const adminRouters = require("./routes/adminRouters");
app.use(cors());
// secure Http headers
app.use(helmet());
// read request body
app.use(bodyParser.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// MgDb connect
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected");
  });
// limit requests
const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/", limiter);
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// data sanitization against NoSql query injection
app.use(mongoSanitize());
app.use(xss());
// using routes
app.use("/", userRouters);
app.use("/admin", adminRouters);
// prevent parameter pollution
app.use(hpp());
// handle un unhanlded routes
app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
