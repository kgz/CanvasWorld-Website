## ADDED Requirements

### Requirement: Typed animation context
Visualization chrome and particle ticks SHALL communicate play/pause, speed, scrub progress, replay, and completion through a React context — not `window` CustomEvents.

#### Scenario: Pause without events
- **WHEN** the user toggles pause on the bottom controls
- **THEN** particle drawing pauses without dispatching a `toggleAnimation` window event

### Requirement: Progress UI without DOM ids
Progress label and slider SHALL bind to context state. The tick path SHALL NOT write `#progress-text` or `#progress-slider` via `getElementById`.

#### Scenario: Progress reflects draw count
- **WHEN** particles are drawing
- **THEN** the progress UI shows the current drawn / total counts from context

### Requirement: Dynamic progress max
The progress slider maximum SHALL equal the visualization’s particle count (as reported by the tick), not a hardcoded 200000.

#### Scenario: Slider range
- **WHEN** a page reports `totalParticles`
- **THEN** the progress slider `max` equals that total

### Requirement: Screenshot full draw
When `screenshot=true`, the animation path SHALL still draw the full particle set immediately.

#### Scenario: Screenshot mode
- **WHEN** a page loads with screenshot mode
- **THEN** `calculateParticlesToDraw` returns the full particle count
