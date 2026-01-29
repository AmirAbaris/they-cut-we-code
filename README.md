# They Cut, We Code

An offline-first LeetCode-like coding platform that works during internet shutdowns.

## Architecture

- **Frontend**: Next.js (App Router) on `http://localhost:3000`
- **Backend**: NestJS REST API on `http://localhost:4000`
- **Database**: SQLite (`./backend/data/app.db`)
- **Execution**: Local Docker containers (no external APIs)

## Quick Start (Offline Setup)

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm (or pnpm/yarn)

### One-Command Setup

```bash
# Pull Docker images (one-time, can be done offline later via docker load)
docker pull node:20-bookworm-slim
docker pull python:3.12-slim

# Start everything
docker compose up -d

# Or run manually:
cd backend && npm install && npm run seed && npm run start:dev
cd frontend && npm install && npm run dev
```

### Offline Installation

If you have a pre-packaged bundle:

```bash
# Load Docker images
docker load < images.tar

# Restore database
cp app.db.backup backend/data/app.db

# Install dependencies (if node_modules.tar provided)
tar -xf node_modules.tar
```

## Development

```bash
# Backend
cd backend
npm install
npm run seed  # Seed problems from JSON
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

## Features

- ✅ Curated coding problems (array, stack, two pointers, binary search, trees)
- ✅ In-browser IDE (Monaco Editor)
- ✅ JavaScript & Python support
- ✅ Run against sample test cases
- ✅ Submit against hidden test cases
- ✅ Secure Docker-based code execution
- ✅ Fully offline after initial setup

## Current Problems

The platform comes with 5 sample problems. Add more by editing `backend/seed/problems.json` and running `npm run seed` in the backend directory.

Sample problems included:

- Group Anagrams (Array)
- Two Sum (Array)
- Valid Parentheses (Stack)
- Binary Search (Binary Search)
- Invert Binary Tree (Trees)

## Security

- Containers run with `--network none`
- Resource limits (CPU, memory, PIDs)
- Read-only root filesystem
- No external API calls
- Hard timeouts enforced

## License

MIT
