## ADDED Requirements

### Requirement: Costa surface is available as a 3D mesh viz

The site SHALL expose an active `costa_surface` route that renders a lit triangle mesh of a truncated Costa–Hoffman–Meeks minimal surface.

#### Scenario: Default surface

- **WHEN** a user opens `/costa_surface` with default params
- **THEN** the mesh uses the Costa ζ/℘ parametrization on a truncated unit-square domain with default `margin` in 0.06–0.12
- **AND** `Base` uses `drawMode: 'mesh'` with lights

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Costa Surface appears under category `misc` with title "Costa Surface"
- **AND** About copy names the Costa–Hoffman–Meeks / genus-1 complete minimal surface with three ends
- **AND** transport `n` scrubs visible triangle count

#### Scenario: Truncation margin

- **WHEN** the user changes `margin`
- **THEN** the UV domain shrinks or grows away from the punctures at 0, ½, and i/2
- **AND** UV grid resolution is baked (no res GUI knob)
