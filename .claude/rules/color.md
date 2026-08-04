# Color System

## Already solid

Full Radix Colors palettes (12 steps + alpha `aN`, P3) for 8 accent hues (red/pink/purple/indigo/blue/teal/amber/brown) plus gray and black. Indirection via `[data-altrone-accent='X'] { --accent-N: var(--X-N); }` is already implemented correctly — components reference `--accent-N`, never a raw hue name.

## Gap found

`danger`/`success`/`warning` are flat single colors (`_common.scss`), not full 12-step scales. There is no green palette for `success` at all.

## Decided

- Build full semantic tokens for message types — but expose a purpose-named layer over the scale, not raw `danger-1`/`danger-2` directly to consumers (same primitive + semantic-alias approach as spacing/radius). Exact names not chosen yet.
- **Disabled state gets its own dedicated color palette, not opacity.** Opacity is unpredictable over glass/translucent materials (alpha channels stack) — need a dedicated muted palette for disabled elements.

## Open

- `danger`/`success`/`warning` (+ possible 4th status `info` for neutral informational messages) — fixed hues regardless of the chosen `accent`, or also switchable? Leaning toward fixed (per Radix Themes convention), so `accent="red"` doesn't visually blend with `danger` — **not confirmed**.
- Categorical (qualitative) palette for `Avatar` background, `Tags`/`Badge` color choice, `Calendar` event categories — needs ~8–12 fixed, mutually distinguishable colors (not shades of one hue). **Not decided** — how many colors, auto-pick by name hash vs. manual prop.
- `forced-colors` (Windows High Contrast Mode) — real accessibility gap, explicitly deferred, come back to it.
- Point tokens: `--focus-color` exists. Need to check/add `--color-overlay-scrim` (Modal/Drawer backdrop — possibly hardcoded rgba today), `--color-selection`. Open: should `Screen.HeaderBackdrop`'s current `--accent-a3` backing be intentional, or should it be neutral `--gray-a3`?

## Confirmed detail

Numeric deltas (+/− in DataGrid/DataTable) should reuse `success`/`danger` + `--text-numeric` — no separate token needed for this.
