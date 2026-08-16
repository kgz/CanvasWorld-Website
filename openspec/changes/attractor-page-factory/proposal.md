## Why

Particle attractor/map pages duplicate ~130 lines of Redux datData wiring, animation tick scaffolding, and yellow-trail coloring. Only math, params, scale, seed, color, and description differ. Factory collapses that shell so new vizs are config, not copy-paste.

## What Changes

- Add `createAttractorPage` factory for 2D particle attractors/maps
- Migrate Clifford, Henon, and the Hopalong family onto the factory
- Leave Mandelbrot (shader) as the escape hatch — unchanged

## Capabilities

### New Capabilities
- `attractor-page`: Config-driven particle visualization page shell

### Modified Capabilities
- (none)

## Impact

- Closes #2
- Frontend pages under `packages/frontend/src/pages/attractors/` and `maps/henon_map.tsx`
- Routes/component map paths unchanged (same default exports)
