import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, Box, Avatar, Chip } from "@mui/material";
import { BugReport, CheckCircle, Pending, ExitToApp, VerifiedUser } from "@mui/icons-material";
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
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "'Segoe UI', sans-serif" }}>

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
          <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>QA Control Center</Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: "#475569", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", mb: 2 }}>
            Contenido
          </Typography>
          {[
            { label: "📋 Evidencias para revisar" },
            { label: "📊 Estado de evidencias" },
            { label: "🔔 Notificaciones recientes" },
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
              <Typography sx={{ color: "#64748b", fontSize: 11 }}>Equipo QA</Typography>
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
            Panel de Control QA
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 14 }}>
            Revisión y validación de evidencias — EliteCorp Consulting Group
          </Typography>
        </Box>

        {/* Métricas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: "Pendientes de revisión", value: pendientes, icon: <Pending />, color: "#f59e0b", bg: "#fffbeb" },
            { title: "Aprobadas", value: aprobadas, icon: <CheckCircle />, color: "#10b981", bg: "#f0fdf4" },
            { title: "Rechazadas", value: rechazadas, icon: <BugReport />, color: "#ef4444", bg: "#fef2f2" },
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
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <VerifiedUser sx={{ color: "#3b82f6", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>Estado de Evidencias</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={dataBar}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="value" fill="#1e40af" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 2 }}>Notificaciones Recientes</Typography>
              <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
              {notificaciones.length === 0 ? (
                <Typography sx={{ color: "#94a3b8", fontSize: 14 }}>No hay notificaciones.</Typography>
              ) : (
                notificaciones.slice(0, 5).map((n, i) => (
                  <Box key={i} sx={{ p: 1.5, mb: 1, bgcolor: "#f8fafc", borderRadius: 2, borderLeft: "3px solid #3b82f6" }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{n.mensaje}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.3 }}>{n.usuario || "todos"}</Typography>
                  </Box>
                ))
              )}
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Lista de evidencias */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>Evidencias para Revisar</Typography>
            <Chip label={`${pendientes} pendientes`} size="small" color="warning" />
          </Box>
          <Box sx={{ p: 2 }}>
            {evidencias.length === 0 ? (
              <Typography sx={{ color: "#94a3b8", fontSize: 14, p: 2 }}>No hay evidencias cargadas.</Typography>
            ) : (
              evidencias.map((e, i) => (
                <Box key={i} sx={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  p: 2, mb: 1, borderRadius: 2,
                  bgcolor: e.estado === "pendiente" ? "#fffbeb" : "#f8fafc",
                  border: "1px solid",
                  borderColor: e.estado === "pendiente" ? "#fde68a" : "#f1f5f9",
                }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{e.titulo}</Typography>
                    <Typography sx={{ fontSize: 13, color: "#64748b", mb: 0.5 }}>{e.descripcion}</Typography>
                    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                      <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>👤 {e.usuario}</Typography>
                      {e.proyecto && (
                        <Box sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 1, px: 1, py: 0.2 }}>
                          <Typography sx={{ fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>📁 {e.proyecto}</Typography>
                        </Box>
                      )}
                      {e.hito && (
                        <Box sx={{ bgcolor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 1, px: 1, py: 0.2 }}>
                          <Typography sx={{ fontSize: 11, color: "#15803d", fontWeight: 600 }}>🏁 {e.hito}</Typography>
                        </Box>
                      )}
                      <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                        🕐 {new Date(e.fecha).toLocaleString("es-AR")}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: 2, flexShrink: 0 }}>
                    <Chip
                      label={e.estado.toUpperCase()}
                      size="small"
                      color={e.estado === "aprobada" ? "success" : e.estado === "rechazada" ? "error" : "warning"}
                    />
                    {e.estado === "pendiente" && (
                      <>
                        <Button size="small" variant="contained" color="success"
                          onClick={() => handleRevisar(e.id, "aprobada")}
                          sx={{ textTransform: "none", fontSize: 12, borderRadius: 2 }}>
                          Aprobar
                        </Button>
                        <Button size="small" variant="contained" color="error"
                          onClick={() => handleRevisar(e.id, "rechazada")}
                          sx={{ textTransform: "none", fontSize: 12, borderRadius: 2 }}>
                          Rechazar
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default QADashboard;