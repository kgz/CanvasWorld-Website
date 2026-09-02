## Decisions

1. **One util file per family** — `cliffordAttractor.ts`, `hopalongAttractor.ts` (all four variants), `henonMap.ts`
2. **Named exports** — `{system}Tick(x, y, params)` matching `bedheadAttractorTick` / `gingerbreadManTick`
3. **Hopalong shared y-step** — all variants use `y_{n+1} = a - x_n`; only x update differs
4. **Tests** — equation spot-check + finite iteration smoke per system

## Non-Goals

- Extract every attractor in the catalog (#14 acceptance is Clifford + Hopalong + one map)
- Move Bogdanov tick out of its page file (already tested inline)
