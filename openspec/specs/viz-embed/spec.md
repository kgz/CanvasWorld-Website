# viz-embed Specification

## Purpose
TBD - created by archiving change blog-mdx-posts. Update Purpose after archive.
## Requirements
### Requirement: Inline viz embed
Posts SHALL be able to embed a live visualisation by catalog slug via a `VizEmbed` component that shows a stage, optional label, play/pause, and a link to the full-page route.

#### Scenario: Single embed
- **WHEN** a post includes `VizEmbed` for `lorenz_attractor`
- **THEN** a live viz appears inline and “Open full” links to `/lorenz_attractor`

### Requirement: Multi-embed
Multiple `VizEmbed` instances on one page SHALL be supported so related systems can run side by side.

#### Scenario: Hopalong family grid
- **WHEN** a post embeds multiple Hopalong variants
- **THEN** each embed can run without requiring a global single-runner lock

### Requirement: Visibility budget
Embeds SHALL pause when offscreen (IntersectionObserver) and when the document is hidden (`visibilityState`), and resume when visible again if the user has not paused them.

#### Scenario: Scroll away
- **WHEN** an embed leaves the viewport
- **THEN** its animation/stage stops consuming frames until it returns (or stays user-paused)

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

