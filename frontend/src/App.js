import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import ConsultorDashboard from "./components/ConsultorDashboard";
import QADashboard from "./components/QADashboard";
import GerenciaDashboard from "./components/GerenciaDashboard";
import ClienteDashboard from "./components/ClienteDashboard";

// 🛡️ Componente Guardián para proteger las rutas por Rol
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole"); 
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
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
            <ProtectedRoute allowedRoles={["Consultor", "Admin", "admin"]}>
              <ConsultorDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard-qa" 
          element={
            <ProtectedRoute allowedRoles={["QA", "Admin", "admin", "qa"]}>
              <QADashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard-gerencia" 
          element={
            <ProtectedRoute allowedRoles={["Gerente", "Direccion", "Admin", "admin"]}>
              <GerenciaDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard-cliente" 
          element={
            <ProtectedRoute allowedRoles={["Cliente", "Admin", "admin", "cliente"]}>
              <ClienteDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Redirección por si meten cualquier otra URL inválida */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;