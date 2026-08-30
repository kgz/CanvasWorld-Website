## ADDED Requirements

### Requirement: Clebsch cubic mesh route
The site SHALL expose an active `clebsch_cubic` route that renders a lit triangle mesh of the Clebsch diagonal cubic (Hunt/Nordstrand affine chart).

#### Scenario: Default mesh loads
- **WHEN** a user opens `/clebsch_cubic` with default params
- **THEN** a lit double-sided mesh of the cubic appears and may auto-rotate outside screenshot mode

#### Scenario: Catalog entry
- **WHEN** the gallery lists misc visualizations
- **THEN** Clebsch Cubic appears under category `misc` with slug `clebsch_cubic`

### Requirement: About copy mentions 27 lines
The About panel SHALL state that this is the diagonal cubic on which all 27 lines are real, and SHALL show the affine cubic equation used by the mesh.

#### Scenario: About math
- **WHEN** a user opens About on `/clebsch_cubic`
- **THEN** the copy references the 27 real lines and the Hunt/Nordstrand cubic field
