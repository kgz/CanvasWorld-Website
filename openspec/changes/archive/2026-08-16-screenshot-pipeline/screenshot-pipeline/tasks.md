## 1. Frontend screenshot mode

- [x] 1.1 Add `screenshotMode` helper + `window.__CW_READY__` typing
- [x] 1.2 Hide chrome in `template-modern` when screenshot
- [x] 1.3 Tag canvas `#cw-viz-canvas`; signal ready after first full tick / shader frames
- [x] 1.4 Keep max-particles behaviour in `useAnimationState`

## 2. Capture tooling

- [x] 2.1 Add Playwright capture script + `pnpm thumbs` (frontend)
- [x] 2.2 Rewrite Go `screenshot.go` (ready wait, canvas shot, no ImageMagick)
- [x] 2.3 Remove SSR lazy screenshot spawn

## 3. Docs / verify

- [x] 3.1 Document how to run thumbs in README
- [x] 3.2 `go build` backend
- [x] 3.3 OpenSpec tasks checked
