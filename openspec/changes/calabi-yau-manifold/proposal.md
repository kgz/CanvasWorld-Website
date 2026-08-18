## Why

CanvasWorld has no Calabi–Yau visualization, and `Base` cannot draw a lit surface (points, line trails, fullscreen shaders only). The look people expect is a Hanson Fermat-slice mesh, not a point cloud.

## What Changes

- New active catalog route `calabi_yau` (category `misc`)
- Hanson parametric mesh: solutions of \(z_1^n + z_2^n = 1\) over all \(n \times n\) Riemann patches, projected \(\mathbb{C}^2 \to \mathbb{R}^3\)
- `Base` mesh draw mode with lights (reusable later, e.g. figure knots)
- About copy states this is a 2-real-dimensional slice of the quintic, not the full 6-real CY3
- Gallery thumb via capture pipeline

## Capabilities

### New Capabilities

- `calabi-yau-manifold`: misc catalog page rendering a lit Hanson Calabi–Yau slice mesh, plus the `Base` mesh primitive it needs

### Modified Capabilities

- (none)

## Impact

- `packages/frontend/src/pages/_base.tsx` + `packages/frontend/src/@types/gui.ts`
- `packages/frontend/src/pages/misc/calabi_yau.tsx`
- `packages/frontend/src/utils/calabiYau.ts`
- `packages/frontend/src/@types/routes.tsx`
- `packages/shared/routes.json`
- `packages/backend/static/images/calabi_yau.png`
- Issue #87
