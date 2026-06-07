import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import ConsultorDashboard from "./components/ConsultorDashboard";
import QADashboard from "./components/QADashboard";
import GerenciaDashboard from "./components/GerenciaDashboard";
import ClienteDashboard from "./components/ClienteDashboard";

// 🛡️ Componente Guardián para proteger las rutas por Rol
const ProtectedRoute = ({ children, allowedRoles }) => {
  // Simulamos levantar el usuario y su rol desde el almacenamiento local
  const userRole = localStorage.getItem("userRole"); 
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    // Si no está logueado, patitas a la calle (al Login)
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Si está logueado pero quiere entrar a un panel que no le corresponde
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública principal */}
        <Route path="/" element={<Login />} />

        {/* 🔒 Dashboards protegidos estrictamente por rol según ELITECORP */}
        <Route 
          path="/dashboard-consultor" 
          element={
            <ProtectedRoute allowedRoles={["Consultor", "Admin"]}>
              <ConsultorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard-qa" 
          element={
            <ProtectedRoute allowedRoles={["QA", "Admin"]}>
              <QADashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard-gerencia" 
          element={
            <ProtectedRoute allowedRoles={["Gerente", "Admin"]}>
              <GerenciaDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard-cliente" 
          element={
            <ProtectedRoute allowedRoles={["Cliente", "Admin"]}>
              <ClienteDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirección por si meten cualquier otra URL inválida */}
        <Route path="*" replace to="/" />
      </Routes>
    </Router>
  );
}

export default App;
