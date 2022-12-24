const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const asyncHandler = require("../../middleware/asyncHandler");

module.exports = {
  createCategory: asyncHandler(async (req, res) => {
    let { cat_name, cat_name_en } = req.body;
    db.query(
      "call sp_create_cat(?,?);",
      [cat_name, cat_name_en],
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

  showAllCategory: asyncHandler(async (req, res) => {
    db.query(
      "select t_category.* , group_concat(t_sub_category.sub_cat_name) as sub_cat_name,group_concat(t_sub_category.sub_cat_id) as sub_cat_id from t_category left join t_sub_category on t_sub_category.cat_id = t_category.cat_id group by t_category.cat_id;",
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

  showSubCategoryWithCatId: asyncHandler(async (req, res) => {
    db.query(
      "select cat_name , cat_name_en , sub_cat_id , sub_cat_name,sub_cat_name_en from t_category inner join t_sub_category on t_category.cat_id = t_sub_category.cat_id where t_sub_category.cat_id = ?;",
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
  }),

  deleteCategory: asyncHandler(async (req, res) => {
    var cat_id = req.params.id;
    db.query("call sp_delete_cat(?);", [cat_id], (err, results) => {
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

  updateCategory: asyncHandler(async (req, res) => {
    let { cat_id, cat_name, cat_name_en } = req.body;
    db.query(
      "call sp_update_cat(?,?,?);",
      [cat_id, cat_name, cat_name_en],
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

  createSubCategory: asyncHandler(async (req, res) => {
    let { cat_id, sub_cat_name, sub_cat_name_en } = req.body;
    db.query(
      "call sp_create_sub_cat(?,?,?);",
      [cat_id, sub_cat_name, sub_cat_name_en],
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

  showSubCategory: asyncHandler(async (req, res) => {
    db.query("select * from t_sub_category;", [], (err, results) => {
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
    });
  }),

  updateSubCategory: asyncHandler(async (req, res) => {
    let { cat_id, sub_cat_id, sub_cat_name, sub_cat_name_en } = req.body;
    db.query(
      "call sp_update_sub_cat(?,?,?,?);",
      [cat_id, sub_cat_id, sub_cat_name, sub_cat_name_en],
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

  deleteSubCategory: asyncHandler(async (req, res) => {
    let sub_cat_id = req.params.id;
    db.query("call sp_delete_sub_cat(?);", [sub_cat_id], (err, results) => {
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
};
