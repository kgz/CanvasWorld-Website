## ADDED Requirements

### Requirement: Notebook index route
The frontend SHALL serve a lab notebook index at path `/blog` (React Router basename `/chaos`).

#### Scenario: Direct navigation
- **WHEN** a user opens `/chaos/blog`
- **THEN** the notebook index page renders with hero title “The lab notebook”

### Requirement: Featured and grid layout
The notebook index SHALL show a featured post block and a grid of additional post cards matching the OD prototype structure (tag, title, excerpt, meta).

#### Scenario: Content regions present
- **WHEN** the notebook index loads
- **THEN** a featured post section and a “More notes” grid are visible

### Requirement: Site navigation
Home and notebook pages SHALL link to each other via site nav (Gallery / Notebook or Blog / About as appropriate).

#### Scenario: From home to notebook
- **WHEN** a user clicks the notebook nav link on the home page
- **THEN** they navigate to `/blog`

#### Scenario: Current page indicator
- **WHEN** the notebook index is shown
- **THEN** the notebook nav item is marked as the current page
