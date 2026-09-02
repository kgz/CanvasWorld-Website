## ADDED Requirements

### Requirement: Embed iframe title is the viz name

A `VizEmbed` iframe SHALL use the catalog visualisation name as `title` (fallback: explicit `label`, then a spaced slug).

#### Scenario: Lorenz embed

- **WHEN** a post embeds `lorenz_attractor` without a custom label
- **THEN** the iframe `title` is the catalog name (e.g. “Lorenz Attractor”), not a raw slug

### Requirement: Transport and queued state are announced

Play, pause, replay, and queued states SHALL be exposed to assistive tech (not only visually). The embed control SHALL be skippable in the tab order with no keyboard trap.

#### Scenario: Pause announced

- **WHEN** the user pauses an embed
- **THEN** the control’s accessible name reflects Pause vs Play vs Replay

#### Scenario: Queued announced

- **WHEN** a staggered embed is not yet allowed to load
- **THEN** the control or figure announces that it is queued, and Tab can move past it

### Requirement: Reduced motion does not auto-run embeds

When `prefers-reduced-motion: reduce` is set, a `VizEmbed` SHALL start paused (poster visible) until the user plays it.

#### Scenario: Reduced-motion post

- **WHEN** a user with reduced motion opens a post that contains a `VizEmbed`
- **THEN** the embed does not auto-play motion; Play is available
