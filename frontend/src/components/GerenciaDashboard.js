import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, Box, Avatar, Chip } from "@mui/material";
import { Security, Assignment, NotificationsActive, ExitToApp, TrendingUp } from "@mui/icons-material";
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const aprobadas = evidencias.filter((e) => e.estado === "aprobada").length;
  const pendientes = evidencias.filter((e) => e.estado === "pendiente").length;
  const totalEvidencias = evidencias.length;
  const satisfaccion = totalEvidencias > 0 ? Math.round((aprobadas / totalEvidencias) * 100) : 0;

  const dataLinea = auditoria.slice(0, 7).map((a) => ({
    name: new Date(a.fecha).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
    acciones: a.accion.startsWith("LOGIN") ? 1 : 2,
  }));

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
          <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>Gerencia</Typography>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", mb: 2 }}>
            Contenido
          </Typography>
          {[
            { label: "📊 Métricas del proyecto" },
            { label: "📈 Actividad del sistema" },
            { label: "⚠️ Hitos próximos" },
            { label: "🔍 Registro de auditoría" },
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
              <Typography sx={{ color: "#64748b", fontSize: 11 }}>Dirección</Typography>
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
            Panel de Dirección
          </Typography>
          <Typography sx={{ color: "#64748b", fontSize: 14 }}>
            Visión ejecutiva del proyecto — EliteCorp Consulting Group
          </Typography>
        </Box>

        {/* Métricas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: "Evidencias Activas", value: pendientes, icon: <Assignment />, color: "#3b82f6", bg: "#eff6ff" },
            { title: "Completadas", value: aprobadas, icon: <Security />, color: "#10b981", bg: "#f0fdf4" },
            { title: "Tasa de Aprobación", value: `${satisfaccion}%`, icon: <TrendingUp />, color: "#8b5cf6", bg: "#faf5ff" },
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

        {/* Gráfico + Hitos */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <TrendingUp sx={{ color: "#3b82f6", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>Actividad del Sistema</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={dataLinea}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Line type="monotone" dataKey="acciones" stroke="#1e40af" strokeWidth={2.5} dot={{ r: 4, fill: "#1e40af" }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <NotificationsActive sx={{ color: "#f59e0b", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>Hitos Próximos a Vencer</Typography>
              </Box>
              {hitos.length === 0 ? (
                <Box sx={{ p: 2, bgcolor: "#f0fdf4", borderRadius: 2, border: "1px solid #bbf7d0" }}>
                  <Typography sx={{ color: "#15803d", fontSize: 14, fontWeight: 600 }}>✅ Sin hitos urgentes</Typography>
                  <Typography sx={{ color: "#64748b", fontSize: 12, mt: 0.5 }}>No hay hitos próximos a vencer.</Typography>
                </Box>
              ) : (
                hitos.map((h, i) => (
                  <Box key={i} sx={{
                    p: 2, mb: 1, borderRadius: 2, bgcolor: "#fff7ed",
                    border: "1px solid #fde68a",
                  }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{h.titulo}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#64748b" }}>{h.proyecto}</Typography>
                    <Chip
                      label={new Date(h.fecha_vencimiento).toLocaleDateString("es-AR")}
                      color="warning" size="small" sx={{ mt: 1 }}
                    />
                  </Box>
                ))
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Registro de auditoría */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>Registro de Auditoría</Typography>
            <Chip label={`${auditoria.length} registros`} size="small" sx={{ bgcolor: "#f1f5f9", color: "#475569" }} />
          </Box>
          <Box sx={{ p: 2 }}>
            {auditoria.length === 0 ? (
              <Typography sx={{ color: "#94a3b8", fontSize: 14, p: 2 }}>No hay registros de auditoría.</Typography>
            ) : (
              auditoria.slice(0, 20).map((a, i) => (
                <Box key={i} sx={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  p: 2, mb: 1, borderRadius: 2,
                  bgcolor: i % 2 === 0 ? "#f8fafc" : "#fff",
                  border: "1px solid #f1f5f9",
                }}>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0f172a" }}>{a.accion}</Typography>
                    <Typography sx={{ fontSize: 12, color: "#94a3b8", mt: 0.3 }}>👤 {a.usuario}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
                    🕐 {new Date(a.fecha).toLocaleString("es-AR")}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}

export default GerenciaDashboard;