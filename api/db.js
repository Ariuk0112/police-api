const mysql = require("mysql");

const pool = mysql.createPool({
  dateStrings: true,
  connectionLimit: process.env.DB_CONNECTIONLIMIT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE, multipleStatements: true
});
/**
 * Executes SQL query and returns data.
 * @constructor
 * @param {string} queryText - SQL query string.
 */
const querySQL = function (queryText) {
  return new Promise(function (resolve, reject) {
    pool.query(queryText, function (err, results, fields) {
      // Error
      if (err) return reject(err);
      if (Array.isArray(results)) {
        // removal by for loop
        let finalResults = [];
        const resultsLength = results.length;
        for (let index = 0; index < resultsLength; index++) {
          finalResults.push({ ...results[index] });
        }
        return resolve(finalResults);
      } else {
        return resolve(results);
      }
    });
  });
};
module.exports = pool;
