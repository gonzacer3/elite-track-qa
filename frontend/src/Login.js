import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      alert("Login exitoso");
    } catch (err) {
      alert("Error en login");
    }
  };

  return (
    <div style={{ margin: "50px" }}>
      <h2>EliteTrack QA - Login</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}

export default Login;

