import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/logoelitecorp.jpeg"; // Asegúrate de tener logo.png en src/assets/

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });

      const { token, role } = res.data;

      localStorage.setItem("token", token);

      if (role === "consultor") {
        navigate("/dashboard-consultor");
      } else if (role === "qa") {
        navigate("/dashboard-qa");
      } else if (role === "gerencia") {
        navigate("/dashboard-gerencia");
      } else if (role === "cliente") {
        navigate("/dashboard-cliente");
      }
    } catch (err) {
      alert("Credenciales inválidas ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>Iniciar Sesión</h2>
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
        <button onClick={handleLogin} style={styles.button}>
          Ingresar
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
    backgroundColor: "#f4f4f4",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: "320px",
    textAlign: "center",
  },
  logo: {
    width: "100px",
    marginBottom: "20px",
  },
  title: {
    marginBottom: "20px",
    color: "#1e3c72",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1e3c72",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Login;
