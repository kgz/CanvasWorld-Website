## Context

`brusselator` is a phase-orbit trail via `createAttractorPage` + Euler ODE. Issue #50 wants a separate spatial RD field (Wikipedia-style spots/stripes), not a rewrite of #31. Gallery, thumbs, and blog embeds expect the usual catalog + `Base` + `?iframe` / screenshot contract.

## Goals / Non-Goals

**Goals:**
- Distinct slug `brusselator_rd` with evolving 2D concentration field
- Reflective (Neumann) borders on a rectangular grid
- Tunable `a`, `b`, `Du`, `Dv`, `dt`, grid size
- Embed + thumb pipeline parity with other viz

**Non-Goals:**
- Changing ODE Brusselator
- GPU ping-pong RD (CPU Euler is enough at ≤256²)
- Reviving unfinished Gray-Scott experiments

## Decisions

1. **Slug `brusselator_rd`** — short, distinct from `brusselator`; category `misc` (chemical field, not a discrete map trail).
2. **CPU grid + particle color field** — fixed 2D particle lattice colored by `u`; reuses `Base` particles, pause, and screenshot ready without a new draw mode. Alternatives: canvas2d overlay (breaks `#cw-viz-canvas` contract), GLSL ping-pong (more moving parts).
3. **Neumann laplacian** — mirror edge samples (`i±1` clamped) for reflective borders per ticket.
4. **Defaults for Turing-ish spots** — `a=1`, `b≈3`, `Du < Dv` (e.g. 1 vs 8), small `dt`, noise around steady state `(u,v)=(a,b/a)`.
5. **Transport `n`** — maps to simulated step count from a fresh seed (scrub rebuilds); play advances steps when not paused. Always draw the full grid.

## Risks / Trade-offs

- [Large grid + scrub rebuild] → cap grid ≤256; rebuild only on scrub / param change
- [Stiff `dt`] → clamp `dt`; document stable ranges in About
- [Thumb too early / blank] → run a fixed warmup step budget in screenshot mode before `__CW_READY__`

## Migration Plan

Additive route only. No migration. Rollback = deactivate catalog entry.
