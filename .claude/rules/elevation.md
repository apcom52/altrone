# Elevation — z-index + Shadow as One Semantic Role

- Z-index scale (`altroneApplication.module.scss`, Bootstrap-style): `--level-dropdown(1000) → sticky(1020) → fixed(1030) → offcanvas-backdrop(1040) → offcanvas(1045) → modal-backdrop(1050) → modal(1055) → popover(1070) → tooltip(1080) → toast(1090)`.
- Shadows (`_shadow.scss`, Radix-style recipe): `--shadow-none`, `--shadow-inset`, `--shadow-1..5`. Dark-theme overrides for both the `--gray-aN` outline and `--black-aN` blur live in the same file under `[data-altrone-theme='dark']` — shadows are built on `--black-aN`, near-invisible on a dark surface without this.
- Surface elevation (lightening the surface itself, not just the shadow) is handled independently via `--glass-background-color` → `--gray-a6` — see `dark-theme.md`. A from-scratch Material-3-style tonal-elevation model (background tone driven by numeric elevation) is still open, likely tied to `Box`'s materials.

## Decided: one semantic role = z-index + shadow

| Role | z-index | Shadow (light) | Candidates |
|---|---|---|---|
| `--elevation-flat` | auto | `--shadow-none` | Box at rest |
| `--elevation-raised` | auto / `--level-dropdown` | `--shadow-1`+`--shadow-2` | Tabs item, DatePicker day |
| `--elevation-sticky` | `--level-sticky` | light bottom edge | DataTable columnHeaders |
| `--elevation-overlay` | `--level-popover` | `--shadow-1`+`--shadow-4` | Popover, Dropdown, Drawer |
| `--elevation-modal` | `--level-modal` | `--shadow-1`+`--shadow-5` | Modal, Dialog |
| `--elevation-toast` | `--level-toast` | `--shadow-1`+`--shadow-5`/`--shadow-6` | Toast |

Implemented as `--elevation-{role}-z-index` / `--elevation-{role}-shadow` in `application/styles/_elevation.scss` — use these roles for any new elevated surface rather than picking a raw shadow/z-index value. See `Elevation.stories.tsx` for rationale and live swatches (dark theme via the toolbar).

## Gotchas

- `Screen.Header` is page-level fixed chrome, not a `sticky` candidate despite the table above — it uses `calc(var(--level-fixed) - 1)` directly in `screen.module.scss` (strictly above generic in-content sticky components, strictly below `Screen.Sidebar`'s fixed level). Don't switch it to `--elevation-sticky-*`.
- `Tooltip` has no `box-shadow`/border (its `FloatingArrow` SVG can't be wrapped by one) — its elevation is conveyed by background lightening only, see `dark-theme.md`.

## Open

Full Material-3-style tonal elevation for dark theme (surface tone driven by numeric elevation, independent of the `glass` material) — not designed yet.
