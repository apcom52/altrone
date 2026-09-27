# Motion / Reduced Motion

Three implementation layers:

1. **Pure CSS** — durations/easing as CSS custom properties (`--motion-duration-fast/base`, `--motion-easing-standard`), zeroed under `@media (prefers-reduced-motion: reduce)` at the root (`application/styles/_motion.scss`) — single source of truth. Covers plain transitions only — a looping `@keyframes` animation needs its own reduced-motion override, since a zeroed duration doesn't stop a loop.
2. **JS animation via `motion`** (Modal/Popover/Tooltip/Notifications/Spoiler, etc.) — `Application` wraps its tree in `<MotionConfig reducedMotion="user">` for a global effect without touching every component.
3. **Manual JS timing** (e.g. `setTimeout` before unmount after an exit animation) — use the SSR-safe `useMediaMatch('(prefers-reduced-motion: reduce)')` instead of hardcoding durations.

## Nuance (WCAG 2.3.3)

Reduced motion ≠ remove all movement. Direct feedback tied to a user action (`Splitter.Divider` following the cursor, `Spoiler`'s expand) stays — what gets removed is decorative/autoplay/looping motion. **Ask before deciding a specific animation's reduced-motion behavior — don't assume "stop it" is always right:**
- `Skeleton` shimmer — purely decorative, communicates nothing a static placeholder doesn't. Stopped under reduced motion.
- `Loading` spinner — a functional state indicator (the only signal a background operation is still running), not decorative. Deliberately kept spinning; flagged with a comment so it doesn't look like an oversight.

See `application/styles/Motion.stories.tsx` (Storybook `Foundations/Motion`).
