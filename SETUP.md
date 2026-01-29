# Setup Guide

## Quick Start

### Prerequisites

- Node.js 20+ and npm (or pnpm/yarn)
- Docker & Docker Compose
- Git (optional, for cloning)

### Development Setup

1. **Install dependencies:**

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Pull Docker images (one-time):**

```bash
docker pull node:20-bookworm-slim
docker pull python:3.12-slim
```

3. **Seed the database:**

```bash
cd backend
npm run seed
```

4. **Start services:**

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

5. **Access the platform:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Offline Setup

### Option 1: Using Setup Script

```bash
# Run setup script (pulls images, installs deps, seeds DB)
./scripts/setup-offline.sh

# Start platform
./scripts/start.sh
```

### Option 2: Manual Offline Installation

If you have a pre-packaged bundle:

1. **Load Docker images:**

```bash
docker load < dist/images.tar
```

2. **Restore database:**

```bash
cp dist/app.db.backup backend/data/app.db
```

3. **Install dependencies** (if node_modules not included):

```bash
cd backend && npm install
cd ../frontend && npm install
```

4. **Start services:**

```bash
# Backend
cd backend && npm run start:dev

# Frontend (new terminal)
cd frontend && npm run dev
```

### Option 3: Docker Compose (Production-like)

```bash
# Build and start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

## Adding Problems

1. Edit `backend/seed/problems.json`
2. Add problem objects with:
   - `slug`, `title`, `difficulty`, `tags`
   - `statementMd` (markdown)
   - `starterJs`, `starterPy` (starter code)
   - `testCases` array (with `isHidden`, `input`, `expectedOutput`)

3. Re-seed:

```bash
cd backend
npm run seed
```

## Troubleshooting

### Backend won't start

- Check if port 4000 is available
- Ensure SQLite database directory exists: `mkdir -p backend/data`
- Check Docker is running: `docker info`

### Code execution fails

- Verify Docker images are pulled: `docker images | grep -E "node|python"`
- Check Docker daemon is running: `docker ps`
- Review backend logs for errors

### Frontend can't connect to backend

- Verify backend is running on http://localhost:4000
- Check CORS settings in `backend/src/main.ts`
- Ensure `NEXT_PUBLIC_API_URL` matches backend URL

### Database issues

- Delete and re-seed: `rm backend/data/app.db && cd backend && npm run seed`
- Check file permissions on `backend/data/`

## Security Notes

- Containers run with `--network none` (no internet)
- Resource limits enforced (CPU, memory, PIDs)
- Read-only root filesystem
- Non-root user inside containers
- Hard timeout of 5 seconds per execution

## Production Deployment

For production:

1. Set `NODE_ENV=production`
2. Build frontend: `cd frontend && npm run build`
3. Use process manager (PM2, systemd) for backend
4. Configure reverse proxy (nginx) if needed
5. Ensure Docker socket permissions are secure
6. Run backend as non-root user
