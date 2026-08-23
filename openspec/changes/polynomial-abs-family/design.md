## Context

Archive sources:

- `(3d) Polynomial ABS` — absolute-value affine map, 7 coeffs per axis
- `(3d) Polynomial, Type A` — 3-param quadratic-style map
- `(3d) Polynomial, Type B` — 6-param scaled product map
- `(3d) Polynomial, Type C` — quadratic map, 6 coeffs per axis

Pattern: Aizawa/Lorenz 3D trail pages (`useAnimationState`, transport `n`, param reset).

## Goals / Non-Goals

**Goals:**

- Faithful archive equations and primary defaults
- Four active catalog cards + one family notebook
- Thumbs for all four slugs

**Non-Goals:**

- Nested dat.GUI folders (flatten coeffs to flat knobs)
- Continuous ODE reformulation

## Decisions

1. **Discrete maps** — one iterate per sample (not Euler/`dt`).
2. **GPU line trail** like Lorenz/Aizawa so scrubbing `n` matches other 3D attractors.
3. **Flat knobs** — ABS: `xa…xg`, `ya…yg`, `za…zg`; Type C: `xa…xf`, `ya…yf`, `za…zf`; A/B: `a…c` / `a…f`.
4. **Defaults** from archive `scripts/index.js`; Type B README decimals as a second preset; ABS `index.1.js` as alternate preset.
5. **One notebook** with `VizEmbedGrid` for all four (Hopalong family pattern); featured demote of current featured if needed.
6. **Seed** `(0,0,0)` matching archive; scales ~50–100 tuned so shapes fill camera.

## Risks / Trade-offs

- [Many knobs on ABS/C] → Accept; matches archive coefficient count; presets cover common looks.
- [Line trail vs archive points] → Prefer site-wide 3D trail contract; still fills the silhouette.
