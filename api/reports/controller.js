const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");
const readXlsxFile = require('read-excel-file/node');

module.exports = {
    createReportType: asyncHandler(async (req, res, err) => {
        let { type_name, type_img } =
            req.body;
        if (req.files.type_img) {
            type_img = "img.png";
        } else {
            type_img = "no-photo.png";
        }
        db.query(
            "call sp_create_r_type(?,?) ",
            [type_img, type_name],
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

                results = Object.values(JSON.parse(JSON.stringify(results[0])));
                if (req.files.type_img) {
                    type_img = req.files.type_img;
                    type_img.name = `/uploads/reports/icon_${results[0].type_id}${path.parse(type_img.name).ext
                        }`;
                    str = type_img.name.split("/").pop();
                    type_img.mv(`${process.env.REPORTS_FILE_UPLOAD_PATH}/${str}`, (err) => {
                        if (err) {
                            throw new myError(
                                "Файл хуулах явцад алдаа гарлаа :" + err.message,
                                400
                            );
                        }
                    });
                    type_img = type_img.name;
                }
                db.query(
                    " update t_report_type set type_img = ? where type_id = ?",
                    [type_img, results[0].type_id],
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
                            data: result,
                        });
                    }
                );
            }
        );
    }),

    showReports: asyncHandler(async (req, res, err) => {
        db.query(
            "select * from t_report_type",
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

    showReportsWithtype: asyncHandler(async (req, res, err) => {
        let type_id = req.params.typeId;
        db.query(
            "select * from t_crime_sub_type  left join t_report_type on t_report_type.type_id = t_crime_sub_type.type_id where t_crime_sub_type.type_id = ?",
            [type_id],
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
    createReport: asyncHandler(async (req, res, err) => {
        let { u_phone, u_name, type_id, r_desc, r_date, c_longitude, c_latitude } = req.body;
        console.log(req.body);
        db.query(
            "INSERT INTO `t_user_reports` (`u_phone`, `u_name`, `type_id`, `r_desc`, `r_date`, `c_longitude`, `c_latitude`) VALUES (?,?,?,?,?,?,?);",
            [u_phone, u_name, type_id, r_desc, r_date, c_longitude, c_latitude],
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
    approveReport: asyncHandler(async (req, res, err) => {
        let { r_id, dep_name, c_type, c_sub_type_name,
            c_date, c_longitude,
            c_latitude, c_is_family_violence, is_imported } = req.body;
        console.log(req.body);
        db.query(
            "call sp_submit_report(?,?,?,?,?,?,?,?,?);",
            [r_id, dep_name, c_type, c_sub_type_name,
                c_date, c_longitude,
                c_latitude, c_is_family_violence, is_imported],
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
    showAllReports: asyncHandler(async (req, res, err) => {
        db.query(
            "select r_id from t_user_reports where t_status = 0",
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
                let skip = start;
                if (end > total) end = total;

                const pagination = { total, pageCount, start, end };

                if (page < pageCount) pagination.nextPage = page + 1;
                if (page > 1) pagination.prevPage = page - 1;

                results = Object.values(JSON.parse(JSON.stringify(results)));
                db.query(
                    "call sp_show_reports(?,?,?)",
                    [skip, limit, sort],
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

    filterReports: asyncHandler(async (req, res, err) => {
        let typeId = req.params.typeId;
        db.query(
            "SELECT r_id FROM data_police.t_user_reports left join t_report_type on t_user_reports.type_id = t_report_type.type_id where t_user_reports.t_status and t_report_type.type_id = ?",
            [typeId],
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
                const limit = parseInt(req.query.limit) || 10;
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
                    "call sp_filter_reports_typeId(?,?,?,?)",
                    [typeId, skip, limit, sort],
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
};
