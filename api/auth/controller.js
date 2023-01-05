const jwt = require("jsonwebtoken");
const { generateOTP, message } = require("../../utils/otp.util");
const empty = require("is-empty");
const md5 = require("md5");
const db = require("../db");
const asyncHandler = require("../../middleware/asyncHandler");
function auth(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (token == null)
    return res.status(401).json({
      success: 0,
      message: "token is null",
    });

  jwt.verify(token, process.env.SECRET, (err, data) => {
    if (err) {
      jwt.verify(token, process.env.ACCESS_TOKEN_ADMIN, (err, data) => {
        if (err)
          return res.status(401).json({
            success: 0,
            message: err.message,
          });
        console.log("admin");
        req.data = data;
        next();
      });
    } else {
      console.log("user");
      req.data = data;
      next();
    }
  });
}

module.exports = {
  auth: auth,
  check: (req, res) => {
    res.json({
      success: 1,
      data: req.data,
    });
  },

  createAccount: asyncHandler(async (req, res) => {
    if (req.body.username && req.body.password) {
      console.log("sda");
      let { username, password } = req.body;
      db.query(
        "call sp_create_admin_account(?,?);",
        [username, password],
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
          const accessToken = jwt.sign(
            {
              id: results[0].a_id,
            },
            process.env.ACCESS_TOKEN_ADMIN,
            { expiresIn: "300m" }
          );
          console.log(`Creating account for ${req.body.username}`);
          return res.status(200).json({
            success: 1,
            id: results[0].a_id,
            accessToken: accessToken,
          });
        }
      );
    } else {
      let { phone } = req.body;
      const otp = generateOTP(6);
      db.query(
        "call sp_create_user_account(?,?)",
        [phone, otp],
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
          return res.status(200).json({
            success: 1,
            otp: otp,
            phone: req.body.phone,
            u_id: results[0].u_id,
          });
        }
      );
    }
    // message(phone, otp);
  }),
  login: asyncHandler(async (req, res) => {
    if (req.body.username && req.body.password) {
      let { username, password } = req.body;
      db.query(
        "call sp_login_admin(?,?)",
        [username, password],
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
          const accessToken = jwt.sign(
            {
              ad_id: results[0].a_id,
              username: username,
            },
            process.env.ACCESS_TOKEN_ADMIN,
            { expiresIn: "300m" }
          );
          return res.json({
            success: true,
            ad_id: results[0].a_id,
            username: req.body.username,
            accessToken: accessToken,
          });
        }
      );
    } else {
      const { phone } = req.body;
      const otp = generateOTP(6);
      db.query("call sp_login_user(?,?)", [phone, otp], (err, results) => {
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
          success: true,
          message: "Баталгаажуулах код бүртгэлтэй дугаарлуу илгээгдлээ",
          data: {
            phone: phone,
            otp: otp,
          },
        });
      });
      message(phone, otp);
    }
  }),

  verifyPhoneOtp: asyncHandler(async (req, res) => {
    let { phone, otp } = req.body;
    db.query("call sp_verifyOtp(?,?) ", [phone, otp], (err, results) => {
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
      const accessToken = jwt.sign(
        {
          userId: results[0].u_id,
        },
        process.env.SECRET,
        { expiresIn: "120m" }
      );

      res.status(200).json({
        type: "success",
        message: "OTP verified successfully",
        data: {
          accessToken,
          userId: results[0].u_id,
        },
      });
    });
  }),
  show: asyncHandler(async (req, res) => {
    db.query("select * from t_users ", [], (err, results) => {
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
        data: results,
      });
    });
  }),
  update: asyncHandler(async (req, res) => {
    let user = req.body;
    user.password = md5(req.body.password);
    let item = await User.findById(req.params.id).lean();
    if (!item)
      return res.json({ success: false, message: "Мэдээлэл олдсонгүй.!" });
    let vol = await User.findByIdAndUpdate(req.params.id, user);
    return res.json({
      success: true,
      data: vol,
    });
  }),
  delete_user: asyncHandler(async (req, res) => {
    let item = await User.findById(req.params.id).lean();
    if (!item)
      return res.json({ success: false, message: "Мэдээлэл олдсонгүй.!" });
    let vol = await User.findByIdAndDelete(req.params.id);
    return res.json({
      success: true,
      data: vol,
    });
  }),
};
