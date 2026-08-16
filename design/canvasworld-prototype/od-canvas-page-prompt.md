# Open Design brief — CanvasWorld visualization (canvas) page

## Goal
Design the **live visualization / canvas page** chrome for CanvasWorld — the screen after you open a system (e.g. Lorenz, Clifford, Brusselator). Output `canvas.html` (+ CSS) in this project. Update `index.html` hub to link it. **Match the visual language of `home.html`** (tokens in `css/shared.css`).

## Product context
- Current React chrome: `packages/frontend/src/pages/template-modern.tsx` — top nav, left sidebar (params / about / explore), full-bleed WebGL stage, bottom transport (play / speed / progress)
- Routes live under `/chaos/{slug}`; embed mode `?iframe` may hide chrome later
- Brand: scientific / atmospheric (ink–void), accent teal from home — not purple SaaS glow

## Composition (desktop ~1280–1440)
One job: **watch and tune a living system**.

### Stage (dominant)
- Full-bleed or near-full-bleed canvas plane (placeholder abstract field OK — no real WebGL required)
- Visualization title as a clear but secondary signal to the stage (not louder than the canvas)
- No card grid on this page; no floating promo badges on the canvas

### Chrome (supporting)
- Sticky/top bar: wordmark → home, current viz title, minimal links
- Side panel (collapsible): parameter controls (sliders), short About/math blurb, optional “Explore” list of other systems
- Bottom transport: play/pause/replay, speed, progress scrub + `n = drawn / total` — one quiet bar, not a dashboard of widgets

### States to show (can be one HTML with notes, or subtle variants)
- Default: panel open, animation playing
- Optional note for collapsed panel / iframe-minimal chrome

## Motion
2–3 intentional motions: panel open/close, transport hover, soft stage ambient — presence not noise. Respect reduced-motion.

## Constraints
- Reuse / extend `css/shared.css` tokens from home
- Static HTML/CSS/JS only
- Desktop-first; usable on tablet/mobile (panel may stack or drawer)
- Avoid: purple glow, cream+terracotta, broadsheet, emoji, pill-cluster clutter, multi-layer card chrome

## Out of scope
- Real Three.js/WebGL, auth, CMS, blog iframe host page (separate)
- Redesigning the homepage (`home.html` already exists)

## Acceptance
- [ ] `canvas.html` lands in `design/canvasworld-prototype/`
- [ ] Hub links to it
- [ ] Reads as same family as home; canvas stage is the hero of the page
- [ ] Ready for a later React port of `template-modern`
