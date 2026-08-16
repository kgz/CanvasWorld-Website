## Why

Classic Hopalong (`/hopalong_attractor`) draws correctly but sits as a tiny speck at early/mid particle counts because it uses `scale: 1` and the default particle camera (`z=400`), while sibling Hopalong pages set explicit `scale` + `cameraPosition`.

## What Changes

- Tune classic Hopalong `scale` and `cameraPosition` so the attractor fills the stage like siblings at mid `n`
- Verify mid and full particle counts remain readable (orbit zoom still available)

## Capabilities

### New Capabilities

- `hopalong-classic-framing`: Classic Hopalong default framing is stage-readable without orbit hunting

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/pages/attractors/hopalong_attractor.tsx`
- Issue #69
