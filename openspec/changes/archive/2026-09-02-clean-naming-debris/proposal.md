## Why

Leftover filenames and dead code make the frontend harder to navigate: `ikeda Map.tsx` has a space, routes registry exports unused stubs, and `_base.tsx` still carries unreachable test-shader debug.

## What Changes

- Rename `ikeda Map.tsx` → `ikeda_map.tsx`
- Drop dead `routesV1` / `BaseRoute` exports and stale `dummy_data.ts` tsconfig include
- Remove unreachable `TestShaderPlane` test path from `_base.tsx`
- Trim stale global declarations in `vite-env.d.ts` and unused `t.d.ts` (SCSS)

## Capabilities

### New Capabilities

- `frontend-hygiene`: source filenames and registries contain no known copy/backup/space debris

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/pages/maps/ikeda_map.tsx`
- `packages/frontend/src/@types/routes.tsx`
- `packages/frontend/src/pages/_base.tsx`
- `packages/frontend/tsconfig.json`, `vite-env.d.ts`, `t.d.ts`
- Closes #7
