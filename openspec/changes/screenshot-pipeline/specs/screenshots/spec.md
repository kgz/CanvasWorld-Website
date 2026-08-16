## ADDED Requirements

### Requirement: Screenshot query mode
When the page URL includes `screenshot=true`, the SPA SHALL hide navigation, sidebar, and animation chrome so only the visualization canvas is visible, and SHALL draw the full particle set immediately (no progressive animation).

#### Scenario: Chrome hidden
- **WHEN** a user or capturer opens `/{slug}?screenshot=true`
- **THEN** nav, sidebar, and bottom transport controls are not shown

### Requirement: Ready signal
After the visualization has produced a complete first frame suitable for capture, the page SHALL set `window.__CW_READY__` to `true`.

#### Scenario: Capturer waits
- **WHEN** a capturer navigates to `/{slug}?screenshot=true`
- **THEN** it can wait until `window.__CW_READY__ === true` before taking a screenshot

### Requirement: Canvas target
The WebGL canvas used for the visualization SHALL be identifiable as `#cw-viz-canvas` for element screenshots.

#### Scenario: Element capture
- **WHEN** a capturer screenshots `#cw-viz-canvas`
- **THEN** the image is the viz only (not full page chrome)

### Requirement: Offline thumb generation
The project SHALL provide a Playwright-based script that captures each active route into `packages/backend/static/images/{slug}.png`.

#### Scenario: Local thumbs
- **WHEN** a developer runs the thumbs script against a running frontend
- **THEN** PNG files are written for each active slug

### Requirement: No ImageMagick at runtime
The backend screenshot path SHALL NOT invoke ImageMagick.

#### Scenario: API screenshot
- **WHEN** `POST /api/screenshot/:route` succeeds
- **THEN** the PNG is saved without calling `convert` / ImageMagick

### Requirement: SSR does not generate screenshots
Bot SSR SHALL use existing icon files only and SHALL NOT start screenshot jobs on request.

#### Scenario: Discord crawl
- **WHEN** a bot requests `/{slug}`
- **THEN** SSR returns OG tags pointing at `/chaos/icons/{slug}.png` without spawning a capture
