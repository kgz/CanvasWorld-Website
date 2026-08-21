---
name: blog-builder
description: >-
  End-to-end Classical Chaos lab notebook builder: facts sheet, clean-context
  rewrite agent, copyright-check, ai-prose-filter, independent public-reader
  review, then apply must-fixes and re-gate. Use when the user asks to build /
  write / ship a blog post, notebook MDX, or “facts then agents then gates”,
  or to run the full blog pipeline for packages/frontend/src/blog/posts/.
---

# Blog builder

Orchestrates a **new or full rewrite** of a Classical Chaos notebook post the way we ship them: facts → isolated writer → gates → independent public review → fix → re-gate.

Voice + MDX hygiene details live in [lab-notebook-writing](../lab-notebook-writing/SKILL.md) and `.cursor/rules/lab-notebook-writing.mdc`. This skill is the **pipeline**. Do not skip steps.

## Pipeline

```text
0 intakes → 1 facts → 2 affordances → 3 write (fresh agent)
  → 4 copyright → 5 ai-prose → 6 public-reader (fresh agent)
  → 7 apply must-fix (+ should-fix if user wants)
  → 8 re-run 4–5 (and 6 if large edits) → 9 ship checklist
```

Paste every gate verdict into chat before calling the post done.

## Step 0 — Intake

Confirm with the user (or infer from ticket):

| Need | Example |
|------|---------|
| Topic / angle | “Why the Lorenz attractor never closes” |
| Catalog slug(s) for embeds | `lorenz_attractor` |
| Sources for facts | page impl, OpenSpec, OD prototype, ticket notes |
| `meta` hints | tag, featured, order, dateLabel |

Do **not** start writing prose in this step.

## Step 1 — Fact sheet (this agent or Task)

Read implementation / notes. Output **bullets only**:

- Math / history facts (discoverer, year, equations, classic params)
- Site behavior (integrator, defaults, seed, particle/trail notes)
- What the viz shows (color, framing, grow-in, etc.)
- No sentences lifted from third-party articles
- No metaphors, jokes, or creative outline

Show the fact sheet to the user if they asked to review facts first; otherwise proceed.

## Step 2 — Affordance note (required)

Write a short **AFFORDANCES** block the writer and reviewers must honor:

```text
AFFORDANCES:
- Notebook embed: [e.g. grows trail via animateN; pause; Open full →]
- Notebook embed does NOT: [e.g. transport n scrub; param knobs a/b/c]
- Full canvas: [scrub n; presets; drag to rotate; σ/ρ/β knobs…]
- CTA: [e.g. Callout to="/slug" — Goto full canvas]
```

Verify against `VizEmbed` usage in the draft plan and the real page under `packages/frontend/src/pages/`. Inventing UI is a hard fail in step 6.

## Step 3 — Write (fresh Task agent)

Spawn a **new** agent with **only**:

- Fact sheet
- Affordance note
- Voice from lab-notebook-writing (discoverer, Classical Chaos)
- Target path: `packages/frontend/src/blog/posts/<slug>.mdx`
- MDX shape (`export const meta`, no body H1, `VizEmbed`, optional `Callout to=…`)
- Excerpt: search-shaped topic first, implementation second
- Never name repo paths / filenames / internal APIs in prose
- Avoid **spec-sheet voice**: particle budgets, iframe queue, camera z, framing scale, and long default dumps belong later or not at all — lead with what you see and why it matters
- **Never** put an affordance inventory before/after `<VizEmbed>` (Pause/Open full/knobs/HUD/scrub lists). Curiosity → embed; knobs belong in Callout or a short full-canvas section. See [voice-notes.md](voice-notes.md).

**Do not** paste source articles or prior draft prose into the writer.

Prompt skeleton:

```text
Write packages/frontend/src/blog/posts/<slug>.mdx using ONLY the fact sheet
and affordances below. Lab-notebook discoverer voice. No H1 in body.
Embeds: <slugs>. Match AFFORDANCES (no UI claims the embed lacks).
Excerpt: topic/curiosity first, how-we-draw second.
Return the full MDX file contents.
```

Parent agent writes the file from the writer output (or lets the writer write the file if scoped to that path only).

## Step 4 — Copyright check

Read and follow [copyright-check](../copyright-check/SKILL.md). Prefer a **fresh** Task agent (review-only).

- Verdict must be **clear** before continuing
- Fix every flag, then re-run until clear

## Step 5 — AI prose filter

Read and follow [ai-prose-filter](../ai-prose-filter/SKILL.md). Prefer the same gate agent as step 4 or a fresh one.

- Verdict must be **clear** before continuing
- Fix every hit, then re-run until clear

## Step 6 — Independent public-reader check

Read and follow [public-reader-check](../public-reader-check/SKILL.md).

**Always** use a fresh Task agent. Pass full MDX + AFFORDANCES. Review only — no rewrite in that agent.

Show the report to the user.

## Step 7 — Apply review feedback

Default:

1. Apply all **must-fix**
2. Apply **should-fix** unless the user said review-only
3. Skip **nice-to-have** unless asked

After edits, re-run steps **4** and **5**. Re-run **6** only if the through-line, CTA, or UI claims changed substantially.

## Step 8 — Ship checklist

- [ ] File under `packages/frontend/src/blog/posts/` (registry auto-globs `*.mdx`)
- [ ] Real catalog slugs in `VizEmbed` / `thumbSlug` / `Callout to`
- [ ] Title only in `meta` (no `#` H1)
- [ ] Equations/params match facts
- [ ] Affordance-accurate (embed vs full canvas)
- [ ] copyright-check **clear**
- [ ] ai-prose-filter **clear**
- [ ] public-reader-check report shown; must-fixes applied
- [ ] No commit unless the user asked

## Components cheat sheet

| MDX | Use |
|-----|-----|
| `<VizEmbed slug="…" label="…" animateN />` | Live embed; `animateN` only if grow-in is intended |
| `<VizEmbedGrid>…</VizEmbedGrid>` | Staggered multi-embed |
| `<Callout>` | Static note |
| `<Callout to="/catalog_slug">` | Clickable callout + arrow (full-canvas CTA) |
| `<BlockMath>` / `<InlineMath>` | KaTeX via PostPage |

Wired in `PostPage` `mdxComponents`.

## Parallelism

- Steps 4 and 5 may share one gate agent in a single prompt (both skill formats).
- Step 3 writer and step 6 reviewer must stay **isolated** from each other and from source articles.
- Do not run writer and public-reader in the same agent context.

## Stop conditions

- User says stop / review-only after step 6 → deliver report, do not edit
- Gate stuck after two fix loops → paste remaining hits and ask the user
- Missing catalog slug or unknown affordances → stop and ask; do not invent

## Related skills

- [lab-notebook-writing](../lab-notebook-writing/SKILL.md) — voice + MDX shape
- [copyright-check](../copyright-check/SKILL.md)
- [ai-prose-filter](../ai-prose-filter/SKILL.md)
- [public-reader-check](../public-reader-check/SKILL.md)
