## Context

Archive: https://github.com/kgz/CanvasWorld_archive/tree/master/(2d)%20Hilbert%20Curve  
README mentions an L-system; the shipped `scripts/index.js` draws with `hindex2xy(hindex, N)` (bit-twiddle Hilbert index → grid cell) and connects consecutive indices.

Sierpiński is a shader fractal; Hilbert is a sequential path → 2D particle points like `createAttractorPage`, but each particle is `hindex2xy(i)`, not an iterated map.

## Goals / Non-Goals

**Goals:**

- Active slug `hilbert_curve` under category `fractal`
- Pure util + tests; grow-in via existing animation/`n` scrub
- Notebook + thumb + About copy

**Non-Goals:**

- L-system turtle rewrite (archive README only)
- 3D Hilbert
- Shader fill of the square

## Decisions

1. **Port `hindex2xy`**, not the L-system — matches running archive code.
2. **Custom 2D particle page** (not `createAttractorPage`): points are index-mapped; optional `order` knob sets `N = 2^order`, curve length `N²`.
3. **Default order 7** (`N=128`, 16384 points); buffer sized for max order 9; frame centered on the square.
4. **Hue along index** (archive HSB spirit) + yellow tip on newest segment.
5. **SEO** rich `routes.json` description; notebook `featured: false` (keep Aizawa featured).

## Risks / Trade-offs

- [High order] → Mitigation: cap order at 9; only draw first `N²` of the buffer.
- [createAttractorPage mismatch] → Mitigation: custom tick keyed by index `i`.
