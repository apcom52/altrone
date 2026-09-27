# Responsiveness

- **Decided (two-level model)**: viewport breakpoints (`--breakpoint-*`, `useBreakpoint()`) for app-level decisions (e.g. whether to show mobile navigation); container queries (`@container`) for component-level decisions (cards, content nested in `Screen.Content`), used selectively, not everywhere. `Screen` itself is out of scope for this — it always occupies the full viewport (no nested/embedded `Screen` planned, confirmed 2026-09-16), so its own sidebar/aside/bottom-nav mode is correctly driven by `useBreakpoint()`, not `useContainerQuery()`.
- **Visual vs. structural adaptivity**: visual (hide an element, change the grid) is pure CSS `@container`, no JS/SSR risk. Structural (List-Detail collapsing into a single panel) needs JS (`ResizeObserver`) — same SSR-desync risk as theme/reduced-motion. Use the SSR-safe `useContainerQuery()`/`useElementSize()` hooks, following the `useMediaMatch` pattern.
- `size` stays an explicit, author-set prop — must not change implicitly based on breakpoint (explicit config over magic).
- Adaptivity is not just resizing — it's a navigation *idiom* change (tab bar ↔ sidebar), applying to the `Screen`/`List-Detail` presets.

## Implemented

- `useBreakpoint()` (`utils/hooks/useBreakpoint/`) — five `is{Xs,Sm,Md,Lg,Xl}` booleans, each `min-width`, mirroring `--breakpoint-*`. Built on `useMediaMatch`, sharing its SSR-safe false-until-mounted default.
- `useElementSize()`/`useContainerQuery()` (`utils/hooks/useContainerQuery/`) — `useElementSize` tracks an element's content-box size via `ResizeObserver`, reporting `{ width: 0, height: 0 }` until measured (SSR-safe). `useContainerQuery(ref, { minWidth?, maxWidth? })` is a thin boolean wrapper over it.
- See `application/styles/Responsiveness.stories.tsx` for an overview with live examples.
