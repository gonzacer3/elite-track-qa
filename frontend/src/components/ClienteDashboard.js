import React, { useState } from "react";
import { containerStyle, cardStyle, titleStyle, sectionStyle, buttonStyle } from "./styles";

function ClienteDashboard() {
  const [encuesta, setEncuesta] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const entregables = [
    "Informe de calidad - Sprint 1",
    "Reporte de auditoría - Abril",
    "Plan de pruebas - Módulo Login",
  ];

  const handleSubmitEncuesta = () => {
    if (encuesta.trim() !== "") {
      setSubmitted(true);
      alert("Encuesta enviada ✅ ¡Gracias por tu feedback!");
      setEncuesta("");
    } else {
      alert("Completa la encuesta antes de enviar");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Dashboard Cliente Externo</h2>

        <div style={sectionStyle}>
          <h3>Entregables disponibles</h3>
          <ul>
            {entregables.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3>Encuesta de satisfacción</h3>
          <textarea
            value={encuesta}
            onChange={(e) => setEncuesta(e.target.value)}
            placeholder="Escribe tu opinión sobre el proyecto..."
            rows="4"
            style={{ width: "100%", borderRadius: "5px", padding: "10px" }}
          />
          <button onClick={handleSubmitEncuesta} style={buttonStyle}>Enviar</button>
          {submitted && <p>¡Encuesta enviada correctamente! ✅</p>}
        </div>
      </div>
    </div>
  );
}

export default ClienteDashboard;
