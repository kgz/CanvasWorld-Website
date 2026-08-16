## ADDED Requirements

### Requirement: Homepage works on small screens

The homepage SHALL remain readable and tappable at phone and tablet widths without horizontal overflow, preserving brand-first hero composition.

#### Scenario: Phone homepage

- **WHEN** a user opens the homepage at approximately 390×844
- **THEN** nav, hero, and gallery are usable without horizontal scroll
- **AND** primary CTAs remain tappable

### Requirement: Canvas chrome works on small screens

Canvas/viz chrome SHALL adapt so params open as a dismissible drawer/scrim, transport remains reachable, and the stage fills the remaining viewport.

#### Scenario: Phone canvas

- **WHEN** a user opens a particle or shader route at approximately 390×844
- **THEN** they can open and close Params without permanently blocking the viz
- **AND** play/scrub/speed controls remain reachable with touch-sized targets
- **AND** the page does not require horizontal scrolling
