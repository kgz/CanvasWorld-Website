# hilbert-curve Specification

## Purpose
TBD - created by archiving change hilbert-curve. Update Purpose after archive.
## Requirements
### Requirement: Hilbert curve catalog route
The system SHALL expose an active catalog entry with slug `hilbert_curve`, category `fractal`, and a thumbnail under `/chaos/icons/hilbert_curve.png`.

#### Scenario: Active fractal entry
- **WHEN** a client loads the shared route catalog
- **THEN** an entry with slug `hilbert_curve` exists with `active: true` and an ASCII-only thumbnail path

### Requirement: Hilbert index mapping viz
The system SHALL draw the 2D Hilbert curve by mapping successive Hilbert indices to grid coordinates and revealing points in index order.

#### Scenario: Grow-in along the curve
- **WHEN** a user opens `/hilbert_curve`
- **THEN** particles appear along the Hilbert path in index order up to the current order’s `N²` length

#### Scenario: Order controls grid size
- **WHEN** the order parameter is set to an integer `k` in the supported range
- **THEN** the curve uses grid size `N = 2^k` and at most `N²` points

