#!/bin/bash

# === Load .env ===
set -a
source ../.env
set +a

DB_NAME="$DB_NAME"
MYSQL_USER="$DB_USER"
MYSQL_HOST="$DB_HOST"
MYSQL_PORT="$DB_PORT"

echo "HOST: $DB_HOST"
echo "USER: $DB_USER"
echo "PASSWORD: $DB_PASSWORD"

cd "$(dirname "$0")" || exit 1
echo "🚀 Dropping and recreating database: $DB_NAME"

echo "Creating database schema..."
mysql --protocol=TCP -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$DB_NAME"< ../db/schema.sql

if [ $? -ne 0 ]; then
    echo "❌ Failed to execute schema.sql"
    exit 1
fi

echo "Inserting initial seed data into database..."
mysql --protocol=TCP -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$DB_NAME"< ../db/seed.sql

if [ $? -ne 0 ]; then
    echo "❌ Failed to execute seed.sql"
    exit 1
fi

echo "✅ Database $DB_NAME setup complete."

