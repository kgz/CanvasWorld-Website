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

   **Backend**:
   ```bash
   cd packages/backend
   go mod download
   air
   ```

   **Frontend**:
   ```bash
   cd packages/frontend
   pnpm install
   pnpm dev
   ```

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