# Motion / Reduced Motion

Three implementation layers (plan, not yet implemented):

1. **Pure CSS** — durations/easing as CSS custom properties (`--motion-duration-fast/base`, `--motion-easing-standard`), zeroed under `@media (prefers-reduced-motion: reduce)` at the root — single source of truth.
2. **JS animation via `motion`** (already a dependency, v12, used in Button/DataTable/DatePicker) — wrap the `AltroneApplication` provider tree in `<MotionConfig reducedMotion="user">` for a global effect without touching every component.
3. **Manual JS timing** (e.g. `setTimeout` before unmount after an exit animation) — reuse the existing SSR-safe `useMediaMatch('(prefers-reduced-motion: reduce)')` instead of hardcoding durations.

## Nuance (WCAG 2.3.3)

Reduced motion ≠ remove all movement. Direct feedback tied to a user action (e.g. `Splitter.Divider` following the cursor) is not removed — what gets removed is decorative/autoplay/looping motion (e.g. `Skeleton` shimmer → static/pulsing state instead).

## Open

- Whether to formalize this as a `## Motion & reduced motion` section in `CLAUDE.md` was raised but not decided — this file is that formalization.
