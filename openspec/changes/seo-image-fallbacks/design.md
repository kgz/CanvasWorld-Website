## Context

Backend already injects `#cw-seo` (H1, About, img) for bots. SPA viz pages still set incomplete Helmet from `_base` (slug-as-title, no `og:image`). Thumbs live at `/chaos/icons/{slug}.png`.

## Goals / Non-Goals

**Goals:** Full OG on viz routes; one meaningful `<img>` per viz page and VizEmbed; richer gallery alts; one student-style H2 per category; no-JS copy via noscript + existing SSR.

**Non-Goals:** New screenshot pipeline; rewriting notebook prose; JSON-LD.

## Decisions

1. **Alt convention** — `{title}: {first sentence of catalog description}`, truncated ~160 chars. Shared helper `thumbAlt`.
2. **Pattern B** — visually hidden img/H2/p in chrome (not a visible poster that fights WebGL). Screenshot mode skips the extra DOM.
3. **Category H2** — fixed phrases: attractors / maps / fractals / misc. Not per-slug keyword stuffing.
4. **Embeds** — catalog thumb behind iframe (`object-fit: cover`); noscript link to `/{slug}`.
5. **Helmet ownership** — viz meta lives in `template-modern` only; `_base` stops emitting Helmet.

## Risks / Trade-offs

- [Hidden content] → keep copy identical to catalog description already shown in About.
- [_base Helmet gone] → iframe/screenshot pages inherit parent or stay untitled; acceptable for embeds.
