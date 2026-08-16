## Why

Port the classic 3D Lorenz attractor from CanvasWorld_archive (#39) into the modern canvas chrome, preserving the soft blue-on-black look from the archive sample.

## What Changes

- New active catalog route `lorenz_attractor` (3D particle trail)
- Correct Lorenz ODEs (σ, ρ, β) with Euler integration; plot integrated state (not archive derivative bug)
- Soft blue color treatment matching archive sample (`#729ee5` family)
- About copy with standard equations; params a/b/c = σ/ρ/β
- Gallery thumb via capture pipeline

## Capabilities

### New Capabilities

- `lorenz-attractor`: 3D Lorenz strange attractor viz with OD chrome, transport, and catalog entry

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/pages/attractors/lorenz_attractor.tsx` (+ util if needed)
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/backend/static/images/lorenz_attractor.png`
- Issue #39
