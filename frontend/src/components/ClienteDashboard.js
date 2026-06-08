import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, Box, Avatar, Chip } from "@mui/material";
import { Assignment, CheckCircle, HourglassEmpty, ExitToApp, Notifications } from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>

      {/* Sidebar */}
      <Box sx={{
        width: 240,
        background: "linear-gradient(180deg, #0f172a 0%, #1e3a5f 100%)",
        display: "flex",
        flexDirection: "column",
        p: 3,
        flexShrink: 0,
      }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", mb: 1 }}>
            EliteTrack QP
          </Typography>
          <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>Portal Cliente</Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", mb: 2 }}>
            Contenido
          </Typography>
          {[
            { label: "📊 Mis métricas" },
            { label: "📋 Mis evidencias" },
            { label: "🔔 Notificaciones" },
          ].map((item) => (
            <Box key={item.label} sx={{ px: 2, py: 1, mb: 0.5 }}>
              <Typography sx={{ color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ borderTop: "1px solid rgba(255,255,255,0.1)", pt: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Avatar sx={{ bgcolor: "#1e40af", width: 36, height: 36, fontSize: 14 }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{username}</Typography>
              <Typography sx={{ color: "#64748b", fontSize: 11 }}>Cliente Externo</Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            startIcon={<ExitToApp />}
            onClick={handleLogout}
            sx={{
              color: "#64748b", justifyContent: "flex-start", textTransform: "none",
              fontSize: 13, "&:hover": { color: "#ef4444", bgcolor: "rgba(239,68,68,0.1)" }
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, p: 4, overflowY: "auto" }}>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.5 }}>
            Portal del Cliente
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 14 }}>
            Seguimiento de evidencias — EliteCorp Consulting Group
          </Typography>
        </Box>

        {/* Métricas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: "En Revisión", value: pendientes, icon: <HourglassEmpty />, color: "#f59e0b", bg: "#fffbeb" },
            { title: "Aprobadas", value: aprobadas, icon: <CheckCircle />, color: "#10b981", bg: "#f0fdf4" },
            { title: "Total Evidencias", value: evidencias.length, icon: <Assignment />, color: "#3b82f6", bg: "#eff6ff" },
          ].map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
                  <Avatar sx={{ bgcolor: item.bg, color: item.color, width: 48, height: 48 }}>
                    {item.icon}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{item.title}</Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>{item.value}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Gráfico + Notificaciones */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>Estado de mis Evidencias</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={dataPie}
                    dataKey="value"
                    cx="50%"
                    cy="45%"
                    innerRadius="35%"
                    outerRadius="65%"
                    paddingAngle={4}
                    label={({ value }) => value > 0 ? value : ""}
                  >
                    {COLORS.map((color, index) => <Cell key={index} fill={color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Notifications sx={{ color: "#3b82f6", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>Notificaciones</Typography>
              </Box>
              {notificaciones.length === 0 ? (
                <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>No hay notificaciones.</Typography>
              ) : (
                notificaciones.slice(0, 5).map((n, i) => (
                  <Box key={i} sx={{ p: 1.5, mb: 1, bgcolor: "#f8fafc", borderRadius: 2, borderLeft: "3px solid #3b82f6" }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{n.mensaje}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.3 }}>
                      🕐 {new Date(n.fecha).toLocaleString("es-AR")}
                    </Typography>
                  </Box>
                ))
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Lista de evidencias */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>Mis Evidencias</Typography>
            <Chip label={`${evidencias.length} total`} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569" }} />
          </Box>
          <Box sx={{ p: 2 }}>
            {evidencias.length === 0 ? (
              <Typography sx={{ color: "#94a3b8", fontSize: 14, p: 2 }}>No hay evidencias registradas.</Typography>
            ) : (
              evidencias.map((e, i) => (
                <Box key={i} sx={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  p: 2, mb: 1, borderRadius: 2,
                  bgcolor: i % 2 === 0 ? "#f8fafc" : "#fff",
                  border: "1px solid #f1f5f9",
                  "&:hover": { borderColor: "#cbd5e1" },
                }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{e.titulo}</Typography>
                    <Typography sx={{ fontSize: 13, color: "#64748b" }}>{e.descripcion}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.5 }}>
                      🕐 {new Date(e.fecha).toLocaleString("es-AR")}
                    </Typography>
                  </Box>
                  <Chip
                    label={e.estado.toUpperCase()}
                    size="small"
                    sx={{ ml: 2, flexShrink: 0 }}
                    color={e.estado === "aprobada" ? "success" : e.estado === "rechazada" ? "error" : "warning"}
                  />
                </Box>
              ))
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default ClienteDashboard;