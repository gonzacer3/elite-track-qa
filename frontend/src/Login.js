import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/logoelitecorp.jpeg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Por favor completá todos los campos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        username,
        password,
      });

      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userRole", role);

      if (role === "Consultor") navigate("/dashboard-consultor");
      else if (role === "QA") navigate("/dashboard-qa");
      else if (role === "Direccion") navigate("/dashboard-gerencia");
      else if (role === "Cliente") navigate("/dashboard-cliente");
      else setError("Rol desconocido: " + role);
    } catch (err) {
      if (err.response?.status === 423) {
        setError("Cuenta bloqueada. Intentá nuevamente en 15 minutos.");
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={styles.container}>

      {/* Panel izquierdo — Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.brandContent}>
          <img src={logo} alt="EliteCorp Logo" style={styles.brandLogo} />
          <h1 style={styles.brandTitle}>EliteTrack QP</h1>
          <p style={styles.brandSubtitle}>Sistema de Gestión de Calidad</p>
          <div style={styles.divider} />
          <p style={styles.brandDesc}>
            Plataforma corporativa para el seguimiento, control y aseguramiento
            de calidad de proyectos en EliteCorp Consulting Group.
          </p>
          <div style={styles.badgeRow}>
            <span style={styles.badge}>ISO 9001</span>
            <span style={styles.badge}>ISO/IEC 25010</span>
            <span style={styles.badge}>SQA</span>
          </div>
        </div>
        <p style={styles.brandFooter}>© 2026 EliteCorp Consulting Group</p>
      </div>

      {/* Panel derecho — Formulario */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <img src={logo} alt="EliteCorp Logo" style={styles.formLogo} />
            <h2 style={styles.formTitle}>Acceso al Sistema</h2>
            <p style={styles.formSubtitle}>Ingresá tus credenciales corporativas</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Usuario</label>
            <input
              type="text"
              placeholder="nombre.usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Verificando..." : "Iniciar Sesión →"}
          </button>

          <div style={styles.rolesHint}>
            <p style={styles.rolesTitle}>Perfiles disponibles</p>
            <div style={styles.rolesList}>
              {["Consultor", "QA", "Dirección", "Cliente"].map((r) => (
                <span key={r} style={styles.roleTag}>{r}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    overflow: "hidden",
  },

  // Panel izquierdo
  leftPanel: {
    width: "45%",
    background: "linear-gradient(160deg, #0f172a 0%, #1e3a5f 60%, #1e40af 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "48px",
    color: "#fff",
  },
  brandContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  brandLogo: {
    width: "80px",
    height: "80px",
    borderRadius: "16px",
    objectFit: "cover",
    marginBottom: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  },
  brandTitle: {
    fontSize: "32px",
    fontWeight: "800",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  brandSubtitle: {
    fontSize: "16px",
    color: "#93c5fd",
    margin: "0 0 24px 0",
    fontWeight: "500",
  },
  divider: {
    width: "48px",
    height: "3px",
    background: "#3b82f6",
    borderRadius: "2px",
    marginBottom: "24px",
  },
  brandDesc: {
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#cbd5e1",
    marginBottom: "32px",
    maxWidth: "380px",
  },
  badgeRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  badge: {
    background: "rgba(59, 130, 246, 0.2)",
    border: "1px solid rgba(59, 130, 246, 0.4)",
    color: "#93c5fd",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  brandFooter: {
    fontSize: "13px",
    color: "#475569",
    margin: 0,
  },

  // Panel derecho
  rightPanel: {
    width: "55%",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "48px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: "1px solid #e2e8f0",
  },
  formHeader: {
    marginBottom: "32px",
    textAlign: "center",
  },
  formLogo: {
    width: "72px",
    height: "72px",
    borderRadius: "14px",
    objectFit: "cover",
    marginBottom: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 8px 0",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  errorBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "15px",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    backgroundColor: "#f8fafc",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#1e40af",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "28px",
    letterSpacing: "0.3px",
    transition: "background 0.2s",
  },
  rolesHint: {
    borderTop: "1px solid #f1f5f9",
    paddingTop: "20px",
  },
  rolesTitle: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: "10px",
  },
  rolesList: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  roleTag: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default Login;