## Why

Archive Perlin Noise (#48) is still missing from Classical Chaos. The old demo colored a particle grid from 2D gradient noise; a dense field needs a non-particle (shader) path so the gallery can show continuous Perlin without a million points.

## What Changes

- New active catalog route `perlin_noise` (category `misc`, title "Perlin Noise")
- Fullscreen GLSL improved Perlin field: scale / octaves / anim speed via Params; hue from noise (+ slow time offset)
- Lab notebook post linking the viz
- Gallery thumb via capture pipeline

## Capabilities

### New Capabilities

- `perlin-noise-field`: misc catalog page rendering an animated 2D Perlin noise field via `Base` shader mode

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/shaders/perlin.vert.glsl` / `perlin.frag.glsl`
- `packages/frontend/src/utils/perlin.ts` (+ unit tests for CPU reference)
- `packages/frontend/src/pages/misc/perlin_noise.tsx`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/frontend/src/blog/posts/perlin-noise.mdx`
- `packages/backend/static/images/perlin_noise.png`
- Issue #48
