## 1. Catalog and types

- [x] 1.1 Add `usesTransportBar` / `progressLabel` to Sierpiński catalog entry
- [x] 1.2 Type `renderMode` and optional chrome fields on `CatalogEntry` / `TRoute`

## 2. Shell and helpers

- [x] 2.1 Add `vizCatalog.ts` with transport/progress helpers
- [x] 2.2 Wire `template-modern.tsx` to catalog metadata (drop `isShaderViz` / `usesTransportBar` reflection)
- [x] 2.3 Extract `findVizCanvas` to `vizCanvas.ts` and update shader overlays

## 3. Page cleanup

- [x] 3.1 Remove `isShaderViz` from Mandelbrot/Julia factory and Perlin
- [x] 3.2 Remove `usesTransportBar` / `progressLabel` statics from Sierpiński

## 4. Verify

- [x] 4.1 Add unit tests for `vizCatalog` helpers
- [x] 4.2 `pnpm run build` in frontend
