const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verificarToken, soloRol } = require("../middleware/auth");

// GET /api/auditoria
router.get("/", verificarToken, soloRol("Direccion", "QA"), async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM auditoria ORDER BY fecha DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener auditoría" });
  }
});

module.exports = router;