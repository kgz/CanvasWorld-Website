## ADDED Requirements

### Requirement: Curated glossary registry

The frontend SHALL maintain a curated, readonly map of glossary term slugs to plain-language definitions suitable for Classical Chaos About copy and lab notebooks.

Each entry SHALL include at least a display label and a one- to two-sentence definition. Entries MAY include an optional short “in this context” line for viz-specific wording.

#### Scenario: Known term resolves

- **WHEN** `GlossaryTerm` is rendered with `term="attractor"` and the slug exists in the registry
- **THEN** the component uses the registry label (unless children override visible text) and the registry definition for the popover body

#### Scenario: Unknown slug fails soft

- **WHEN** `GlossaryTerm` is rendered with a slug not present in the registry
- **THEN** the visible text (children or slug) renders as plain inline text with no popover and no runtime error in production

### Requirement: Inline glossary trigger in prose

Authors SHALL be able to mark glossary terms inline in viz About JSX and in MDX notebook posts using a shared `GlossaryTerm` component.

The trigger SHALL appear as inline text (not a block) with a visual affordance (e.g. dotted underline) distinct from normal links.

#### Scenario: MDX post uses glossary term

- **WHEN** a notebook MDX file contains `<GlossaryTerm term="attractor" />`
- **THEN** the rendered post shows the term inline with the glossary affordance

#### Scenario: About panel uses glossary term

- **WHEN** a viz `getDescription()` JSX tree includes `<GlossaryTerm term="isosurface" />`
- **THEN** the About section in the side panel shows the term with the same affordance as MDX

### Requirement: Accessible glossary popover

The glossary popover SHALL be operable with keyboard and touch, and SHALL expose the definition to assistive technology.

#### Scenario: Keyboard open and dismiss

- **WHEN** a keyboard user focuses a glossary trigger and activates it (Enter or Space)
- **THEN** the definition popover opens, receives appropriate ARIA attributes (`aria-expanded`, labelled content), and closes on Escape

#### Scenario: Visible focus on trigger

- **WHEN** a keyboard user tabs to a glossary trigger
- **THEN** a visible `:focus-visible` ring appears (consistent with site chrome focus styling)

#### Scenario: Touch toggle

- **WHEN** a user on a coarse-pointer device taps a glossary trigger
- **THEN** the popover toggles open; tapping outside the popover dismisses it

#### Scenario: Hover on fine pointer

- **WHEN** a user with a fine pointer hovers a glossary trigger
- **THEN** the popover opens without requiring click; moving pointer away or blurring the trigger dismisses it

### Requirement: Popover layout in constrained panels

The popover SHALL remain readable when opened inside the viz About side panel and within the MDX article column (no permanent clipping off-screen when space allows).

#### Scenario: About side panel overflow

- **WHEN** a glossary trigger near the bottom of the About side panel is activated
- **THEN** the popover flips or shifts so the definition text remains visible within the viewport or panel scroll area

### Requirement: Initial term coverage

The registry SHALL ship with at least fifteen curated terms drawn from high-frequency chaos, geometry, and dynamics vocabulary used on the site (including `polynomial`, `attractor`, `phase-plane`, and `isosurface`).

#### Scenario: Issue examples present

- **WHEN** a developer inspects the initial registry
- **THEN** entries exist for `polynomial`, `attractor`, `phase-plane`, and `isosurface` with plain-language definitions

### Requirement: Pilot authoring

At least two viz About descriptions and one lab notebook MDX post SHALL use `GlossaryTerm` for at least one term each, demonstrating both authoring surfaces.

#### Scenario: Pilot notebook post

- **WHEN** a user reads a pilot notebook post linked in the change PR
- **THEN** at least one glossary term in the body shows the inline gloss affordance

#### Scenario: Pilot About copy

- **WHEN** a user opens a pilot viz page and scrolls to About
- **THEN** at least one glossary term in the About body shows the inline gloss affordance
