## Why

Only Bedhead (and Gingerbread) keep iterate math in `utils/` with Vitest coverage. Clifford, Hopalong variants, and Hénon inline formulas in page files — hard to test and duplicate across the Hopalong family.

## What Changes

- Extract pure tick functions for Clifford, four Hopalong variants, and Hénon map under `packages/frontend/src/utils/`
- Add Vitest tests matching the Bedhead/Gingerbread pattern
- Wire `createAttractorPage` pages to call utils (thin `iterate` wrappers only)

## Capabilities

### New Capabilities

- `attractor-math-cores`: Shared iterate/step functions and unit tests for 2D attractors/maps

### Modified Capabilities

## Impact

- `packages/frontend/src/utils/` (new modules)
- `packages/frontend/src/pages/attractors/clifford_attractor.tsx`
- `packages/frontend/src/pages/attractors/hopalong_attractor*.tsx` (4 files)
- `packages/frontend/src/pages/maps/henon_map.tsx`
- `packages/frontend/src/__tests__/`
