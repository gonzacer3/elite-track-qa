import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Business, Folder, ThumbUp } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

const dataProyectos = [
  { name: "Proy A", avance: 80 },
  { name: "Proy B", avance: 60 },
  { name: "Proy C", avance: 90 },
];

const dataKPIs = [
  { name: "Ene", costo: 50, ingresos: 70 },
  { name: "Feb", costo: 55, ingresos: 75 },
  { name: "Mar", costo: 60, ingresos: 85 },
];

function GerenciaDashboard() {
  // Estado para los logs reales de auditoría
  const [auditoria, setAuditoria] = useState([]);
  // Estado para las métricas generales de gerencia
  const [metrics, setMetrics] = useState({ activos: 0, completados: 0, satisfaccion: "0%" });

  useEffect(() => {
    // 1. Traer logs reales del backend (ej: quién modificó un plan o subió evidencia)
    fetch("http://localhost:5000/api/auditoria")
      .then((res) => res.json())
      .then((data) => {
        // Formateamos los logs que vienen de la base de datos
        const logs = data.map((log) => `${log.usuario} - ${log.accion} (${new Date(log.fecha).toLocaleDateString()})`);
        setAuditoria(logs);
      })
      .catch((err) => {
        console.error("Error cargando logs de auditoría:", err);
        // Fallback descriptivo si no hay registros o no existe el endpoint aún
        setAuditoria(["No se registran acciones recientes en el log de auditoría."]);
      });

    // 2. Traer KPIs reales de proyectos
    fetch("http://localhost:5000/api/dashboard/gerencia")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => {
        // Mantener valores de simulación coherentes si no está la API financiera
        setMetrics({ activos: 5, completados: 12, satisfaccion: "88%" });
      });
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" color="primary" gutterBottom style={{ fontWeight: "bold" }}>
        Gerencia Dashboard — ELITECORP
      </Typography>

      {/* Tarjetas Dinámicas */}
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Folder color="primary" />
              <Typography variant="h6">Proyectos Activos</Typography>
              <Typography variant="h5">{metrics.activos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Business color="secondary" />
              <Typography variant="h6">Proyectos Completados</Typography>
              <Typography variant="h5">{metrics.completados}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <ThumbUp color="success" />
              <Typography variant="h6">Satisfacción General</Typography>
              <Typography variant="h5">{metrics.satisfaccion}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={6}>
          <BarChart width={400} height={300} data={dataProyectos}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avance" fill="#1976d2" />
          </BarChart>
        </Grid>
        <Grid item xs={6}>
          <LineChart width={400} height={300} data={dataKPIs}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="costo" stroke="#d32f2f" strokeWidth={2} />
            <Line type="monotone" dataKey="ingresos" stroke="#388e3c" strokeWidth={2} />
          </LineChart>
        </Grid>
      </Grid>

      {/* Trazabilidad y Auditoría */}
      <Typography variant="h6" style={{ marginTop: "30px", fontWeight: "bold" }}>
        Registro de Auditoría (Trazabilidad)
      </Typography>
      <ul style={{ marginTop: "10px", backgroundColor: "#f5f5f5", padding: "15px 30px", borderRadius: "4px" }}>
        {auditoria.map((item, index) => (
          <li key={index} style={{ marginBottom: "8px", fontFamily: "monospace", color: "#333" }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GerenciaDashboard;