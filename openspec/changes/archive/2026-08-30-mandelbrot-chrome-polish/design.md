## Context

Particle pages wire `datData` into the floating Params panel. Mandelbrot kept a competing fixed panel and initialized `u_resolution` from `window.inner*`, which drifts from the staged canvas.

## Goals / Non-Goals

- Goals: one chrome language; no gray SaaS card; stable fullscreen fractal; preserve interactions
- Non-Goals: new fractals; mobile epic (#65); OD redesign pass (reuse chrome tokens)

## Decisions

1. `iterations` + `colorScheme` via Redux `datData` (sliders in Params)
2. Stage HUD CSS module (`mandelbrotHud.module.css`) for mode toggle, reset, export, center/zoom meta — same glass/mono family as FPS
3. Fragment shader samples via `vUv * u_resolution` (not raw `gl_FragCoord`) and clamps smooth-color logs
4. Pointer layer is stage-scoped (`absolute` inset), not `fixed` over the whole window
5. Canvas lookup via `#cw-viz-canvas`

## Risks

- Julia click + drag both on hit layer — keep click-to-set only when not dragging
