# Elevation — z-index + Shadow as One Semantic Role

## Already in place

- Z-index scale is complete (`altroneApplication.module.scss`, Bootstrap-style): `--level-dropdown(1000) → sticky(1020) → fixed(1030) → offcanvas-backdrop(1040) → offcanvas(1045) → modal-backdrop(1050) → modal(1055) → popover(1070) → tooltip(1080) → toast(1090)`.
- Shadows are complete too (`_shadow.scss`, Radix Colors-style recipe): `--shadow-none`, `--shadow-inset`, `--shadow-1..5`.

## Gap found (first pass shipped, see Implemented)

`--shadow-*` had no dark-theme override — shadows are built on `--black-aN`, nearly invisible on a dark surface. A first-pass fix ships in `_shadow.scss` (see Implemented below): both the `--gray-aN` outline and `--black-aN` blur layers are shifted up the alpha scale under `[data-altrone-theme='dark']` — an initial ~4-step shift on the black layer alone was visually confirmed too faint (screenshot review), since `--background-1`/`--background-2` sit close together in lightness and leave little room for the shadow to read; the outline is now shifted too (~3 steps) and the blur considerably more (~6-8 steps).

**Surface half fixed independently of `Box`'s materials.** The "lighten the surface itself" half of Material 3-style tonal elevation turned out not to require `Box`'s material system at all: `--glass-background-color` (the fill behind `Modal`/`Drawer`/`Tooltip`'s trigger button/`Tabs.Item`/`DataTable`'s header/`Box`'s `glass` material/...) had a dark-mode value that was almost the same color as `--gray-1`, so every "elevated glass" surface blended into the page instead of lifting off it. Fixed in `altroneApplication.module.scss` by pointing it at `--gray-a6` (the same light-tinted alpha scale gray already uses for dark-mode overlays) instead of a near-black literal — see `dark-theme.md`. This closes most of the practical "invisible in dark mode" complaint; a from-scratch Material 3 tonal-elevation model (background tone driven by numeric elevation, independent of the `glass` material specifically) is still open and tied to `Box`'s materials landing.

## Decided

Link z-index and shadow into one semantic role:

| Role | z-index | Shadow (light) | Candidates |
|---|---|---|---|
| `--elevation-flat` | auto | `--shadow-none` | Box at rest |
| `--elevation-raised` | auto / `--level-dropdown` | `--shadow-1`+`--shadow-2` | Tabs item, DatePicker day |
| `--elevation-sticky` | `--level-sticky` | light bottom edge | Screen.Header, DataTable columnHeaders |
| `--elevation-overlay` | `--level-popover` | `--shadow-1`+`--shadow-4` | Popover, Dropdown, Drawer |
| `--elevation-modal` | `--level-modal` | `--shadow-1`+`--shadow-5` | Modal, Dialog |
| `--elevation-toast` | `--level-toast` | `--shadow-1`+`--shadow-5` (or new `--shadow-6`) | Toast |

## Open

- Full Material 3-style tonal elevation for dark theme (lighten the surface itself, not just the shadow) — not designed, likely tied to `Box`'s materials.

## Implemented

Roles exist as two custom properties each (`--elevation-{role}-z-index`, `--elevation-{role}-shadow`) in `core/src/components/application/styles/_elevation.scss` — see `core/src/components/application/styles/Elevation.stories.tsx` for the rationale and a live swatch of each role (switch the story's theme toolbar to dark to see the dark-mode shadows). The shadow half of `raised`/`overlay`/`modal`/`toast` was reverse-engineered from shadow combinations multiple real components already shared exactly (e.g. `Popover`/`Drawer`/`Toolbar.Group` all independently used `shadow-1`+`shadow-4`); `sticky`'s shadow is seeded from `DataTable` column headers, its only real precedent.

Migrated (zero visual diff in light theme): `DataTable` column headers (`sticky`), `Tabs.Item`/`DatePicker` day/`BottomNavigation` item/`Slider` track (`raised`), `Popover`/`Drawer`/`Toolbar.Group` (`overlay`, `Drawer`'s z-index left on its own offcanvas levels — no role covers that), `Modal` (`modal`), `Notifications` (`toast`). `NavigationList`/`BottomNavigation`'s outer surface — previously `shadow-1`+`shadow-5` (Modal-level weight) despite being persistent chrome, not an overlay — is now `--elevation-raised-shadow`, matching their own items; this one **does** change the rendered shadow (was the open mismatch, now resolved).

**Fixed: `Screen.Header` doesn't actually use `--elevation-sticky-z-index`, despite being listed as a `sticky` candidate above.** It's page-level `position: fixed` chrome, not a component-scoped sticky header — sharing the z-index with e.g. `DataTable`'s column headers meant a `DataTable` inside `Screen.Content` could tie with the fixed header on z-index and win the stacking order by DOM position, rendering over it (reported as "the header sometimes renders below content"). `Screen.Header` now uses `calc(var(--level-fixed) - 1)` in `screen.module.scss`: strictly above the generic `sticky` tier (so it outranks any in-content sticky component), and strictly below `--level-fixed` (so `Screen.Sidebar`, which floats a rounded panel over the header's top-left corner, still stays in front of it).

`Tooltip` deliberately has no `box-shadow`/border (unlike the roles above) — the bubble's `FloatingArrow` is a separate SVG a border can't wrap around correctly. So its dark-mode fix lightens `--tooltip-background-color` itself instead (`--gray-6`, see `dark-theme.md`); `--tooltip-arrow-color` just tracks it, same as before.

Dark-theme shadow overrides live in `_shadow.scss` under `[data-altrone-root='true'][data-altrone-theme='dark']` — see the Gap found note above.
