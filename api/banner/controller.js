const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");
module.exports = {
    createBanner: asyncHandler(async (req, res) => {
        let { b_title, b_img, b_link } =
            req.body;
        if (req.files) {
            if (req.files.b_img) {
                b_img = "img.png";
            } else {
                b_img = "no-photo.png";
            }

        }
        else {
            b_img = "";
        }
        db.query(
            "insert into t_banner (b_title, b_img, b_link ) values (?,?,?);select max(b_id) as b_id from t_banner;",
            [b_title, b_img, b_link],
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
                results = Object.values(JSON.parse(JSON.stringify(results[1])));

                if (req.files) {
                    if (req.files.b_img) {
                        b_img = req.files.b_img;
                        b_img.name = `/uploads/banner/photo_${results[0].b_id}${path.parse(b_img.name).ext
                            }`;
                        str = b_img.name.split("/").pop();
                        b_img.mv(`${process.env.BANNER_FILE_UPLOAD_PATH}/${str}`, (err) => {
                            if (err) {
                                throw new myError(
                                    "Файл хуулах явцад алдаа гарлаа :" + err.message,
                                    400
                                );
                            }
                        });
                        b_img = b_img.name;
                    }
                    db.query(
                        "update t_banner set b_img = ? where b_id = ?",
                        [b_img, results[0].b_id],
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
                else {
                    res.status(200).json({
                        success: 1,
                        message: "success",
                        data: results,
                    });
                }

            }
        );
    }),
    getList: asyncHandler(async (req, res, err) => {

        db.query(
            "select * from t_banner",
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

    updateBanner: asyncHandler(async (req, res) => {
        let b_img, str;
        if (req.files) {
            if (req.files.b_img) {
                b_img = req.files.b_img;
                b_img.name = `/uploads/banner/photo_${req.body.b_id}${path.parse(b_img.name).ext
                    }`;
                str = b_img.name.split("/").pop();
                b_img.mv(`${process.env.BANNER_FILE_UPLOAD_PATH}/${str}`, (err) => {
                    if (err) {
                        throw new myError(
                            "Файл хуулах явцад алдаа гарлаа :" + err.message,
                            400
                        );
                    }
                });

                b_img = b_img.name;
            }
            else {
                b_img = req.body.n_img;
                if (empty(b_img)) {
                    b_img = ""
                }
            }

        }
        else {
            b_img = req.body.b_img;
            if (empty(b_img)) {
                b_img = " "
            }
        }


        let { b_id, b_title, b_link } = req.body;
        db.query(
            "update t_banner set b_title=?, b_img=?, b_link=? where b_id = ? ",
            [b_title, b_img, b_link, b_id],
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
                });
            }
        );
    }),

    deleteBanner: asyncHandler(async (req, res) => {
        if (req.params.id) {
            db.query(
                "delete from t_banner where b_id = ?",
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
