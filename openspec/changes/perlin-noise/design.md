## Context

Archive `Perlin Noise` used a JS SimplexNoise library on a square particle lattice, mapping `noise2D(x·scale, y·scale)+offset` into HSL hue. Issue #48 notes a non-particle render mode may be needed. Classical Chaos already has `ERenderMode.SHADER` fullscreen planes (Mandelbrot, Sierpiński).

## Goals / Non-Goals

**Goals:** Active `perlin_noise` misc route; continuous 2D improved Perlin on the GPU; Params for scale / octaves / speed; animated time offset; About + notebook post; gallery thumb.

**Non-Goals:** Shipping a particle lattice fallback; 3D Perlin volumes; simplex-only parity with the archive library; pan/zoom HUD (Mandelbrot-style).

## Decisions

1. **Shader plane, not particles.** Dense continuous field; `renderMode: "shader"`; `isShaderViz = true` (no transport bar).
2. **Improved Perlin (Ken Perlin 2002 fade/gradients), not simplex.** Matches the ticket title; archive used simplex visually for the same colored-field idea.
3. **CPU `perlin2` in `utils/perlin.ts`** for unit tests and shared defaults; GLSL reimplements the same fade / hash / lerp structure.
4. **GUI:** `scale` (0.5–20, default ~4), `octaves` (1–6, default 4), `speed` (0–2, default 0.25). Time uniform advances by `delta * speed` when not paused / screenshot-frozen.
5. **Color:** Map fBm ∈ [−1,1] → hue band ~200–360° (archive-like cyan→magenta), fixed sat/light; dark void-free fill.
6. **Screenshot:** Freeze time at a fixed offset so thumbs are stable; mark ready via existing shader path.

## Risks / Trade-offs

- [Hash differs CPU vs GPU] → tests cover CPU range/continuity; visual QA on GPU.
- [High octaves on weak GPUs] → cap octaves at 6.
- [Embed without progress] → notebook uses VizEmbed without `animateN` (continuous field).
