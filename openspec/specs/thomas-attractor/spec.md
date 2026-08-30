# thomas-attractor Specification

## Purpose
TBD - created by archiving change thomas-attractor. Update Purpose after archive.
## Requirements
### Requirement: Thomas catalog route
The app SHALL serve active slug `thomas_attractor` drawing a 3D Euler trail of Thomas’s cyclically symmetric ODEs with knobs `b` and `dt`.

#### Scenario: Stage loads
- **WHEN** a visitor opens `/chaos/thomas_attractor`
- **THEN** a WebGL line trail appears with Params and About

### Requirement: ODEs match tick
About and iterate SHALL use ẋ = sin(y) − b x (and cyclic) with default b=0.19, dt=0.01, seed (0.1,0,0).

#### Scenario: Defaults
- **WHEN** the page loads
- **THEN** the trail integrates those ODEs from (0.1,0,0)

### Requirement: Thumb and notebook
Gallery thumb and a lab notebook MDX embedding `thomas_attractor` SHALL ship with the change.

#### Scenario: Notebook embed
- **WHEN** the Thomas notebook post opens
- **THEN** VizEmbed of `thomas_attractor` is present

