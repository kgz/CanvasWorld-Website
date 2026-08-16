# Shared CanvasWorld catalog
#
# `routes.json` is the single source of truth for visualization metadata
# (slug, title, category, description, thumbnail, renderMode, active).
#
# Consumers:
# - Frontend: import via `@cw/routes` (Vite alias)
# - Backend: loads at runtime (`CW_ROUTES_CATALOG` or `../shared/routes.json` / `./routes.json`)
# - Thumbs: `packages/frontend/scripts/capture-thumbs.mjs`
