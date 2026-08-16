## ADDED Requirements

### Requirement: Classic Hopalong default framing is stage-readable

The classic Hopalong attractor page SHALL use scale and camera framing so the attractor is comfortably visible in the first viewport at mid particle counts without requiring the user to orbit-zoom to find it.

#### Scenario: Mid-count readability

- **WHEN** a user opens `/hopalong_attractor` and transport reaches roughly mid particle count
- **THEN** the attractor occupies a substantial portion of the stage (not a tiny central speck)
- **AND** sibling Hopalong pages remain unchanged

#### Scenario: Interactions preserved

- **WHEN** the user uses orbit controls or the transport bar
- **THEN** pan/zoom/orbit and particle scrub still work
