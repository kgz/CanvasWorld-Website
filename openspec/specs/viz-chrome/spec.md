# viz-chrome Specification

## Purpose
TBD - created by archiving change canvas-chrome-react-port. Update Purpose after archive.
## Requirements
### Requirement: OD canvas chrome on viz routes
Active visualization routes SHALL render inside the Open Design canvas shell (topbar, stage, collapsible params panel, transport bar) matching `design/canvasworld-prototype/canvas.html`.

#### Scenario: Desktop viz page
- **WHEN** a user opens `/chaos/{slug}` on desktop
- **THEN** they see wordmark, viz title + category tag, Params toggle, gallery link, floating side panel, and bottom transport

#### Scenario: Screenshot / iframe
- **WHEN** `?screenshot=true` or `?iframe` is present
- **THEN** chrome is omitted and only the viz stage renders

