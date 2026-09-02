## MODIFIED Requirements

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
