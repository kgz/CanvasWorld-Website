# frontend-tooling Specification

## Purpose
TBD - created by archiving change upgrade-vite. Update Purpose after archive.
## Requirements
### Requirement: Frontend uses current Vite toolchain

`packages/frontend` SHALL depend on Vite 8.x with a compatible `@vitejs/plugin-react` and Vitest 4.x.

#### Scenario: Dev and production build

- **WHEN** `pnpm dev` or `pnpm exec vite build` runs in `packages/frontend`
- **THEN** the command completes without Vite version errors

### Requirement: Optional mkcert HTTPS for local dev

When `VITE_HTTPS_KEY` and `VITE_HTTPS_CERT` point at readable PEM files, Vite dev server SHALL serve HTTPS.

#### Scenario: mkcert env set

- **WHEN** both HTTPS env vars are set to valid mkcert PEM paths
- **THEN** `pnpm dev` starts with TLS enabled on the configured port

