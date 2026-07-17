 
# Innovatech Frontend

SPA en React para la gestión de productos de Innovatech Chile. Consume la API REST del backend (`innovatech-backend`) desplegada en AWS ECS, a través de un Application Load Balancer.

Proyecto desarrollado para la Evaluación Final Transversal — ISY1101 (Introducción a Herramientas DevOps), DuocUC.

## Stack

- React 18
- Jest + React Testing Library (tests)
- nginx (servidor de producción, dentro del contenedor)
- Docker (build multi-stage)

## Estructura del proyecto

```
frontend/
├── public/
│   ├── config.js          # URL del backend, sobreescrita en runtime por docker-entrypoint.sh
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ProductoForm.jsx
│   │   └── ProductoList.jsx
│   ├── App.jsx
│   ├── App.test.js        # tests con Jest
│   ├── index.js
│   └── setupTests.js
├── Dockerfile              # build multi-stage (node:20-alpine → nginx:alpine)
├── docker-entrypoint.sh    # inyecta la URL real del backend al iniciar el contenedor
├── docker-compose.yml      # entorno local completo (frontend + backend + mysql)
└── .github/workflows/deploy.yml
```

## Cómo correr en local

### Opción A: con Docker Compose (recomendado, levanta todo el stack)

Desde la raíz del proyecto (donde está `docker-compose.yml`):

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api/health

### Opción B: solo el frontend, en modo desarrollo

```bash
npm install
npm start
```

Abre http://localhost:3000. Necesitas el backend corriendo aparte (o ajusta `public/config.js` con la URL que corresponda).

## Variables de entorno

| Variable | Descripción | Dónde se usa |
|---|---|---|
| `API_URL` | URL base del backend | Inyectada por `docker-entrypoint.sh` al arrancar el contenedor, sobreescribe `public/config.js` |

## Tests

```bash
npm install
npm test
```

Incluye:
- Render del componente principal
- Verificación de conexión al backend (mock de `fetch`)
- Validación del formulario (rechazo de precio inválido)

## Pipeline CI/CD

Cada push a `main` dispara `.github/workflows/deploy.yml`, que ejecuta en orden:

1. **Test** — `npm test` (Jest)
2. **Build** — construye la imagen Docker (multi-stage)
3. **Push** — publica la imagen en Amazon ECR (tags: SHA del commit + `latest`)
4. **Deploy** — registra una nueva revisión de la Task Definition y actualiza el Service en Amazon ECS (rolling update, sin downtime)

### Secretos requeridos (GitHub Actions → Settings → Secrets and variables → Actions)

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN`

> Estas credenciales provienen de AWS Academy Learner Lab y son temporales (expiran cada ~4 horas). Deben actualizarse en los secrets del repo cada vez que se reinicia la sesión del lab.

## Infraestructura en AWS

Desplegado en un clúster ECS Fargate, detrás de un Application Load Balancer que enruta por path:

- `/api/*` → backend (puerto 8080)
- resto → este frontend (puerto 80)

Ver detalle completo de la arquitectura en el informe técnico del proyecto y en el repositorio [`innovatech-backend`](https://github.com/bluepoint25/innovatech-backend).

## Repositorio relacionado

- Backend: https://github.com/bluepoint25/innovatech-backend