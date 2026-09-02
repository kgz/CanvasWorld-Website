## Why

`env.example` still documents backend on 9090 while Go, Docker, and Vite proxy default to 8080. Thumbnail scripts and README reference stale port 3002. Screenshot `FRONTEND_URL` omits the `/chaos` basename.

## What Changes

- Align `env.example` with 8080 backend / 5173 frontend
- Default `FRONTEND_URL` and thumb scripts to `http://localhost:5173/chaos`
- Document port matrix in README and env comments
- Set docker-compose `FRONTEND_URL` for screenshot service

## Capabilities

### New Capabilities

- `dev-ports`: Documented local/docker/prod port and env contract

## Impact

- `env.example`, `packages/frontend/.env.example`
- `README.md`, `packages/backend/main.go`
- `packages/frontend/scripts/capture-thumbs.mjs`
- `docker-compose.yml`
