const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verificarToken, soloRol } = require("../middleware/auth");

// GET /api/evidencias
router.get("/", verificarToken, async (req, res) => {
  try {
    let rows;
    if (req.user.role === "Cliente") {
      [rows] = await pool.query(
        "SELECT * FROM evidencias WHERE proyecto = ? ORDER BY fecha DESC",
        [req.user.proyecto]
      );
    } else {
      [rows] = await pool.query("SELECT * FROM evidencias ORDER BY fecha DESC");
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener evidencias" });
  }
});

// POST /api/evidencias
router.post("/", verificarToken, soloRol("Consultor", "QA"), async (req, res) => {
  const { titulo, descripcion, archivo, archivo_nombre, archivo_tipo, proyecto, hito, fecha_vencimiento } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({ message: "Título y descripción requeridos" });
  }

  if (archivo && archivo.length > 20 * 1024 * 1024 * 1.37) {
    return res.status(400).json({ message: "Archivo supera el límite de 20MB" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO evidencias 
        (titulo, descripcion, archivo, archivo_nombre, archivo_tipo, proyecto, hito, fecha_vencimiento, usuario, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descripcion, archivo || null, archivo_nombre || null, archivo_tipo || null,
       proyecto || null, hito || null, fecha_vencimiento || null, req.user.username, "pendiente"]
    );

    await pool.query(
      "INSERT INTO auditoria (usuario, accion) VALUES (?, ?)",
      [req.user.username, `SUBIO_EVIDENCIA: ${titulo}${proyecto ? ` [${proyecto}]` : ''}`]
    );

    res.status(201).json({ message: "Evidencia creada", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al crear evidencia" });
  }
});

// PATCH /api/evidencias/:id/revisar
router.patch("/:id/revisar", verificarToken, soloRol("QA"), async (req, res) => {
  const { estado } = req.body;

  if (!["aprobada", "rechazada"].includes(estado)) {
    return res.status(400).json({ message: "Estado debe ser aprobada o rechazada" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE evidencias SET estado = ? WHERE id = ?",
      [estado, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Evidencia no encontrada" });
    }

    await pool.query(
      "INSERT INTO auditoria (usuario, accion) VALUES (?, ?)",
      [req.user.username, `REVISO_EVIDENCIA_${req.params.id}: ${estado}`]
    );

    res.json({ message: `Evidencia ${estado}` });
  } catch (err) {
    res.status(500).json({ message: "Error al revisar evidencia" });
  }
});

module.exports = router;