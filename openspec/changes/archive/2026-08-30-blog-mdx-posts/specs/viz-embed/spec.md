## ADDED Requirements

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
