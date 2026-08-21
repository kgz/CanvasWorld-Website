---
name: public-reader-check
description: >-
  Independent review of Classical Chaos lab notebook (or other public copy) for
  public-reader sense, language/tone, UI claims vs what the page actually shows,
  and on-page SEO wording (title, excerpt, H2s, early body). Use when the user
  asks for a public-person check, sense check, language review, or SEO word
  check on blog/MDX; after drafting notebook posts; or before ship when
  wondering if non-experts follow the piece. Review only — do not rewrite
  unless asked.
---

# Public reader check

Independent pass. **Do not rewrite** the post unless the user asks for edits after the report.

Prefer launching a **fresh Task agent** with the full post text + this skill’s criteria so the check is not contaminated by the drafting context. If running inline, still stay review-only and critical.

## Scope

- Primary: `packages/frontend/src/blog/posts/*.mdx` (Classical Chaos lab notebook)
- Also: any public-facing prose the user points at

This is **not** the technical SEO ticket (meta tags, sitemap, canonicals). Only **words on screen**: title, excerpt, headings, early paragraphs, CTAs.

Sibling gates (different jobs):

- [copyright-check](../copyright-check/SKILL.md) — expression / paraphrase risk
- [ai-prose-filter](../ai-prose-filter/SKILL.md) — AI tells / banned gloss

## Context the reviewer needs

Paste or attach:

1. Full MDX body + `export const meta` (title, excerpt, slug)
2. What the **notebook page** actually affords vs **full canvas** (e.g. VizEmbed grows trail / pause / Open full; no transport `n` scrub; param knobs live on full stage)
3. Any live CTA copy (`Callout to=…`, button labels)

If embed vs full-canvas behavior is unknown, say so — do not invent UI.

## Review criteria

### 1. Public reader sense

Curious non-expert or lightly technical person:

- Can they follow the through-line from open → payoff?
- Where do they stall (jargon cliff, unexplained symbols)?
- Do any lines claim controls that **are not on this view** (knobs, scrub `n`, orbit, presets)?
- Is “orbit” / similar ambiguous (camera rotate vs periodic orbit)?

### 2. Language / tone

- Clarity, jargon load, awkward phrases
- Lab-notebook discoverer voice vs lecture, marketing gloss, or **spec-sheet / catalog inventory** (param dumps, particle budgets, camera z, framing scale) before the reader has a reason to care
- Prefer what you saw on the cards over engine notes; math supports the looking
- **Hard fail:** affordance inventory next to the embed (pan/zoom/pause/knobs/HUD/Open full stacked). See [blog-builder/voice-notes.md](../blog-builder/voice-notes.md)
- **Hard fail:** selling by listing what the notebook lacks (“does not do click-to-Julia…”) — pitch what the full stage offers instead
- Quote specific sentences when flagging

### 3. On-page SEO wording

| Surface | Ask |
|--------|-----|
| Title | Primary topic + curiosity/intent without clickbait? |
| Excerpt | Search-shaped first (topic people query), implementation second? |
| H2s | Readable purpose; any natural query phrases without stuffing? |
| Early body | Core entity named early (e.g. Lorenz attractor, strange attractor)? |

No keyword stuffing. Optional better phrasings as bullets only.

## Output format (required)

```markdown
## Verdict
1–2 sentences.

## Strengths
- …

## Issues by severity

### Must-fix
- **Label** — quote + why (especially UI mismatch)

### Should-fix
- …

### Nice-to-have
- …

## SEO word-on-screen notes
Short table or bullets for title / excerpt / H2s / early body.
Optional phrasing bullets if useful.

## Top 3 concrete edits
If only three changes were allowed.
```

Be independent and critical. End after the report unless the user asks to apply edits.

## Task-agent prompt skeleton

Use when spawning a subagent:

```text
Independent reviewer. Do NOT rewrite. Evaluate only.

POST:
[paste meta + body]

AFFORDANCES:
- Notebook embed: […]
- Full canvas: […]

Criteria: public reader sense, language/tone, UI claims vs reality,
on-page SEO wording (not technical SEO).

Return: Verdict, Strengths, Issues (must/should/nice) with quotes,
SEO notes, Top 3 concrete edits.
```

## When to run in the notebook pipeline

Required before ship in [blog-builder](../blog-builder/SKILL.md) (after copyright + AI filter). Also whenever the user asks “does this make sense to a public person?” / “language check” / “SEO words”.
