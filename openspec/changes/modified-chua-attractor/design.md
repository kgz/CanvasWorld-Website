## Context

Archive: https://github.com/kgz/CanvasWorld_archive/tree/master/(3d)%20Modified%20Chua%20Chaotic%20attractor  
Pattern: Lorenz/Aizawa 3D GPU line trail (`*Tick` util + attractor page).

## Decisions

1. **Euler step** matching archive `scripts/index.js`:  
   `h = -b sin(πx/(2a) + d)`,  
   `ẋ = α(y − h)`, `ẏ = x − y + z`, `ż = −β y`  
   (script uses `−β y`; README sign typo ignored).
2. **Defaults** from archive GUI coeffs: `α=10.82`, `β=14.286`, `a=1.3`, `b=0.11`, `d=2.981`, seed `(1,1,0)`. Default `dt=0.02` for dense line trail; archive `dt=0.1` kept as a preset.
3. **GPU line trail** like Aizawa (not archive point-wrap); scrub via `n`.
4. **Knobs** expose `alpha`, `beta`, `a`, `b`, `d`, `dt`; presets include archive defaults.
5. **SEO**: rich `routes.json` description; notebook `featured: true` (demote Aizawa featured).
6. **Thumb** via `pnpm thumbs -- --slug modified_chua_attractor` when Vite+backend up.

## Risks

- Archive `dt=0.1` is coarse for line strips; denser default avoids a thin-wire gallery thumb.
