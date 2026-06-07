import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Box, Avatar, Button } from "@mui/material";
import { Business, Folder, ThumbUp, ExitToApp, History } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, ResponsiveContainer } from "recharts";

function GerenciaDashboard() {
  const navigate = useNavigate();
  const [auditoria, setAuditoria] = useState([]);
  const [metrics, setMetrics] = useState({ activos: 0, completados: 0, satisfaccion: "0%" });

  useEffect(() => {
    fetch("http://localhost:5000/api/auditoria")
      .then((res) => res.json())
      .then((data) => setAuditoria(data.map((log) => `${log.usuario} - ${log.accion}`)))
      .catch(() => setAuditoria(["No hay registros recientes."]));

    fetch("http://localhost:5000/api/dashboard/gerencia")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => setMetrics({ activos: 5, completados: 12, satisfaccion: "88%" }));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>Gerencia Command Center</Typography>
          <Typography color="text.secondary">Reportes Ejecutivos | EliteCorp</Typography>
        </Box>
        <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>Cerrar Sesión</Button>
      </Box>

      {/* Stats Corporativas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Proyectos Activos", value: metrics.activos, icon: <Folder />, color: "#3b82f6" },
          { title: "Completados", value: metrics.completados, icon: <Business />, color: "#8b5cf6" },
          { title: "Satisfacción", value: metrics.satisfaccion, icon: <ThumbUp />, color: "#10b981" },
        ].map((item, i) => (
          <Grid item xs={4} key={i}>
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

      {/* Gráficos Responsivos */}
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Avance de Proyectos</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[{name: "A", avance: 80}, {name: "B", avance: 60}, {name: "C", avance: 90}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>KPI Financiero (Costo vs Ingreso)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={[{name: "Ene", c: 50, i: 70}, {name: "Feb", c: 55, i: 75}, {name: "Mar", c: 60, i: 85}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="c" stroke="#ef4444" strokeWidth={3} name="Costo" />
                <Line type="monotone" dataKey="i" stroke="#10b981" strokeWidth={3} name="Ingresos" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Auditoría Estilizada */}
      <Card sx={{ mt: 3, p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <History /> Registro de Auditoría
        </Typography>
        <Box sx={{ backgroundColor: "#f1f5f9", p: 2, borderRadius: 2, fontFamily: "monospace", fontSize: "0.9rem" }}>
          {auditoria.map((log, i) => <div key={i} style={{ marginBottom: "5px" }}>{`> ${log}`}</div>)}
        </Box>
      </Card>
    </Box>
  );
}

export default GerenciaDashboard;