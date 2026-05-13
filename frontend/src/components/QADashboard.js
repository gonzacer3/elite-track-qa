import React, { useState } from "react";
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
  const [notificaciones] = useState([
    "Bug crítico reportado en módulo A",
    "Test de regresión completado",
  ]);

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" color="primary" gutterBottom>
        QA Dashboard
      </Typography>

      {/* Tarjetas */}
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card><CardContent>
            <BugReport color="error" />
            <Typography variant="h6">Bugs Abiertos</Typography>
            <Typography variant="h5">12</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={4}>
          <Card><CardContent>
            <CheckCircle color="success" />
            <Typography variant="h6">Bugs Resueltos</Typography>
            <Typography variant="h5">34</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={4}>
          <Card><CardContent>
            <Assessment color="secondary" />
            <Typography variant="h6">Cobertura Tests</Typography>
            <Typography variant="h5">92%</Typography>
          </CardContent></Card>
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

      {/* Notificaciones */}
      <Typography variant="h6" style={{ marginTop: "30px" }}>
        Notificaciones
      </Typography>
      <ul>
        {notificaciones.map((n, i) => <li key={i}>{n}</li>)}
      </ul>
    </div>
  );
}

export default QADashboard;
