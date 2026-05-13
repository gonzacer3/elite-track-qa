# EliteTrack QA

Sistema de trazabilidad y control de calidad para proyectos de software.  
Este repositorio contiene el código y la documentación del proyecto **EliteTrack QA**, desarrollado con **React, Node.js y SQL**.

## 🚀 Tecnologías
- **Frontend:** React (login, dashboards por rol, UI)
- **Backend:** Node.js (Express, JWT, RBAC)
- **Base de Datos:** MySQL
- **QA Tools:** JMeter, k6
- **UI Framework:** Material UI (MUI v5)
- **Gráficos:** Recharts
- **HTTP Client:** Axios

## 📂 Estructura del proyecto
elite-track-qa/
├── frontend/        # Aplicación React (login, dashboards con MUI + Recharts)
├── backend/         # API Node.js (RBAC, auditoría, endpoints)
├── database/        # Scripts SQL (usuarios, roles, auditoría, evidencias)
├── docs/            # Documentación QA (plan de calidad, RTM, matriz de riesgos, UML)
└── README.md        # Este archivo

Código

## ⚙️ Instalación

### Clonar el repositorio
```bash
git clone https://github.com/tuusuario/elite-track-qa.git
cd elite-track-qa

Backend (Node.js)
cd backend
npm install
node server.js

Frontend (React)
cd ../frontend
npm install
npm start
Dependencias principales
npm install react-router-dom axios recharts @mui/material @mui/icons-material @emotion/react @emotion/styled
🧪 QA y Pruebas
Pruebas funcionales: Validación de login, RBAC, carga de evidencias, notificaciones, auditoría.

Pruebas de rendimiento: Simulación de usuarios concurrentes con JMeter/k6.

Pruebas de seguridad: Validación de roles y expiración de sesión (15 min).

Pruebas de usabilidad: Dashboards con diseño profesional (Material UI + Recharts).

📊 Documentación
Toda la documentación del proyecto (Plan de Calidad, Matriz de Riesgos, RTM, UML) se encuentra en la carpeta /docs.

👥 Equipo
Gamarra Marcos

Fabricio Toscano

Nicolás Vázquez

Gonzalo Cerimedo

Valencia Lautaro