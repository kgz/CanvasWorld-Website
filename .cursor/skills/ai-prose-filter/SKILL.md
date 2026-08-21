---
name: ai-prose-filter
description: >-
  Filter Classical Chaos notebook (or other) prose for AI tells: banned
  vocabulary, em-dash piles, weird spacing, summary-bot closers, and
  over-balanced structure. Use as a required pass after drafting blog/MDX
  posts, when the user asks to de-AI / humanize copy, or when
  lab-notebook-writing reaches its AI filter gate.
---

# AI prose filter

## When to run

- After any notebook draft or rewrite
- Before commit/PR of `packages/frontend/src/blog/posts/*.mdx`
- When `lab-notebook-writing` reaches its AI filter gate

## Voice reminder

Target: curious beginner discovering the system — not a model summarizing a topic.

## Scan checklist

Mark each hit with line/quote.

### Lexicon (ban / rewrite)

`delve`, `tapestry`, `crucible`, `landscape of`, `robust`, `seamless`, `leverage`,
`utilize`, `facilitate`, `intricate`, `multifaceted`, `underscore`, `pivotal`,
`testament to`, `in the realm of`, `it's important to note`, `when it comes to`

### Punctuation / spacing

- Em-dash piles (`—` more than rarely)
- Odd Unicode spaces / double spaces used for “style”
- Fancy quotes used inconsistently for decoration

### Structure tells

- Three perfectly parallel bullets or three mirrored H2s with the same rhythm
- Sections that only restate the previous section in fancier words
- Closers: `In this post we…`, `In conclusion…`, `Overall…`, `In summary…`

### Tone tells

- Lecturer voice: `one observes`, `it can be said that`
- Empty hype with no canvas/UI concrete (`powerful`, `beautiful journey`)
- Wikipedia-smooth explanation with no “I tried / I noticed” grain (for notebook posts)

## Procedure

1. Read the full draft once for overall “model summary” smell
2. Run the scan checklist; list every hit
3. Rewrite flagged spans in discoverer voice (concrete, slightly uneven)
4. Re-scan once; stop when clean

## Output format

```markdown
## AI prose filter

**Verdict:** clear | needs-fixes

### Hits
- [quote] — tell type — rewrite: …

### Pass 2
- clean | remaining: …
```

## Clear criteria

Verdict **clear** only when lexicon/punctuation/structure/tone hits are fixed or consciously kept for a real reason noted in Notes (rare).
