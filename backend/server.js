require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Rutas
// Scheduler de alertas por email
const { verificarYEnviarAlertas } = require("./routes/email");
if (require.main === module || process.env.NODE_ENV !== "test") {
  setInterval(async () => {
    const enviados = await verificarYEnviarAlertas();
    if (enviados > 0) console.log(`📧 Alertas enviadas: ${enviados}`);
  }, 60 * 60 * 1000); // cada 1 hora
}

app.use("/api/auth", require("./routes/auth"));
app.use("/api/evidencias", require("./routes/evidencias"));
app.use("/api/notificaciones", require("./routes/notificaciones"));
app.use("/api/auditoria", require("./routes/auditoria"));

// Ruta de salud
app.get("/", (req, res) => {
  res.json({ status: "EliteTrack QP API funcionando ✅" });
});

// Solo levantar el servidor si no estamos en modo test
if (require.main === module) {
  const pool = require("./db");
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, async () => {
    try {
      await pool.query("SELECT 1");
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log("Conectado a la base de datos elite_track ✅");
    } catch (err) {
      console.error("Error conectando a la base:", err);
    }
  });
}

module.exports = app;