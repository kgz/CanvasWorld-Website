## Context

Archive: https://github.com/kgz/CanvasWorld_archive/tree/master/(3d)%20Aizawa%20Attractor  
Pattern: Lorenz 3D trail (`lorenz_attractor.tsx` + `lorenzTick`).

## Decisions

1. **Euler step** with archive defaults `a…f` and `dt=0.01`; seed `(0.1,0,0)`.
2. **GPU line trail** like Lorenz (not archive point-wrap); scrub via `n`.
3. **Knobs** expose `a–f` + `dt`; presets include archive defaults.
4. **SEO**: rich `routes.json` description; notebook `featured: true` (demote Lorenz featured).
5. **Thumb** via `pnpm thumbs -- --slug aizawa_attractor` when Vite+backend up.

## Risks

- Six params crowd the Params panel — still matches archive GUI.
