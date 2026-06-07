import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, Box, Avatar } from "@mui/material";
import { BugReport, CheckCircle, ExitToApp, Shield } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
function QADashboard() {
  const navigate = useNavigate();
  const [metrics] = useState({ bugsAbiertos: 12, bugsResueltos: 34, cobertura: "92%" });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* Header Corporativo */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#0f172a" }}>QA Command Center</Typography>
          <Typography color="text.secondary">Monitoreo y Control de Calidad | EliteCorp</Typography>
        </Box>
        <Button variant="outlined" color="inherit" startIcon={<ExitToApp />} onClick={handleLogout}>Cerrar Sesión</Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: "Bugs Abiertos", value: metrics.bugsAbiertos, icon: <BugReport />, color: "#ef4444" },
          { title: "Bugs Resueltos", value: metrics.bugsResueltos, icon: <CheckCircle />, color: "#22c55e" },
          { title: "Cobertura Tests", value: metrics.cobertura, icon: <Shield />, color: "#3b82f6" },
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

      {/* Main Chart Section */}
      <Card sx={{ p: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Tendencia de Calidad Semestral</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[{name: 'Ene', bugs: 12}, {name: 'Feb', bugs: 8}, {name: 'Mar', bugs: 15}, {name: 'Abr', bugs: 5}]}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="bugs" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  );
}

export default QADashboard;