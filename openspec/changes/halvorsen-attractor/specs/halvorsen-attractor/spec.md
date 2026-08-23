## ADDED Requirements

### Requirement: Halvorsen catalog route
The app SHALL serve an active catalog slug `halvorsen_attractor` that draws a 3D Euler trail of the classic Halvorsen ODEs with knobs `a` and `dt`.

#### Scenario: Stage loads
- **WHEN** a visitor opens `/chaos/halvorsen_attractor`
- **THEN** a WebGL line trail of the Halvorsen system is shown with Params and About

### Requirement: ODEs match About and tick
About and the iterate SHALL use the same cyclically symmetric ODEs with defaults a=1.4, dt=0.01, seed (−5,0,0).

#### Scenario: Defaults
- **WHEN** the page loads with default knobs
- **THEN** the trail integrates ẋ = −a x − 4y − 4z − y² (and cyclic) from (−5,0,0)

### Requirement: Gallery thumb
A gallery thumbnail SHALL exist at the catalog thumbnail path for `halvorsen_attractor`.

#### Scenario: Home gallery
- **WHEN** the home gallery renders the Halvorsen card
- **THEN** it shows the regenerated thumb for that slug

### Requirement: Lab notebook
A lab notebook MDX post SHALL embed `halvorsen_attractor` and appear in the notebook index / SEO export.

#### Scenario: Embed
- **WHEN** a reader opens the Halvorsen notebook post
- **THEN** a VizEmbed of `halvorsen_attractor` is present
