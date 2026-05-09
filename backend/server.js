const express = require("express");
const cors = require("cors");
const pool = require("./db"); // conexión a MySQL
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando ✅");
});

// Ruta de login (texto plano)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario en la base
    const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    // Comparación directa (texto plano)
    if (password !== user.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      "clave_secreta", // ⚠️ reemplazá por una clave segura
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// Levantar servidor
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
