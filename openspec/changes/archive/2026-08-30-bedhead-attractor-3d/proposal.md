## Why

Issue #45: product already has 2D `bedhead_attractor`; the archive workshop is a 3D discrete map (same x/y plus a crafted z). Port that as its own catalog slug so the upgrade does not replace the 2D stage.

## What Changes

- New 3D Bedhead page + tick util (`bedhead_attractor_3d`) from archive map equations/params
- `routes.json` / `routes.tsx` wiring with SEO-ready description
- Featured lab notebook MDX + `blog-posts.json` export
- Gallery thumb for the new slug
- Keep existing 2D Bedhead unchanged

## Capabilities

### New Capabilities

- `bedhead-attractor-3d`: 3D Bedhead discrete map viz + catalog + notebook

### Modified Capabilities

- (none)

## Impact

- Frontend page/utils, routes map, shared catalog, blog MDX, static thumb
- Closes #45; advances #30
