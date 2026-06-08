import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Refresh token automático — RNF02
// Renueva el token cada 10 minutos si el usuario está activo
let inactivityTimer;
// eslint-disable-next-line no-unused-vars
let refreshTimer;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    // 15 minutos sin actividad — cerrar sesión
    localStorage.clear();
    window.location.href = "/";
  }, 15 * 60 * 1000);
}

async function refreshToken() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:3001/api/auth/refresh", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
    } else {
      // Token inválido — cerrar sesión
      localStorage.clear();
      window.location.href = "/";
    }
  } catch {
    // Si falla la conexión no cerramos sesión
  }
}

// Escuchar actividad del usuario
["mousemove", "keydown", "click", "scroll"].forEach((event) => {
  window.addEventListener(event, resetInactivityTimer);
});

// Refrescar token cada 10 minutos si hay sesión activa
refreshTimer = setInterval(refreshToken, 10 * 60 * 1000);

// Iniciar timer de inactividad
resetInactivityTimer();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();