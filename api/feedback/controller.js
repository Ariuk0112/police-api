const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");

module.exports = {
  createFeedback: asyncHandler(async (req, res) => {
    let { f_name } = req.body;

    db.query(
      "call sp_create_feedback_options(?) ",
      [f_name],
      (err, results) => {
        if (err && err.message.startsWith("ER_SIGNAL_EXCEPTION")) {
          return res.json({
            success: 0,
            message: err.message.replace("ER_SIGNAL_EXCEPTION: ", ""),
          });
        } else if (err) {
          return res.status(200).json({
            success: 0,
            message: err.message,
          });
        }

        res.status(200).json({
          success: 1,
          message: "success",
          data: results,
        });
      }
    );
  }),
  submitFeedback: asyncHandler(async (req, res) => {
    let { f_id } = req.body;
    db.query("call sp_submit_feedback(?) ", [f_id], (err, results) => {
      if (err && err.message.startsWith("ER_SIGNAL_EXCEPTION")) {
        return res.json({
          success: 0,
          message: err.message.replace("ER_SIGNAL_EXCEPTION: ", ""),
        });
      } else if (err) {
        return res.status(200).json({
          success: 0,
          message: err.message,
        });
      }

      res.status(200).json({
        success: 1,
        message: "success",
        data: results,
      });
    });
  }),

  showAllOptions: asyncHandler(async (req, res) => {
    db.query(
      "select * from t_feedback ",
      [],

      (err, results) => {
        if (err && err.message.startsWith("ER_SIGNAL_EXCEPTION")) {
          return res.json({
            success: 0,
            message: err.message.replace("ER_SIGNAL_EXCEPTION: ", ""),
          });
        } else if (err) {
          return res.status(200).json({
            success: 0,
            message: err.message,
          });
        }

        res.status(200).json({
          success: 1,
          message: "success",
          data: results,
        });
      }
    );
  }),


  updateOption: asyncHandler(async (req, res) => {
    db.query(
      "update t_feedback set f_name = ? where f_id =?",
      [req.body.f_name, req.body.f_id],

      (err, results) => {
        if (err && err.message.startsWith("ER_SIGNAL_EXCEPTION")) {
          return res.json({
            success: 0,
            message: err.message.replace("ER_SIGNAL_EXCEPTION: ", ""),
          });
        } else if (err) {
          return res.status(200).json({
            success: 0,
            message: err.message,
          });
        }

        res.status(200).json({
          success: 1,
          message: "success",
          data: results,
        });
      }
    );
  }),

  deleteFeedback: asyncHandler(async (req, res) => {
    const f_id = req.params.id;
    db.query(
      "delete from t_feedback where f_id = ? ",
      [f_id],
      (err, results) => {
        if (err && err.message.startsWith("ER_SIGNAL_EXCEPTION")) {
          return res.json({
            success: 0,
            message: err.message.replace("ER_SIGNAL_EXCEPTION: ", ""),
          });
        } else if (err) {
          return res.status(200).json({
            success: 0,
            message: err.message,
          });
        }

        res.status(200).json({
          success: 1,
          message: "success",
          data: results,
        });
      }
    );
  }),
};
