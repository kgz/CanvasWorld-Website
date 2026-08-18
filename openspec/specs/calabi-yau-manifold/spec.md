# calabi-yau-manifold Specification

## Purpose
TBD - created by archiving change calabi-yau-manifold. Update Purpose after archive.
## Requirements
### Requirement: Calabi–Yau slice is available as a 3D mesh viz

The site SHALL expose an active `calabi_yau` route that renders a lit triangle mesh of the Hanson Fermat slice \(z_1^n + z_2^n = 1\) projected to \(\mathbb{R}^3\).

#### Scenario: Default quintic

- **WHEN** a user opens `/calabi_yau` with default params
- **THEN** degree \(n=5\) and all \(5 \times 5\) Riemann patches are meshed
- **AND** vertices use \(z_1 = e^{2\pi i k_1/n}[\cos(x+iy)]^{2/n}\), \(z_2 = e^{2\pi i k_2/n}[\sin(x+iy)]^{2/n}\) with \(x \in [0,\pi/2]\), \(y \in [-\pi/2,\pi/2]\)
- **AND** the 3D point is \((\operatorname{Re} z_1,\ \operatorname{Re} z_2,\ \cos a\cdot\operatorname{Im} z_1 + \sin a\cdot\operatorname{Im} z_2)\)

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Calabi–Yau appears under category `misc` with thumb
- **AND** About copy states this is a 2-real-dimensional slice of the quintic, not the full 6-real Calabi–Yau 3-fold
- **AND** transport `n` scrubs visible triangle count

#### Scenario: Mesh primitive

- **WHEN** the page draws
- **THEN** `Base` uses an indexed mesh with lights (not points or a line strip)
- **AND** screenshot mode draws the full mesh and marks the canvas ready without waiting on a particle fill

