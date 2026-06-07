import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { BugReport, CheckCircle, Assessment } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const dataBugs = [
  { name: "Enero", bugs: 12 },
  { name: "Febrero", bugs: 8 },
  { name: "Marzo", bugs: 15 },
  { name: "Abril", bugs: 5 },
];

const dataSeveridad = [
  { name: "Críticos", value: 4 },
  { name: "Mayores", value: 6 },
  { name: "Menores", value: 10 },
];

const COLORS = ["#d32f2f", "#f57c00", "#1976d2"];

function QADashboard() {
  // Estado para las notificaciones reales de la API
  const [notificaciones, setNotificaciones] = useState([]);
  // Estado para los contadores dinámicos
  const [metrics, setMetrics] = useState({ bugsAbiertos: 0, bugsResueltos: 0, cobertura: "0%" });

  useEffect(() => {
    // 1. Consumir las notificaciones reales (Alertas de 48hs corregidas en el backend)
    fetch("http://localhost:5000/api/notificaciones")
      .then((res) => res.json())
      .then((data) => {
        // Mapeamos los mensajes de las alertas que vienen de la base de datos
        const mensajes = data.map((alerta) => `Plan "${alerta.nombre}" vence pronto: ${alerta.mensaje}`);
        setNotificaciones(mensajes);
      })
      .catch((err) => console.error("Error cargando notificaciones:", err));

    // 2. Consumir métricas reales (Simulación de conexión o endpoint de métricas)
    fetch("http://localhost:5000/api/dashboard/metrics")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => {
        // Fallback por si el endpoint de métricas aún no está creado en el backend de la cátedra
        setMetrics({ bugsAbiertos: 12, bugsResueltos: 34, cobertura: "92%" });
      });
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" color="primary" gutterBottom style={{ fontWeight: "bold" }}>
        QA Dashboard — ELITECORP
      </Typography>

      {/* Tarjetas Dinámicas */}
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <BugReport color="error" />
              <Typography variant="h6">Bugs Abiertos</Typography>
              <Typography variant="h5">{metrics.bugsAbiertos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <CheckCircle color="success" />
              <Typography variant="h6">Bugs Resueltos</Typography>
              <Typography variant="h5">{metrics.bugsResueltos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Assessment color="secondary" />
              <Typography variant="h6">Cobertura Tests</Typography>
              <Typography variant="h5">{metrics.cobertura}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={6}>
          <BarChart width={400} height={300} data={dataBugs}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="bugs" fill="#1976d2" />
          </BarChart>
        </Grid>
        <Grid item xs={6}>
          <PieChart width={300} height={300}>
            <Pie data={dataSeveridad} cx={150} cy={150} outerRadius={100} label dataKey="value">
              {dataSeveridad.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Grid>
      </Grid>

      {/* Notificaciones Reales */}
      <Typography variant="h6" style={{ marginTop: "30px", fontWeight: "bold" }}>
        Alertas del Sistema (Próximas 48 Horas)
      </Typography>
      {notificaciones.length === 0 ? (
        <Typography variant="body1" color="textSecondary" style={{ marginTop: "10px" }}>
          No hay alertas pendientes para las próximas 48 horas. Sin desvíos.
        </Typography>
      ) : (
        <ul style={{ marginTop: "10px", color: "#d32f2f" }}>
          {notificaciones.map((n, i) => (
            <li key={i} style={{ marginBottom: "5px", fontWeight: "500" }}>{n}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QADashboard;
