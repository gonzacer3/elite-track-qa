const mysql = require("mysql2/promise");

async function init() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "TU_NUEVA_CONTRASEÑA"
    });

    await connection.query("CREATE DATABASE IF NOT EXISTS elite_track");
    await connection.query("USE elite_track");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Consultor','QA','Direccion','Cliente') NOT NULL
      )
    `);

    console.log("✅ Base de datos y tabla creadas correctamente");
    await connection.end();
  } catch (err) {
    console.error("❌ Error creando la base:", err);
  }
}

init();
