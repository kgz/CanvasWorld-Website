## ADDED Requirements

### Requirement: Particle page factory
The frontend SHALL provide a `createAttractorPage` factory that builds a React page from configuration (params, iterate, seed, scale, color, camera, description) and attaches a static `getDescription` used by the viz chrome.

#### Scenario: Factory page loads
- **WHEN** a route uses a factory-built default export
- **THEN** DatGui params initialize, particles animate via the configured iterate, and the sidebar can call `getDescription()`

### Requirement: Wave-1 migrations
Clifford Attractor, Henon Map, and all Hopalong variants SHALL be implemented via the factory without changing their URL slugs.

#### Scenario: Slugs unchanged
- **WHEN** a user opens `/clifford_attractor`, `/henon_map`, or a Hopalong slug
- **THEN** the corresponding visualization still loads at that path

### Requirement: Shader escape hatch
Mandelbrot (shader render mode) SHALL remain a hand-rolled page outside the particle factory.

#### Scenario: Mandelbrot untouched
- **WHEN** a user opens `/mandelbrot_set`
- **THEN** the existing shader-based page still runs
