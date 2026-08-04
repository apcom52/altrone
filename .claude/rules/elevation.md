# Elevation — z-index + Shadow as One Semantic Role

## Already in place

- Z-index scale is complete (`altroneApplication.module.scss`, Bootstrap-style): `--level-dropdown(1000) → sticky(1020) → fixed(1030) → offcanvas-backdrop(1040) → offcanvas(1045) → modal-backdrop(1050) → modal(1055) → popover(1070) → tooltip(1080) → toast(1090)`.
- Shadows are complete too (`_shadow.scss`, Radix Colors-style recipe): `--shadow-none`, `--shadow-inset`, `--shadow-1..5`.

## Gap found

`--shadow-*` has no dark-theme override at all — shadows are built on `--black-aN`, nearly invisible on a dark surface. Needs a Material 3-style solution (tonal elevation — height via mixing tone into the surface, not shadow alone). Details not worked out — **open**.

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

- `NavigationList`/`BottomNavigation` currently use `shadow-1`+`shadow-5` (Modal-level weight) even though they're persistent chrome, not an overlay — likely should drop to `--elevation-raised`, but **not confirmed**.
- Dark-theme elevation approach — not worked out.
