## Why

Issue #43 ports the archive 3D Peter de Jong attractor. It is a distinct discrete map from the 2D de Jong (#36 / `peter_de_jong_attractor`): six knobs and a z-update, not the four-parameter planar map.

## What Changes

- Add active catalog slug `peter_de_jong_attractor_3d` with 3D trail page (Lorenz/Aizawa-style scrub + auto-rotate)
- Iterate util matching archive equations; About math aligned
- Lab notebook MDX + `blog-posts.json` export
- Gallery thumbnail PNG

## Capabilities

### New Capabilities

- `peter-de-jong-3d`: 3D Peter de Jong discrete map viz, catalog route, notebook entry, gallery thumb

### Modified Capabilities

- (none)

## Impact

- `packages/frontend` page, util, routes wiring, blog
- `packages/shared/routes.json`, `blog-posts.json`
- `packages/backend/static/images/peter_de_jong_attractor_3d.png`
