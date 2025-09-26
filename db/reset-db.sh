#!/bin/bash

# Script pour réinitialiser la base de données avec schema.sql

echo "🚀 Reset de la base de données..."

docker exec -i moneydb psql -U money -d moneydb < ./db/schema.sql

echo "✅ Base de données réinitialisée avec succès !"
