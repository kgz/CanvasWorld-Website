## Context

Issue #3. Dual registries already drift; this change does **not** unify them (#1) — it only makes current keys/URLs agree so screenshots and icons work.

## Goals / Non-Goals

**Goals:**
- One slug per viz matching FE `genPath`
- One page URL shape: `/{slug}`
- One icon URL shape: `/chaos/icons/{slug}.png`
- Screenshot navigates the real SPA route with `?screenshot=true`

**Non-Goals:**
- Full screenshot pipeline rewrite (CSS hide / Playwright / CI) → #8
- Unified JSON registry → #1
- ASCII-only unicode slug rename → #16
- Removing unused Brusselator from BE (leave unless it confuses keys)

## Decisions

1. **Canonical slug source (interim):** FE `genPath(name)` — lowercase, spaces → `_`, keep hyphens (e.g. `gumowski-mira_attractor`).
2. **Icon mount stays `/chaos/icons`** — already used by home cards; SSR switches to this (not `/static/images`).
3. **Screenshot URL drops `/chaos/` prefix** — SPA has no such prefix.
4. **Rename PNG** `mandlebrot_set.png` → `mandelbrot_set.png` to match corrected slug (no redirect for typo; rare cached OG).

## Risks / Trade-offs

- Existing Discord embeds caching `mandlebrot_set` may 404 until recrawl — acceptable.
- Unicode `sierpiński_triangle` remains until #16; add BE key + no PNG yet is fine.

## Migration Plan

- Update BE keys + screenshot URL + SSR paths
- Rename PNG on disk
- Document contract in `openspec/specs/url-contract/spec.md` (via archive later)

## Open Questions

None for this change.
