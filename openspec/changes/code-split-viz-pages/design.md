## Decisions

1. **Per-slug dynamic import map** in `vizPageLoaders.ts` keyed by catalog slug
2. **`VizPageStage`** wraps lazy pages with Suspense fallback
3. **About panel** loads `getDescription` via `loadVizPageDescription` after chunk fetch
4. **Lazy `template-modern`** keeps screenshot/redux viz chrome off the home path

## Benchmark (prod preview, `/chaos/`)

| | Home JS transferred |
|--|--|
| Before (eager) | 1,757,853 B (1 chunk) |
| After (lazy) | 807,567 B (3 chunks) |
| Reduction | **54%** |
