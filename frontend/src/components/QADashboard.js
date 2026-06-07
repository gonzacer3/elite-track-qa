import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid, Card, CardContent, Typography, Button, Box, Avatar,
  Chip, CircularProgress, List, ListItem, ListItemText, Divider
} from "@mui/material";
import { BugReport, CheckCircle, ExitToApp, Shield, Notifications, PieChart as PieIcon } from "@mui/icons-material";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
 
const COLORS_PIE = ["#ef4444", "#f97316", "#3b82f6"];
 
function QADashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ bugsAbiertos: 0, bugsResueltos: 0, cobertura: "0%" });
  const [notificaciones, setNotificaciones] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
 
  const dataSeveridad = [
    { name: "Críticos", value: 4 },
    { name: "Mayores",  value: 6 },
    { name: "Menores",  value: 10 },
  ];
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
 
    // Notificaciones reales de la API
    fetch("http://localhost:3001/api/notificaciones", { headers })
      .then((res) => res.json())
      .then((data) => {
        setNotificaciones(data);
        setLoadingNotifs(false);
      })
      .catch(() => setLoadingNotifs(false));
 
    // Métricas — fallback a valores de referencia si el endpoint no existe aún
    fetch("http://localhost:3001/api/dashboard/metrics", { headers })
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => setMetrics({ bugsAbiertos: 12, bugsResueltos: 34, cobertura: "92%" }));
  }, []);
 
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
 
  return (
    <Box sx={{ p: 4, backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
 
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>QA Command Center</Typography>
          <Typography color="text.secondary">Monitoreo y Control de Calidad | EliteCorp</Typography>
        </Box>
        <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Box>
 
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Bugs Abiertos",  value: metrics.bugsAbiertos,  icon: <BugReport />,   color: "#ef4444" },
          { title: "Bugs Resueltos", value: metrics.bugsResueltos, icon: <CheckCircle />, color: "#22c55e" },
          { title: "Cobertura Tests",value: metrics.cobertura,     icon: <Shield />,      color: "#3b82f6" },
        ].map((item, i) => (
          <Grid item xs={12} sm={4} key={i}>
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
 
      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
 
        {/* Bar Chart — Tendencia semestral */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Tendencia de Calidad Semestral</Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={[
                { name: "Ene", bugs: 12 },
                { name: "Feb", bugs: 8  },
                { name: "Mar", bugs: 15 },
                { name: "Abr", bugs: 5  },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="bugs" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
 
        {/* Pie Chart — Severidad */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", borderRadius: 3, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
              <PieIcon sx={{ color: "#0f172a" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Bugs por Severidad</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={dataSeveridad} cx="50%" cy="45%" outerRadius={90} dataKey="value" label>
                  {dataSeveridad.map((_, index) => (
                    <Cell key={index} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
 
      {/* Alertas / Notificaciones */}
      <Card sx={{ p: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Notifications sx={{ color: "#f97316" }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Alertas del Sistema — Próximas 48 horas
          </Typography>
        </Box>
 
        {loadingNotifs ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={28} />
          </Box>
        ) : notificaciones.length === 0 ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 2 }}>
            <CheckCircle sx={{ color: "#22c55e" }} />
            <Typography color="text.secondary">Sin alertas pendientes. Sistema estable.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notificaciones.map((n, i) => (
              <React.Fragment key={i}>
                <ListItem sx={{ px: 0 }}>
                  <Chip
                    label="Alerta"
                    size="small"
                    sx={{ mr: 2, bgcolor: "#fef3c7", color: "#92400e", fontWeight: 600 }}
                  />
                  <ListItemText primary={n.mensaje} secondary={n.fecha ? new Date(n.fecha).toLocaleString("es-AR") : null} />
                </ListItem>
                {i < notificaciones.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>
 
    </Box>
  );
}
 
export default QADashboard;