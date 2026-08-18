## Why

Barth’s sextic is the algebraic-geometry sequel to Calabi–Yau: a degree-6 surface with 65 nodes and icosahedral symmetry, meshed from an implicit like the gyroid.

## What Changes

- New active catalog route `barth_sextic` (category `misc`)
- Implicit Barth sextic meshed with existing `polygoniseGrid`
- Reuse `Base` `drawMode: 'mesh'`
- About copy: golden-ratio equation + 65 nodes
- Gallery thumb via capture pipeline

## Capabilities

### New Capabilities

- `barth-sextic`: misc catalog page rendering a lit Barth sextic mesh

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/barthSextic.ts`
- `packages/frontend/src/pages/misc/barth_sextic.tsx`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/backend/static/images/barth_sextic.png`
- Issue #89
