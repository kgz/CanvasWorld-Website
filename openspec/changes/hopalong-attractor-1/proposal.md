## Why

Archive “Hopalong Attractor 1” is a distinct accidental-`sin`-for-`sign` map, not a duplicate of classic Hopalong or the sinusoidal cousin. Ticket #35 ports it as its own catalog slug without touching existing Hopalong cards.

## What Changes

- New active attractor route `hopalong_attractor_1` via `createAttractorPage`
- Iterate uses archive README math: `sin(x−1)` (not `sign`) and `|b x − 1 − c|`
- Catalog entry, React route map, gallery thumb
- Lab notebook: extend hopalong family post (fifth card) rather than a separate post

## Capabilities

### New Capabilities

- `hopalong-attractor-1`: 2D Hopalong-1 attractor page (archive sin typo variant)

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/pages/attractors/hopalong_attractor_1.tsx`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/frontend/src/blog/posts/hopalong-family.mdx`
- `packages/backend/static/images/hopalong_attractor_1.png`
- Issue #35
