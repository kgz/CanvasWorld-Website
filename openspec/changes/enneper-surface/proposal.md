## Why

CanvasWorld has gyroid as a TPMS mesh but no classical Enneper minimal surface. Enneper’s polynomial parametrization is a distinct self-intersecting saddle that belongs in `misc` as a lit mesh.

## What Changes

- New active catalog route `enneper_surface` (category `misc`, title "Enneper Surface")
- UV-grid mesh from the classical polynomial Enneper parametrization
- Reuse `Base` `drawMode: 'mesh'`
- About copy: Enneper’s minimal surface
- Optional GUI `span` for the |u|,|v| domain; UV resolution baked

## Capabilities

### New Capabilities

- `enneper-surface`: misc catalog page rendering a lit Enneper polynomial mesh

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/enneperSurface.ts`
- `packages/frontend/src/pages/misc/enneper_surface.tsx`
- `packages/frontend/src/__tests__/misc/enneper_surface.test.ts`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- Issue #97
