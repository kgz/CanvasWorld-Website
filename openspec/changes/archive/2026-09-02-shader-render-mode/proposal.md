## Why

Shader visualizations (Mandelbrot, Julia, Sierpiński, Perlin) already declare `renderMode: "shader"` in the catalog, but the canvas shell still probes page components for `isShaderViz` and `usesTransportBar` statics. That couples chrome behavior to Base internals and makes every new shader page a template hack.

## What Changes

- Type catalog `renderMode` as `webgl` | `shader` and pass optional chrome metadata (`usesTransportBar`, `progressLabel`) from `routes.json` into `TRoute`.
- Drive transport-bar visibility from route metadata instead of component static reflection.
- Remove `isShaderViz` / `usesTransportBar` statics from shader pages.
- Add a small `vizCatalog` helper module and shared `findVizCanvas` for shader HUD overlays.
- Document the shader page contract (Base + `ERenderMode.SHADER`, optional overlay HUD).

## Capabilities

### New Capabilities

- `shader-render-mode`: Catalog-driven render mode and chrome rules for shader vs particle viz pages.

### Modified Capabilities

- `viz-chrome`: Transport bar enablement SHALL follow catalog metadata, not component static flags.

## Impact

- `packages/shared/routes.json`
- `packages/frontend/src/@types/routes.tsx`
- `packages/frontend/src/pages/template-modern.tsx`
- Shader pages: `complexQuadraticSet.tsx`, `sierpinski_triangle.tsx`, `perlin_noise.tsx`
- New: `packages/frontend/src/modules/vizCatalog.ts`, `packages/frontend/src/modules/vizCanvas.ts`
