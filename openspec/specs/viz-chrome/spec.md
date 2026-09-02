# viz-chrome Specification

## Purpose
TBD - created by archiving change canvas-chrome-react-port. Update Purpose after archive.
## Requirements
### Requirement: OD canvas chrome on viz routes
Active visualization routes SHALL render inside the Open Design canvas shell (topbar, stage, collapsible params panel, transport bar) matching `design/canvasworld-prototype/canvas.html`. Transport bar visibility SHALL be derived from route catalog metadata (`renderMode`, optional `usesTransportBar`), not from static properties on the page component.

#### Scenario: Desktop viz page
- **WHEN** a user opens `/chaos/{slug}` on desktop
- **THEN** they see wordmark, viz title + category tag, Params toggle, gallery link, floating side panel, and bottom transport when the route metadata enables it

#### Scenario: Shader page without transport
- **WHEN** a user opens a shader route without `usesTransportBar` (e.g. Mandelbrot)
- **THEN** the bottom transport bar is hidden

#### Scenario: Screenshot / iframe
- **WHEN** `?screenshot=true` or `?iframe` is present
- **THEN** chrome is omitted and only the viz stage renders

### Requirement: Skip link into About on viz pages

Active visualisation pages (non-iframe, non-screenshot) SHALL provide a skip link that moves keyboard focus to the About region, so the canvas is not a dead-end for AT users.

#### Scenario: Tab from viz load

- **WHEN** a keyboard user tabs from load on `/chaos/{slug}` (full chrome)
- **THEN** a skip link reaches the About region

### Requirement: Visible focus on chrome inputs

Canvas chrome controls SHALL show a `:focus-visible` ring. Number inputs SHALL NOT use `outline: none` without a visible replacement.

#### Scenario: Parameter field

- **WHEN** a keyboard user focuses a chrome number input or transport control
- **THEN** a focus ring is visible

