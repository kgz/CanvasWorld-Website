## ADDED Requirements

### Requirement: Spatial Brusselator RD catalog route

The site SHALL expose an active `brusselator_rd` route that renders a 2D reaction–diffusion Brusselator field, distinct from the ODE phase-orbit route `brusselator`.

#### Scenario: Default evolving field

- **WHEN** a user opens `/brusselator_rd` with default params
- **THEN** the viz shows a rectangular concentration field that evolves over time
- **AND** kinetics follow the Brusselator rates with diffusion on `u` and `v`
- **AND** borders use reflective (Neumann) conditions

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Brusselator RD appears with its own thumb and title distinguishing it from Brusselator (ODE)
- **AND** About copy states this is spatial RD, not the well-mixed phase orbit
- **AND** the page works under basename `/chaos`, `?iframe`, and the screenshot/thumb pipeline

#### Scenario: Parameters

- **WHEN** the user changes `a`, `b`, diffusion rates, `dt`, or grid size
- **THEN** the field is reseeded (or stepped) with the new parameters
- **AND** transport pause freezes evolution while play continues stepping
