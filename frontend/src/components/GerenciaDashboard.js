import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, Box, Avatar, Chip } from "@mui/material";
import { Security, Assignment, NotificationsActive, ExitToApp } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const BASE_URL = "http://localhost:3001";

function GerenciaDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Dirección";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [auditoria, setAuditoria] = useState([]);
  const [evidencias, setEvidencias] = useState([]);
  const [hitos, setHitos] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/auditoria`, { headers })
      .then((res) => res.json())
      .then((data) => setAuditoria(Array.isArray(data) ? data : []))
      .catch(() => setAuditoria([]));

    fetch(`${BASE_URL}/api/evidencias`, { headers })
      .then((res) => res.json())
      .then((data) => setEvidencias(Array.isArray(data) ? data : []))
      .catch(() => setEvidencias([]));

    fetch(`${BASE_URL}/api/notificaciones/hitos-proximos`, { headers })
      .then((res) => res.json())
      .then((data) => setHitos(Array.isArray(data) ? data : []))
      .catch(() => setHitos([]));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const aprobadas = evidencias.filter((e) => e.estado === "aprobada").length;
  const pendientes = evidencias.filter((e) => e.estado === "pendiente").length;
  const totalEvidencias = evidencias.length;
  const satisfaccion = totalEvidencias > 0
    ? Math.round((aprobadas / totalEvidencias) * 100)
    : 0;

  // Datos para gráfico de actividad (últimas acciones de auditoría)
  const dataLinea = auditoria.slice(0, 7).map((a, i) => ({
    name: `A${i + 1}`,
    acciones: i + 1,
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>Gerencia Dashboard</Typography>
          <Typography color="text.secondary">Bienvenido, {username} | EliteCorp</Typography>
        </Box>
        <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>Cerrar Sesión</Button>
      </Box>

      {/* Métricas reales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Evidencias Activas", value: pendientes, icon: <Assignment />, color: "#3b82f6" },
          { title: "Completadas", value: aprobadas, icon: <Security />, color: "#10b981" },
          { title: "Tasa de Aprobación", value: `${satisfaccion}%`, icon: <NotificationsActive />, color: "#8b5cf6" },
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

      {/* Gráfico de actividad */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Actividad del Sistema</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dataLinea}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="acciones" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Hitos próximos a vencer */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>⚠️ Hitos Próximos a Vencer</Typography>
        {hitos.length === 0 ? (
          <Typography color="text.secondary">No hay hitos próximos a vencer.</Typography>
        ) : (
          hitos.map((h, i) => (
            <Box key={i} sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              p: 2, mb: 1, borderBottom: "1px solid #f1f5f9", borderRadius: 2,
              bgcolor: "#fff7ed"
            }}>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{h.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">{h.proyecto}</Typography>
              </Box>
              <Chip
                label={new Date(h.fecha_vencimiento).toLocaleDateString("es-AR")}
                color="warning"
                size="small"
              />
            </Box>
          ))
        )}
      </Card>

      {/* Log de auditoría */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Registro de Auditoría</Typography>
        {auditoria.length === 0 ? (
          <Typography color="text.secondary">No hay registros de auditoría.</Typography>
        ) : (
          auditoria.slice(0, 10).map((a, i) => (
            <Box key={i} sx={{
              display: "flex", justifyContent: "space-between",
              p: 1.5, mb: 1, borderBottom: "1px solid #f1f5f9"
            }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.accion}</Typography>
                <Typography variant="caption" color="text.secondary">{a.usuario}</Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {new Date(a.fecha).toLocaleString("es-AR")}
              </Typography>
            </Box>
          ))
        )}
      </Card>
    </Box>
  );
}

export default GerenciaDashboard;