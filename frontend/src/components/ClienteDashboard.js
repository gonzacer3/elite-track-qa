import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, Box, Avatar, Chip } from "@mui/material";
import { Assignment, CheckCircle, HourglassEmpty, ExitToApp } from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#f59e0b", "#10b981", "#ef4444"];
const BASE_URL = "http://localhost:3001";

function ClienteDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Cliente";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [evidencias, setEvidencias] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/evidencias`, { headers })
      .then((res) => res.json())
      .then((data) => setEvidencias(Array.isArray(data) ? data : []))
      .catch(() => setEvidencias([]));

    fetch(`${BASE_URL}/api/notificaciones`, { headers })
      .then((res) => res.json())
      .then((data) => setNotificaciones(Array.isArray(data) ? data : []))
      .catch(() => setNotificaciones([]));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const pendientes = evidencias.filter((e) => e.estado === "pendiente").length;
  const aprobadas = evidencias.filter((e) => e.estado === "aprobada").length;
  const rechazadas = evidencias.filter((e) => e.estado === "rechazada").length;

  const dataPie = [
    { name: "Pendientes", value: pendientes },
    { name: "Aprobadas", value: aprobadas },
    { name: "Rechazadas", value: rechazadas },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>Portal del Cliente</Typography>
          <Typography color="text.secondary">Bienvenido, {username} | EliteCorp</Typography>
        </Box>
        <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>Cerrar Sesión</Button>
      </Box>

      {/* Métricas reales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "En Revisión", value: pendientes, icon: <HourglassEmpty />, color: "#f59e0b" },
          { title: "Aprobadas", value: aprobadas, icon: <CheckCircle />, color: "#10b981" },
          { title: "Total Evidencias", value: evidencias.length, icon: <Assignment />, color: "#3b82f6" },
        ].map((item, i) => (
          <Grid item xs={12} md={4} key={i}>
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

      {/* Gráfico */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, borderRadius: 3, height: 300 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Estado de mis Evidencias</Typography>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={dataPie} dataKey="value" cx="50%" cy="50%" innerRadius="50%" outerRadius="75%" paddingAngle={5}>
                  {COLORS.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Notificaciones */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, borderRadius: 3, height: 300, overflowY: "auto" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Notificaciones</Typography>
            {notificaciones.length === 0 ? (
              <Typography color="text.secondary">No hay notificaciones.</Typography>
            ) : (
              notificaciones.slice(0, 5).map((n, i) => (
                <Box key={i} sx={{ p: 1.5, mb: 1, borderBottom: "1px solid #f1f5f9" }}>
                  <Typography variant="body2">{n.mensaje}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(n.fecha).toLocaleString("es-AR")}
                  </Typography>
                </Box>
              ))
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Lista de evidencias */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Mis Evidencias</Typography>
        {evidencias.length === 0 ? (
          <Typography color="text.secondary">No hay evidencias registradas.</Typography>
        ) : (
          evidencias.map((e, i) => (
            <Box key={i} sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              p: 2, mb: 1, borderBottom: "1px solid #f1f5f9", borderRadius: 2
            }}>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{e.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">{e.descripcion}</Typography>
              </Box>
              <Chip
                label={e.estado.toUpperCase()}
                size="small"
                color={e.estado === "aprobada" ? "success" : e.estado === "rechazada" ? "error" : "warning"}
              />
            </Box>
          ))
        )}
      </Card>
    </Box>
  );
}

export default ClienteDashboard;