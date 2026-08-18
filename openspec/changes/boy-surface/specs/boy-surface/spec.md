## ADDED Requirements

### Requirement: Boy's surface is available as a 3D mesh viz

The site SHALL expose an active `boy_surface` route that renders a lit triangle mesh of Boy’s surface (Bryant–Kusner immersion of \(\mathbb{RP}^2\) in \(\mathbb{R}^3\)).

#### Scenario: Default surface

- **WHEN** a user opens `/boy_surface` with default params
- **THEN** the mesh is a Bryant–Kusner (or equivalent) parametrization of Boy’s immersion
- **AND** `Base` uses `drawMode: 'mesh'` with lights
- **AND** all vertex coordinates are finite
- **AND** the triangle index count is greater than 100

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Boy's Surface appears under category `misc` with slug `boy_surface`
- **AND** About copy states that this is an immersion of \(\mathbb{RP}^2\), not an embedding
- **AND** transport `n` scrubs visible triangle count
- **AND** dat.gui has no extra knobs (empty options)
