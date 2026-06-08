import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, Box, Avatar, TextField, Alert } from "@mui/material";
import { Assignment, CheckCircle, ExitToApp, Send, Upload } from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
const COLORS = ["#3b82f6", "#f59e0b", "#10b981"];
const BASE_URL = "http://localhost:3001";

function ConsultorDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Consultor";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [evidencias, setEvidencias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/evidencias`, { headers })
      .then((res) => res.json())
      .then((data) => setEvidencias(Array.isArray(data) ? data : []))
      .catch(() => setEvidencias([]));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleSubirEvidencia = async () => {
    if (!titulo || !descripcion) {
      setMensaje({ tipo: "error", texto: "Título y descripción son obligatorios." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/evidencias`, {
        method: "POST",
        headers,
        body: JSON.stringify({ titulo, descripcion }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje({ tipo: "success", texto: "Evidencia enviada a QA correctamente." });
        setTitulo("");
        setDescripcion("");
        // Recargar evidencias
        const resEv = await fetch(`${BASE_URL}/api/evidencias`, { headers });
        const dataEv = await resEv.json();
        setEvidencias(Array.isArray(dataEv) ? dataEv : []);
      } else {
        setMensaje({ tipo: "error", texto: data.message || "Error al subir evidencia." });
      }
    } catch {
      setMensaje({ tipo: "error", texto: "Error de conexión con el servidor." });
    }
    setLoading(false);
  };

  const pendientes = evidencias.filter((e) => e.estado === "pendiente").length;
  const aprobadas = evidencias.filter((e) => e.estado === "aprobada").length;
  const rechazadas = evidencias.filter((e) => e.estado === "rechazada").length;

  const dataPie = [
    { name: "Pendientes", v: pendientes },
    { name: "Aprobadas", v: aprobadas },
    { name: "Rechazadas", v: rechazadas },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>Consultor Command Center</Typography>
          <Typography color="text.secondary">Bienvenido, {username} | EliteCorp</Typography>
        </Box>
        <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>Cerrar Sesión</Button>
      </Box>

      {/* Métricas reales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Pendientes", value: pendientes, icon: <Assignment />, color: "#3b82f6" },
          { title: "Aprobadas", value: aprobadas, icon: <CheckCircle />, color: "#10b981" },
          { title: "Rechazadas", value: rechazadas, icon: <Send />, color: "#ef4444" },
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

      {/* Gráfico + Formulario */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, borderRadius: 3, height: 350, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Distribución de Evidencias</Typography>
            <Box sx={{ flexGrow: 1, width: "100%", minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataPie} dataKey="v" cx="50%" cy="50%" innerRadius="50%" outerRadius="75%" paddingAngle={5}>
                    {COLORS.map((color, index) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* Formulario de carga de evidencia — RF02 / Caso de Uso B */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, borderRadius: 3, height: 350, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Upload /> Cargar Evidencia
            </Typography>
            {mensaje && (
              <Alert severity={mensaje.tipo} sx={{ mb: 2 }} onClose={() => setMensaje(null)}>
                {mensaje.texto}
              </Alert>
            )}
            <TextField
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              fullWidth
              multiline
              rows={3}
              size="small"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleSubirEvidencia}
              disabled={loading}
              sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#0f172a" }}
            >
              {loading ? "Enviando..." : "Enviar a QA"}
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de evidencias reales */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Mis Evidencias</Typography>
        {evidencias.length === 0 ? (
          <Typography color="text.secondary">No hay evidencias cargadas aún.</Typography>
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
              <Typography sx={{
                fontWeight: 700, fontSize: "0.85rem",
                color: e.estado === "aprobada" ? "#10b981" : e.estado === "rechazada" ? "#ef4444" : "#f59e0b"
              }}>
                {e.estado.toUpperCase()}
              </Typography>
            </Box>
          ))
        )}
      </Card>
    </Box>
  );
}

export default ConsultorDashboard;