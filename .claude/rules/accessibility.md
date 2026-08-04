# Accessibility

- Keyboard navigation: roving tabindex in composite widgets, arrow keys, `Escape` closes an overlay and returns focus to the trigger, `Home`/`End`.
- Focus: use `:focus-visible` (not `:focus`); focus trap in Modal/Dialog/Drawer; focus returns to the trigger on close.
- Prefer native semantics first, ARIA only when there's no native equivalent.
- Icon-only controls must have `aria-label` (the `Toolbar.Action` pattern already does this — treat as mandatory, not optional, for every icon-only control).
- `aria-live` for `Toast`.
- Contrast: WCAG AA — 4.5:1 for text, 3:1 for large text and UI elements; state is never conveyed by color alone.
- Respect `prefers-reduced-motion` (see `motion.md`).
- Hit area ≥ ~24px even at `size="mini"`.
- Form validation: `aria-invalid` + `aria-describedby`.
