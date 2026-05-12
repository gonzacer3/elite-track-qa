import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import ConsultorDashboard from "./components/ConsultorDashboard";
import QADashboard from "./components/QADashboard";
import GerenciaDashboard from "./components/GerenciaDashboard";
import ClienteDashboard from "./components/ClienteDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal */}
        <Route path="/" element={<Login />} />

        {/* Dashboards por rol */}
        <Route path="/dashboard-consultor" element={<ConsultorDashboard />} />
        <Route path="/dashboard-qa" element={<QADashboard />} />
        <Route path="/dashboard-gerencia" element={<GerenciaDashboard />} />
        <Route path="/dashboard-cliente" element={<ClienteDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
