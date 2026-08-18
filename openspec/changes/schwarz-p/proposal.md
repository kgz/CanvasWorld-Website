## Why

Schwarz P is the primitive sibling of the gyroid: another triply periodic minimal surface, meshed as one cubic cell so the gallery can pair labyrinths instead of stacking more algebraic blobs.

## What Changes

- New active catalog route `schwarz_p` (category `misc`, title "Schwarz P")
- Implicit Schwarz P approximation \(\cos x + \cos y + \cos z = t\) meshed with existing `polygoniseGrid`
- One unit cell by default; tile count is a visual param
- Reuse `Base` `drawMode: 'mesh'`
- About copy: Schwarz P / TPMS
- Gallery thumb via capture pipeline (manager)

## Capabilities

### New Capabilities

- `schwarz-p-mesh`: misc catalog page rendering a lit Schwarz P unit cell (optional tiling) via marching cubes

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/schwarzP.ts`
- `packages/frontend/src/pages/misc/schwarz_p.tsx`
- `packages/frontend/src/__tests__/misc/schwarz_p.test.ts`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/backend/static/images/schwarz_p.png` (manager capture)
- Issue #92
