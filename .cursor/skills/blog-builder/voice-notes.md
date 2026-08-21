# Blog-builder voice notes (from shipping)

Living list of patterns readers rejected. Writer + public-reader must treat these as hard fails unless the user asks for chrome docs.

## Anti-patterns (do not write)

### Affordance inventory before / after the embed
Bad (Mandelbrot, Aug 2026 — user rejected):

> The embed below is the live Mandelbrot view. Drag to pan, scroll to zoom. Pause if you want it quiet. Knobs, HUD, and click-to-Julia live on the full stage — Open full when you want those.

Also rejected across Hopalong / Enneper / Boy / Schwarz / Roman / Brusselator / Hénon / Ikeda opens:

- Pause / Play / Open full / knobs / HUD / scrub / particle counts stacked in one “how to use the card” paragraph
- “This page is for looking, not tuning” as a stock closer after every inventory
- Listing what the embed does **not** have right before `<VizEmbed>`

**Do instead:** Curiosity or what you see → embed. Put knobs / Julia / scrub in a short full-canvas section or `<Callout to="…">` only.

### Selling by listing what is missing
Bad (Mandelbrot — user: “like selling a car by saying it doesn’t have turbo / power steering”):

> This notebook embed does not do click-to-Julia. No Open Julia button, no Reset/Export chrome…

Also bad: “This page does not expose those knobs…” / “the missing piece is…” / long does-not lists / “Full canvas vs this notebook” framed as deficit.

**Do instead:** Say what the full stage *offers*, link it (`[full Mandelbrot stage](/mandelbrot_set)`), Callout. Affordance honesty stays in the writer’s AFFORDANCES note for gates — not as a feature-deficit pitch to readers.

### Engineering inventory as the whole post
Bad (Clifford / old “render-loop”): particle budgets, 24k vs 200k, DPR caps, “what one frame does” to typed arrays, embed pause queues — when the reader asked where it came from and what the map does.

**Do instead:** Discoverer / discoverer+math: who, what map, equations, what you see when you twist knobs. FPS and budgets are not the notebook topic unless the user asked for an engineering note.

### Ticket / staff voice
- Issue numbers, “About still wrong”, “site truth vs catalog”
- “embed chrome”, “transport `n`” without plain language first

### “I expected…” opener formula (hard fail across the corpus)
Bad (Barth / Boy / Brusselator / Enneper / Schwarz / … — user Aug 2026: every post starting this way sounds like AI):

> I expected a smooth algebraic blob. What showed up looked more like…
> I kept waiting for a sealed outside…
> I opened it expecting a clean saddle…

Same template: expectation → soft letdown → “what showed up.” Fine **once** in a while as real grain; not as the default first sentence for every notebook.

**Do instead:** Vary openings — name the object, what is on the canvas, who wrote it, a concrete detail, a question.

### Narrator-first “I” as the whole post (hard fail)
Bad (user Aug 2026: why is it always “I” — just write the blog about the thing):

> Icosahedral spikes on a black field — that is what hit me first…
> I kept wondering whether the spikes lived in the math…
> I bounce classic (φ,1,1) against…

The notebook can stay curious and concrete without making the author the subject. Prefer **the surface / map / equation / canvas** as the grammatical subject.

**Do instead:** “Barth’s sextic is…”, “The cloud grows in…”, “Raising mix sharpens the spikes…”. Occasional “you” for affordances is fine. Spare “I” for rare, earned asides — not every paragraph.

## Preferred beats

1. The object / what is on the canvas (not the narrator’s feelings)
2. Live viz
3. Math or mechanism (support, not spine)
4. Short “full canvas” invite (positive, linked) + Callout
5. No “does not have…” paragraphs
6. No default “I expected…” / “what hit me first” openers

## Tracked user quotes

| Date | Post | Note |
|------|------|------|
| Aug 2026 | hopalong-family | “one loads after another” / particle budgets — casual reader does not care |
| Aug 2026 | hopalong-family | Still “stiff” = lecture + spec-sheet; public-reader alone insufficient without discoverer soften |
| Aug 2026 | mandelbrot-escape | Rejected affordance inventory paragraph before embed |
| Aug 2026 | mandelbrot-escape | Don’t write bare `` `/mandelbrot_set` `` — use a real markdown link |
| Aug 2026 | mandelbrot-escape | Don’t sell by listing missing features (no turbo / power steering) |
| Aug 2026 | OD slugs | `render-loop` → `clifford` (via `clifford-60fps`); `l-systems` → `sierpinski-gasket`. Engineering FPS/budget posts rejected — readers want origin + what the map does. |
| Aug 2026 | corpus | “I expected…” / “I kept waiting…” as default opener on every post — sounds like AI; vary openings |
| Aug 2026 | corpus | Narrator-first “I” (“what hit me first”, “I bounce…”) — write about the viz/math, not the author |

## Catalog links in prose

Prefer `[full Mandelbrot stage](/mandelbrot_set)` (or the viz title) over monospace path strings. Internal `/…` hrefs are routed via PostPage `a` → `Link`.
