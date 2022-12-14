const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");
const readXlsxFile = require('read-excel-file/node');
async function sdafunction(file) {
    if (
        file.mimetype.includes("excel") ||
        file.mimetype.includes("spreadsheetml")
    ) {
        file.name = `/excel${path.parse(file.name).ext}`;
        file.mv(`${process.env.EXCEL_FILE_UPLOAD_PATH}/${file.name}`, { mkdirp: true }, (err) => {
            if (err) {
                throw new myError(
                    "Файл хуулах явцад алдаа гарлаа :" + err.message,
                    400
                );
            }
        })
        let uploadPath = process.env.EXCEL_FILE_UPLOAD_PATH + file.name;
        return uploadPath
    }
    else {

        const message = "Supports only excel file!"
        return message;
    }

}
module.exports = {
    readFile: asyncHandler(async (req, res, err) => {
        if (req.files) {
            let file = req.files.excel;
            let id;
            db.query(
                "select max(last_updated_id) as id from t_crime",
                [],
                asyncHandler(async (err, results) => {
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
                    id = results[0].id;
                    if (empty(id)) {
                        id = 1;
                    }
                    else {
                        id = id + 1
                    }

                    const uploadPath = await sdafunction(file);
                    if (uploadPath == "Supports only excel file!") {
                        return res.status(501).json({
                            success: 0,
                            message: uploadPath,
                        });
                    }

                    readXlsxFile(uploadPath).then((rows) => {
                        // `rows` is an array of rows
                        // each row being an array of cells.
                        rows.shift();

                        const modifiedData = rows.map(data => {
                            return [
                                ...data,
                                id
                            ]
                        })
                        rows.map(data => {
                            db.query(
                                "call sp_filter_imported_crimes(?)",
                                [data[2]]
                            );
                        });
                        db.query(
                            "insert into t_crime (dep_name,c_type,c_sub_type_name,c_date,c_longitude,c_latitude,c_is_family_violence,last_updated_id) values ?",
                            [modifiedData],
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

                        fs.unlink(
                            `${uploadPath}`,
                            (err) => {
                                if (err) {
                                    throw new myError(
                                        "Файл устгах явцад алдаа гарлаа :" + err.message,
                                        400
                                    );
                                }
                            }
                        );
                    },



                    ).catch((err) => {
                        res.status(501).json({
                            success: 0,
                            message: "aldaa garlaa dahin oroldnu1" + err,
                        });
                    })
                })
            );
        } else {
            res.status(500).json({
                success: 0,
                message: "file baihgui baina",
            });
        }
    }),
    getCrimeList: asyncHandler(async (req, res, err) => {

        db.query(
            "select c_id from t_crime",
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
                    "call sp_show_crime(?,?,?)",
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

    getCrimeList_type: asyncHandler(async (req, res, err) => {
        type = req.body.type;
        if (empty(type)) {
            res.status(501).json({
                success: 0,
                message: "type cannot be empty!",
            });
        }
        else {
            db.query(
                "SELECT c_id FROM t_crime join t_crime_sub_type on t_crime.c_sub_type_name = t_crime_sub_type.c_sub_type_name join t_report_type on t_crime_sub_type.type_id = t_report_type.type_id where t_report_type.type_name =?;",
                [type],
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
                        "SELECT t_crime.* FROM data_police.t_crime join t_crime_sub_type on t_crime.c_sub_type_name = t_crime_sub_type.c_sub_type_name join t_report_type on t_crime_sub_type.type_id = t_report_type.type_id where t_report_type.type_name =? order by c_date desc limit ?,?",
                        [type, skip, limit],
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
                                pagination,
                                data: result,
                            });
                        }
                    );
                }
            );
        }

    }),
    getCount: asyncHandler(async (req, res) => {
        let type = req.query.type;
        if (type == "month") {
            db.query(
                "select count(c_id) as count , type_name from t_crime join t_crime_sub_type on t_crime.c_sub_type_name = t_crime_sub_type.c_sub_type_name join t_report_type on t_crime_sub_type.type_id = t_report_type.type_id  WHERE t_crime.c_date  >now() - INTERVAL 1 month group by type_name order by count desc",
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
        }
        else if (type == 'season') {
            db.query(
                "select count(c_id) as count , type_name from t_crime join t_crime_sub_type on t_crime.c_sub_type_name = t_crime_sub_type.c_sub_type_name join t_report_type on t_crime_sub_type.type_id = t_report_type.type_id WHERE t_crime.c_date >now() - INTERVAL 3 month group by type_name order by count desc;",
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
        }
        else if (type == 'year') {
            db.query(
                "select count(c_id) as count , type_name from t_crime join t_crime_sub_type on t_crime.c_sub_type_name = t_crime_sub_type.c_sub_type_name join t_report_type on t_crime_sub_type.type_id = t_report_type.type_id  WHERE t_crime.c_date >now() - INTERVAL 1 year group by type_name order by count desc;",
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
        }
        else if (empty(type)) {
            db.query(
                "select count(c_id) as count , type_name from t_crime right join t_crime_sub_type  on t_crime.c_sub_type_name = t_crime_sub_type.c_sub_type_name right join t_report_type on t_report_type.type_id = t_crime_sub_type.type_id  where type_name not in('Тодорхойгүй') group by t_report_type.type_name order by count desc limit 11",
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
        }
        else {
            res.status(501).json({
                success: 0,
                message: "error undefined type",

            });
        }
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
    deleteLastImport: asyncHandler(async (req, res) => {
        db.query(
            "select max(last_updated_id) as id from t_crime;",
            [],
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
                console.log();
                db.query(
                    "delete from t_crime where last_updated_id = ?;",
                    [result[0].id],
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
        );

    }),
};
