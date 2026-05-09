# EliteTrack QA

Sistema de trazabilidad y control de calidad para proyectos de software.  
Este repositorio contiene el código y la documentación del proyecto **EliteTrack QA**, desarrollado con **React, Node.js y SQL**.

##  Tecnologías
- **Frontend:** React
- **Backend:** Node.js (Express)
- **Base de Datos:** SQL
- **QA Tools:** JMeter, k6

##  Estructura del proyecto
elite-track-qa/
├── frontend/        # Aplicación React (login, carga de evidencias, UI)
├── backend/         # API Node.js (RBAC, auditoría, endpoints)
├── database/        # Scripts SQL (usuarios, roles, auditoría, evidencias)
├── docs/            # Documentación QA (plan de calidad, RTM, matriz de riesgos, UML)
└── README.md        # Este archivo

Código

##  Instalación

### Clonar el repositorio
```bash
git clone https://github.com/tuusuario/elite-track-qa.git
cd elite-track-qa
Backend (Node.js)
bash
cd backend
npm init -y
npm install express mysql2
Frontend (React)
bash
cd ../frontend
npx create-react-app .
npm start  

QA y Pruebas
Pruebas funcionales: Validación de RF01–RF04 (login, RBAC, carga de evidencias, notificaciones, auditoría).

Pruebas de rendimiento: Simulación de 50 usuarios concurrentes con JMeter/k6.

Pruebas de seguridad: Validación de roles y expiración de sesión (15 min).

Pruebas de usabilidad: Tiempo de aprendizaje < 30 minutos.

Documentación
Toda la documentación del proyecto (Plan de Calidad, Matriz de Riesgos, RTM, UML) se encuentra en la carpeta /docs.

Equipo
Gamarra Marcos

Fabricio Toscano

Nicolás Vázquez

Gonzalo Cerimedo

Valencia Lautaro