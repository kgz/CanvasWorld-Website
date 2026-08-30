## Why

Issue #173: viz pages are canvas-only. Crawlers and social cards miss a real `<img>`, full OG on the SPA, and student-facing headings. Gallery thumbs already exist — reuse them.

## What Changes

- Per-viz Helmet: full OG + Twitter using catalog title, description, `/icons/{slug}.png`
- Visually hidden `<img>` + category H2 + catalog description on viz pages (and `<noscript>`)
- Strip `_base` Helmet so pathname stubs do not overwrite chrome meta
- `VizEmbed` static poster thumb + noscript link
- Gallery / featured-note `alt` from title + first description clause
- Bot SSR img `alt` includes description, not title only

## Capabilities

### New Capabilities

- `seo-image-fallbacks`: static thumb + OG + no-JS copy on viz, embeds, and gallery

### Modified Capabilities

- (none)

## Impact

- Frontend chrome, VizEmbed, gallery/blog cards, `_base` Helmet
- Backend `seoContentHTML` alt text
- Closes #173
