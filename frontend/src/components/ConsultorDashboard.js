import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid, Card, CardContent, Typography, Button, Box, Avatar,
  TextField, Alert, MenuItem, Chip
} from "@mui/material";
import { Assignment, CheckCircle, ExitToApp, Send, Upload, FolderOpen } from "@mui/icons-material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#f59e0b", "#10b981", "#ef4444"];
const BASE_URL = "http://localhost:3001";
const PROYECTOS = ["EliteTrack QP", "Proyecto Alpha", "Proyecto Beta", "Otro"];

function ConsultorDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Consultor";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [evidencias, setEvidencias] = useState([]);
  const [hitosDB, setHitosDB] = useState([]);
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
    fetch(`${BASE_URL}/api/notificaciones/hitos-proximos`, { headers })
      .then((res) => res.json())
      .then((data) => setHitosDB(Array.isArray(data) ? data : []))
      .catch(() => setHitosDB([]));
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
          fecha_vencimiento: null,
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
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>

      {/* Sidebar */}
      <Box sx={{
        width: 240,
        background: "linear-gradient(180deg, #0f172a 0%, #1e3a5f 100%)",
        display: "flex", flexDirection: "column", p: 3, flexShrink: 0,
      }}>
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", mb: 1 }}>
            EliteTrack QP
          </Typography>
          <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>Consultor</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: "#64748b", fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", mb: 2 }}>
            Contenido
          </Typography>
          {[{ label: "📊 Mis métricas" }, { label: "📤 Cargar evidencia" }, { label: "📋 Mis evidencias" }].map((item) => (
            <Box key={item.label} sx={{ px: 2, py: 1, mb: 0.5 }}>
              <Typography sx={{ color: "#94a3b8", fontSize: 15, fontWeight: 500 }}>{item.label}</Typography>
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
              <Typography sx={{ color: "#64748b", fontSize: 11 }}>Consultor Interno</Typography>
            </Box>
          </Box>
          <Button fullWidth startIcon={<ExitToApp />} onClick={handleLogout}
            sx={{ color: "#64748b", justifyContent: "flex-start", textTransform: "none",
              fontSize: 13, "&:hover": { color: "#ef4444", bgcolor: "rgba(239,68,68,0.1)" } }}>
            Cerrar Sesión
          </Button>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, p: 4, overflowY: "auto" }}>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mb: 0.5 }}>Panel del Consultor</Typography>
          <Typography sx={{ color: "#64748b", fontSize: 14 }}>Gestión y carga de evidencias — EliteCorp Consulting Group</Typography>
        </Box>

        {/* Métricas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: "Pendientes", value: pendientes, icon: <Assignment />, color: "#f59e0b", bg: "#fffbeb" },
            { title: "Aprobadas", value: aprobadas, icon: <CheckCircle />, color: "#10b981", bg: "#f0fdf4" },
            { title: "Rechazadas", value: rechazadas, icon: <Send />, color: "#ef4444", bg: "#fef2f2" },
          ].map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
                  <Avatar sx={{ bgcolor: item.bg, color: item.color, width: 48, height: 48 }}>{item.icon}</Avatar>
                  <Box>
                    <Typography sx={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{item.title}</Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>{item.value}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Gráfico + Formulario */}
        <Box sx={{ display: "flex", gap: 3, mb: 4, alignItems: "flex-start" }}>

          {/* Gráfico */}
          <Box sx={{ width: "280px", flexShrink: 0 }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1 }}>Distribución</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={dataPie} dataKey="value" cx="50%" cy="45%"
                    innerRadius="30%" outerRadius="70%" paddingAngle={4}
                    label={({ value }) => value > 0 ? value : ""}>
                    {COLORS.map((color, index) => <Cell key={index} fill={color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Box>

          {/* Formulario */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Upload sx={{ color: "#1e40af", fontSize: 20 }} />
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>Cargar Evidencia</Typography>
              </Box>

              {mensaje && (
                <Alert severity={mensaje.tipo} sx={{ mb: 2, borderRadius: 2 }} onClose={() => setMensaje(null)}>
                  {mensaje.texto}
                </Alert>
              )}

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Título *" value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  fullWidth size="small"
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    select label="Proyecto" value={proyecto}
                    onChange={(e) => setProyecto(e.target.value)}
                    fullWidth size="small"
                  >
                    <MenuItem value="">Sin proyecto</MenuItem>
                    {PROYECTOS.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </TextField>
                  <TextField
                    select label="Hito" value={hito}
                    onChange={(e) => setHito(e.target.value)}
                    fullWidth size="small"
                  >
                    <MenuItem value="">Sin hito</MenuItem>
                    {hitosDB.filter((h) => !proyecto || h.proyecto === proyecto).length > 0
                      ? hitosDB.filter((h) => !proyecto || h.proyecto === proyecto).map((h) => (
                          <MenuItem key={h.id} value={h.titulo}>
                            {h.titulo} — {new Date(h.fecha_vencimiento).toLocaleDateString("es-AR")}
                          </MenuItem>
                        ))
                      : <MenuItem disabled>No hay hitos para este proyecto</MenuItem>
                    }
                  </TextField>
                </Box>
                <TextField
                  label="Descripción *" value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  fullWidth multiline rows={3} size="small"
                />
                <Button
                  variant="outlined" component="label" fullWidth startIcon={<FolderOpen />}
                  sx={{
                    height: "40px", textTransform: "none", justifyContent: "flex-start", px: 2,
                    color: archivoNombre ? "#10b981" : "#64748b",
                    borderColor: archivoNombre ? "#10b981" : "#e2e8f0",
                    bgcolor: archivoNombre ? "#f0fdf4" : "#f8fafc",
                    borderRadius: 2, fontSize: 13,
                  }}
                >
                  {archivoNombre ? archivoNombre : "Adjuntar archivo (máx. 20MB)"}
                  <input type="file" hidden onChange={handleArchivo} />
                </Button>
                <Button
                  variant="contained" startIcon={<Send />}
                  onClick={handleSubirEvidencia} disabled={loading} fullWidth
                  sx={{
                    borderRadius: 2, textTransform: "none",
                    background: "linear-gradient(135deg, #1e40af, #0f172a)",
                    py: 1.2, fontSize: 14, fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(30,64,175,0.3)",
                  }}
                >
                  {loading ? "Enviando..." : "Enviar a QA →"}
                </Button>
              </Box>
            </Card>
          </Box>
        </Box>

        {/* Lista de evidencias */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" }}>
          <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>Mis Evidencias</Typography>
            <TextField select label="Filtrar" value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)} size="small" sx={{ minWidth: 150 }}>
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="pendiente">Pendientes</MenuItem>
              <MenuItem value="aprobada">Aprobadas</MenuItem>
              <MenuItem value="rechazada">Rechazadas</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ p: 2 }}>
            {evidenciasFiltradas.length === 0 ? (
              <Typography sx={{ color: "#94a3b8", fontSize: 14, p: 2 }}>No hay evidencias para mostrar.</Typography>
            ) : (
              evidenciasFiltradas.map((e, i) => (
                <Box key={i} sx={{
                  p: 2, mb: 1, borderRadius: 2,
                  bgcolor: e.estado === "pendiente" ? "#fffbeb" : "#f8fafc",
                  border: "1px solid",
                  borderColor: e.estado === "pendiente" ? "#fde68a" : "#f1f5f9",
                  "&:hover": { borderColor: "#cbd5e1" },
                }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{e.titulo}</Typography>
                    <Chip label={e.estado.toUpperCase()} size="small" sx={{ ml: 2, flexShrink: 0 }}
                      color={e.estado === "aprobada" ? "success" : e.estado === "rechazada" ? "error" : "warning"} />
                  </Box>
                  <Typography sx={{ fontSize: 13, color: "#64748b", mb: 1 }}>{e.descripcion}</Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
                    {e.proyecto && (
                      <Box sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 2, px: 1.5, py: 0.5 }}>
                        <Typography sx={{ fontSize: 10, color: "#1e40af", fontWeight: 700, display: "block" }}>PROYECTO</Typography>
                        <Typography sx={{ fontSize: 13, color: "#1d4ed8", fontWeight: 600 }}>{e.proyecto}</Typography>
                      </Box>
                    )}
                    {e.hito && (
                      <Box sx={{ bgcolor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 2, px: 1.5, py: 0.5 }}>
                        <Typography sx={{ fontSize: 10, color: "#166534", fontWeight: 700, display: "block" }}>HITO</Typography>
                        <Typography sx={{ fontSize: 13, color: "#15803d", fontWeight: 600 }}>{e.hito}</Typography>
                      </Box>
                    )}
                    {e.fecha_vencimiento && (
                      <Box sx={{ bgcolor: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 2, px: 1.5, py: 0.5 }}>
                        <Typography sx={{ fontSize: 10, color: "#c2410c", fontWeight: 700, display: "block" }}>VENCE</Typography>
                        <Typography sx={{ fontSize: 13, color: "#ea580c", fontWeight: 600 }}>
                          {new Date(e.fecha_vencimiento).toLocaleDateString("es-AR")}
                        </Typography>
                      </Box>
                    )}
                    {e.archivo_nombre && (
                      <Box sx={{ bgcolor: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 2, px: 1.5, py: 0.5 }}>
                        <Typography sx={{ fontSize: 10, color: "#6b21a8", fontWeight: 700, display: "block" }}>ARCHIVO</Typography>
                        <Typography sx={{ fontSize: 13, color: "#7e22ce", fontWeight: 600 }}>{e.archivo_nombre}</Typography>
                      </Box>
                    )}
                    <Box sx={{ bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2, px: 1.5, py: 0.5 }}>
                      <Typography sx={{ fontSize: 10, color: "#64748b", fontWeight: 700, display: "block" }}>FECHA</Typography>
                      <Typography sx={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>{new Date(e.fecha).toLocaleString("es-AR")}</Typography>
                    </Box>
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

export default ConsultorDashboard;