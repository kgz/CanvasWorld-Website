## Why

Steiner’s Roman surface is the classic RP² immersion next to Barth/Calabi in the misc mesh set. Issue #95 adds it as a lit parametric mesh with no extra GUI knobs.

## What Changes

- New active catalog route `roman_surface` (category `misc`, title "Roman Surface")
- Steiner parametrization meshed as a UV grid (`drawMode: 'mesh'`)
- About copy: Steiner Roman surface / RP²
- Empty dat.gui like Barth (canonical pose; no param named `n`)

## Capabilities

### New Capabilities

- `roman-surface`: misc catalog page rendering a lit Steiner Roman surface mesh

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/romanSurface.ts`
- `packages/frontend/src/pages/misc/roman_surface.tsx`
- `packages/frontend/src/__tests__/misc/roman_surface.test.ts`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- Issue #95
