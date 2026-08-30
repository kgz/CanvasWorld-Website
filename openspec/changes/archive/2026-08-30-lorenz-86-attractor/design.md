## Context

Archive: https://github.com/kgz/CanvasWorld_archive/tree/master/(3d)%20Lorenz%2086  
Pattern: Lorenz / Aizawa 3D trail (`lorenz_attractor.tsx` + `lorenzTick`).

## Decisions

1. **Separate slug** `lorenz_86` — does not replace `lorenz_attractor`.
2. **Euler step** with archive defaults `a=1.111`, `b=4.494`, `f=1.479`, `g=0.44`, `d=0.13` (dt); seed `(0,0,0)`.
3. **GPU line trail** like Lorenz (not archive point-wrap); scrub via `n`.
4. **Knobs** expose `a`, `b`, `f`, `g`, `d`; presets include archive defaults.
5. **Framing**: scale ~50 like archive; `rotation.z = π/2` via position remap.
6. **SEO**: rich `routes.json` description; notebook `featured: true` (demote Aizawa featured).
7. **Thumb** via `pnpm thumbs -- --slug lorenz_86` when Vite+backend up.

## Risks

- Archive README z-equation has a typo; implement from `scripts/index.js`.
