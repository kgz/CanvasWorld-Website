# schwarz-p-mesh Specification

## Purpose
TBD - created by archiving change schwarz-p. Update Purpose after archive.
## Requirements
### Requirement: Schwarz P is available as a 3D mesh viz

The site SHALL expose an active `schwarz_p` route that renders a lit triangle mesh of the Schwarz P implicit surface.

#### Scenario: Default unit cell

- **WHEN** a user opens `/schwarz_p` with default params
- **THEN** the mesh is the level set \(\cos x + \cos y + \cos z = 0\)
- **AND** the sampled domain is one \(2\pi\)-period cube
- **AND** `Base` uses `drawMode: 'mesh'` with lights

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Schwarz P appears under category `misc` with title "Schwarz P" and thumb
- **AND** About copy names Schwarz P / triply periodic minimal surface
- **AND** transport `n` scrubs visible triangle count

#### Scenario: Iso and tiles

- **WHEN** the user changes iso-level \(t\) or tile count
- **THEN** the mesh is rebuilt for \(\cos x + \cos y + \cos z = t\) over \([0, 2\pi\cdot\mathrm{tiles}]^3\)
- **AND** grid resolution is baked (not a GUI param)

