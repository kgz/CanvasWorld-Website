## Context

3D ODE trail like Lorenz/Aizawa. OD prototype uses a=1.4, dt=0.01, seed (−5,0,0). Classic cyclic form with fixed coupling 4.

## Goals / Non-Goals

**Goals:**
- `halvorsen_attractor` catalog + stage + About
- Thumb + notebook post

**Non-Goals:**
- Generalizing cyclic attractor factory
- Changing archive ports epic #30 beyond this slug

## Decisions

1. **Hand-rolled 3D trail** (not `_attractorPage`) — same as Aizawa/Lorenz.
2. **Knobs `a` + `dt` only** — classic single-parameter form; seed fixed at (−5,0,0).
3. **Presets** — a=1.4 (default), ~1.3, ~1.6 for demo variety.
4. **Framing** — scale ~2.5–3 (orbit radius ~10–15 from seed −5); camera ~[0,0,45]; cool→warm trail.
5. **Notebook** ships with viz (current delivery bar / user queue), OD angle: cyclic symmetry.

## Risks / Trade-offs

- [Seed far from origin] → Match OD/Sprott (−5,0,0); do not use (0.1,0,0).
- [Framing] → Tune scale/camera after first paint / thumb.

## Open Questions

- None.
