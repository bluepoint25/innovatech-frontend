#!/bin/sh
# Sobreescribe config.js con la URL real del backend, tomada de la variable
# de entorno API_URL que se define en la Task Definition de ECS.
set -e

API_URL_VALUE="${API_URL:-http://localhost:8080}"

cat > /usr/share/nginx/html/config.js <<EOF
window.APP_CONFIG = {
  API_URL: "${API_URL_VALUE}"
};
EOF

exec "$@"
