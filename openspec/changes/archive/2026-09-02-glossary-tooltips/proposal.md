## Why

Beginners reading About panels and lab notebooks hit math jargon (attractor, polynomial, phase plane, isosurface) without a quick plain-language gloss. A lightweight inline definition on hover or tap keeps them on the page instead of opening a separate glossary route or leaving to search.

## What Changes

- Curated shared term list with one-line Classical-Chaos-flavoured definitions (not Wikipedia dumps)
- Reusable `GlossaryTerm` inline component for MDX notebooks and viz About JSX
- Accessible tooltip/popover: keyboard focus, Escape to dismiss, tap-to-toggle on touch, visible focus ring
- Seed ~15–20 high-frequency chaos/geometry terms; expand over time via the shared list
- Wire component into `MDXProvider` on post pages; use in a handful of pilot About descriptions and one notebook post as proof

## Capabilities

### New Capabilities

- `glossary-tooltips`: Curated term registry, inline gloss trigger + popover UI, and authoring hooks for About panels and MDX notebooks

### Modified Capabilities

<!-- none — additive feature; blog-posts and site-a11y behaviour unchanged at spec level -->

## Impact

- `packages/frontend/src/glossary/` — term registry + `GlossaryTerm` component and styles
- `packages/frontend/src/pages/PostPage.tsx` — register `GlossaryTerm` in `mdxComponents`
- `packages/frontend/src/pages/template-modern.tsx` — About body can render glossary terms (via shared component imported in viz `getDescription` JSX)
- Pilot edits: 2–3 viz `getDescription` blocks + 1 MDX post
- Optional small dependency for popover positioning (e.g. `@floating-ui/react-dom`) if pure CSS is insufficient for panel overflow
- Closes #178
