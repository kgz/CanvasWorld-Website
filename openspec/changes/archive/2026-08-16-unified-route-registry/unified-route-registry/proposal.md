## Why

Attractors are registered twice (FE `routes.tsx` + BE `routes.go`) plus a third thumbs slug list. Drift already happened; adding a viz requires editing multiple places.

## What Changes

- Add shared `packages/shared/routes.json` as the single catalog (slug, title, category, description, thumbnail, renderMode, active)
- Backend loads catalog for API / SSR / screenshot-all (replace hand-written `getRoutes`)
- Frontend builds gallery/router list from catalog + a component map (elements stay in TS)
- Playwright thumbs reads active slugs from the same JSON
- Update Dockerfile so production ships the catalog next to the binary

## Capabilities

### New Capabilities
- `route-registry`: Shared visualization catalog consumed by FE and BE

### Modified Capabilities
- `url-contract`: backend keys come from catalog slugs (same string contract)

## Impact

- Closes #1
- Touches `packages/shared/`, `packages/backend/routes.go` (+ load helpers), FE `routes.tsx` / consumers, `capture-thumbs.mjs`, root `Dockerfile`
