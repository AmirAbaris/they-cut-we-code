#!/bin/bash
set -e

echo "=== Offline Setup Script ==="
echo "This script prepares the platform for offline use."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Pull Docker images
echo -e "${YELLOW}Pulling Docker images...${NC}"
docker pull node:20-bookworm-slim
docker pull python:3.12-slim
echo -e "${GREEN}✓ Docker images pulled${NC}"

# Save Docker images to tar
echo -e "${YELLOW}Saving Docker images to tar...${NC}"
mkdir -p dist
docker save node:20-bookworm-slim python:3.12-slim -o dist/images.tar
echo -e "${GREEN}✓ Docker images saved to dist/images.tar${NC}"

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
cd backend
npm install
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Seed database
echo -e "${YELLOW}Seeding database...${NC}"
cd backend
npm run seed
cd ..
echo -e "${GREEN}✓ Database seeded${NC}"

# Backup database
echo -e "${YELLOW}Creating database backup...${NC}"
mkdir -p dist
cp backend/data/app.db dist/app.db.backup 2>/dev/null || echo "Database will be created on first run"
echo -e "${GREEN}✓ Setup complete!${NC}"

echo ""
echo "To use offline:"
echo "1. Copy the entire project directory"
echo "2. Load Docker images: docker load < dist/images.tar"
echo "3. Restore database: cp dist/app.db.backup backend/data/app.db"
echo "4. Start backend: cd backend && npm run start:dev"
echo "5. Start frontend: cd frontend && npm run dev"
