# roman-surface Specification

## Purpose
TBD - created by archiving change roman-surface. Update Purpose after archive.
## Requirements
### Requirement: Roman surface is available as a 3D mesh viz

The site SHALL expose an active `roman_surface` route that renders a lit triangle mesh of Steiner’s Roman surface (RP² immersion).

#### Scenario: Default surface

- **WHEN** a user opens `/roman_surface` with default params
- **THEN** the mesh is the Steiner parametrization \(x=a^2\cos u\sin u\sin v\), \(y=a^2\cos u\sin u\cos v\), \(z=a^2\cos^2 u\cos v\sin v\) with \(a=1\) and \(u,v\in[0,\pi]\)
- **AND** `Base` uses `drawMode: 'mesh'` with lights

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Roman Surface appears under category `misc` with thumb
- **AND** About copy names Steiner’s Roman surface and \(\mathbb{RP}^2\)
- **AND** transport `n` scrubs visible triangle count
- **AND** dat.gui has no parameter named `n`

