# barth-sextic Specification

## Purpose
TBD - created by archiving change barth-sextic. Update Purpose after archive.
## Requirements
### Requirement: Barth sextic is available as a 3D mesh viz

The site SHALL expose an active `barth_sextic` route that renders a lit triangle mesh of Barth’s sextic.

#### Scenario: Default surface

- **WHEN** a user opens `/barth_sextic` with default params
- **THEN** the mesh is the zero set of \(4(\tau^2 x^2-y^2)(\tau^2 y^2-z^2)(\tau^2 z^2-x^2)-(1+2\tau)(x^2+y^2+z^2-1)^2\) with \(\tau=(1+\sqrt{5})/2\)
- **AND** `Base` uses `drawMode: 'mesh'` with lights

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Barth sextic appears under category `misc` with thumb
- **AND** About copy names the golden-ratio equation and the 65 nodes
- **AND** transport `n` scrubs visible triangle count

