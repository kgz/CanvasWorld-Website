# sierpinski-chrome-hud Specification

## Purpose
TBD - created by archiving change sierpinski-chrome-hud. Update Purpose after archive.
## Requirements
### Requirement: Sierpiński stage HUD matches OD chrome

The Sierpiński page SHALL present zoom/pan feedback and reset using the same visual family as other OD canvas HUDs (mono meta chip, glass control), not a gray Tailwind floating card.

#### Scenario: No SaaS overlay card

- **WHEN** a user opens `/sierpinski_triangle` (or equivalent route)
- **THEN** there is no full-width/gray `bg-gray-800` style floating card over the stage
- **AND** center/zoom readout and reset use OD HUD styling

#### Scenario: Interactions preserved

- **WHEN** the user scrolls over the stage, drags, or clicks reset
- **THEN** zoom-under-cursor, pan, and reset-to-default still work
- **AND** the transport bar still scrubs construction depth

#### Scenario: Readable fractal

- **WHEN** the page loads at default framing
- **THEN** the gasket is clearly visible against the void under chrome vignette/panels

