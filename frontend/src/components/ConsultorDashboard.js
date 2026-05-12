import React, { useState } from "react";
import { containerStyle, cardStyle, titleStyle, sectionStyle, buttonStyle } from "./styles";

function ConsultorDashboard() {
  const [file, setFile] = useState(null);
  const [checklist, setChecklist] = useState({
    requisitos: false,
    pruebas: false,
    documentacion: false,
  });

  const handleUpload = () => {
    if (file) {
      alert(`Evidencia subida: ${file.name}`);
      setFile(null);
    } else {
      alert("Selecciona un archivo primero");
    }
  };

  const handleChecklistChange = (e) => {
    const { name, checked } = e.target;
    setChecklist({ ...checklist, [name]: checked });
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Dashboard Consultor Interno</h2>

        <div style={sectionStyle}>
          <h3>Subir Evidencias</h3>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload} style={buttonStyle}>Subir</button>
        </div>

        <div style={sectionStyle}>
          <h3>Checklist de Calidad</h3>
          <label>
            <input type="checkbox" name="requisitos" checked={checklist.requisitos} onChange={handleChecklistChange} />
            Requisitos completos
          </label><br />
          <label>
            <input type="checkbox" name="pruebas" checked={checklist.pruebas} onChange={handleChecklistChange} />
            Pruebas realizadas
          </label><br />
          <label>
            <input type="checkbox" name="documentacion" checked={checklist.documentacion} onChange={handleChecklistChange} />
            Documentación entregada
          </label>
        </div>
      </div>
    </div>
  );
}

export default ConsultorDashboard;
