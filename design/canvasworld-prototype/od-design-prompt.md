# CanvasWorld — foundation prototype

Build a cohesive static HTML/CSS prototype hub for **CanvasWorld**: a mathematical attractors / maps / fractals visualization platform. Production stack is React + Three.js / GLSL (Vite) with a Go Fiber API for SSR embeds and screenshots. This OD project is the **visual source of truth** before ports.

## Product context

- Gallery of interactive visualizations (attractors, maps, fractals)
- Each viz page: WebGL canvas + parameter controls (leva/dat-gui style)
- Social embeds via bot SSR (Open Graph meta + screenshots)
- Monorepo: `packages/frontend`, `packages/backend`

## Design direction

- **Scientific, atmospheric** — ink/void canvas energy without generic purple-glow SaaS chrome
- Brand-first: “CanvasWorld” must read as the hero signal on the hub
- Desktop-first (~1280–1440), usable on tablet
- Shared tokens in `css/shared.css`; add `data-od-id` on major regions

## Files to create / extend

### Hub
- Keep `index.html` as the screen index; link every new prototype page with short meta

### Early screens (add as needed)
1. `home.html` — brand hero + gallery grid of visualizations
2. Per-viz chrome shells when porting specific attractors (canvas stage + control panel layout)

## Out of scope

- Real WebGL / shader logic (placeholder stage is fine)
- Auth, payments, admin
