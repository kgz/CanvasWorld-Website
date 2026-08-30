## Why

Classic cubic surface (all 27 lines real) that sits next to Barth / Calabi–Yau as a lit algebraic mesh. Catalog still lacks `clebsch_cubic`.

## What Changes

- New active catalog route `clebsch_cubic` (category `misc`, title "Clebsch Cubic")
- Hunt/Nordstrand affine cubic meshed with existing `polygoniseGrid`
- Reuse `Base` `drawMode: 'mesh'`
- About copy: diagonal cubic, 27 real lines, Eckardt points
- Lab notebook post + gallery thumb via capture pipeline

## Capabilities

### New Capabilities

- `clebsch-cubic`: misc catalog page rendering a lit Clebsch diagonal cubic mesh

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/utils/clebschCubic.ts`
- `packages/frontend/src/pages/misc/clebsch_cubic.tsx`
- `packages/frontend/src/__tests__/misc/clebsch_cubic.test.ts`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/frontend/src/blog/posts/clebsch-cubic.mdx`
- `packages/shared/blog-posts.json` (export)
- `packages/backend/static/images/clebsch_cubic.png`
- Issue #90
