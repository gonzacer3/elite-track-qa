const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
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
  const PORT = 3001;
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