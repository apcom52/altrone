# Responsiveness

- **Decided (two-level model)**:
  - Viewport breakpoints (`--breakpoint-*`, `useBreakpoint()`) — for app-level decisions (e.g. whether to show mobile navigation).
  - Container queries (`@container`) — for component-level decisions (a `Screen` inside a `Splitter` panel, cards) — used selectively, not everywhere.
- **Visual vs. structural adaptivity**: visual (hide an element, change the grid) is pure CSS `@container`, no JS, no SSR-desync risk. Structural (List-Detail collapsing into a single panel) needs JS (`ResizeObserver`) — the same SSR-desync problem as theme/reduced-motion. Use the SSR-safe `useContainerQuery()`/`useElementSize()` hook, following the `useMediaMatch` pattern.
- `size` stays an explicit, author-set prop — it must not change implicitly based on breakpoint. This matches the project's philosophy of explicit config over magic.
- Adaptivity is not just resizing — it's a navigation *idiom* change (tab bar ↔ sidebar). Applies to the `Screen`/`List-Detail` presets (see `application-screen.md`).

## Implemented

- `useBreakpoint()` (`core/src/utils/hooks/useBreakpoint/`) — five `is{Xs,Sm,Md,Lg,Xl}` booleans, each `min-width`, mirroring the `--breakpoint-*` values exactly. Built on `useMediaMatch`, so it shares its SSR-safe false-until-mounted default.
- `useElementSize()` / `useContainerQuery()` (`core/src/utils/hooks/useContainerQuery/`) — `useElementSize` tracks an element's content-box size via `ResizeObserver`, reporting `{ width: 0, height: 0 }` until measured on mount (SSR-safe, same pattern as `useMediaMatch`). `useContainerQuery(ref, { minWidth?, maxWidth? })` is a thin boolean wrapper over it.
- See `core/src/components/application/styles/Responsiveness.stories.tsx` for an overview with live examples of both.
