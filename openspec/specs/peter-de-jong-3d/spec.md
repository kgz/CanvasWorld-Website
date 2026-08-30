# peter-de-jong-3d Specification

## Purpose
TBD - created by archiving change peter-de-jong-3d. Update Purpose after archive.
## Requirements
### Requirement: 3D Peter de Jong catalog route

The app SHALL serve an active catalog slug `peter_de_jong_attractor_3d` that draws a progressive 3D trail of the archive discrete Peter de Jong map with knobs `a`…`f`.

#### Scenario: Stage loads

- **WHEN** a visitor opens `/chaos/peter_de_jong_attractor_3d`
- **THEN** a WebGL trail of the 3D map is shown with Params and About
- **AND** the slug is distinct from `peter_de_jong_attractor` (2D)

### Requirement: Map matches About and tick

About and the iterate SHALL use the same simultaneous update rules with archive defaults `a=2.695`, `b=1.72`, `c=1.178`, `d=0.311`, `e=-1`, `f=-1`, seed `(0,0,0)`.

#### Scenario: Defaults

- **WHEN** the page loads with default knobs
- **THEN** each step uses \(x'=\sin(a z)-\cos(b x)\), \(y'=\sin(c x)-\cos(d y)\), \(z'=\sin(e y)-\cos(f z)\) from the previous state
- **AND** plotted positions are scaled archive-style (×50)

### Requirement: Gallery thumb

A gallery thumbnail SHALL exist at the catalog thumbnail path for `peter_de_jong_attractor_3d`.

#### Scenario: Home gallery

- **WHEN** the home gallery renders the 3D Peter de Jong card
- **THEN** it shows the regenerated thumb for that slug

### Requirement: Lab notebook

A lab notebook MDX post SHALL embed `peter_de_jong_attractor_3d` and appear in the notebook index / SEO export.

#### Scenario: Embed

- **WHEN** a reader opens the 3D Peter de Jong notebook post
- **THEN** a VizEmbed of `peter_de_jong_attractor_3d` is present

