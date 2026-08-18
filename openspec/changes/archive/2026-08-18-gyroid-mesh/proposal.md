## Why

Gyroid is the next lit-mesh viz after Calabi–Yau: a Schoen triply periodic minimal surface that fills a gallery card as a coral/foam cell rather than another folded algebraic blob.

## What Changes

- New active catalog route `gyroid` (category `misc`)
- Implicit Schoen gyroid \(\sin x\cos y + \sin y\cos z + \sin z\cos x = t\) meshed with marching cubes
- One unit cell by default; tile count is a param
- Reuse `Base` `drawMode: 'mesh'`
- About copy: Schoen gyroid / TPMS
- Gallery thumb via capture pipeline

## Capabilities

### New Capabilities

- `gyroid-mesh`: misc catalog page rendering a lit gyroid unit cell (optional tiling) via marching cubes

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/marchingCubes.ts`
- `packages/frontend/src/utils/gyroid.ts`
- `packages/frontend/src/pages/misc/gyroid.tsx`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/backend/static/images/gyroid.png`
- Issue #91
