const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

// POST /api/auth/refresh
router.post("/refresh", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Token requerido" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token inválido" });

  try {
    // Verificar el token actual (aunque esté por vencer)
    const decoded = jwt.verify(token, JWT_SECRET);

    // Emitir nuevo token con 15 minutos más desde ahora
    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username, role: decoded.role },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token: newToken });
  } catch (err) {
    return res.status(401).json({ message: "Token expirado o inválido" });
  }
});

module.exports = router;