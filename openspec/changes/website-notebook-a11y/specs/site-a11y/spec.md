## ADDED Requirements

### Requirement: Skip link and main landmark

Home, notebook index, and post pages SHALL expose a skip link as the first focusable control, targeting a single `<main id="main">` on that page.

#### Scenario: Tab from load on home

- **WHEN** a user tabs from page load on `/` or `/blog`
- **THEN** the first stop is a skip link that moves focus to `#main`

#### Scenario: Home has one main

- **WHEN** a user opens the home page
- **THEN** the document contains exactly one `<main id="main">` wrapping primary content (hero, gallery, notes)

### Requirement: Labelled site nav and current page

Site navigation SHALL have an accessible name. `aria-current="page"` SHALL be set only on the Notebook link when the notebook index is showing, not on post pages.

#### Scenario: Screen reader lists nav

- **WHEN** a screen reader lists landmarks on home, `/blog`, or a post
- **THEN** it finds a navigation named “Site” (or equivalent) and can tell home vs notebook vs a post

#### Scenario: Post does not claim notebook index

- **WHEN** a user is on `/blog/{slug}`
- **THEN** the Notebook link is not `aria-current="page"`

### Requirement: Visible keyboard focus

Interactive home, notebook, and post chrome (CTAs, cards, search, prev/next, nav links) SHALL show a `:focus-visible` ring. Controls SHALL remain reachable and activatable from the keyboard.

#### Scenario: Tab through gallery and notes

- **WHEN** a keyboard user tabs through gallery cards, featured/note cards, and post prev/next
- **THEN** each control shows a visible focus ring and activates with Enter

#### Scenario: Blog search keeps a ring

- **WHEN** a keyboard user focuses the notebook search field
- **THEN** a focus ring is visible (no `outline: none` without a replacement)

### Requirement: Accessible names on cards and icon controls

A gallery card’s accessible name SHALL be the visualisation name. A featured or note card’s accessible name SHALL be the post title. Icon-only buttons SHALL have an accessible name.

#### Scenario: Gallery card name

- **WHEN** a screen reader reads a gallery card
- **THEN** it announces the viz name (thumb is decorative if the name is already in the link)

#### Scenario: Featured note name

- **WHEN** a screen reader reads a featured or list card on `/blog` or home notes
- **THEN** it announces the post title

### Requirement: About is a described region

The `#about` target SHALL be a footer (or other landmark) with an accessible name, not an unlabeled one-line fragment.

#### Scenario: About from nav

- **WHEN** a user follows the About link
- **THEN** focus/hash lands on a region a screen reader can list as About

### Requirement: Reduced motion on site chrome

Home hero, gallery entrance, and smooth-scroll “Random” SHALL honor `prefers-reduced-motion: reduce`. Body text vs muted chrome SHALL meet WCAG AA contrast.

#### Scenario: Reduced motion on home

- **WHEN** the user prefers reduced motion
- **THEN** the hero canvas does not auto-run a motion loop, gallery cards do not stagger-animate in, and Random scroll is instant
