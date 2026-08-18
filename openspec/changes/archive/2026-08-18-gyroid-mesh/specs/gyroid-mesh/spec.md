## ADDED Requirements

### Requirement: Gyroid is available as a 3D mesh viz

The site SHALL expose an active `gyroid` route that renders a lit triangle mesh of Schoen’s gyroid implicit surface.

#### Scenario: Default unit cell

- **WHEN** a user opens `/gyroid` with default params
- **THEN** the mesh is the level set \(\sin x\cos y + \sin y\cos z + \sin z\cos x = 0\)
- **AND** the sampled domain is one \(2\pi\)-period cube
- **AND** `Base` uses `drawMode: 'mesh'` with lights

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Gyroid appears under category `misc` with thumb
- **AND** About copy names the Schoen gyroid / triply periodic minimal surface
- **AND** transport `n` scrubs visible triangle count

#### Scenario: Iso and tiles

- **WHEN** the user changes iso-level \(t\) or tile count
- **THEN** the mesh is rebuilt for \(\sin x\cos y + \sin y\cos z + \sin z\cos x = t\) over \([0, 2\pi\cdot\mathrm{tiles}]^3\)
