import React from "react";
import { containerStyle, cardStyle, titleStyle, sectionStyle } from "./styles";

function GerenciaDashboard() {
  const kpis = [
    { name: "Proyectos activos", value: 5 },
    { name: "Bugs abiertos", value: 12 },
    { name: "Satisfacción cliente", value: "85%" },
  ];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Dashboard Gerencia</h2>

        <div style={sectionStyle}>
          <h3>KPIs</h3>
          <ul>
            {kpis.map((kpi, index) => (
              <li key={index}><strong>{kpi.name}:</strong> {kpi.value}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GerenciaDashboard;
