## Why

Costa–Hoffman–Meeks is the classic genus-1 complete embedded minimal surface (three ends). CanvasWorld has Enneper / TPMS wires but no Costa mesh yet; #96 asks for a lit truncated mesh under `misc`.

## What Changes

- New active catalog route `costa_surface` (category `misc`, title "Costa Surface")
- Truncated UV mesh from the Costa Weierstrass–ζ/℘ parametrization on the square torus
- Reuse `Base` `drawMode: 'mesh'` (lights + OrbitControls + transport `n`)
- About copy: genus-1 complete minimal surface, three ends
- Gallery thumb + lab notebook post

## Capabilities

### New Capabilities

- `costa-surface`: misc catalog page rendering a lit truncated Costa mesh

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/costaSurface.ts`
- `packages/frontend/src/pages/misc/costa_surface.tsx`
- `packages/frontend/src/__tests__/misc/costa_surface.test.ts`
- `packages/shared/routes.json`, `packages/frontend/src/@types/routes.tsx`
- `packages/frontend/src/blog/posts/costa-surface.mdx`
- `packages/backend/static/images/costa_surface.png`
