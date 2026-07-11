// Este archivo se sobreescribe automáticamente al iniciar el contenedor Docker
// (ver docker-entrypoint.sh) con la URL real del backend/ALB.
// En desarrollo local queda apuntando a localhost:8080.
window.APP_CONFIG = {
  API_URL: "http://localhost:8080"
};
