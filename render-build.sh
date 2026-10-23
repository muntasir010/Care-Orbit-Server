#!/usr/bin/env bash
set -o errexit

# Install dependencies required for TypeScript compilation
npm install --include=dev

# Compile TypeScript
npm run build

# Generate Prisma Client
npx prisma generate --schema=./prisma/schema

# Apply database migrations
npx prisma migrate deploy --schema=./prisma/schema