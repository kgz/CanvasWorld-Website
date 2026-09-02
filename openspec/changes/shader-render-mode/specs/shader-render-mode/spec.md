## ADDED Requirements

### Requirement: Catalog declares render mode for every active slug

Each active entry in `packages/shared/routes.json` SHALL include `renderMode` with value `webgl` or `shader`.

#### Scenario: Shader slugs

- **WHEN** the catalog is loaded
- **THEN** `mandelbrot_set`, `julia_set`, `sierpinski_triangle`, and `perlin_noise` have `renderMode: "shader"`
- **AND** all other active slugs have `renderMode: "webgl"`

### Requirement: Shader pages use Base shader mode without component chrome flags

A page registered with `renderMode: "shader"` SHALL render through `Base` with `ERenderMode.SHADER` and SHALL NOT attach `isShaderViz` or `usesTransportBar` static properties for shell behavior.

#### Scenario: Mandelbrot shell

- **WHEN** `/chaos/mandelbrot_set` loads
- **THEN** the canvas shell hides the particle transport bar based on catalog `renderMode` alone

### Requirement: Optional transport metadata lives in the catalog

When a shader page needs the bottom transport bar, its catalog entry SHALL set `usesTransportBar: true` and MAY set `progressLabel` for scrub copy.

#### Scenario: Sierpiński depth scrub

- **WHEN** `/chaos/sierpinski_triangle` loads outside iframe/screenshot mode
- **THEN** the transport bar is visible with label `depth`
