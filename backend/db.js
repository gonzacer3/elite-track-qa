const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",              // tu usuario
  password: "2003", // la que recordaste
  database: "elite_track"    // la base que vamos a crear
});

module.exports = pool;