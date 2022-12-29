const fs = require("fs");
const colors = require("colors");
require("dotenv").config();
const { json } = require("express/lib/response");
const Runner = require("run-my-sql-file");
const db = require("./api/db");
const path = require('path');

const host = 'localhost';
const user = 'root';
const password = 'aJYJJSDfqCXStAMRRaBX';

const Importer = require('mysql-import');
const importer = new Importer({ host, user, password });
function createTable() {

  importer.onProgress(progress => {
    var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
    console.log(`${percent}% Completed`);
  });

  importer.import('./database/create.sql').then(() => {

    console.log(`SQL file(s) imported.`);
  }).catch(err => {
    console.error(err);
  });
}
function createProcedure() {

  importer.onProgress(progress => {
    var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
    console.log(`${percent}% Completed`);
  });

  importer.import('./database/sp.sql').then(() => {

    console.log(`SQL file(s) imported.`);
  }).catch(err => {
    console.error(err);
  });
}
// const importData = async () => {
//   try {

//     const create = fs.readFileSync(path.join(__dirname, '/database/create.sql'));
//     console.log(create);
//     const query = await db.query(create, (err, result) => {
//       if (err) {
//         throw err;
//       } else {

//         console.log("Data imported success".green.inverse);
//       }

//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// const deleteData = async () => {
//   try {
//     await creat.deleteMany();
//     console.log("Data deleted success".red.inverse);
//   } catch (err) {
//     console.log(err.red.inverse);
//   }
// };

// if (process.argv[2] == "-i") {
//   importData();
// } else if (process.argv[2] == "-d") {
//   deleteData();
// }
if (process.argv[2] == "-i") {
  createTable();
} else if (process.argv[2] == "-d") {
  deleteData();
}
