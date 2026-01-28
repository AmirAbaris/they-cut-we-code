#!/bin/bash
set -e

echo "=== Loading Docker Images ==="

if [ ! -f "dist/images.tar" ]; then
  echo "Error: dist/images.tar not found"
  echo "Run scripts/setup-offline.sh first"
  exit 1
fi

echo "Loading Docker images from dist/images.tar..."
docker load < dist/images.tar
echo "✓ Docker images loaded successfully"
