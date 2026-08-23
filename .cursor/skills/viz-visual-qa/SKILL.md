---
name: viz-visual-qa
description: >-
  Visual QA for Classical Chaos attractors/maps/meshes: check math vs About,
  draw mode (points vs lines), framing/scale/camera, color ramp, defaults and
  examples (no rings/blobs/runaway), thumbs. Use when a viz “looks horrible”,
  after porting a catalog slug, when the user asks to review a viz visually, or
  before In review for a new attractor/map page.
---

# Viz visual QA

Ignore archive/port provenance. Ask: does this stage earn a catalog slot?

## When to run

- User says a viz looks bad / blob / rings / muddy / wrong
- After implementing or tuning a page under `packages/frontend/src/pages/{attractors,maps,fractals,misc}/`
- Before claiming a viz port is ready for In review

## Procedure

### 1. Math identity

- Compare `iterate` / tick util to About `BlockMath` and any unit test.
- Distinct from siblings? (e.g. Hopalong sinusoidal ≠ typo `sin`/`sign` map)
- If the only story is “archive typo” / duplicate of an existing slug → **kill**, don’t polish.

### 2. Boundedness & silhouette

- Quick iterate (script or mental): defaults should stay bounded and show structure (lace, lobes, folds), not diverge to ±1e4 or collapse to a filled rectangle.
- Examples 2–3 must not be periodic rings or empty when Example 1 is good.
- Prefer params the user already liked when fixing presets.

### 3. Draw mode vs density

| Map type | Prefer |
|----------|--------|
| Dense discrete 2D/3D point cloud | `points` + HSL/chunk color |
| Sparse ODE trail (Lorenz, Aizawa) | `line` + cool→warm along age |
| Mesh | lit mesh; don’t fake with opaque lines |

Dense discrete maps drawn as thick/opaque **lines** often read as a **solid blob** — switch to points or cut opacity hard.

### 4. Color

- Live view: saturated ramp (HSL-chunk, cyan→magenta, cool→warm with early contrast). Avoid muddy single pink/beige.
- Screenshot/thumb (`isScreenshotMode` / `pnpm thumbs`): must still show structure — flat `SOLID` crush can nuke detail; prefer same hue walk or a solidify allowlist only when AA fringes need crushing.
- No purple-on-black glow cliché unless the existing page family already uses it.

### 5. Framing

- `scale` × orbit span should fill the frame without sitting inside the cloud or leaving a tiny speck.
- `cameraPosition` / auto-rotate: readable silhouette in first seconds.
- After visual change: regen thumb  
  `cd packages/frontend && FRONTEND_URL=http://127.0.0.1:5173/chaos pnpm thumbs -- --slug <slug>`  
  (Vite 5173 + icons 8080). Commit PNG with the viz change.

### 6. Copy hygiene (About + notebook)

- No private archive links, “ported from”, bare `/slug` paths, staff `transport n` without plain language.
- Affordance claims: embed vs full canvas.

## Output

Short report:

```text
Slug: …
Math: match | mismatch | duplicate→kill
Draw/color/frame: … (what you change)
Examples: … 
Thumb: regen | skip
Verdict: ship | fix | kill
```

Then implement fixes (or close the ticket/PR on **kill**).

## Related

- Gallery thumbs: `.cursor/rules/gallery-thumb-regen.mdc`
- Notebook gates: skill `blog-builder` (separate from canvas look)
