## Why

The Hopf fibration S³ → S² is the classic linked-circle sculpture of fiber geometry. CanvasWorld has RP² immersions and minimal surfaces but no Hopf fiber picture yet (#93).

## What Changes

- New active catalog route `hopf_fibration` (category `misc`, title "Hopf Fibration")
- Stereographic projection of Hopf fibers as a particle wire (family of linked circles)
- GUI params: fiber count and stereographic strength
- About copy: Hopf map S³ → S²
- Lab notebook post + gallery thumb

## Capabilities

### New Capabilities

- `hopf-fibration`: misc catalog page rendering stereographic Hopf fibers as a particle wire

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/hopfFibration.ts`
- `packages/frontend/src/pages/misc/hopf_fibration.tsx`
- `packages/frontend/src/__tests__/misc/hopf_fibration.test.ts`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/frontend/src/blog/posts/hopf-fibration.mdx`
- `packages/backend/static/images/hopf_fibration.png`
- Issue #93
