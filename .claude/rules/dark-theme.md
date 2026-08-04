# Dark Theme

- Current approach (JS state → data attribute, not relying solely on `prefers-color-scheme`) is confirmed correct — matches the next-themes/Radix Themes convention. Keep it.
- **Found**: two parallel selectors exist — `[data-altrone-theme='dark']` (current, used in color files) and a legacy `.AltroneDark` class on `<html>` with a dead CSS block on old variable names (already tracked as tech debt in `core/.../application/ROADMAP.md`) — remove the class, keep only the attribute.

## Open

- FOUC on SSR — add an inline blocking script (like next-themes) that sets the theme attribute before first paint/hydration, since `AltroneApplication` was recently updated for SSR. Not decided.
- Consider native CSS `light-dark()` + `color-scheme` instead of duplicating every color under `[data-altrone-theme='dark']` in every hue file. Separate topic, not explored deeply. Not decided.
