import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Box, Avatar, Button } from "@mui/material";
import { ConfirmationNumber, Feedback, Star, ExitToApp, Assessment } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

function ClienteDashboard() {
  const navigate = useNavigate();
  const [encuestas] = useState(["Encuesta de soporte técnico completada", "Encuesta de satisfacción enviada"]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Corporativo */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>Portal del Cliente</Typography>
          <Typography color="text.secondary">Gestión de Tickets y Satisfacción | EliteCorp</Typography>
        </Box>
        <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>Cerrar Sesión</Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Tickets Abiertos", value: 3, icon: <ConfirmationNumber />, color: "#3b82f6" },
          { title: "Encuestas", value: 24, icon: <Feedback />, color: "#8b5cf6" },
          { title: "Satisfacción", value: "90%", icon: <Star />, color: "#10b981" },
        ].map((item, i) => (
          <Grid item xs={4} key={i}>
            <Card sx={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", borderRadius: 3 }}>
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: `${item.color}20`, color: item.color }}>{item.icon}</Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">{item.title}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{item.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Estado de Tickets</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{name: "Abiertos", cantidad: 3}, {name: "Proceso", cantidad: 5}, {name: "Resueltos", cantidad: 12}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Nivel de Satisfacción</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={[{name: "Alto", value: 18}, {name: "Medio", value: 5}, {name: "Bajo", value: 2}]} dataKey="value" innerRadius={60} outerRadius={80} label>
                  {[0, 1, 2].map((i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Encuestas */}
      <Card sx={{ mt: 3, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <Assessment /> Encuestas Recientes
        </Typography>
        <Box sx={{ backgroundColor: "#f1f5f9", p: 2, borderRadius: 2 }}>
          {encuestas.map((e, i) => (
            <Typography key={i} sx={{ mb: 1 }}>• {e}</Typography>
          ))}
        </Box>
      </Card>
    </Box>
  );
}

export default ClienteDashboard;