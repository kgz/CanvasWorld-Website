## Why

Boy’s surface is the classic immersion of the real projective plane in R³ with a single triple point. CanvasWorld has algebraic/minimal meshes (Calabi–Yau, gyroid, Barth) but no RP² immersion yet.

## What Changes

- New active catalog route `boy_surface` (category `misc`, title "Boy's Surface")
- Bryant–Kusner (or equivalent) parametrization meshed as a lit triangle mesh
- Reuse `Base` `drawMode: 'mesh'`
- About copy: RP² immersion, not an embedding
- No extra dat.gui knobs (empty options like Barth); bake a canonical pose
- Gallery thumb via capture pipeline (manager)

## Capabilities

### New Capabilities

- `boy-surface`: misc catalog page rendering a lit Boy’s surface mesh

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/boySurface.ts`
- `packages/frontend/src/pages/misc/boy_surface.tsx`
- `packages/frontend/src/__tests__/misc/boy_surface.test.ts`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/backend/static/images/boy_surface.png` (manager)
- Issue #94
