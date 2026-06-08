const nodemailer = require("nodemailer");
const pool = require("../db");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function verificarYEnviarAlertas() {
  try {
    const [hitos] = await pool.query(`
      SELECT * FROM hitos 
      WHERE fecha_vencimiento BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 48 HOUR)
      AND notificado = 0
    `);

    for (const hito of hitos) {
      // Obtener todos los usuarios para notificar
      const [usuarios] = await pool.query(
        "SELECT username FROM users WHERE role IN ('QA', 'Direccion')"
      );

      for (const usuario of usuarios) {
        await transporter.sendMail({
          from: `"EliteTrack QP" <${process.env.SMTP_USER}>`,
          to: process.env.SMTP_DEST || process.env.SMTP_USER,
          subject: `⚠️ Hito próximo a vencer: ${hito.titulo}`,
          html: `
            <h2>Alerta de Hito — EliteTrack QP</h2>
            <p>El hito <strong>${hito.titulo}</strong> del proyecto <strong>${hito.proyecto}</strong> vence en menos de 48 horas.</p>
            <p><strong>Fecha de vencimiento:</strong> ${new Date(hito.fecha_vencimiento).toLocaleString("es-AR")}</p>
            <p>Ingresá al sistema para tomar las acciones necesarias.</p>
          `,
        });
      }

      // Marcar como notificado
      await pool.query("UPDATE hitos SET notificado = 1 WHERE id = ?", [hito.id]);

      // Registrar en auditoría
      await pool.query(
        "INSERT INTO auditoria (usuario, accion) VALUES (?, ?)",
        ["sistema", `ALERTA_EMAIL_HITO: ${hito.titulo}`]
      );
    }

    return hitos.length;
  } catch (err) {
    console.error("Error enviando alertas:", err);
    return 0;
  }
}

module.exports = { verificarYEnviarAlertas };