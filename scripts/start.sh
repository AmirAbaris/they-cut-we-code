#!/bin/bash
set -e

echo "=== Starting Offline Judge Platform ==="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running"
  exit 1
fi

# Check if images are available
if ! docker image inspect node:20-bookworm-slim > /dev/null 2>&1; then
  echo "Warning: node:20-bookworm-slim not found. Attempting to pull..."
  docker pull node:20-bookworm-slim || {
    echo "Error: Failed to pull node:20-bookworm-slim"
    echo "If offline, run: docker load < dist/images.tar"
    exit 1
  }
fi

if ! docker image inspect python:3.12-slim > /dev/null 2>&1; then
  echo "Warning: python:3.12-slim not found. Attempting to pull..."
  docker pull python:3.12-slim || {
    echo "Error: Failed to pull python:3.12-slim"
    echo "If offline, run: docker load < dist/images.tar"
    exit 1
  }
fi

# Start backend
echo "Starting backend..."
cd backend
if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
fi

if [ ! -f "data/app.db" ]; then
  echo "Seeding database..."
  npm run seed
fi

npm run start:dev &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 5

# Start frontend
echo "Starting frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✓ Platform started!"
echo "  Backend: http://localhost:4000"
echo "  Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
