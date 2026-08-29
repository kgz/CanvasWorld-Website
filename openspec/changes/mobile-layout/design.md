## Context

OD run on `design/canvasworld-prototype/` (prompt `od-mobile-prompt.md`): phone 390 / tablet 768. Production React still uses desktop-only nowrap topbar.

## Goals / Non-Goals

**Goals:**
- Params panel: close and reopen on ~390px; toggle never covered by the drawer
- No overlapping or clipped chrome (topbar, FPS, transport)
- Home/blog/post: hamburger nav, usable grids
- Safe-area + `100dvh`

**Non-Goals:**
- Desktop visual redesign
- WebGL/math changes
- Thumbs

## Decisions

- Match OD breakpoints: canvas ≤900px, site nav ≤720px
- Panel **closed by default** at ≤900px; in-panel close + scrim + topbar toggle
- Icon-only chrome buttons with `aria-label` (Gallery keeps an icon)
- Shared `SiteNav` for home / blog / post (OD `js/site-nav.js`)
- CSS tokens `--safe-*` and `--touch-min: 44px`

## Risks / Trade-offs

- Closing the panel when crossing 900px may surprise a tablet user rotating — same as OD; acceptable
