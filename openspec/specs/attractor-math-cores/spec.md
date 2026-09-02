# attractor-math-cores Specification

## Purpose
TBD - created by archiving change attractor-math-cores. Update Purpose after archive.
## Requirements
### Requirement: Core iterate functions live in utils

Clifford, Hopalong (classic/positive/additive/sinusoidal), and Hénon SHALL expose pure `*Tick` functions under `packages/frontend/src/utils/` with no React or Three.js imports.

#### Scenario: Page wiring

- **WHEN** a listed attractor page runs its animation tick
- **THEN** it delegates to the corresponding util `*Tick` function

### Requirement: Unit tests cover iterate math

Each extracted `*Tick` SHALL have Vitest tests that verify the discrete map equations and finite output for default parameters.

#### Scenario: Clifford equation

- **WHEN** `cliffordAttractorTick` is called with known x, y, and parameters
- **THEN** the result matches the sine/cosine update formulas

