---
name: lab-notebook-writing
description: >-
  Draft or rewrite Classical Chaos lab notebook posts in beginner-discoverer
  voice. For the full facts→agents→gates pipeline use blog-builder. Use when
  writing or editing blog/MDX under packages/frontend/src/blog/, porting OD
  posts, extracting fact sheets, or when the user mentions notebook voice,
  anti-AI signatures, copyright check, or AI filter.
---

# Lab notebook writing

Voice, MDX shape, and single-post craft. **Full build pipeline** (facts → writer agent → copyright → AI filter → public-reader → fix): skill [blog-builder](../blog-builder/SKILL.md).

## When to use

- Tweaking voice/copy on an existing post
- Fact sheet or rewrite only (user paused the full pipeline)
- Porting `design/canvasworld-prototype/posts/` into app copy

Follow `.cursor/rules/lab-notebook-writing.mdc` when those files are in scope.

## Pipeline (if not using blog-builder)

```text
A fact sheet → B rewrite → C copyright-check → D ai-prose-filter
  → E public-reader-check → apply must-fixes → re-gate C/D → ship
```

Do **not** skip C or D. Read and follow:

- [copyright-check](../copyright-check/SKILL.md)
- [ai-prose-filter](../ai-prose-filter/SKILL.md)
- [public-reader-check](../public-reader-check/SKILL.md) — fresh agent; show report; apply must-fixes unless user said review-only

Always record **AFFORDANCES** (embed vs full canvas) before writing UI claims.

Paste gate verdicts into the chat (or PR notes) when finishing.

## Voice (target)

Write like someone who has never touched this stuff before and is discovering it live — the same energy as starting chaos toys ~15 years ago.

- Curious, concrete, slightly uneven; not a lecture or marketing page
- Say what you saw, what broke your intuition, what you clicked next
- Math stays correct; Classical Chaos brand; no fake authority

Quick ban hints (full scan is `ai-prose-filter`): no delve/tapestry/crucible, no em-dash piles, no “In this post we explored…”.

## Step A — Fact sheet only

```text
- Lorenz 1963 convection model; three ODEs
- Classic params: σ=10, ρ=28, β=8/3
- Bounded + aperiodic → strange attractor
- Sensitivity: tiny seed diff → different wing
- Site: trajectory buffer + reveal + slow rotate
```

Facts only. No lifted sentences. No unique metaphors. No cloned creative outline.

## Step B — Rewrite (clean context)

Fresh turn/agent with **only**: fact sheet + affordances + this voice + `meta` + embed slugs.

Do **not** paste the source article into the rewrite context.

## Step C — Copyright check

Run skill `copyright-check` on the draft. Fix every flag. Proceed only on **clear**.

## Step D — AI prose filter

Run skill `ai-prose-filter` on the draft. Fix every hit. Proceed only on **clear**.

## Step E — Public reader check

Run skill `public-reader-check` (fresh agent). Apply must-fixes; re-run C/D.

## Step F — MDX hygiene

- [ ] Title only in `export const meta` (no duplicate `#` H1 in body)
- [ ] Equations/params still correct
- [ ] Embeds use real catalog slugs
- [ ] No repo paths, filenames, or internal module names in prose
- [ ] UI claims match affordances (embed vs full canvas)

## MDX shape

```mdx
export const meta = {
  slug: 'example',
  title: '…',
  tag: 'Attractors',
  excerpt: '…',
  dateLabel: 'Aug 2026',
  readMinutes: 5,
  thumbSlug: 'lorenz_attractor',
  featured: false,
  order: 40,
}

Opening paragraph — no H1.

<VizEmbed slug="lorenz_attractor" label="Lorenz" />

## Section

…
```

## Multi-agent handoff

Prefer [blog-builder](../blog-builder/SKILL.md) for end-to-end.

**Extract:** “Facts-only bullets for [topic]. No prose.”

**Rewrite:** “Using only these bullets + affordances, write MDX in lab-notebook discoverer voice. Embeds: [slugs].”

**Gate:** “Run copyright-check, then ai-prose-filter, on this draft. Report both verdicts.”

**Public sense:** “Run public-reader-check on this draft (independent agent). Report only.”
