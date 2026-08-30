## Context

Homepage already ports OD home. Viz pages still use `template-modern` glass/sidebar layout.

## Goals / Non-Goals

- Goals: match `canvas.html` structure and visual language; preserve controls/about/explore/transport
- Non-Goals: change attractor math; redesign Mandelbrot/Sierpinski floating overlays beyond chrome

## Decisions

1. CSS module `canvasChrome.module.css` from OD canvas sections + shared tokens (Literata / Source Sans / JetBrains Mono to align with frontpage)
2. Stage hosts `<route.element />` full-bleed; vignette overlay is CSS-only
3. Transport uses OD speed presets (0.5× / 1× / 2× / 4×) instead of continuous slider
4. `?iframe` / screenshot: stage only (no chrome)
5. Side panel open by default on desktop; scrim closes on mobile

## Risks

- R3F Canvas defaults to `100vh` — override via stage host CSS so viz fills stage not viewport
