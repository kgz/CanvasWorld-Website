## Why

Frontend `package.json` pins Vite 3 while Vitest 3/4 and `@vitejs/plugin-react` 4+ expect modern Vite. Plugin friction and outdated tooling block dependency updates (#12).

## What Changes

- Bump Vite to current major (8.x), `@vitejs/plugin-react` 6.x, Vitest 4.x
- Wire optional local HTTPS from `VITE_HTTPS_KEY` / `VITE_HTTPS_CERT` (mkcert) in `vite.config.ts`
- Adjust config if Vite 8 requires migration (esbuild target, plugin hooks)
- Verify `pnpm dev`, `pnpm build`, tests, and production Dockerfile

## Capabilities

### New Capabilities

- `frontend-tooling`: Vite/Vitest major versions and dev HTTPS contract

### Modified Capabilities

## Impact

- `packages/frontend/package.json`, `pnpm-lock.yaml`
- `packages/frontend/vite.config.ts`, `vitest.config.ts`
- Root `Dockerfile` (frontend build stage)
