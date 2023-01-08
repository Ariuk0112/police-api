const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const path = require("path");
const fs = require("fs");
const asyncHandler = require("../../middleware/asyncHandler");
const myError = require("../../utils/myError");

module.exports = {
  createNews: asyncHandler(async (req, res) => {
    let { n_img, n_title, n_desc, n_files, n_content, child_sub_cat_id, n_video_link } =
      req.body;
    if (req.files) {
      if (req.files.n_img) {
        n_img = "img.png";
      } else {
        n_img = "no-photo.png";
      }
      if (req.files.n_files) {
        n_files = "file.pdf";
      } else {
        n_files = "no-files";
      }
    }
    else {
      n_img = " ";
    }


    db.query(
      "call sp_create_news(?,?,?,?,?,?,?) ",
      [n_img, n_title, n_desc, n_content, n_files, child_sub_cat_id, n_video_link],
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
        if (req.files) {
          if (req.files.n_img) {
            n_img = req.files.n_img;
            n_img.name = `/uploads/news/photo_${results[0].n_id}${path.parse(n_img.name).ext
              }`;
            str = n_img.name.split("/").pop();
            n_img.mv(`${process.env.NEWS_FILE_UPLOAD_PATH}/${str}`, (err) => {
              if (err) {
                throw new myError(
                  "Файл хуулах явцад алдаа гарлаа :" + err.message,
                  400
                );
              }
            });
            n_img = n_img.name;
          }

          if (req.files.n_files) {
            n_files = req.files.n_files;
            n_files.name = `/uploads/news/files_${results[0].n_id}${path.parse(n_files.name).ext
              }`;
            str = n_files.name.split("/").pop();
            n_files.mv(`${process.env.NEWS_FILE_UPLOAD_PATH}/${str}`, (err) => {
              if (err) {
                throw new myError(
                  "Файл хуулах явцад алдаа гарлаа :" + err.message,
                  400
                );
              }
            });
            n_files = n_files.name;
          }
          db.query(
            "call sp_insert_news_img(?,?,?)",
            [results[0].n_id, n_img, n_files],
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

  showAllNews: asyncHandler(async (req, res) => {
    db.query(
      "select * from t_news order by createdAt desc",
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

  showOneNews: asyncHandler(async (req, res) => {
    const n_id = req.params.id;
    console.log(n_id);
    db.query(
      "select n_id, n_img, n_title, n_desc, n_content, n_viewcount, createdAt ,sub_cat_name ,cat_name from t_news inner join  t_sub_category on t_news.sub_cat_id =t_sub_category.sub_cat_id inner join t_category on t_category.cat_id =t_sub_category.cat_id where t_news.n_id = ? ",
      [n_id],
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
  showVideoNews: asyncHandler(async (req, res) => {

    db.query(
      "SELECT n_id FROM t_news where n_video_link is not null order by createdAt desc;",
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
        let skip = start - 1;
        console.log(limit);
        if (end > total) end = total;

        const pagination = { total, pageCount, start, end };

        if (page < pageCount) pagination.nextPage = page + 1;
        if (page > 1) pagination.prevPage = page - 1;

        db.query(
          "SELECT * FROM t_news where n_video_link is not null order by createdAt desc limit ?,? ",
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
            result = Object.values(JSON.parse(JSON.stringify(result)));

            console.log(result);
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
  updateNews: asyncHandler(async (req, res) => {
    let n_img, n_files, str;
    if (req.files) {
      if (req.files.n_img) {
        console.log("sda");
        n_img = req.files.n_img;
        n_img.name = `/uploads/news/photo_${req.body.n_id}${path.parse(n_img.name).ext
          }`;
        str = n_img.name.split("/").pop();
        console.log(str);
        n_img.mv(`${process.env.NEWS_FILE_UPLOAD_PATH}/${str}`, (err) => {
          if (err) {
            throw new myError(
              "Файл хуулах явцад алдаа гарлаа :" + err.message,
              400
            );
          }
        });

        n_img = n_img.name;
      }
      else {
        n_img = req.body.n_img;
      }
      if (req.files.n_files) {
        n_files = req.files.n_files;
        n_files.name = `/uploads/news/files_${req.body.n_id}${path.parse(n_files.name).ext
          }`;
        str = n_files.name.split("/").pop();
        console.log(str);
        n_files.mv(`${process.env.NEWS_FILE_UPLOAD_PATH}/${str}`, (err) => {
          if (err) {
            throw new myError(
              "Файл хуулах явцад алдаа гарлаа :" + err.message,
              400
            );
          }
        });

        n_files = n_files.name;
      }
      else {
        n_files = req.body.n_files;
      }

    }
    else {
      n_img = req.body.n_img;
      n_files = req.body.n_files;
    }


    let { n_id, n_title, n_desc, n_content, sub_cat_id } = req.body;
    console.log(n_img, n_title, n_desc, n_content, sub_cat_id, n_files);
    db.query(
      "call sp_update_news(?,?,?,?,?,?,?) ",
      [n_id, n_img, n_title, n_desc, n_content, sub_cat_id, n_files],
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

  deleteNews: asyncHandler(async (req, res) => {
    const n_id = req.params.id;
    db.query("call sp_delete_news(?) ", [n_id], (err, results) => {
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
      console.log(results);
      let str = results[0].n_img.split("/").pop();
      fs.unlink(`${process.env.NEWS_FILE_UPLOAD_PATH}/${str}`, (err) => {
        if (err) {
          throw new myError(
            "Файл устгах явцад алдаа гарлаа :" + err.message,
            400
          );
        }
      });
      let str1 = results[0].n_files.split("/").pop();
      fs.unlink(`${process.env.NEWS_FILE_UPLOAD_PATH}/${str1}`, (err) => {
        if (err) {
          throw new myError(
            "Файл устгах явцад алдаа гарлаа :" + err.message,
            400
          );
        }
      });
      res.status(200).json({
        success: 1,
        message: "success",
        data: results,
      });
    });
  }),

  showNewsWithSubCat: asyncHandler(async (req, res) => {
    let sub_cat_id = req.params.sub_cat_id;
    if (req.query.startDate && req.query.endDate) {
      let startDate = req.query.startDate;
      let endDate = req.query.endDate;
      db.query(
        "select n_id from t_news inner join t_sub_category on t_news.sub_cat_id =t_sub_category.sub_cat_id where t_sub_category.sub_cat_id = ?  and t_news.createdAt between ? and ?; ",
        [sub_cat_id, startDate, endDate],
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
          let skip = start - 1;
          if (end > total) end = total;

          const pagination = { total, pageCount, start, end };

          if (page < pageCount) pagination.nextPage = page + 1;
          if (page > 1) pagination.prevPage = page - 1;

          results = Object.values(JSON.parse(JSON.stringify(results)));
          console.log(results);
          db.query(
            "select n_id from t_news inner join t_sub_category on t_news.sub_cat_id =t_sub_category.sub_cat_id where t_sub_category.sub_cat_id = ?  and t_news.createdAt between ? and ? order by createdAt desc limit ?,?;",
            [sub_cat_id, startDate, endDate, skip, limit],
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
    else {
      db.query(
        "select n_id from t_news inner join t_sub_category on t_news.sub_cat_id =t_sub_category.sub_cat_id where t_sub_category.sub_cat_id = ?; ",
        [sub_cat_id],
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
          console.log(results);
          db.query(
            "call sp_filter_news_sub_cat_id(?,?,?,?)",
            [sub_cat_id, skip, limit, sort],
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

  showNewsWithCat: asyncHandler(async (req, res) => {
    let cat_id = req.params.cat_id;
    if (req.query.startDate && req.query.endDate) {
      let startDate = req.query.startDate;
      let endDate = req.query.endDate;
      db.query(
        "select n_id from t_news inner join t_sub_category on t_news.sub_cat_id = t_sub_category.sub_cat_id inner join t_category on t_sub_category.cat_id = t_category.cat_id where t_category.cat_id = ? and t_news.createdAt between ? and ?;",
        [cat_id, startDate, endDate],
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
          let skip = start - 1;
          if (end > total) end = total;

          const pagination = { total, pageCount, start, end };

          if (page < pageCount) pagination.nextPage = page + 1;
          if (page > 1) pagination.prevPage = page - 1;

          db.query(
            "select * from t_news inner join t_sub_category on t_news.sub_cat_id = t_sub_category.sub_cat_id inner join t_category on t_sub_category.cat_id = t_category.cat_id where t_category.cat_id = ? and t_news.createdAt between ? and ? order by createdAt desc limit ?,? ;",
            [cat_id, startDate, endDate, skip, limit],
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
    else {
      db.query(
        "select n_id from t_news inner join t_sub_category on t_news.sub_cat_id = t_sub_category.sub_cat_id inner join t_category on t_sub_category.cat_id = t_category.cat_id where t_category.cat_id = ?;",
        [cat_id],
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

          db.query(
            "call sp_filter_news_cat_id(?,?,?,?)",
            [cat_id, skip, limit, sort],
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

  searchNews: asyncHandler(async (req, res) => {
    let text = '%' + req.query.text + '%';
    db.query(
      "SELECT n_id FROM t_news where n_title like ?;",
      [text],
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
        let skip = start - 1;
        console.log(limit);
        if (end > total) end = total;

        const pagination = { total, pageCount, start, end };

        if (page < pageCount) pagination.nextPage = page + 1;
        if (page > 1) pagination.prevPage = page - 1;

        db.query(
          "SELECT * FROM t_news where n_title like ? order by createdAt desc limit ?,? ",
          [text, skip, limit],
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

            console.log(result);
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
