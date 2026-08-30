## Context

46 active slugs in `packages/shared/routes.json`. Factory pages share `createAttractorPage`; others set `getDescription`. Closed #75–#82 already covered several maps.

## Decisions

- Source of truth is the tick/shader. About and catalog follow it.
- Copy-only About/catalog: no thumb regen. Shader/default changes that alter the canvas: regen that slug.
- Related closed tickets are not reopened unless a new mismatch appears.

## Findings (this pass)

- Sierpiński: fragment shader forced `depth >= 1`, so transport 0 was not a filled triangle. Honor bar 0; keep min-1 only when screen-capping a positive depth.
- Ikeda: About claimed typical `a ∈ [0.6, 1]`; GUI is `[0, 1]`, default 1.
- Remaining active slugs: equations, param names, ranges, attribution match.
