FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install full deps for build (Nest CLI is a devDependency)
RUN npm ci

# Copy source code
COPY . .

# Build
RUN npm run build

# Runtime image
FROM node:20-bookworm-slim

WORKDIR /app

# Docker CLI is required because the backend spawns `docker run`
RUN apt-get update \
  && apt-get install -y --no-install-recommends docker.io ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built output + seed data
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/seed ./seed

# Create necessary directories (mounted in compose in prod)
RUN mkdir -p data tmp

EXPOSE 4000

# Seed DB on first run (no-op if already seeded), then start
CMD ["sh", "-c", "node dist/scripts/seed-once.js && node dist/main.js"]
