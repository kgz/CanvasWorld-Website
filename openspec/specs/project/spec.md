# Project

## Purpose
CanvasWorld is a mathematical attractors and maps visualization platform — React/WebGL frontend with a Go API for SSR embeds, routes, and screenshots.

## Requirements

### Requirement: Monorepo structure
The system SHALL be organized as a pnpm monorepo with `packages/backend` (Go Fiber API) and `packages/frontend` (React/Vite SPA).

#### Scenario: Development uses split servers
- **WHEN** developers run locally
- **THEN** the Go backend (Air) serves API/SSR and Vite serves the SPA with HMR

#### Scenario: Production serves SPA from backend
- **WHEN** the backend runs in production
- **THEN** it serves the built frontend static assets and API routes

### Requirement: Bot-aware SSR
The backend SHALL detect social/bot user agents and serve pre-rendered HTML with meta tags for embeds; regular browsers receive the SPA.

#### Scenario: Discord embed
- **WHEN** a bot requests an attractor route
- **THEN** the response includes Open Graph / meta tags for that visualization

### Requirement: Open Design prototypes in-repo
Visual prototypes SHALL live under `design/canvasworld-prototype/` as an Open Design imported-folder project, driven via `./bin/od-import-project.sh` and `./bin/od-design-run.sh`.

#### Scenario: Design run writes into the repo
- **WHEN** an OD design run completes for CanvasWorld
- **THEN** HTML/CSS artifacts are updated under `design/canvasworld-prototype/` on disk
