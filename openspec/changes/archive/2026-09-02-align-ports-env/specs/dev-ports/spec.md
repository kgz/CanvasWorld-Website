## ADDED Requirements

### Requirement: Port defaults are consistent across Go, compose, and env examples

Backend `PORT` SHALL default to `8080` in code and all example env files. Frontend dev SHALL use Vite on `5173`.

#### Scenario: Local env copy

- **WHEN** a developer copies `env.example` to `.env` and runs `air` + `pnpm dev`
- **THEN** the backend listens on 8080 and the Vite proxy reaches it without edits

### Requirement: Screenshot and thumb URLs use the live dev basename

`FRONTEND_URL` examples and script defaults SHALL include `/chaos` so capture URLs resolve to `/{basename}/{slug}?screenshot=true`.

#### Scenario: Thumb capture default

- **WHEN** `pnpm thumbs` runs without `FRONTEND_URL` set
- **THEN** Playwright opens `http://localhost:5173/chaos/{slug}?screenshot=true`
