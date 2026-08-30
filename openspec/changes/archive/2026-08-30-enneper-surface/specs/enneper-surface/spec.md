## ADDED Requirements

### Requirement: Enneper surface is available as a 3D mesh viz

The site SHALL expose an active `enneper_surface` route that renders a lit triangle mesh of Enneper’s polynomial minimal surface.

#### Scenario: Default surface

- **WHEN** a user opens `/enneper_surface` with default params
- **THEN** the mesh uses \(x=u-u^3/3+uv^2\), \(y=v-v^3/3+vu^2\), \(z=u^2-v^2\) on \(u,v\in[-\mathrm{span},\mathrm{span}]\) with default `span` in \(1.6\)–\(2.0\)
- **AND** `Base` uses `drawMode: 'mesh'` with lights

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Enneper Surface appears under category `misc` with title "Enneper Surface"
- **AND** About copy names Enneper’s minimal surface and the polynomial parametrization
- **AND** transport `n` scrubs visible triangle count

#### Scenario: Span domain

- **WHEN** the user changes `span`
- **THEN** the mesh is rebuilt on \(u,v\in[-\mathrm{span},\mathrm{span}]\)
- **AND** UV grid resolution is baked (no res/bound GUI knobs)
