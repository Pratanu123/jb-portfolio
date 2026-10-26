#!/usr/bin/env bash
# Deploy / refresh the portfolio stack on this server.
# Intended path: /opt/jb-portfolio
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/jb-portfolio}"
COMPOSE_FILES=(-f docker-compose.yml -f docker-compose.prod.yml)
BRANCH="${DEPLOY_BRANCH:-main}"

cd "$APP_DIR"

echo "==> Deploying jb-portfolio from $(pwd) (branch: $BRANCH)"

if [ ! -f .env ]; then
  echo "Missing $APP_DIR/.env — copy from .env.example and configure production values first."
  exit 1
fi

if [ "${SKIP_GIT:-0}" != "1" ]; then
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
else
  echo "==> SKIP_GIT=1 — leaving working tree unchanged"
fi

echo "==> Building and starting portfolio (no Caddy; Nginx is the edge)"
docker compose "${COMPOSE_FILES[@]}" up -d --build --remove-orphans

echo "==> Waiting for app"
for i in $(seq 1 60); do
  if docker compose "${COMPOSE_FILES[@]}" exec -T app \
    node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" \
    >/dev/null 2>&1; then
    break
  fi
  sleep 2
done

echo "==> Deploy finished"
docker compose "${COMPOSE_FILES[@]}" ps
