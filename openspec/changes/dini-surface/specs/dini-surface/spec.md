## ADDED Requirements

### Requirement: Dini’s surface is available as a 3D mesh viz

The site SHALL expose an active `dini_surface` route that renders a lit triangle mesh of Dini’s surface (pseudospherical helicoid).

#### Scenario: Default surface

- **WHEN** a user opens `/dini_surface` with default params
- **THEN** vertices use \(x=a\cos u\sin v\), \(y=a\sin u\sin v\), \(z=a(\cos v+\ln\tan(v/2))+b u\) with default \(a\approx 1\), \(b\approx 0.2\)
- **AND** \(u\) spans a baked multi-turn interval and \(v\) stays in a band away from \(0\) and \(\pi\)
- **AND** `Base` uses `drawMode: 'mesh'` with lights

#### Scenario: Shape params

- **WHEN** the user changes GUI `a` or `b`
- **THEN** the mesh rebuilds with the new radius/twist
- **AND** UV resolution is not a GUI control

#### Scenario: Catalog + chrome

- **WHEN** the gallery lists active viz
- **THEN** Dini’s surface appears under category `misc` with title "Dini's Surface"
- **AND** About copy names Dini’s surface and the pseudosphere
- **AND** transport `n` scrubs visible triangle count
