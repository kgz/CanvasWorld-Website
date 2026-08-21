## Why

Discord/Google never get correct per-viz OG or catalog-backed meta (#60). Prod is live on `matf.dev/chaos`; bot SSR and the SPA shell still disagree on host, slug lookup, and indexable HTML.

## What Changes

- Canonical public base URL via env (`PUBLIC_BASE`, default `https://matf.dev/chaos`) for `og:*`, Twitter, and `rel=canonical`
- Catalog slug resolution that strips an optional `/chaos` prefix (works with or without Traefik strip)
- Narrow social-bot detection so Google is not trapped on a “Loading…” stub
- Bot HTML: real title/description/image content (no redirect loop)
- Production SPA responses inject route-specific title/description/OG into Vite `index.html`
- `robots.txt` Sitemap line + dynamic `/sitemap.xml` for home, blog index, and active catalog slugs

## Capabilities

### New Capabilities

- `seo-public-meta`: Public canonical URL, bot SSR, sitemap/robots, and per-route meta for Classical Chaos on matf.dev/chaos

### Modified Capabilities

- (none)

## Impact

- `packages/backend` (`main.go`, `ssr.go`, new helpers)
- `packages/frontend/public/robots.txt`
- `packages/backend/templates/index.html` (dev OG host)
- `env.example`
- Closes #60
