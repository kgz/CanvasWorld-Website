## Context

Issue #1. Slugs already aligned by #3; catalogs are still duplicated.

## Goals / Non-Goals

**Goals:**
- One JSON file to add/edit viz metadata
- Explicit `slug` fields (no runtime genPath for registry identity)
- `active: false` for stubs (brusselator, sierpiński until FE-wired)
- FE keeps a `Record<slug, Component>` map

**Non-Goals:**
- Lazy/code-split pages (#17)
- ASCII-only slug rename (#16)
- AttractorPage factory (#2)

## Decisions

1. **SoT = `packages/shared/routes.json`** — language-neutral.
2. **Go loads from disk** (`CW_ROUTES_CATALOG` or `../shared/routes.json` / `./routes.json`) — embed avoided so Docker copies the file beside the binary.
3. **API `GET /api/routes`** returns `{ [slug]: { description, title, category, … } }` for backward-compatible map shape, built from active+inactive entries (or all entries; screenshots filter `active`).
4. **Screenshot-all / thumbs** iterate `active: true` only.
5. **genPath retained** for display-name helpers where needed; gallery/router prefer catalog `slug`.

## Risks / Trade-offs

- [Missing catalog file at runtime] → fail fast on backend start with clear path hint
- [FE component map out of sync] → skip or warn for active entries without a component; do not invent routes
