# Responsiveness

- **Decided (two-level model)**:
  - Viewport breakpoints (`--breakpoint-*`, planned `useBreakpoint()` per `core/.../application/ROADMAP.md`) — for app-level decisions (e.g. whether to show mobile navigation).
  - Container queries (`@container`) — for component-level decisions (a `Screen` inside a `Splitter` panel, cards) — used selectively, not everywhere.
- **Visual vs. structural adaptivity**: visual (hide an element, change the grid) is pure CSS `@container`, no JS, no SSR-desync risk. Structural (List-Detail collapsing into a single panel) needs JS (`ResizeObserver`) — the same SSR-desync problem as theme/reduced-motion. Proposed (not implemented): a new SSR-safe `useContainerQuery()`/`useElementSize()` hook, following the `useMediaMatch` pattern.
- `size` stays an explicit, author-set prop — it must not change implicitly based on breakpoint. This matches the project's philosophy of explicit config over magic.
- Adaptivity is not just resizing — it's a navigation *idiom* change (tab bar ↔ sidebar). Applies to the `Screen`/`List-Detail` presets (see `v4-application-screen.md`).
