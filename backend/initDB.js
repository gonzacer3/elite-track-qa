const pool = require("./db");

async function init() {
  try {
    await pool.query("CREATE DATABASE IF NOT EXISTS elite_track");
    await pool.query("USE elite_track");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Consultor','QA','Direccion','Cliente') NOT NULL
      )
    `);

    console.log("Base de datos y tabla creadas correctamente ✅");
    process.exit();
  } catch (err) {
    console.error("Error creando la base:", err);
    process.exit(1);
  }
}

init();
