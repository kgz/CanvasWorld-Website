## MODIFIED Requirements

### Requirement: Sierpiński triangle visualization
The product SHALL render the Sierpiński gasket with GPU fragment evaluation and interactive zoom/pan.

#### Scenario: Mouse-wheel zoom
- **WHEN** the user scrolls over the canvas
- **THEN** the view zooms toward the cursor and gasket detail increases with depth

#### Scenario: Depth control
- **WHEN** the user raises max depth
- **THEN** additional recursive removals appear (until float precision collapses)
