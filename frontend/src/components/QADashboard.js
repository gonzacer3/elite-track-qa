import React, { useState } from "react";
import { containerStyle, cardStyle, titleStyle, sectionStyle, buttonStyle } from "./styles";

function QADashboard() {
  const [bug, setBug] = useState("");

  const handleReport = () => {
    if (bug.trim() !== "") {
      alert("Bug reportado: " + bug);
      setBug("");
    } else {
      alert("Describe el bug antes de enviar");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Dashboard QA</h2>

        <div style={sectionStyle}>
          <h3>Reportar Bug</h3>
          <textarea
            value={bug}
            onChange={(e) => setBug(e.target.value)}
            placeholder="Describe el bug encontrado..."
            rows="4"
            style={{ width: "100%", borderRadius: "5px", padding: "10px" }}
          />
          <button onClick={handleReport} style={buttonStyle}>Enviar</button>
        </div>
      </div>
    </div>
  );
}

export default QADashboard;
