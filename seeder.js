const fs = require("fs");
const colors = require("colors");
require("dotenv").config();
const { json } = require("express/lib/response");

const db = require("./api/db");
const path = require('path');
const brand = JSON.parse(
  fs.readFileSync(__dirname + "/data/subCategory.json", "utf-8")
);
const importData = async () => {
  try {

    const create = fs.readFileSync(path.join(__dirname, '/database/create.sql')).toString();
    const query = await db.query(create, (err, result) => {
      if (err) {
        throw err;
      } else {

        console.log("Data imported success".green.inverse);
      }

    });
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await creat.deleteMany();
    console.log("Data deleted success".red.inverse);
  } catch (err) {
    console.log(err.red.inverse);
  }
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
