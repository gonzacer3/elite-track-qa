require("dotenv").config({ override: false });
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function init() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "elite_track",
  });

  try {
    await connection.query("CREATE DATABASE IF NOT EXISTS elite_track");
    await connection.query("USE elite_track");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       username VARCHAR(50) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL,
       role ENUM('Consultor','QA','Direccion','Cliente') NOT NULL,
       email VARCHAR(100) DEFAULT NULL,
       proyecto VARCHAR(100) DEFAULT NULL,
       intentos_fallidos INT DEFAULT 0,
       bloqueado_hasta DATETIME DEFAULT NULL
      )
    `);

    const [cols] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'email'
    `);
    if (cols.length === 0) {
      await connection.query(`ALTER TABLE users ADD COLUMN email VARCHAR(100) DEFAULT NULL`);
    }

    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS evidencias (
       id INT AUTO_INCREMENT PRIMARY KEY,
       titulo VARCHAR(100) NOT NULL,
       descripcion TEXT,
       archivo LONGTEXT,
       archivo_nombre VARCHAR(255) DEFAULT NULL,
       archivo_tipo VARCHAR(100) DEFAULT NULL,
       proyecto VARCHAR(100) DEFAULT NULL,
       hito VARCHAR(100) DEFAULT NULL,
       fecha_vencimiento DATE DEFAULT NULL,
       usuario VARCHAR(50),
       estado ENUM('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
       fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const [colsVenc] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'evidencias' AND COLUMN_NAME = 'fecha_vencimiento'
    `);
    if (colsVenc.length === 0) {
      await connection.query(`ALTER TABLE evidencias ADD COLUMN fecha_vencimiento DATE DEFAULT NULL`);
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS hitos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(100) NOT NULL,
        descripcion TEXT,
        fecha_vencimiento DATETIME NOT NULL,
        proyecto VARCHAR(100),
        notificado TINYINT DEFAULT 0
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mensaje TEXT NOT NULL,
        usuario VARCHAR(50) NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS auditoria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(50) NOT NULL,
        accion TEXT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const usuarios = [
      { username: "admin",     password: "Admin1234!",     role: "Direccion", email: "qa.elitetrack+admin@gmail.com"     },
      { username: "qa",        password: "QA1234!",        role: "QA",        email: "qa.elitetrack+qa@gmail.com"        },
      { username: "consultor", password: "Consultor1234!", role: "Consultor", email: "qa.elitetrack+consultor@gmail.com" },
      { username: "cliente",   password: "Cliente1234!",   role: "Cliente",   email: "qa.elitetrack+cliente@gmail.com"   },
      { username: "projectalpha", password: "Cliente1234!", role: "Cliente", email: "qa.elitetrack+cliente@gmail.com" },
    ];

    for (const u of usuarios) {
      const [exists] = await connection.query("SELECT id FROM users WHERE username = ?", [u.username]);
      if (exists.length === 0) {
        const hash = await bcrypt.hash(u.password, 10);
        await connection.query(
          "INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)",
          [u.username, hash, u.role, u.email]
        );
        console.log(`Usuario creado: ${u.username} (${u.email})`);
      } else {
        await connection.query(
          "UPDATE users SET email = ? WHERE username = ? AND email IS NULL",
          [u.email, u.username]
        );
      }
    }

    await connection.query(`
      INSERT INTO hitos (titulo, descripcion, fecha_vencimiento, proyecto)
      SELECT 'Revisión UAT', 'Revisión final con usuarios', DATE_ADD(NOW(), INTERVAL 3 DAY), 'EliteTrack QP'
      WHERE NOT EXISTS (SELECT 1 FROM hitos WHERE titulo = 'Revisión UAT')
    `);

    console.log("Base de datos inicializada correctamente ✅");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await connection.end();
    process.exit();
  }
}

init();