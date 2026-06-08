import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, Box, Avatar, Chip } from "@mui/material";
import { BugReport, CheckCircle, Pending, ExitToApp } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const BASE_URL = "http://localhost:3001";

function QADashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "QA";
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

  const handleRevisar = async (id, estado) => {
    await fetch(`${BASE_URL}/api/evidencias/${id}/revisar`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    // Recargar evidencias
    const res = await fetch(`${BASE_URL}/api/evidencias`, { headers });
    const data = await res.json();
    setEvidencias(Array.isArray(data) ? data : []);
  };

  const pendientes = evidencias.filter((e) => e.estado === "pendiente").length;
  const aprobadas = evidencias.filter((e) => e.estado === "aprobada").length;
  const rechazadas = evidencias.filter((e) => e.estado === "rechazada").length;

  const dataBar = [
    { name: "Pendientes", value: pendientes },
    { name: "Aprobadas", value: aprobadas },
    { name: "Rechazadas", value: rechazadas },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>QA Control Center</Typography>
          <Typography color="text.secondary">Bienvenido, {username} | EliteCorp</Typography>
        </Box>
        <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>Cerrar Sesión</Button>
      </Box>

      {/* Métricas reales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Pendientes de revisión", value: pendientes, icon: <Pending />, color: "#f59e0b" },
          { title: "Aprobadas", value: aprobadas, icon: <CheckCircle />, color: "#10b981" },
          { title: "Rechazadas", value: rechazadas, icon: <BugReport />, color: "#ef4444" },
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
      <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Estado de Evidencias</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dataBar}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Lista de evidencias con acciones */}
      <Card sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Evidencias para Revisar</Typography>
        {evidencias.length === 0 ? (
          <Typography color="text.secondary">No hay evidencias cargadas.</Typography>
        ) : (
          evidencias.map((e, i) => (
            <Box key={i} sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              p: 2, mb: 1, borderBottom: "1px solid #f1f5f9", borderRadius: 2
            }}>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{e.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">{e.descripcion}</Typography>
                <Typography variant="caption" color="text.secondary">Por: {e.usuario}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip
                  label={e.estado.toUpperCase()}
                  size="small"
                  color={e.estado === "aprobada" ? "success" : e.estado === "rechazada" ? "error" : "warning"}
                />
                {e.estado === "pendiente" && (
                  <>
                    <Button size="small" variant="contained" color="success"
                      onClick={() => handleRevisar(e.id, "aprobada")}
                      sx={{ textTransform: "none" }}>Aprobar</Button>
                    <Button size="small" variant="contained" color="error"
                      onClick={() => handleRevisar(e.id, "rechazada")}
                      sx={{ textTransform: "none" }}>Rechazar</Button>
                  </>
                )}
              </Box>
            </Box>
          ))
        )}
      </Card>

      {/* Notificaciones recientes */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Notificaciones Recientes</Typography>
        {notificaciones.length === 0 ? (
          <Typography color="text.secondary">No hay notificaciones.</Typography>
        ) : (
          notificaciones.slice(0, 5).map((n, i) => (
            <Box key={i} sx={{ p: 1.5, mb: 1, borderBottom: "1px solid #f1f5f9" }}>
              <Typography variant="body2">{n.mensaje}</Typography>
              <Typography variant="caption" color="text.secondary">{n.usuario_destino || "todos"}</Typography>
            </Box>
          ))
        )}
      </Card>
    </Box>
  );
}

export default QADashboard;