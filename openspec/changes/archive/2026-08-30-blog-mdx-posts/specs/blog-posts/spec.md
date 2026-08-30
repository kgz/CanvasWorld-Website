## ADDED Requirements

### Requirement: Post routes from MDX
The frontend SHALL serve notebook articles at `/blog/:slug` loaded from MDX modules under the frontend package.

#### Scenario: Open a known post
- **WHEN** a user navigates to `/chaos/blog/lorenz-never-closes`
- **THEN** the article page renders with title, tag, and body content

#### Scenario: Unknown slug
- **WHEN** a user navigates to `/chaos/blog/does-not-exist`
- **THEN** they are redirected to `/blog` or shown a not-found state that links back to the notebook index

### Requirement: Article chrome matches design
Post pages SHALL include a back link to the notebook index, doc header (tag, title, meta), and footer navigation between posts when next/prev exist.

#### Scenario: Back to notebook
- **WHEN** a user clicks the back control on a post
- **THEN** they navigate to `/blog`
