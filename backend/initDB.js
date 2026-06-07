const pool = require("./db");

async function init() {
  try {
    await pool.query("USE elite_track");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Consultor','QA','Direccion','Cliente') NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS evidencias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(100) NOT NULL,
        descripcion TEXT NOT NULL,
        archivo TEXT,
        usuario VARCHAR(50) NOT NULL,
        estado ENUM('pendiente','aprobada','rechazada') DEFAULT 'pendiente',
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS hitos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(100) NOT NULL,
        descripcion TEXT,
        fecha_vencimiento DATETIME NOT NULL,
        proyecto VARCHAR(100)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mensaje TEXT NOT NULL,
        usuario VARCHAR(50) NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS auditoria (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario VARCHAR(50) NOT NULL,
        accion TEXT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Usuarios de prueba
    const bcrypt = require("bcryptjs");
    const usuarios = [
      { username: "admin", password: "Admin1234!", role: "Direccion" },
      { username: "qa", password: "QA1234!", role: "QA" },
      { username: "consultor", password: "Consultor1234!", role: "Consultor" },
      { username: "cliente", password: "Cliente1234!", role: "Cliente" },
    ];

    for (const u of usuarios) {
      const [exists] = await pool.query("SELECT id FROM users WHERE username = ?", [u.username]);
      if (exists.length === 0) {
        const hash = await bcrypt.hash(u.password, 10);
        await pool.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [u.username, hash, u.role]);
        console.log(`Usuario creado: ${u.username}`);
      }
    }

    // Hito de prueba próximo
    await pool.query(`
      INSERT INTO hitos (titulo, descripcion, fecha_vencimiento, proyecto)
      SELECT 'Revisión UAT', 'Revisión final con usuarios', DATE_ADD(NOW(), INTERVAL 3 DAY), 'EliteTrack QP'
      WHERE NOT EXISTS (SELECT 1 FROM hitos WHERE titulo = 'Revisión UAT')
    `);

    console.log("Base de datos inicializada correctamente ✅");
    process.exit();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

init();
