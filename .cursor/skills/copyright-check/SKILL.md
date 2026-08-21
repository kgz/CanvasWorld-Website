---
name: copyright-check
description: >-
  Review Classical Chaos lab notebook (or other) copy for copyright risk:
  facts vs protected expression, close paraphrase, creative outline cloning,
  and third-party images/embeds. Use when finishing a blog/MDX post, after a
  facts-then-rewrite draft, before commit/PR of packages/frontend/src/blog/,
  or when the user asks for a copyright check / clearance pass.
---

# Copyright check

Not legal advice. Repo practical pass only.

## When to run

- After drafting or rewriting any `packages/frontend/src/blog/posts/*.mdx`
- Before commit/PR that ships notebook prose
- When `lab-notebook-writing` reaches its copyright gate

## Input

- The draft MDX (or prose)
- Optional: list of sources used (URLs, books). If sources were used, ask for them if missing.

## Procedure

1. **Classify each block**
   - Fact / equation / algorithm / idea → OK
   - Our OD prototype / prior notebook copy → OK to rewrite
   - Distinctive third-party wording, metaphor, or joke → **flag**
   - Creative outline cloned beat-for-beat from one source → **flag**

2. **Paraphrase distance**
   - Read a flagged sentence aloud: would it still match a specific page if you searched a distinctive 6–8 word span?
   - If yes → rewrite from facts only (do not “tweak” the stolen sentence)

3. **Assets**
   - `VizEmbed` / `/chaos/icons/*` → OK
   - External images, paper figures, screenshots of other sites → **flag** unless license is clear

4. **Attribution**
   - Discoverer + year (e.g. Lorenz 1963) when it aids the reader → good
   - Attribution does **not** make copying prose OK

## Output format

```markdown
## Copyright check

**Verdict:** clear | needs-fixes

### Flags
- [quote or section] — reason — fix: …

### Notes
- Sources reviewed: …
```

If **needs-fixes**: list concrete rewrites or “delete/replace asset”. Do not rubber-stamp.

## Clear criteria

Verdict **clear** only when:

- No close paraphrase of third-party prose you can identify
- No unlicensed third-party figures
- Remaining content is facts, equations, or original expression
