const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");

module.exports = {
    createEmp: asyncHandler(async (req, res, err) => {
        let { emp_f_name, emp_l_name, emp_position, emp_phone, emp_work_phone } = req.body;
        db.query(
            "INSERT INTO `t_employee`  (`emp_f_name`, `emp_l_name`, `emp_position`,`emp_phone`, `emp_work_phone`)  VALUES   (?,?,?,?,?);   ",
            [emp_f_name, emp_l_name, emp_position, emp_phone, emp_work_phone],
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

    showAllEmp: asyncHandler(async (req, res, err) => {
        db.query(
            "select emp_id from t_employee ",
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

                total = results.length;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 100;
                const sort = req.query.sort;

                ["sort", "page", "limit"].forEach((el) => delete req.query[el]);

                const pageCount = Math.ceil(total / limit);
                const start = (page - 1) * limit + 1;
                let end = start + limit - 1;
                let skip = start - 1;
                if (end > total) end = total;

                const pagination = { total, pageCount, start, end };

                if (page < pageCount) pagination.nextPage = page + 1;
                if (page > 1) pagination.prevPage = page - 1;

                results = Object.values(JSON.parse(JSON.stringify(results)));
                db.query(
                    "select * from t_employee limit ?,?",
                    [skip, limit],
                    (err, result) => {
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
                            pagination,
                            data: result,
                        });
                    }
                );


            }
        );
    }),
    showAllEmp: asyncHandler(async (req, res, err) => {
        if (!empty(req.params.id)) {

            db.query(
                "select * from t_employee where emp_id = ?",
                [req.params.id],

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
                        pagination,
                        data: result,
                    });
                }
            );
        }
        else {
            res.status(501).json({
                success: 0,
                message: "id cannot be empty! "
            });
        }
    }),
};
