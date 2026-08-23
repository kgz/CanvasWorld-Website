## Context

Archive: `(3d) Thomas cyclically symmetric attractor`. Classic literature form uses ẋ = sin(y) − b x (cyclic). Archive GUI used b≈0.15–0.33.

## Goals / Non-Goals

**Goals:** Catalog trail, About, thumb, notebook  
**Non-Goals:** Reproducing archive’s additive `x += dx` quirk literally — use proper Euler on the ODE

## Decisions

1. ODEs: ẋ = sin(y) − b x (and cyclic); knobs `b`, `dt`
2. Defaults: b=0.19, dt=0.01, seed (0.1, 0, 0); presets ~0.1528 (archive), ~0.208
3. Clone Aizawa trail chrome; scale ~8–12; cool→warm line

## Risks / Trade-offs

- [Archive vs literature step] → Prefer literature ODE + Euler; note archive in About briefly if needed

## Open Questions

- None
