## Why

Port the archive 2D Hilbert Curve (#34) under epic #30 so Classical Chaos ships the classic space-filling curve as an active fractal catalog entry with notebook and thumb.

## What Changes

- `hilbert_curve` fractal page: Hilbert index→(x,y) particle trail (archive `hindex2xy`)
- `routes.json` + `routes.tsx` wiring, `active: true`
- Unit tests for the pure math util
- Lab notebook MDX + `blog-posts.json` export
- Gallery thumb PNG for the slug

## Capabilities

### New Capabilities

- `hilbert-curve`: 2D Hilbert space-filling curve viz + catalog + notebook

### Modified Capabilities

- (none)

## Impact

- Frontend page/utils/tests, routes map, shared catalog, blog MDX, static thumb
- Closes #34; advances #30
