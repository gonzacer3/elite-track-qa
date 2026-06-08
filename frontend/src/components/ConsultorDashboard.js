import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid, Card, CardContent, Typography, Button, Box, Avatar,
  TextField, Alert, MenuItem, Chip
} from "@mui/material";
import { Assignment, CheckCircle, ExitToApp, Send, Upload } from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#f59e0b", "#10b981", "#ef4444"];
const BASE_URL = "http://localhost:3001";

const PROYECTOS = ["EliteTrack QP", "Proyecto Alpha", "Proyecto Beta", "Otro"];
const HITOS = ["Hito 1 - Inicio", "Hito 2 - Diseño", "Hito 3 - Desarrollo", "Hito 4 - QA", "Hito 5 - Cierre"];

function ConsultorDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Consultor";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [evidencias, setEvidencias] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [proyecto, setProyecto] = useState("");
  const [hito, setHito] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [archivoNombre, setArchivoNombre] = useState("");
  const [archivoTipo, setArchivoTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarEvidencias = () => {
    fetch(`${BASE_URL}/api/evidencias`, { headers })
      .then((res) => res.json())
      .then((data) => setEvidencias(Array.isArray(data) ? data : []))
      .catch(() => setEvidencias([]));
  };

  useEffect(() => {
    cargarEvidencias();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setMensaje({ tipo: "error", texto: "El archivo supera el límite de 20MB." });
      return;
    }
    setArchivoNombre(file.name);
    setArchivoTipo(file.type);
    const reader = new FileReader();
    reader.onload = (ev) => setArchivo(ev.target.result.split(",")[1]);
    reader.readAsDataURL(file);
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
        body: JSON.stringify({
          titulo, descripcion, proyecto, hito,
          archivo, archivo_nombre: archivoNombre, archivo_tipo: archivoTipo,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje({ tipo: "success", texto: "Evidencia enviada a QA correctamente." });
        setTitulo(""); setDescripcion(""); setProyecto(""); setHito("");
        setArchivo(null); setArchivoNombre(""); setArchivoTipo("");
        cargarEvidencias();
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
    { name: "Pendientes", value: pendientes },
    { name: "Aprobadas", value: aprobadas },
    { name: "Rechazadas", value: rechazadas },
  ];

  const evidenciasFiltradas = filtroEstado === "todos"
    ? evidencias
    : evidencias.filter((e) => e.estado === filtroEstado);

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

      {/* Métricas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Pendientes", value: pendientes, icon: <Assignment />, color: "#f59e0b" },
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

        {/* Gráfico */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Distribución</Typography>
            <ResponsiveContainer width="100%" height={300}>
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
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Formulario — layout vertical, un campo por fila */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Upload /> Cargar Evidencia
            </Typography>
            {mensaje && (
              <Alert severity={mensaje.tipo} sx={{ mb: 2 }} onClose={() => setMensaje(null)}>
                {mensaje.texto}
              </Alert>
            )}

            {/* Título */}
            <TextField
              label="Título *"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            />

            {/* Proyecto */}
            <TextField
              select
              label="Proyecto"
              value={proyecto}
              onChange={(e) => setProyecto(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="">Sin proyecto</MenuItem>
              {PROYECTOS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>

            {/* Hito */}
            <TextField
              select
              label="Hito"
              value={hito}
              onChange={(e) => setHito(e.target.value)}
              fullWidth
              size="small"
              sx={{ mb: 2 }}
            >
              <MenuItem value="">Sin hito</MenuItem>
              {HITOS.map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
            </TextField>

            {/* Descripción */}
            <TextField
              label="Descripción *"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              fullWidth
              multiline
              rows={3}
              size="small"
              sx={{ mb: 2 }}
            />

            {/* Archivo */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                mb: 2,
                textTransform: "none",
                justifyContent: "flex-start",
                px: 2,
                color: archivoNombre ? "#10b981" : "inherit",
                borderColor: archivoNombre ? "#10b981" : "inherit",
              }}
            >
              {archivoNombre ? `📎 ${archivoNombre}` : "📎 Adjuntar archivo (máx. 20MB)"}
              <input type="file" hidden onChange={handleArchivo} />
            </Button>

            {/* Enviar */}
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleSubirEvidencia}
              disabled={loading}
              fullWidth
              sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#0f172a", py: 1.2 }}
            >
              {loading ? "Enviando..." : "Enviar a QA"}
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de evidencias con filtro */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Mis Evidencias</Typography>
          <TextField
            select
            label="Filtrar"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="pendiente">Pendientes</MenuItem>
            <MenuItem value="aprobada">Aprobadas</MenuItem>
            <MenuItem value="rechazada">Rechazadas</MenuItem>
          </TextField>
        </Box>
        {evidenciasFiltradas.length === 0 ? (
          <Typography color="text.secondary">No hay evidencias para mostrar.</Typography>
        ) : (
          evidenciasFiltradas.map((e, i) => (
            <Box key={i} sx={{
              p: 2, mb: 1,
              borderBottom: "1px solid #f1f5f9",
              borderRadius: 2,
              "&:hover": { bgcolor: "#f8fafc" }
            }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{e.titulo}</Typography>
                <Chip
                  label={e.estado.toUpperCase()}
                  size="small"
                  sx={{ ml: 2, flexShrink: 0 }}
                  color={e.estado === "aprobada" ? "success" : e.estado === "rechazada" ? "error" : "warning"}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{e.descripcion}</Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                {e.proyecto && (
                  <Box sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 2, px: 1.5, py: 0.5 }}>
                    <Typography variant="caption" sx={{ color: "#1e40af", fontWeight: 700, display: "block" }}>PROYECTO</Typography>
                    <Typography variant="body2" sx={{ color: "#1d4ed8", fontWeight: 600 }}>{e.proyecto}</Typography>
                  </Box>
                )}
                {e.hito && (
                  <Box sx={{ bgcolor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 2, px: 1.5, py: 0.5 }}>
                    <Typography variant="caption" sx={{ color: "#166534", fontWeight: 700, display: "block" }}>HITO</Typography>
                    <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 600 }}>{e.hito}</Typography>
                  </Box>
                )}
                {e.archivo_nombre && (
                  <Box sx={{ bgcolor: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 2, px: 1.5, py: 0.5 }}>
                    <Typography variant="caption" sx={{ color: "#6b21a8", fontWeight: 700, display: "block" }}>ARCHIVO</Typography>
                    <Typography variant="body2" sx={{ color: "#7e22ce", fontWeight: 600 }}>{e.archivo_nombre}</Typography>
                  </Box>
                )}
                <Box sx={{ bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2, px: 1.5, py: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, display: "block" }}>FECHA</Typography>
                  <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600 }}>{new Date(e.fecha).toLocaleString("es-AR")}</Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Card>
    </Box>
  );
}

export default ConsultorDashboard;