## MODIFIED Requirements

### Requirement: Featured and grid layout
The notebook index SHALL show a featured post block and a grid of additional post cards matching the OD prototype structure (tag, title, excerpt, meta). Published posts MUST link to `/blog/:slug`.

#### Scenario: Content regions present
- **WHEN** the notebook index loads
- **THEN** a featured post section and a “More notes” grid are visible

#### Scenario: Card navigates to post
- **WHEN** a user activates a published post card
- **THEN** they navigate to that post’s `/blog/:slug` route
