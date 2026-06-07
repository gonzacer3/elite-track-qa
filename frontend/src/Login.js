import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/logoelitecorp.jpeg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        username,
        password,
      });

      const { token, role } = res.data;

      // 💾 Guardamos los datos necesarios en el almacenamiento local
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userRole", role); // 🔥 Clave para que ProtectedRoute no te rebote

      // 🚀 Redirección inteligente adaptada a mayúsculas, minúsculas y roles de ELITECORP
      if (role === "Consultor" || role === "admin" || role === "Admin") {
        navigate("/dashboard-consultor"); 
      } else if (role === "QA" || role === "qa") {
        navigate("/dashboard-qa");
      } else if (role === "Direccion" || role === "Gerente") {
        navigate("/dashboard-gerencia");
      } else if (role === "Cliente" || role === "cliente") {
        navigate("/dashboard-cliente");
      } else {
        alert("Rol desconocido: " + role);
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
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    fontFamily: "Roboto, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    width: "320px",
    textAlign: "center",
  },
  logo: {
    width: "100px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "20px",
    color: "#1e3c72",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#1e3c72",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default Login;
