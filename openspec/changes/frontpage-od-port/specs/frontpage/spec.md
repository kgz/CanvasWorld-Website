## ADDED Requirements

### Requirement: Brand-first hero
The homepage SHALL present **CanvasWorld** as the dominant first-viewport brand signal, with one headline, one short supporting sentence, and a CTA group. The visualization card grid SHALL NOT appear in the first viewport.

#### Scenario: First viewport composition
- **WHEN** a visitor opens `/chaos/` (or the SPA home catch-all)
- **THEN** they see CanvasWorld as hero-level text, supporting copy, CTAs, and a full-bleed atmospheric visual plane before scrolling to the gallery

### Requirement: Gallery from route registry
The homepage gallery SHALL list each active entry from the frontend route registry, linking to `/{slug}` via `genPath`, and SHALL attempt to show the icon at `/chaos/icons/{slug}.png`.

#### Scenario: Open a visualization
- **WHEN** a visitor clicks a gallery card
- **THEN** the SPA navigates to that visualization route

### Requirement: Random visualization CTA
The homepage SHALL provide a control that scrolls to and briefly highlights a randomly chosen gallery card.

#### Scenario: Random pick
- **WHEN** the visitor activates “Random visualization”
- **THEN** a gallery card is scrolled into view and visually highlighted for a short duration

### Requirement: Motion respect
Hero ambient animation and entrance motion SHALL respect `prefers-reduced-motion: reduce`.

#### Scenario: Reduced motion
- **WHEN** the user prefers reduced motion
- **THEN** the hero canvas does not continuously animate and card entrances do not rely on motion
