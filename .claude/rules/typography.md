# Typography — DEFERRED

This area was explicitly parked ("return to it later"). Treat everything here except the confirmed bullets as **not decided** — don't implement a content/control role system for typography without checking first.

## Confirmed

- Existing primitives (`_text.scss`): `--text-size-1..9`, `--line-height-1..9` (names are correct, do not rename), `--text-weight-*` — all in px.
- Icons: the library stays on `lucide-react` (do not change). Icon size must follow the component's `size` prop.
- `rem` for typography is **rejected for now** (see also `v4-rejected.md`). Known gap to remember: the HIG equivalent (Dynamic Type) on the web is a `rem`-based scale — without it, user font-size settings in the browser/OS don't affect Altrone text. Not being implemented now, but don't forget it exists.

## Draft / not confirmed

- Content roles: `title` / `subtitle` / `body` / `caption` / `code`, candidates `display` / `overline` / `legal` / `link` / `numeric` (`tabular-nums`, useful for DataGrid/DataTable/NumberInput).
- Control roles: `--text-control-{mini,s,m,l,xl}`, tied 1:1 to component `size` (unlike spacing, reusing the size dictionary was accepted here — text size is physically part of a component's size).
- Icon `strokeWidth` following `--text-weight` of the same tier (SF Symbols-style sync between icon and adjacent text weight) — idea only, not decided.
