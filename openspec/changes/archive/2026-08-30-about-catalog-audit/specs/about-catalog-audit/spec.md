## ADDED Requirements

### Requirement: About matches live math

For each active catalog slug, About (`getDescription` or factory `description`) SHALL use the same update as the page tick, mesh, or shader, including parameter names and GUI ranges when those ranges are stated.

#### Scenario: Sierpiński transport 0

- **WHEN** the depth bar is at 0
- **THEN** the fragment shader SHALL sample with depth 0 (filled outer triangle), not clamp to 1

#### Scenario: Ikeda parameter a

- **WHEN** About or catalog states a range for `a`
- **THEN** that range SHALL be `[0, 1]` with default 1
