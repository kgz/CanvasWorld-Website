## 1. Registry and component

- [ ] 1.1 Add `packages/frontend/src/glossary/terms.ts` with ≥15 curated entries (polynomial, attractor, phase-plane, isosurface, …)
- [ ] 1.2 Add `GlossaryTerm.tsx` + module CSS: inline button trigger, popover panel, unknown-slug soft fallback
- [ ] 1.3 Add `@floating-ui/react-dom` (or equivalent) for flip/shift inside About panel and MDX column
- [ ] 1.4 Implement keyboard (Enter/Space/Escape), `:focus-visible` ring, coarse-pointer tap toggle, fine-pointer hover, outside dismiss

## 2. Wire authoring surfaces

- [ ] 2.1 Register `GlossaryTerm` in `PostPage.tsx` `mdxComponents`
- [ ] 2.2 Export `GlossaryTerm` from a stable import path for viz `getDescription` JSX
- [ ] 2.3 Pilot: add terms to two viz About blocks (e.g. Lorenz + Hopf or mesh page)
- [ ] 2.4 Pilot: add at least one `GlossaryTerm` in `lorenz-never-closes.mdx` (or another high-traffic post)

## 3. Verify

- [ ] 3.1 `pnpm run build` in `packages/frontend`
- [ ] 3.2 Manual: keyboard tab → open gloss → Escape on post + viz About
- [ ] 3.3 Manual: touch/coarse pointer tap toggle + dismiss outside on mobile or devtools emulation
- [ ] 3.4 Manual: popover not clipped at bottom of About side panel
