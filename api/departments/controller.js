const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");
const readXlsxFile = require('read-excel-file/node');

module.exports = {
    createDep: asyncHandler(async (req, res, err) => {
        let dep_name = req.body.dep_name;
        console.log(req.body.dep_name);
        db.query(
            "insert into t_department(dep_name) values (?)",
            [dep_name],
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

    showDep: asyncHandler(async (req, res, err) => {
        db.query(
            "select * from t_department",
            [],
            (err, results) => {
                if (err && err.message.startsWith("ER_SIGNAL_EXCEPTION")) {
                    return res.json({
                        success: 0,
                        message: err.message.replace("ER_SIGNAL_EXCEPTION: ", ""),
                    });
                } else if (err) {
                    return res.status(501).json({
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
    deleteDep: asyncHandler(async (req, res, err) => {
        if (req.params.dep_id) {

            db.query(
                "delete from t_department where dep_id = ?",
                [req.params.dep_id],
                (err, results) => {
                    if (err && err.message.startsWith("ER_SIGNAL_EXCEPTION")) {
                        return res.json({
                            success: 0,
                            message: err.message.replace("ER_SIGNAL_EXCEPTION: ", ""),
                        });
                    } else if (err) {
                        return res.status(501).json({
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
        }
        else {
            res.status(501).json({
                success: 0,
                message: "id cannot be empty"
            });
        }
    }),

    updateDep: asyncHandler(async (req, res, err) => {
        let { dep_id, dep_name } = req.body
        db.query(
            "update t_department set dep_name where dep_id = ?",
            [dep_id, dep_name],
            (err, results) => {
                if (err && err.message.startsWith("ER_SIGNAL_EXCEPTION")) {
                    return res.json({
                        success: 0,
                        message: err.message.replace("ER_SIGNAL_EXCEPTION: ", ""),
                    });
                } else if (err) {
                    return res.status(501).json({
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
