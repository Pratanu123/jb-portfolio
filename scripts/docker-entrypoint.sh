#!/bin/sh
set -eu

mkdir -p /app/public/uploads
if [ -d /app/public/uploads-seed ]; then
  cp -n /app/public/uploads-seed/.gitkeep /app/public/uploads/.gitkeep 2>/dev/null || true
  for file in /app/public/uploads-seed/*; do
    [ -e "$file" ] || continue
    name=$(basename "$file")
    if [ ! -e "/app/public/uploads/$name" ]; then
      cp "$file" "/app/public/uploads/$name"
    fi
  done
fi

echo "Waiting for Postgres and applying schema…"
i=0
until node ./node_modules/prisma/build/index.js db push --skip-generate --schema=./prisma/schema.prisma; do
  i=$((i + 1))
  if [ "$i" -ge 20 ]; then
    echo "Prisma could not reach the database."
    exit 1
  fi
  sleep 2
done

node prisma/seed.cjs

echo "Starting Next.js on ${HOSTNAME:-0.0.0.0}:${PORT:-3000}"
exec node server.js
