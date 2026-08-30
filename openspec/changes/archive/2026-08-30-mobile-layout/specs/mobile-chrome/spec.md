## ADDED Requirements

### Requirement: Viz params can be closed and reopened on a phone

The visualization chrome SHALL provide a params control that remains reachable on viewports ≤900px after the panel is closed. The overlay panel SHALL include an in-panel close control. Tapping the scrim SHALL close the panel. The panel SHALL NOT cover its open/close toggle.

#### Scenario: Reopen after close

- **WHEN** a visitor on a ~390px viewport closes the params panel
- **THEN** they can reopen it from a visible control without the drawer blocking that control

### Requirement: Phone chrome does not clip or collide

On viewports ≤900px the viz topbar SHALL keep wordmark-or-home, truncated title, and icon actions in view. Action buttons SHALL have `aria-label` and SHALL NOT become empty pills. Transport and FPS SHALL NOT overlap tappable controls.

#### Scenario: Gallery control

- **WHEN** chrome button labels are hidden
- **THEN** Gallery still shows an icon and remains labeled for assistive tech

### Requirement: Site nav on phone

Home, blog index, and notebook posts SHALL collapse nav links behind a menu toggle at ≤720px. The menu SHALL open and close, and Escape SHALL close it.

#### Scenario: Open menu

- **WHEN** a visitor taps the menu toggle on a ~390px home or notebook page
- **THEN** Gallery, Notebook, About, and matf.dev are reachable
