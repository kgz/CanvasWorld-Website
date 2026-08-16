## ADDED Requirements

### Requirement: Lorenz attractor is available as a 3D viz

The site SHALL expose an active `lorenz_attractor` route that integrates the classic Lorenz system and renders a 3D particle trail under canvas chrome.

#### Scenario: Classic equations

- **WHEN** a user opens `/lorenz_attractor` with default params
- **THEN** the integrator uses \(\dot x=\sigma(y-x),\ \dot y=x(\rho-z)-y,\ \dot z=xy-\beta z\) with \(\sigma=10,\rho=28,\beta=8/3\)
- **AND** plotted points are integrated state, not raw derivatives

#### Scenario: Archive-inspired color

- **WHEN** the trail is drawn
- **THEN** particles use a soft blue palette in the `#729ee5` family (not the pink hsl-chunk default)

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Lorenz appears with thumb and correct About math
- **AND** transport scrub advances the trail length
