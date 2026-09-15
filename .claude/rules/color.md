# Color System

## Already solid

Full Radix Colors palettes (12 steps + alpha `aN`, P3) for 10 accent hues (red/orange/amber/green/teal/blue/indigo/purple/pink/brown) plus gray and black. Indirection via `[data-altrone-accent='X'] { --accent-N: var(--X-N); }` is already implemented correctly — components reference `--accent-N`, never a raw hue name.

## Implemented

- Full 12-step (+ alpha) Radix scales/roles for `danger`(red)/`success`(green)/`warning`(amber) — fixed hues independent of `accent`, resolving the open question that used to be here. `green` didn't exist before and was ported from `@radix-ui/colors` (`core/src/components/application/colors/_green.scss`); as a side effect of following the existing per-hue-file pattern it also became a selectable `accent` option (not the point of the change, just consistent with it).
- `info` is the one status that deliberately does **not** get a fixed hue — it aliases `--accent-N` directly, so it follows whatever accent the consumer has chosen. Decided this way because info is about drawing attention within the primary flow, not signaling a universal state the way danger/success/warning do — those three need to stay recognizable regardless of branding, info doesn't.
- Semantic layer in `core/src/components/application/colors/_status.scss`: each status maps its 12 steps to the same 5 purpose-named roles already used for gray (`background`/`interactive`/`border`/`solid`/`text`) — e.g. `--danger-text-1`, `--success-solid-1`. Consumers use the role, never a raw `--danger-9`.
- Old flat `--danger-color`/`--success-color`/`--warning-color` (`_common.scss`) removed — all real usages (18 call sites, all but one a text color) migrated to the matching role.
- **Disabled state** has its own dedicated solid tokens (`--disabled-background`, `--disabled-border`, `--disabled-text-color` — the last already existed) instead of opacity.
- **Categorical (qualitative) palette**: 10 fixed hues (`--category-1..10`, `core/src/components/application/colors/_categorical.scss`), each a different hue's solid step rather than shades of one. `orange` didn't exist before this and was ported from `@radix-ui/colors` alongside `green`. Auto-pick by identity hash was the chosen mechanism (not a manual prop) — `ColorUtils.getCategoricalColorIndex(seed)` (`core/src/utils/ColorUtils.ts`) deterministically maps a string to one of the 10, so the same identity always gets the same color.
  - Wired into `Avatar`: falls back to a categorical color keyed by the person's full name when no explicit `backgroundColor` is passed.
  - Wired into `Box` via the `color` prop: a categorical hue name (`'teal'`, `'indigo'`, …) resolves to that hue's solid step `--<hue>-9`; any other string is used as a raw CSS color. It overrides `tone`, sets `--box-color`, and `.ToneCustom` derives every `--box-tone-*` role from it (`solid` fill with oklch auto-contrast text, the alpha/border/text roles via `color-mix()`), so it composes with every `material`. This is a direct pick, not the identity-hash mechanism — `ColorUtils.getCategoricalColorIndex` still maps `--category-N` for callers that want identity-keyed color.
  - **Not wired into `Tags`/`Calendar`** — investigated and neither currently has a structural hook for it. `Tags.Item` is a plain underlined text link with zero background/chip styling today. `Calendar` has no event-category concept implemented at all. Giving either categorical color means designing new component API first (a color/tone prop, a category concept) — a separate, larger decision, not a token wiring task. (`Badge` — the internal counter chip in `internal/badge` — is built on `Box`, so `tone` and `Box`'s `color` prop already reach it if needed.)
- Point tokens added: `--color-overlay-scrim` (`_common.scss`) — shared by `Modal`/`Drawer`/`Screen`'s offcanvas backdrops, replacing each defining its own copy of `--black-a3`; now has a dark-theme override (`--black-a7`) since the light-theme value alone was nearly invisible over an already near-black background — see `dark-theme.md`. `--color-header-backdrop` — `Screen.Header`'s backdrop; **decided to keep accent-tinted** (not neutral gray), now a named token instead of an inline `--accent-a3` in `screen.module.css`. `--color-selection` — `::selection` background, wired globally under `[data-altrone-root='true']`.
- See `core/src/components/application/styles/Color.stories.tsx` for an overview with swatches.

## Open

- `forced-colors` (Windows High Contrast Mode) — real accessibility gap, explicitly deferred, come back to it.

## Confirmed detail

Numeric deltas (+/− in DataTable) should reuse `success`/`danger` + `--text-numeric` — no separate token needed for this.
