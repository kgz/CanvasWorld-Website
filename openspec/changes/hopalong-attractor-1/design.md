## Context

Classic Hopalong (`hopalong_attractor`) multiplies √|bx−c| by `sign(x−1)`. Archive “Hopalong Attractor 1” README documents a typo that used `sin` instead of `sign`, kept because it still looked interesting:

```text
x' = y − 1 − √|b x − 1 − c| · sin(x − 1)
y' = a − x − 1
```

Archive `scripts/index.js` diverges (uses `sign(|…|)` and subtraction). Ship the README formula — that is the intentional “sin typo” story and a real distinct map. Existing `hopalong_attractor_sinusoidal` is a different outer map (G-based cousins); do not merge.

## Goals / Non-Goals

**Goals**

- Catalog slug `hopalong_attractor_1`, title “Hopalong Attractor 1”
- Same page factory / chrome as classic Hopalong
- Defaults near archive GUI (a≈2.38, b=5.2, c=4.8) with readable framing
- Notebook family post includes a fifth embed

**Non-Goals**

- Changing classic / positive / additive / sinusoidal pages
- Reproducing the broken `index.js` iterate line
- New OD chrome for this page alone

## Decisions

1. **Math source** — README over `index.js`.
2. **Param ranges** — a,b,c ∈ [0, 10] per archive README (GUI scaled 0–100 / 10); keep step fine like classic.
3. **Slug** — `hopalong_attractor_1` per issue.
4. **Blog** — update `hopalong-family.mdx` (title/excerpt/grid) instead of a new post.

## Risks / Trade-offs

- `sin` keeps the multiplier continuous in (−1,1), so clouds look softer than classic; framing may need camera/scale tweak after thumb capture.
- Family post currently says “four”; copy must become five without inventing UI.

## Migration

None. Additive catalog route only.
