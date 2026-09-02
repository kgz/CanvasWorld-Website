# CanvasWorld Monorepo

A monorepo containing the CanvasWorld mathematical attractors visualization platform.

## Structure

```
├── packages/
│   ├── backend/          # Go API server with Fiber
│   └── frontend/         # React SPA with Vite
├── docker-compose.yml    # Development environment
├── Dockerfile           # Production build
└── env.example          # Environment configuration
```

## Features

- **Hybrid SSR/SPA**: Bot detection for Discord/social media embeds
- **Hot Reload**: Air for Go backend, Vite for frontend
- **Database**: MySQL with GORM ORM
- **Package Manager**: pnpm for frontend dependencies

## Development Setup

1. **Copy environment files** (gitignored — do not commit):
   ```bash
   cp env.example .env
   cp packages/frontend/.env.example packages/frontend/.env
   ```

2. **Optional local HTTPS** (Vite). Generate certs into a gitignored folder:
   ```bash
   mkdir -p packages/frontend/certs
   mkcert -key-file packages/frontend/certs/localhost-key.pem \
     -cert-file packages/frontend/certs/localhost.pem localhost 127.0.0.1
   ```
   Then uncomment `VITE_HTTPS_KEY` / `VITE_HTTPS_CERT` in `packages/frontend/.env`.  
   Never commit `*.pem` files.

3. **Start with Docker Compose**:
   ```bash
   docker-compose up
   ```

   This will start:
   - MySQL database on port 3306
   - Go backend with Air on port 8080
   - React frontend with Vite on port 5173

4. **Or run locally**:

   **Backend** (listens on `8080`):
   ```bash
   cd packages/backend
   go mod download
   air
   ```

   **Frontend** (Vite on `5173`, routes under `/chaos/`):
   ```bash
   cd packages/frontend
   pnpm install
   pnpm dev
   ```

## Ports

| Service | Local / compose | Production |
|---------|-----------------|------------|
| Backend API | `8080` | `8080` |
| Frontend (Vite dev) | `5173` | — (static files from backend) |
| MySQL | `3306` | — |
| Public site | — | `https://matf.dev/chaos` |

Screenshot and thumb scripts expect `FRONTEND_URL=http://localhost:5173/chaos` in local dev. See `env.example`.

## Thumbnails / OG images

Icons live in `packages/backend/static/images/{slug}.png` and are served at `/chaos/icons/{slug}.png`.

Generate (or refresh) them with Playwright while the frontend is running:

```bash
cd packages/frontend
pnpm exec playwright install chromium   # once
FRONTEND_URL=http://localhost:5173/chaos pnpm thumbs
# single slug:
FRONTEND_URL=http://localhost:5173/chaos pnpm thumbs -- --slug clifford_attractor
```

Pages opened with `?screenshot=true` hide chrome and set `window.__CW_READY__` when the canvas is capture-ready. Prefer this offline script over Discord-first generation — bot SSR only references existing files.

Optional on-demand API (requires Chrome for chromedp): `POST /api/screenshot/:slug` / `POST /api/screenshot-all`.

## Production Build

```bash
docker build -t canvasworld .
docker run -p 8080:8080 canvasworld
```

## Bot Detection

The backend automatically detects bot user agents (Discord, Twitter, Facebook, etc.) and serves pre-rendered HTML with proper meta tags for social media embeds. Regular users get the SPA experience.

## API Endpoints

- `GET /api/version` - API version
- `GET /api/routes` - Available attractor routes
- `GET /*` - SPA routes (with bot detection)

## Environment Variables

See `env.example` for all available configuration options.