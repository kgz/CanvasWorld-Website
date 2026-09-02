## Context

`routes.json` already tags four slugs with `renderMode: "shader"`. `template-modern.tsx` disables the transport bar for shader routes unless a page sets `usesTransportBar = true` or forgets to set `isShaderViz = true` (Mandelbrot/Julia rely on the latter today). Component statics are invisible to the catalog and backend.

## Goals / Non-Goals

**Goals**

- Single source of truth: catalog metadata controls chrome for shader vs WebGL pages.
- Typed `TRoute` fields consumed by template shell.
- Shared canvas lookup for shader HUD overlays.

**Non-Goals**

- Renaming catalog `webgl` to `particles` (future cleanup).
- Moving Mandelbrot HUD into the params panel (covered by `mandelbrot-viz`).
- Changing `_base.tsx` shader render path.

## Decisions

1. **Keep catalog values `webgl` | `shader`** — matches existing JSON and backend `RenderMode` field; `webgl` means particle/mesh Base modes.
2. **Optional catalog fields** — `usesTransportBar?: boolean`, `progressLabel?: string` on entries that need transport chrome (Sierpiński only today).
3. **`vizCatalog.ts` helpers** — `routeShowsTransportBar(route)`, `routeProgressLabel(route)` keep `template-modern` readable.
4. **`vizCanvas.ts`** — export `findVizCanvas()` keyed on `#cw-viz-canvas` for overlay pan/zoom pages.

## Risks / Trade-offs

- Catalog drift if a new shader page needs transport but omits `usesTransportBar` → mitigated by unit tests on known shader slugs.

## Migration Plan

1. Extend `routes.json` + `CatalogEntry` / `TRoute` types.
2. Switch template transport logic to catalog helpers.
3. Delete component static hacks.
4. Extract shared `findVizCanvas`.
