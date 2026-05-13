import React, { useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Business, Folder, EmojiEmotions } from "@mui/icons-material";
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
  const [auditoria] = useState([
    "Pedro cerró proyecto B",
    "Juan subió evidencia",
    "Ana completó encuesta",
  ]);

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Gerencia Dashboard
      </Typography>

      {/* Tarjetas */}
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Folder color="primary" />
              <Typography variant="h6">Proyectos Activos</Typography>
              <Typography variant="h5">5</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Business color="secondary" />
              <Typography variant="h6">Proyectos Completados</Typography>
              <Typography variant="h5">12</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <EmojiEmotions color="success" />
              <Typography variant="h6">Satisfacción</Typography>
              <Typography variant="h5">88%</Typography>
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
            <Line type="monotone" dataKey="costo" stroke="#d32f2f" />
            <Line type="monotone" dataKey="ingresos" stroke="#388e3c" />
          </LineChart>
        </Grid>
      </Grid>

      {/* Auditoría */}
      <Typography variant="h6" style={{ marginTop: "30px" }}>
        Auditoría
      </Typography>
      <ul>
        {auditoria.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
}

export default GerenciaDashboard;
