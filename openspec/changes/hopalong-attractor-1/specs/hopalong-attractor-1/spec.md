## ADDED Requirements

### Requirement: Hopalong Attractor 1 catalog route

The system SHALL expose an active attractor catalog entry with slug `hopalong_attractor_1`, category `attractor`, and a WebGL render mode, distinct from `hopalong_attractor` and `hopalong_attractor_sinusoidal`.

#### Scenario: Route is registered and active

- **WHEN** the shared route registry is loaded
- **THEN** an entry with slug `hopalong_attractor_1` exists with `active: true` and a thumbnail path under `/chaos/icons/`

### Requirement: Archive README iteration map

The Hopalong Attractor 1 page SHALL iterate the 2D map from the archive README (sin typo variant):

- `x' = y - 1 - sqrt(|b x - 1 - c|) * sin(x - 1)`
- `y' = a - x - 1`

It SHALL NOT reuse classic Hopalong’s `sign(x - 1)` multiplier or the sinusoidal cousin’s outer G-based equations.

#### Scenario: One step matches the archive formula

- **WHEN** parameters `a`, `b`, `c` and a seed `(x, y)` are given
- **THEN** the next point equals the README formula above (within floating-point tolerance)

### Requirement: Factory page chrome

The page SHALL be built with `createAttractorPage`, expose knobs for `a`, `b`, `c`, and include About math that documents the sin-for-sign typo origin.

#### Scenario: Page mounts under the slug

- **WHEN** the user opens `/hopalong_attractor_1` (with site basename)
- **THEN** the attractor canvas and parameter controls render without altering other Hopalong routes
