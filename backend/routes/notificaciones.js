const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verificarToken } = require("../middleware/auth");

// GET /api/notificaciones/hitos-proximos
router.get("/hitos-proximos", verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM hitos 
      WHERE fecha_vencimiento BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 2 DAY)
      ORDER BY fecha_vencimiento ASC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener hitos próximos" });
  }
});

// GET /api/notificaciones
router.get("/", verificarToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM notificaciones 
      WHERE usuario = ? OR usuario = 'todos'
      ORDER BY fecha DESC
    `, [req.user.username]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
});

// POST /api/notificaciones
router.post("/", verificarToken, async (req, res) => {
  const { mensaje, usuario_destino } = req.body;

  if (!mensaje) {
    return res.status(400).json({ message: "Mensaje requerido" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO notificaciones (mensaje, usuario, fecha) VALUES (?, ?, NOW())",
      [mensaje, usuario_destino || "todos"]
    );

    await pool.query(
      "INSERT INTO auditoria (usuario, accion) VALUES (?, ?)",
      [req.user.username, `ENVIO_NOTIFICACION: ${mensaje}`]
    );

    res.status(201).json({ message: "Notificación enviada", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error al enviar notificación" });
  }
});

module.exports = router;