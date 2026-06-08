Abrí el archivo README.md que está en la raíz del proyecto y reemplazá todo el contenido por esto:
markdown# EliteTrack QP 🛡️

Sistema de gestión de calidad para EliteCorp Consulting Group.  
Materia: Aseguramiento de Calidad de los Sistemas — IFTS N°4  
Profesor: Eduardo Luis Teruya  
Equipo: Gamarra, Toscano, Vázquez, Cerimedo, Valencia

---

## Stack

- **Backend:** Node.js + Express + MySQL
- **Frontend:** React + Material UI + Recharts
- **Tests:** Jest + Supertest
- **CI/CD:** GitHub Actions
- **Deploy:** Docker + Docker Compose

---

## Requisitos

- Node.js 18+
- MySQL 8.0+
- Docker (opcional)

---

## Variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Default |
|----------|-------------|---------|
| DB_HOST | Host de MySQL | localhost |
| DB_USER | Usuario de MySQL | root |
| DB_PASS | Contraseña de MySQL | — |
| DB_NAME | Nombre de la base | elite_track |
| JWT_SECRET | Clave secreta para JWT | — |
| PORT | Puerto del backend | 3001 |
| FRONTEND_URL | URL del frontend (CORS) | http://localhost:3000 |

---

## Levantar el proyecto

### Con Docker

```bash
docker-compose up --build
```

El sistema queda disponible en:
- Frontend: http://localhost
- Backend: http://localhost:3001

### Sin Docker

**Backend:**
```bash
cd backend
npm install
node initDB.js      # crea tablas y usuarios de prueba
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | Admin1234! | Direccion |
| qa | QA1234! | QA |
| consultor | Consultor1234! | Consultor |
| cliente | Cliente1234! | Cliente |

---

## Tests

```bash
cd backend
npm test
```

Cobertura mínima exigida: **88% branches / 88% lines / 90% functions**.

---

## Flujo de branching (Git Flow)
main         ← solo recibe merges desde develop, con PR aprobado
develop      ← integración continua
feature/*    ← una rama por módulo o funcionalidad
hotfix/*     ← correcciones urgentes en producción

**Regla de integración (QI):**
1. Tests pasados con cobertura ≥ 90% del módulo
2. PR aprobado hacia `develop`
3. CI/CD verde antes del merge

---

## Endpoints principales

| Método | Ruta | Roles |
|--------|------|-------|
| POST | /api/auth/login | Público |
| GET | /api/evidencias | Todos |
| POST | /api/evidencias | Consultor, QA |
| PATCH | /api/evidencias/:id/revisar | QA |
| GET | /api/notificaciones | Todos |
| POST | /api/notificaciones | Todos |
| GET | /api/notificaciones/hitos-proximos | Todos |
| GET | /api/auditoria | Direccion, QA |