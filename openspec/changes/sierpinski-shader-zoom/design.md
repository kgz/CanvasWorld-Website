## Context

Current page samples a 500×400 grid in CPU and draws points. Default camera zoom does not refine the fractal.

## Goals / Non-Goals

- Goals: real-time zoom/pan, self-similar detail to float limits, match Mandelbrot interaction model
- Non-Goals: double-precision deep zoom; chaos-game particle mode

## Decisions

1. Barycentric iterative membership in GLSL (α,β,γ ≥ 0.5 corner remap; all < 0.5 ⇒ hole)
2. Reuse Mandelbrot coordinate mapping + overlay UX
3. Keep `utils/sierpinski.ts` + unit tests as CPU reference

## Risks

- float32 barycentric breaks past ~1e5–1e6× zoom — same class of limit as Mandelbrot mediump
