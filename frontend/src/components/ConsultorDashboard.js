import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { Assignment, CheckCircle, TrendingUp } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const dataProgreso = [
  { name: "Lun", plan: 70, real: 65 },
  { name: "Mar", plan: 75, real: 70 },
  { name: "Mié", plan: 80, real: 75 },
  { name: "Jue", plan: 85, real: 78 },
  { name: "Vie", plan: 90, real: 82 },
];

const dataTareas = [
  { name: "Completas", value: 15 },
  { name: "En Proceso", value: 8 },
  { name: "Pendientes", value: 5 },
];

const COLORS = ["#1e3c72", "#2a5298", "#6fa3ef"];

function ConsultorDashboard() {
  const [evidencias, setEvidencias] = useState([]);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) setEvidencias([...evidencias, file.name]);
  };

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Consultor Dashboard
      </Typography>

      {/* Tarjetas */}
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Assignment color="primary" />
              <Typography variant="h6">Tareas Activas</Typography>
              <Typography variant="h5">8</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <CheckCircle color="success" />
              <Typography variant="h6">Tareas Completadas</Typography>
              <Typography variant="h5">15</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <TrendingUp color="secondary" />
              <Typography variant="h6">Progreso</Typography>
              <Typography variant="h5">75%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={6}>
          <LineChart width={400} height={300} data={dataProgreso}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="plan" stroke="#1e3c72" />
            <Line type="monotone" dataKey="real" stroke="#6fa3ef" />
          </LineChart>
        </Grid>
        <Grid item xs={6}>
          <PieChart width={300} height={300}>
            <Pie data={dataTareas} cx={150} cy={150} outerRadius={100} label dataKey="value">
              {dataTareas.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Grid>
      </Grid>

      {/* Evidencias */}
      <Typography variant="h6" style={{ marginTop: "30px" }}>
        Carga de Evidencias
      </Typography>
      <input type="file" onChange={handleUpload} />
      <ul>
        {evidencias.map((ev, i) => (
          <li key={i}>{ev}</li>
        ))}
      </ul>
    </div>
  );
}

export default ConsultorDashboard;
