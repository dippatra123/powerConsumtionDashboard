const mysql = require("mysql2");
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "DPsep@2020",
    database: "ems_database",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    keepAliveInitialDelay: 10000,
  })
  .promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.log("data base connection Fail:", err.stack);
  }
  console.log("Connected to MySQL database using connection pool.");
  connection.release();
});

module.exports = pool;
