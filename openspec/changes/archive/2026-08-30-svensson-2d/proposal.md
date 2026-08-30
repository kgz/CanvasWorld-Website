## Why

Port the archive 2D Svensson attractor (#37) under epic #30 so the catalog gains another classic sine–cosine map with SEO, notebook, and gallery thumb.

## What Changes

- 2D Svensson page (`svensson_attractor`) via `createAttractorPage` from archive equations/params
- Active `routes.json` + `routes.tsx` wiring
- Lab notebook MDX + `blog-posts.json` export
- Gallery thumb for the slug

## Capabilities

### New Capabilities

- `svensson-2d`: 2D Svensson iterated map viz + catalog + notebook

### Modified Capabilities

- (none)

## Impact

- Frontend attractor page, routes map, shared catalog, blog MDX, static thumb
- Closes #37; advances #30
