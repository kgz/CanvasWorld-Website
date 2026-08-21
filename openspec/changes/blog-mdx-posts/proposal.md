## Why

Lab notebook index (#107) lists placeholder notes. Open Design already has article chrome and mini-player embeds. #86 needs real post pages, authorable content, and live viz embeds that match that design.

## What Changes

- MDX (or equivalent) posts under the frontend, routed at `/blog/:slug`
- Article layout ported from OD `posts/*.html` (doc shell, back link, footer nav)
- `VizEmbed` for inline live viz (iframe/`?iframe` shell first) with offscreen pause + link to full page
- Wire notebook index cards to real post slugs
- Sample posts from OD copy (at least Lorenz + one multi-embed / Hopalong family)

## Capabilities

### New Capabilities
- `blog-posts`: Authorable notebook posts with routes and index linkage
- `viz-embed`: Inline embed chrome with pause/visibility budget and full-page link

### Modified Capabilities
- `lab-notebook-index`: Index cards SHALL link to real `/blog/:slug` posts when published

## Impact

- `packages/frontend` (Vite MDX, routes, blog modules, CSS)
- Depends on notebook index from #107
- Design source: `design/canvasworld-prototype/posts/`, `js/mini-players.js`
