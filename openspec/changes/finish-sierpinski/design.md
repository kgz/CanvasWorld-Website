## Context

Stub was inactive with unicode in slug/paths. Page already implements recursive triangle-membership sampling on a grid (not chaos-game).

## Goals / Non-Goals

- Goals: ASCII slug, activate, register component, tests, icon
- Non-Goals: chaos-game IFS rewrite; redirects (unicode URL never shipped active)

## Decisions

1. Slug `sierpinski_triangle`; title keeps “Sierpiński”
2. Keep grid membership algorithm; catalog description matches it
3. Extract pure math to `utils/sierpinski.ts` for tests
4. Thumbnail: generate a simple gasket PNG until screenshot pipeline refreshes it

## Risks / Trade-offs

- Icon quality is placeholder-level until screenshots run
