## Context

Archive: https://github.com/kgz/CanvasWorld_archive/tree/master/(3d)%20Bedhead%20Attractor  
Product already ships 2D Bedhead (`bedhead_attractor`). Pattern for 3D attractors: Lorenz/Aizawa trail pages with transport `n`.

## Goals / Non-Goals

- **Goals**: Own slug `bedhead_attractor_3d`; archive x/y/z map; scrubbable grow-in; notebook + thumb; leave 2D alone.
- **Non-goals**: Replacing or changing 2D defaults; ODE framing (this stays discrete).

## Decisions

1. **Slug** `bedhead_attractor_3d` — parallel to 2D, not an overwrite.
2. **Discrete map** (no `dt`):
   - \(x' = \sin(xy/b)\,y + \cos(ax - y)\)
   - \(y' = x + \sin(y)/b\)
   - \(z' = y + \cos(yx)/b\)
3. **Defaults** archive GUI: `a=0.13`, `b=0.37`, seed `(0,0,0)`; floor `|b|` away from zero; scale `×20`.
4. **Draw**: translucent **points** (archive style), not a continuous line trail — discrete iterates fill a cloud. Still use animation/`n` grow + param-reset like Lorenz.
5. **Color**: warm amber/orange near archive `0xE27C2E`; solid for thumbs.
6. **SEO**: rich `routes.json` description; notebook `featured: true` (demote Aizawa featured).
7. **Thumb** via `pnpm thumbs -- --slug bedhead_attractor_3d` when Vite+backend up.

## Risks / Trade-offs

- [Risk] `b→0` blows up → Mitigation: safe denominator like 2D util.
- [Risk] Points vs lines look different from Lorenz/Aizawa → Acceptable; matches discrete map + archive.

## Migration Plan

Additive catalog entry only. Rollback = deactivate slug / revert PR.

## Open Questions

- None for ship.
