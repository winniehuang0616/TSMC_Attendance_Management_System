#!/bin/bash

# === Load .env ===
set -a
source ../.env
set +a

DB_NAME="$DB_NAME"
MYSQL_USER="$DB_USER"
MYSQL_HOST="$DB_HOST"
MYSQL_PORT="$DB_PORT"

cd "$(dirname "$0")" || exit 1
echo "🚀 Dropping and recreating database: $DB_NAME"

echo "Creating database schema..."
mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p < ../db/schema.sql

if [ $? -ne 0 ]; then
    echo "❌ Failed to execute schema.sql"
    exit 1
fi

echo "Inserting initial seed data into database..."
mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p < ../db/seed.sql

if [ $? -ne 0 ]; then
    echo "❌ Failed to execute seed.sql"
    exit 1
fi

echo "✅ Database $DB_NAME setup complete."

