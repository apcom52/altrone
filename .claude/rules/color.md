# Color System

- Full Radix Colors palettes (12 steps + alpha `aN`, P3) for 10 accent hues (red/orange/amber/green/teal/blue/indigo/purple/pink/brown) + gray + black. Components reference `--accent-N` (via `[data-altrone-accent='X'] { --accent-N: var(--X-N); }` indirection), never a raw hue name.
- `danger`(red)/`success`(green)/`warning`(amber) have full fixed 12-step scales, independent of `accent`. `info` deliberately has **no** fixed hue — it aliases `--accent-N` directly, since it's about drawing attention within the primary flow (should follow branding), while danger/success/warning must stay recognizable regardless of it.
- Semantic layer (`application/colors/_status.scss`): each status maps its 12 steps to 5 purpose-named roles shared with gray — `background`/`interactive`/`border`/`solid`/`text`, e.g. `--danger-text-1`, `--success-solid-1`. Use the role, never a raw `--danger-9`.
- Old flat `--danger-color`/`--success-color`/`--warning-color` are removed — don't reintroduce them, use the role tokens above.
- Disabled state has its own solid tokens: `--disabled-background`, `--disabled-border`, `--disabled-text-color` — not opacity.
- Categorical (qualitative) palette: 10 fixed hues `--category-1..10` (`application/colors/_categorical.scss`), each a different hue's solid step. `ColorUtils.getCategoricalColorIndex(seed)` (`utils/ColorUtils.ts`) deterministically maps an identity string to one of the 10.
  - `Avatar`: falls back to a categorical color keyed by the person's full name when no explicit `backgroundColor` is passed.
  - `Box`'s `color` prop: a categorical hue name (`'teal'`, `'indigo'`, …) resolves to that hue's solid step `--<hue>-9` (overrides `tone`, sets `--box-color`; `.ToneCustom` derives the rest via `color-mix()`). Any other string is used as a raw CSS color. This is a direct pick, separate from the identity-hash mechanism above.
  - **Not wired into `Tags`/`Calendar`** — neither has a structural hook for it yet (`Tags.Item` has no chip styling, `Calendar` has no category concept). Needs new component API first (a color/tone prop, a category concept), not a token-wiring task.
- Point tokens: `--color-overlay-scrim` (modal/drawer/screen backdrops, dark override in `dark-theme.md`), `--color-header-backdrop` (deliberately kept accent-tinted, not neutral gray), `--color-selection` (global `::selection`, under `[data-altrone-root='true']`).
- Numeric deltas (+/− in DataTable) reuse `success`/`danger` + `--text-numeric` — no separate token needed.
- See `application/styles/Color.stories.tsx` for an overview with swatches.

## Open

`forced-colors` (Windows High Contrast Mode) — real accessibility gap, deferred.
