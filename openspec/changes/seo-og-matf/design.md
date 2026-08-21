## Context

Issue #60. Fiber serves bot SSR and a Vite SPA shell behind Traefik `PathPrefix(/chaos)` + strip. Thumbs are already large enough for Discord (post-#8). Host must be `matf.dev/chaos`, not `canvasworld.dev`.

## Goals / Non-Goals

**Goals:** Correct OG unfurl per slug; Google gets SPA (or meta-injected shell) not a loading stub; sitemap of active routes; env-driven base URL.

**Non-Goals:** Per-blog-post SSR from MDX in Go; regenerating thumbs; changing Traefik strip behavior.

## Decisions

1. **`PUBLIC_BASE`** (fallback `PROD_URL`, then `https://matf.dev/chaos`) — no hardcoded dead domain.
2. **`isBot`** — social preview UAs only (Discord, Twitter, Slack, etc.). Drop bare `bot`/`crawler`/`spider` so Googlebot gets the SPA with injected meta.
3. **Prod humans + Google** — read Vite `index.html`, replace `<title>`, inject description/canonical/OG before `</head>`.
4. **Sitemap** — generated in Go from `activeSlugs()` + `/` + `/blog`.
5. **Image URLs** — `{PUBLIC_BASE}/icons/{slug}.png` (same path browsers use under `/chaos/icons/...`).

## Risks

- Injected meta must HTML-escape descriptions.
- If Traefik ever stops stripping, slug helper must still strip `chaos/`.
