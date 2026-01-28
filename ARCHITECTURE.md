# Architecture Overview

## System Design

### Components

```
┌─────────────┐         ┌─────────────┐
│   Next.js   │─────────▶│   NestJS    │
│  Frontend   │  HTTP    │   Backend   │
│  (Port 3K)  │◀─────────│  (Port 4K)  │
└─────────────┘         └──────┬───────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   SQLite    │
                        │  Database   │
                        └─────────────┘
                               │
                               ▼
                        ┌─────────────┐
                        │   Docker    │
                        │ Containers  │
                        │ (Execution) │
                        └─────────────┘
```

### Data Flow

1. **Problem List**: Frontend → GET /problems → Backend → SQLite → Return list
2. **Problem Detail**: Frontend → GET /problems/:id → Backend → SQLite → Return detail + samples
3. **Run Code**: Frontend → POST /judge/run → Backend → Docker → Compare outputs → Return results
4. **Submit Code**: Frontend → POST /judge/submit → Backend → Docker → Compare all cases → Store submission → Return verdict

## Backend Architecture

### Modules

- **DbModule**: SQLite connection and schema management
- **ProblemsModule**: Problem CRUD operations
- **JudgeModule**: Orchestrates code execution and verdict determination
- **RunnerModule**: Docker container execution service
- **SubmissionsModule**: Submission persistence

### Execution Flow

```
User Code → RunnerService
    ↓
Write to temp directory
    ↓
Spawn Docker container (hardened)
    ↓
Pipe input via stdin
    ↓
Capture stdout/stderr
    ↓
Enforce timeout (5s hard limit)
    ↓
Compare output (normalized)
    ↓
Return verdict
```

### Docker Security

Each execution runs in an isolated container with:

- `--network none` - No network access
- `--cpus="1.0"` - CPU limit
- `--memory="256m"` - Memory limit
- `--pids-limit=128` - Process limit
- `--read-only` - Read-only rootfs
- `--cap-drop ALL` - No capabilities
- `--user 1000:1000` - Non-root user
- Hard timeout via `docker kill`

## Frontend Architecture

### Pages

- `/` - Problem list page
- `/problems/[id]` - Problem detail + IDE

### Components

- Monaco Editor for code editing
- React Markdown for problem statements
- Real-time run/submit feedback

## Database Schema

### Tables

- `problems` - Problem metadata and statements
- `test_cases` - Input/output pairs (hidden flag)
- `submissions` - Submission records
- `submission_cases` - Per-test-case results

## Offline-First Design

### No External Dependencies

- All data stored locally (SQLite)
- Docker images pre-pulled
- No API calls to external services
- Containers run with `--network none`

### Setup Requirements

1. Pull Docker images once (or load from tar)
2. Install npm dependencies
3. Seed database
4. Start services

After setup, platform works completely offline.

## Security Considerations

### Container Isolation

- Network isolation prevents exfiltration
- Resource limits prevent DoS
- Read-only filesystem prevents tampering
- Process limits prevent fork bombs

### Host Security

- Backend runs as non-root (recommended)
- Docker socket access restricted
- Temp directories cleaned after execution
- Output size limits prevent memory exhaustion

### Code Execution

- Hard timeout enforced at Node.js level
- Docker kill as fallback
- Output normalization for fair comparison
- No user-supplied Docker arguments

## Scalability Notes

Current design is optimized for single-user/local use:

- SQLite is file-based (no network DB)
- Sequential test case execution
- No load balancing needed

For multi-user scenarios, consider:

- PostgreSQL/MySQL instead of SQLite
- Queue system for code execution
- Horizontal scaling with multiple judge workers
- Redis for caching problem statements
