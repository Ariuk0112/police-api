const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");

module.exports = {
    create_faq: asyncHandler(async (req, res) => {
        let { f_question, f_answer } = req.body;
        if (empty(f_question) && empty(f_answer)) {
            res.status(501).json({
                success: 0,
                message: "f_question or f_answer cannot be empty"
            });
        }
        else {
            db.query(
                "insert into t_faq (f_question,f_answer) values(?,?)",
                [f_question, f_answer],
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
        }

    }),

    create_key: asyncHandler(async (req, res) => {
        let key_name = req.body.key_name;
        db.query("insert into t_faq_key (key_name) values(?) ", [key_name], (err, results) => {
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
    update_key: asyncHandler(async (req, res) => {
        let { key_name, key_id } = req.body;
        db.query("update t_faq_key set key_name=? where key_id=? ", [key_name, key_id], (err, results) => {
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
    updateFAQ: asyncHandler(async (req, res) => {
        let { f_question, f_answer, f_id } = req.body;
        db.query("update t_faq set f_question=?,f_answer=? where f_id=? ", [f_question, f_answer, f_id], (err, results) => {
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
    showFAQ: asyncHandler(async (req, res) => {

        if (empty(req.body.key_name)) {
            db.query(
                "select f_id from t_faq ",
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
                        "select * from t_faq limit ?,?",
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
        }
        else {
            let key_name = '%' + req.body.key_name + '%';
            console.log(key_name);
            db.query(
                "SELECT * FROM t_faq where f_question LIKE ? ",
                [key_name],

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
        }
    }),
    show_key: asyncHandler(async (req, res) => {
        console.log("sda");
        db.query(
            "SELECT * FROM data_police.t_faq_key;",
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
    deleteFAQ: asyncHandler(async (req, res) => {
        const f_id = req.params.id;
        db.query(
            "delete from t_faq where f_id = ? ",
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
    deleteKey: asyncHandler(async (req, res) => {
        const key_id = req.params.id;
        db.query(
            "delete from t_faq_key where key_id = ? ",
            [key_id],
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
