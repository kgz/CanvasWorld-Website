# peter-de-jong-2d Specification

## Purpose
TBD - created by archiving change peter-de-jong-2d. Update Purpose after archive.
## Requirements
### Requirement: Peter de Jong catalog route
Active slug `peter_de_jong_attractor` SHALL draw the 2D iterated map with knobs a–d.

#### Scenario: Stage loads
- **WHEN** visitor opens `/chaos/peter_de_jong_attractor`
- **THEN** a point cloud of the map appears with Params and About

### Requirement: Map matches About
Iterate SHALL be x′ = sin(a y) − cos(b x), y′ = sin(c x) − cos(d y).

#### Scenario: Defaults
- **WHEN** defaults load
- **THEN** a=2.695, b=1.72, c=1.178, d=0.311, seed (0,0)

### Requirement: Thumb and notebook
Gallery thumb and MDX embedding the slug SHALL ship.

#### Scenario: Notebook
- **WHEN** post opens
- **THEN** VizEmbed of `peter_de_jong_attractor` is present

