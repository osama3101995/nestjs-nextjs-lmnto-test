#!/bin/sh
set -e

echo "Waiting for database..."
until nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 2
done

echo "Running migrations..."
npx prisma migrate deploy --config=apps/packages/database/prisma.config.ts

echo "Checking if seed needed..."
npx prisma db seed --config=apps/packages/database/prisma.config.ts || true

exec "$@"

