## Why

CanvasWorld has no Dini’s surface (pseudospherical helicoid). It is the classic twisted-pseudosphere mesh: radius and pitch as shape, not meshing, so it belongs next to Barth/Calabi–Yau under `misc`.

## What Changes

- New active catalog route `dini_surface` (category `misc`, title "Dini's Surface")
- Classic parametric UV mesh (not isosurface)
- GUI shape params `a` (radius) and `b` (twist); UV resolution baked
- About copy: Dini’s surface / pseudosphere
- Reuse `Base` `drawMode: 'mesh'`
- Gallery thumb via capture pipeline

## Capabilities

### New Capabilities

- `dini-surface`: misc catalog page rendering a lit Dini’s surface mesh

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/diniSurface.ts`
- `packages/frontend/src/pages/misc/dini_surface.tsx`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/backend/static/images/dini_surface.png`
- Issue #98
