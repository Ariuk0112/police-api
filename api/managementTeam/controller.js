const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");
const { isNull } = require("util");

module.exports = {
  createTeam: asyncHandler(async (req, res) => {
    let { man_lastName, man_firstName, man_position, man_img } = req.body;
    if (req.files.man_img) {
      man_img = "img.png";
    } else {
      man_img = "no-photo.png";
    }

    db.query(
      "call sp_create_man_team(?,?,?,?) ",
      [man_img, man_firstName, man_lastName, man_position],
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
        man_img = req.files.man_img;
        man_img.name = `/uploads/management/photo_${results[0].man_id}${path.parse(man_img.name).ext
          }`;
        str = man_img.name.split("/").pop();
        man_img.mv(
          `${process.env.MANAGEMENT_FILE_UPLOAD_PATH}/${str}`,
          (err) => {
            if (err) {
              throw new myError(
                "Файл хуулах явцад алдаа гарлаа :" + err.message,
                400
              );
            }
          }
        );
        db.query(
          "update t_management_team set man_img = ? where man_id = ?  ; ",
          [man_img.name, results[0].man_id],
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
  updateManTeam: asyncHandler(async (req, res) => {
    let { man_lastName, man_firstName, man_position, man_id } = req.body;
    let man_img;
    if (req.files.man_img) {
      man_img = req.files.man_img;
      man_img.name = `/uploads/management/photo_${req.body.man_id}${path.parse(man_img.name).ext
        }`;
      str = man_img.name.split("/").pop();
      console.log(str);
      man_img.mv(`${process.env.MANAGEMENT_FILE_UPLOAD_PATH}/${str}`, (err) => {
        if (err) {
          throw new myError(
            "Файл хуулах явцад алдаа гарлаа :" + err.message,
            400
          );
        }
      });

      man_img = man_img.name;
    } else {
      man_img = req.body.man_img;
    }

    db.query(
      "update t_management_team set man_firstName =?, man_lastName =?, man_position =? , man_img =? where man_id =? ",
      [man_firstName, man_lastName, man_position, man_img, man_id],
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

        results = Object.values(JSON.parse(JSON.stringify(results)));


        res.status(200).json({
          success: 1,
          message: "success",
          data: results,
        });
      }
    );
  }),
  showAllMember: asyncHandler(async (req, res) => {
    db.query(
      "select * from t_management_team ",
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

  deleteMember: asyncHandler(async (req, res) => {
    const man_id = req.params.id;
    db.query(
      "select man_img from t_management_team where man_id = ? ",
      [man_id],
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
        if (empty(results)) {
          res.status(200).json({
            success: 0,
            message: "id-tai medeelel baihgui baina",
          });
        } else {
          let str = results[0].man_img.split("/").pop();
          fs.unlink(
            `${process.env.MANAGEMENT_FILE_UPLOAD_PATH}/${str}`,
            (err) => {
              if (err) {
                throw new myError(
                  "Файл устгах явцад алдаа гарлаа :" + err.message,
                  400
                );
              }
            }
          );

          db.query(
            "delete from t_management_team where man_id = ? ",
            [man_id],
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
      }
    );
  }),
};
