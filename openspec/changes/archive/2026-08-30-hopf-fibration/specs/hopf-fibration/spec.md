## ADDED Requirements

### Requirement: Hopf fibration is available as a 3D particle wire

The site SHALL expose an active `hopf_fibration` route that renders stereographic images of Hopf fibers (circles on S³ mapped to R³) as a particle wire.

#### Scenario: Default fibers

- **WHEN** a user opens `/hopf_fibration` with default params
- **THEN** the canvas shows a family of linked circles from stereographic projection of S³ fibers
- **AND** points are finite and centered/scaled into view
- **AND** `Base` uses the 3D particle path (not lit mesh)

#### Scenario: Fiber count and stereo params

- **WHEN** the user changes GUI `fibers` or `stereo`
- **THEN** the cloud rebuilds with the new fiber count / stereographic strength
- **AND** samples-per-fiber resolution is not a GUI control

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Hopf fibration appears under category `misc` with title "Hopf Fibration"
- **AND** About copy names the Hopf map S³ → S²
- **AND** transport `n` scrubs visible point count
