## Context

Canvas chrome already has ≤900px drawer + ≤640px transport wrap. Homepage has ≤720/460 gallery breakpoints. Ticket #65 is polish + gap-fill for touch and overflow, not a redesign.

## Goals / Non-Goals

**Goals:** Usable home + particle + shader routes at 390×844 and 768×1024; params drawer/scrim; reachable transport; no horizontal overflow.

**Non-Goals:** Attract math; PWA; desktop redesign.

## Decisions

1. Prefer CSS/module tweaks over structural React rewrites.
2. Keep brand-first hero; tighten type/CTA spacing on narrow widths rather than stacking dashboard chrome.
3. Canvas: ensure scrim dismiss works; enlarge transport hit targets; hide redundant labels already sketched.
4. Validate with Playwright screenshots at phone + tablet.

## Risks

- Over-shrinking hero brand; keep name dominant.
- Transport wrap eating stage height — keep compact.
