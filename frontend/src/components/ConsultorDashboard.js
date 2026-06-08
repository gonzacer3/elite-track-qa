import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, Box, Avatar, TextField, Alert, MenuItem, Select, FormControl, InputLabel, Chip } from "@mui/material";
import { Assignment, CheckCircle, ExitToApp, Send, Upload } from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981"];
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

    // Validar tamaño 20MB
    if (file.size > 20 * 1024 * 1024) {
      setMensaje({ tipo: "error", texto: "El archivo supera el límite de 20MB." });
      return;
    }

    setArchivoNombre(file.name);
    setArchivoTipo(file.type);

    const reader = new FileReader();
    reader.onload = (ev) => setArchivo(ev.target.result.split(",")[1]); // base64
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
          titulo,
          descripcion,
          proyecto,
          hito,
          archivo,
          archivo_nombre: archivoNombre,
          archivo_tipo: archivoTipo,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje({ tipo: "success", texto: "Evidencia enviada a QA correctamente." });
        setTitulo("");
        setDescripcion("");
        setProyecto("");
        setHito("");
        setArchivo(null);
        setArchivoNombre("");
        setArchivoTipo("");
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
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 3, height: 420 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Distribución</Typography>
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie data={dataPie} dataKey="value" cx="50%" cy="50%" innerRadius="50%" outerRadius="75%" paddingAngle={5}>
                  {COLORS.map((color, index) => <Cell key={index} fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Formulario */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3, height: 420, overflowY: "auto" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Upload /> Cargar Evidencia
            </Typography>
            {mensaje && (
              <Alert severity={mensaje.tipo} sx={{ mb: 2 }} onClose={() => setMensaje(null)}>
                {mensaje.texto}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Título *" value={titulo} onChange={(e) => setTitulo(e.target.value)} fullWidth size="small" />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Proyecto</InputLabel>
                  <Select value={proyecto} onChange={(e) => setProyecto(e.target.value)} label="Proyecto">
                    {PROYECTOS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Hito</InputLabel>
                  <Select value={hito} onChange={(e) => setHito(e.target.value)} label="Hito">
                    {HITOS.map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button variant="outlined" component="label" fullWidth sx={{ height: 40, textTransform: "none" }}>
                  {archivoNombre ? archivoNombre : "📎 Adjuntar archivo (max 20MB)"}
                  <input type="file" hidden onChange={handleArchivo} />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Descripción *" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} fullWidth multiline rows={3} size="small" />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handleSubirEvidencia}
                  disabled={loading}
                  fullWidth
                  sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#0f172a" }}
                >
                  {loading ? "Enviando..." : "Enviar a QA"}
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de evidencias con filtro */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Mis Evidencias</Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filtrar</InputLabel>
            <Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} label="Filtrar">
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="pendiente">Pendientes</MenuItem>
              <MenuItem value="aprobada">Aprobadas</MenuItem>
              <MenuItem value="rechazada">Rechazadas</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {evidenciasFiltradas.length === 0 ? (
          <Typography color="text.secondary">No hay evidencias para mostrar.</Typography>
        ) : (
          evidenciasFiltradas.map((e, i) => (
            <Box key={i} sx={{
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
              p: 2, mb: 1, borderBottom: "1px solid #f1f5f9", borderRadius: 2
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{e.titulo}</Typography>
                <Typography variant="body2" color="text.secondary">{e.descripcion}</Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                  {e.proyecto && <Chip label={e.proyecto} size="small" variant="outlined" />}
                  {e.hito && <Chip label={e.hito} size="small" variant="outlined" color="primary" />}
                  {e.archivo_nombre && <Chip label={`📎 ${e.archivo_nombre}`} size="small" variant="outlined" color="secondary" />}
                  <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "center" }}>
                    {new Date(e.fecha).toLocaleString("es-AR")}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={e.estado.toUpperCase()}
                size="small"
                sx={{ ml: 2 }}
                color={e.estado === "aprobada" ? "success" : e.estado === "rechazada" ? "error" : "warning"}
              />
            </Box>
          ))
        )}
      </Card>
    </Box>
  );
}

export default ConsultorDashboard;