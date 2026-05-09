import React, { useState } from "react";
import axios from "axios";
import EliteCorpLogo from "./assets/logoelitecorp.jpeg"; // logo dentro de src/assets

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // "success" o "error"

  const handleLogin = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setMessage("Login exitoso ✅");
      setMessageType("success");
    } catch (err) {
      setMessage("Usuario o contraseña incorrectos ❌");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={EliteCorpLogo} alt="EliteCorp Consulting Group" style={styles.logo} />
        <h2 style={styles.title}>EliteTrack QA</h2>
        <p style={styles.subtitle}>Inicia sesión para continuar</p>

        {message && (
          <div
            style={{
              ...styles.message,
              backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
              color: messageType === "success" ? "#155724" : "#721c24",
              borderColor: messageType === "success" ? "#c3e6cb" : "#f5c6cb",
            }}
          >
            {message}
          </div>
        )}

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button} disabled={loading}>
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    width: "350px",
    textAlign: "center",
  },
  logo: {
    width: "180px",
    marginBottom: "20px",
  },
  title: {
    marginBottom: "10px",
    color: "#1e3c72",
  },
  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1e3c72",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  message: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid",
    marginBottom: "15px",
    fontSize: "14px",
  },
};

export default Login;
