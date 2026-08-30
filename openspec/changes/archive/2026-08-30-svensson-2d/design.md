## Context

Archive: https://github.com/kgz/CanvasWorld_archive/tree/master/(2d)%20Svensson%20attractor  
Pattern: Clifford (`clifford_attractor.tsx` + `createAttractorPage`).

## Decisions

1. **Iterate** archive map: `x' = d·sin(a·x) − sin(b·y)`, `y' = c·cos(a·x) + cos(b·y)`.
2. **Defaults** from archive GUI: `a=-3`, `b=3`, `c=3`, `d=3`; seed `(0,0)`; params in `[-3,3]`.
3. **Framing** scale `50` (archive position multiplier), camera `[0,0,-500]` like Clifford.
4. **SEO** rich `routes.json` description; notebook with `VizEmbed` + Callout CTA.
5. **Thumb** via `pnpm thumbs -- --slug svensson_attractor` when Vite+icons up.

## Risks

- Extreme `(a,b,c,d)` can blow the cloud — same knob range as archive; factory clamp/hide off-screen points handles extremes.
