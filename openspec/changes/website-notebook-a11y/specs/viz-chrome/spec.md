## ADDED Requirements

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
