const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");

module.exports = {
    create_division: asyncHandler(async (req, res, err) => {
        if (empty(req.body.d_name)) {
            res.status(200).json({
                success: 0,
                message: "d_name cannot be empty",
            });
        }
        else {
            let d_name = req.body;

            db.query(
                "insert into t_division (d_name) values (?);",
                [d_name],
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
    create_division_tab: asyncHandler(async (req, res, err) => {
        if (empty(req.body.tab_name)) {
            res.status(200).json({
                success: 0,
                message: "tab_name cannot be empty",
            });
        }
        else if (empty(req.body.tab_detail)) {
            res.status(200).json({
                success: 0,
                message: "tab_detail cannot be empty",
            });
        }
        else if (empty(req.body.d_id)) {
            res.status(200).json({
                success: 0,
                message: "d_id cannot be empty",
            });
        }
        else {
            let { tab_name, tab_detail, d_id } = req.body;

            db.query(
                "insert into t_division_tab (tab_name, tab_detail, d_id) values (?,?,?);",
                [tab_name, tab_detail, d_id],
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

    getDivList: asyncHandler(async (req, res, err) => {

        db.query(
            "select d_id from t_division",
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
                const limit = parseInt(req.query.limit) || 20;
                const sort = req.query.sort;

                ["sort", "page", "limit"].forEach((el) => delete req.query[el]);

                const pageCount = Math.ceil(total / limit);
                const start = (page - 1) * limit + 1;
                let end = start + limit - 1;
                let skip = start;
                if (end > total) end = total;

                const pagination = { total, pageCount, start, end };

                if (page < pageCount) pagination.nextPage = page + 1;
                if (page > 1) pagination.prevPage = page - 1;

                results = Object.values(JSON.parse(JSON.stringify(results)));
                db.query(
                    "select * from t_division limit ?,?",
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
                        result = Object.values(JSON.parse(JSON.stringify(result[0])));

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

    getDivTabById: asyncHandler(async (req, res, err) => {
        let d_id = req.query.id;
        if (empty(d_id)) {
            res.status(501).json({
                success: 0,
                message: "d_id cannot be empty!",
            });
        }
        else {

            db.query(
                "select * from t_division_tab join t_division on t_division_tab.d_id = t_division.d_id where t_division.d_id = ? ",
                [d_id],
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
                    result = Object.values(JSON.parse(JSON.stringify(result)));

                    res.status(200).json({
                        success: 1,
                        message: "success",
                        data: result,
                    });
                }
            );
        }
    }),

    deleteDiv: asyncHandler(async (req, res) => {
        let d_id = req.query.id;

        db.query(
            "delete from t_division where d_id = ?",
            [d_id],
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
    deleteDivTab: asyncHandler(async (req, res) => {
        let d_id = req.query.id;
        db.query(
            "delete from t_division where d_id = ?",
            [d_id],
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

    getCrimeList_subtype: asyncHandler(async (req, res, err) => {
        sub_type = req.body.sub_type;
        if (empty(sub_type)) {
            res.status(501).json({
                success: 0,
                message: "type cannot be empty!",
            });
        }
        else {
            db.query(
                "select c_id from t_crime where c_sub_type_name = ?",
                [sub_type],
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
                    let skip = start;
                    if (end > total) end = total;

                    const pagination = { total, pageCount, start, end };

                    if (page < pageCount) pagination.nextPage = page + 1;
                    if (page > 1) pagination.prevPage = page - 1;

                    results = Object.values(JSON.parse(JSON.stringify(results)));
                    db.query(
                        "call sp_filter_crime_subtype(?,?,?,?)",
                        [sub_type, skip, limit, sort],
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
                            result = Object.values(JSON.parse(JSON.stringify(result[0])));

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

    }),
    createSubtype: asyncHandler(async (req, res) => {
        let { c_sub_type_name, type_id } =
            req.body;
        db.query(
            "insert into t_crime_sub_type (c_sub_type_name,type_id) values (?,?) ",
            [c_sub_type_name, type_id],
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

    showSubtype: asyncHandler(async (req, res) => {
        db.query(
            "select * from t_crime_sub_type left join t_report_type on t_crime_sub_type.type_id = t_report_type.type_id",
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
    updateCrimeType: asyncHandler(async (req, res) => {
        let { c_sub_type_name, type_id, c_sub_type_id } = req.body;
        db.query(
            "update t_crime_sub_type set c_sub_type_name=? , type_id = ? where c_sub_type_id=?",
            [c_sub_type_name, type_id, c_sub_type_id],
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
    deleteSub: asyncHandler(async (req, res) => {
        if (req.params.c_type_id) {
            db.query(
                "delete from t_crime_sub_type where c_sub_type_id = ?",
                [req.params.c_type_id],
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
        else {
            res.status(501).json({
                success: 0,
                message: "id must be filled"
            });

        }
    }),
};
