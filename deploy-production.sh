#!/bin/bash
set -e

echo "🚀 Iniciando despliegue (git pull)..."

# 0) Cargar NVM si existe (opcional)
if [ -s "$HOME/.nvm/nvm.sh" ]; then
  echo "📂 Cargando NVM..."
  export NVM_DIR="$HOME/.nvm"
  . "$NVM_DIR/nvm.sh"
fi

# 1) Ir a la carpeta del proyecto (raíz donde está este script)
cd "$(dirname "$0")"

# 2) Asegurar rama y upstream
git fetch --all --prune
git checkout production || git checkout -b production origin/production
git branch --set-upstream-to=origin/production production || true

# 3) Si hay cambios locales, guardarlos temporalmente para no bloquear el pull
STASHED=0
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "🧳 Cambios locales detectados. Guardando en stash temporal..."
  git stash push -u -m "deploy-$(date +%F_%H-%M-%S)"
  STASHED=1
fi

# 4) Traer lo último de GitHub manteniendo historial
echo "⬇️  Haciendo pull con rebase..."
git pull --rebase

# 5) Si guardamos un stash, intentamos restaurarlo (normalmente no debería ser necesario en GVM)
if [ "$STASHED" -eq 1 ]; then
  echo "♻️  Intentando restaurar el stash..."
  set +e
  git stash pop
  POP_STATUS=$?
  set -e
  if [ $POP_STATUS -ne 0 ]; then
    echo "⚠️  No se pudo aplicar el stash automáticamente. Revisa conflictos o ejecuta:"
    echo "    git stash list"
  fi
fi

# 6) Backend: instalar y build
echo "📦 Backend: npm ci + build"
cd backend
npm ci
npm run build

# 7) Frontend: instalar y build
echo "📦 Frontend: npm ci + build"
cd ../mi-frontend
npm ci
npm run build

# 8) Reiniciar PM2
cd ..
echo "♻️ Reiniciando PM2..."
pm2 restart ecosystem.config.js || (pm2 start ecosystem.config.js && pm2 save)

echo "✅ Despliegue completado con git pull."
