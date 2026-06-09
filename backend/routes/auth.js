const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { JWT_SECRET } = require("../middleware/auth");

const MAX_INTENTOS = 5;
const BLOQUEO_MINUTOS = 15;

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Usuario y contraseña requeridos" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    // CP-SEC04: verificar si la cuenta está bloqueada
    if (user.bloqueado_hasta && new Date() < new Date(user.bloqueado_hasta)) {
      return res.status(423).json({ message: "Cuenta bloqueada. Intentá en 15 minutos." });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      const nuevosIntentos = (user.intentos_fallidos || 0) + 1;

      if (nuevosIntentos >= MAX_INTENTOS) {
        // CP-SEC04: bloquear cuenta
        const bloqueadoHasta = new Date(Date.now() + BLOQUEO_MINUTOS * 60 * 1000);
        await pool.query(
          "UPDATE users SET intentos_fallidos = ?, bloqueado_hasta = ? WHERE id = ?",
          [nuevosIntentos, bloqueadoHasta, user.id]
        );
        return res.status(423).json({ message: "Cuenta bloqueada tras 5 intentos fallidos." });
      }

      await pool.query(
        "UPDATE users SET intentos_fallidos = ? WHERE id = ?",
        [nuevosIntentos, user.id]
      );
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // CP-SEC06: login exitoso — resetear contador
    await pool.query(
      "UPDATE users SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = ?",
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    await pool.query(
      "INSERT INTO auditoria (usuario, accion) VALUES (?, ?)",
      [user.username, "LOGIN"]
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;