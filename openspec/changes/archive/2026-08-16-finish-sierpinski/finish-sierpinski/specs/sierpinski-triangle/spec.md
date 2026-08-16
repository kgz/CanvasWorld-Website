## ADDED Requirements

### Requirement: Sierpiński triangle visualization
The product SHALL expose an active fractal route that renders a recursive Sierpiński gasket via grid membership sampling.

#### Scenario: Active ASCII route
- **WHEN** a client requests catalog routes
- **THEN** an entry with slug `sierpinski_triangle` exists with `active: true` and an ASCII-only thumbnail path

#### Scenario: Membership at depth 0
- **WHEN** a point lies inside the outer equilateral triangle at depth 0
- **THEN** membership is true

#### Scenario: Center removed at depth 1
- **WHEN** a point lies in the middle triangle at depth ≥ 1
- **THEN** membership is false
