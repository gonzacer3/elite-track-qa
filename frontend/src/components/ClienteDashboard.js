import React, { useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { ConfirmationNumber, Feedback, Star } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const dataTickets = [
  { name: "Abiertos", cantidad: 3 },
  { name: "En Proceso", cantidad: 5 },
  { name: "Resueltos", cantidad: 12 },
];

const dataSatisfaccion = [
  { name: "Alto", value: 18 },
  { name: "Medio", value: 5 },
  { name: "Bajo", value: 2 },
];

const COLORS = ["#388e3c", "#fbc02d", "#d32f2f"];

function ClienteDashboard() {
  const [encuestas] = useState([
    "Encuesta de soporte técnico completada",
    "Encuesta de satisfacción enviada",
  ]);

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Cliente Dashboard
      </Typography>

      {/* Tarjetas */}
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <ConfirmationNumber color="primary" />
              <Typography variant="h6">Tickets Abiertos</Typography>
              <Typography variant="h5">3</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Feedback color="secondary" />
              <Typography variant="h6">Encuestas</Typography>
              <Typography variant="h5">24</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Star color="success" />
              <Typography variant="h6">Satisfacción</Typography>
              <Typography variant="h5">90%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        <Grid item xs={6}>
          <BarChart width={400} height={300} data={dataTickets}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#1976d2" />
          </BarChart>
        </Grid>
        <Grid item xs={6}>
          <PieChart width={300} height={300}>
            <Pie data={dataSatisfaccion} cx={150} cy={150} outerRadius={100} label dataKey="value">
              {dataSatisfaccion.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Grid>
      </Grid>

      {/* Encuestas */}
      <Typography variant="h6" style={{ marginTop: "30px" }}>
        Encuestas recientes
      </Typography>
      <ul>
        {encuestas.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

export default ClienteDashboard;
