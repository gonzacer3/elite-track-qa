import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, Box, Avatar } from "@mui/material";
import { Assignment, CheckCircle, ExitToApp, Send } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#3b82f6", "#f59e0b"];

function ConsultorDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Consultor";
  
  const [tareas, setTareas] = useState([
    { id: 1, proyecto: "Ecosistema EliteCorp", descripcion: "Modelado BD", estado: "Asignada" },
    { id: 2, proyecto: "Facturación", descripcion: "Endpoint cobros", estado: "En Progreso" },
  ]);

  const handleLogout = () => { 
    localStorage.clear(); 
    navigate("/"); 
  };

  const handleEnviarAQA = (id) => {
    setTareas(tareas.map(t => t.id === id ? { ...t, estado: "Enviado a QA" } : t));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* Header Corporativo */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>Consultor Command Center</Typography>
          <Typography color="text.secondary">Bienvenido, {username} | EliteCorp</Typography>
        </Box>
        <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>Cerrar Sesión</Button>
      </Box>

      {/* Tarjetas de Métricas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Tareas Activas", value: tareas.filter(t => t.estado !== "Enviado a QA").length, icon: <Assignment />, color: "#3b82f6" },
          { title: "Enviadas a QA", value: tareas.filter(t => t.estado === "Enviado a QA").length, icon: <Send />, color: "#f59e0b" },
          { title: "Total Completadas", value: 15, icon: <CheckCircle />, color: "#10b981" },
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

      {/* Sección de Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3, height: 350, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Curva de Progreso Semanal</Typography>
            <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={[{name: "Lun", p: 70, r: 65}, {name: "Mar", p: 75, r: 70}, {name: "Mié", p: 80, r: 75}]}
                  margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="p" name="Plan" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="r" name="Real" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 3, height: 350, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Distribución de Tareas</Typography>
            <Box sx={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={[{name: "Activas", v: 2}, {name: "QA", v: 1}]} 
                    dataKey="v" 
                    cx="50%" cy="50%" 
                    innerRadius="60%" 
                    outerRadius="80%" 
                    paddingAngle={5}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Asignaciones */}
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#0f172a", fontWeight: 700 }}>Asignaciones en Tiempo Real</Typography>
        {tareas.map(t => (
          <Box key={t.id} sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            p: 2, 
            mb: 1,
            backgroundColor: t.estado === "Enviado a QA" ? "#f8fafc" : "transparent",
            borderBottom: "1px solid #f1f5f9",
            borderRadius: 2
          }}>
            <Box>
              <Typography sx={{ fontWeight: 600 }}>{t.proyecto}</Typography>
              <Typography variant="body2" color="text.secondary">{t.descripcion}</Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              {t.estado !== "Enviado a QA" ? (
                <Button 
                  size="small" 
                  variant="contained" 
                  startIcon={<Send />}
                  onClick={() => handleEnviarAQA(t.id)}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Enviar a QA
                </Button>
              ) : (
                <Typography color="success.main" sx={{ fontWeight: 700, fontSize: "0.85rem" }}>
                  🔬 En Revisión QA
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Card>
    </Box>
  );
}

export default ConsultorDashboard;