## ADDED Requirements

### Requirement: Perlin Noise is available as a shader field viz

The site SHALL expose an active `perlin_noise` route that renders a fullscreen 2D improved Perlin noise field via `Base` shader mode.

#### Scenario: Default field

- **WHEN** a user opens `/perlin_noise` with default params
- **THEN** the stage fills with an animated multi-octave Perlin field
- **AND** hue comes from the noise value (cyan–magenta band)
- **AND** `Base` uses `renderMode: SHADER`

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Perlin Noise appears under category `misc` with title "Perlin Noise" and thumb
- **AND** About copy names Ken Perlin / gradient noise and the Params (scale, octaves, speed)

#### Scenario: Params

- **WHEN** the user changes scale, octaves, or speed
- **THEN** the shader uniforms update and the field reflects the new frequency, octave count, and animation rate
