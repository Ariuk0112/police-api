// loading .env
require("dotenv").config();

const express = require("express");
const app = express();
const multer = require("multer");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const fs = require("fs");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cors = require("cors");
const empty = require("isempty");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
global.__basedir = __dirname + "/..";
app.use(express.static("./public"));
// access-control-allow-credentials: true
// access-control-allow-headers: DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization
// access-control-allow-methods: PUT, GET, POST, DELETE, OPTIONS, HEAD
// access-control-allow-origin: *
// access-control-max-age: 1728000
// content-length: 1753
// content-type: application/json
// date: Wed, 27 Apr 2022 14:37:36 GMT
// strict-transport-security: max-age=15724800; includeSubDomains
const issue2options = {
  origin: "*",
  methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
  maxAge: 1728000,
  allowedHeaders: [
    "DNT",
    "X-CustomHeader",
    "Keep-Alive",
    "User-Agent",
    "X-Requested-With",
    "If-Modified-Since",
    "Cache-Control",
    "Content-Type",
    "Authorization",
  ],
};
// --------------------------------------------------------------------------------------
// app config
app.use(cors(issue2options));
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.text({ type: "*/xml" }));
app.use(express.static("public"));
app.use(fileupload());
// main routes
app.use("/api/auth", require("./api/auth/router"));

app.use("/api/category", require("./api/category/router"));
app.use("/api/crime", require("./api/crime/router"));
app.use("/api/team", require("./api/managementTeam/router"));
app.use("/api/news", require("./api/news/router"));
app.use("/api/feedback", require("./api/feedback/router"));
app.use("/api/report", require("./api/reports/router"));
app.use("/api/department", require("./api/departments/router"));
app.use("/api/faq", require("./api/faq/router"));
app.use("/api/emp", require("./api/employee/router"));
app.use("/api/banner", require("./api/banner/router"));

// ADMIN routes

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  let err_status = err.status || 500;

  console.error(
    new Date().toUTCString() + ` ${req.originalUrl} appException:`,
    err.message
  );
  // console.error(err.stack)

  return res.status(err_status).json({
    success: 0,
    message: `${err_status} + ${err.message}`,
  });
});

// --------------------------------------------------------------------------------------
// Handling crashes

process.on("SIGTERM", (signal) => {
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  process.exit(1);
});

process.on("SIGINT", (signal) => {
  console.log(`Process ${process.pid} has been interrupted`);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error(new Date().toUTCString() + " uncaughtException:", err.message);
  console.error(err.stack);
});

process.on("unhandledRejection", (err, promise) => {
  console.log("unhandledRejection at ", promise, `error: ${err.message}`);
});

// --------------------------------------------------------------------------------------

module.exports = app;
