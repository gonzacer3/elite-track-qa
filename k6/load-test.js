import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");

// RNF01: 50 usuarios concurrentes sin degradación
export const options = {
  stages: [
    { duration: "30s", target: 50 }, // rampa de subida a 50 usuarios
    { duration: "1m",  target: 50 }, // mantener 50 usuarios por 1 minuto
    { duration: "10s", target: 0  }, // rampa de bajada
  ],
  thresholds: {
    http_req_duration: ["p(95)<2000"], // 95% de requests bajo 2 segundos
    errors: ["rate<0.01"],             // menos del 1% de errores
    http_req_failed: ["rate<0.01"],    // menos del 1% de fallos HTTP
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001";

// Login y obtener token
function login(username, password) {
  const res = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ username, password }),
    { headers: { "Content-Type": "application/json" } }
  );
  check(res, { "login exitoso": (r) => r.status === 200 });
  return res.json("token");
}

export default function () {
  // Simular usuario autenticado
  const token = login("admin", "Admin1234!");

  if (!token) {
    errorRate.add(1);
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // RF02: listar evidencias
  const resEvidencias = http.get(`${BASE_URL}/api/evidencias`, { headers });
  check(resEvidencias, {
    "evidencias status 200": (r) => r.status === 200,
    "evidencias responde rápido": (r) => r.timings.duration < 2000,
  });
  errorRate.add(resEvidencias.status !== 200);

  sleep(0.5);

  // RF03: listar notificaciones
  const resNotifs = http.get(`${BASE_URL}/api/notificaciones`, { headers });
  check(resNotifs, {
    "notificaciones status 200": (r) => r.status === 200,
    "notificaciones responde rápido": (r) => r.timings.duration < 2000,
  });
  errorRate.add(resNotifs.status !== 200);

  sleep(0.5);

  // RF03: hitos próximos
  const resHitos = http.get(`${BASE_URL}/api/notificaciones/hitos-proximos`, { headers });
  check(resHitos, {
    "hitos status 200": (r) => r.status === 200,
  });
  errorRate.add(resHitos.status !== 200);

  sleep(1);
}