# Motion / Reduced Motion

Three implementation layers:

1. **Pure CSS** — durations/easing as CSS custom properties (`--motion-duration-fast/base`, `--motion-easing-standard`), zeroed under `@media (prefers-reduced-motion: reduce)` at the root (`core/src/components/application/styles/_motion.scss`) — single source of truth. Only covers plain transitions; a looping `@keyframes` animation needs its own reduced-motion override (see below), since a zeroed duration doesn't stop a loop the way it stops a transition.
2. **JS animation via `motion`** (used in Modal/Popover/Tooltip/Notifications/Spoiler and more) — `Application` wraps its tree in `<MotionConfig reducedMotion="user">` (`Application.tsx`) for a global effect without touching every component.
3. **Manual JS timing** (e.g. `setTimeout` before unmount after an exit animation) — reuse the existing SSR-safe `useMediaMatch('(prefers-reduced-motion: reduce)')` instead of hardcoding durations. No current component needed this (unmount timing is handled by `motion`'s own `AnimatePresence`, not manual `setTimeout`) — apply this when one does.

## Nuance (WCAG 2.3.3)

Reduced motion ≠ remove all movement. Direct feedback tied to a user action (e.g. `Splitter.Divider` following the cursor, `Spoiler`'s expand) is not removed — what gets removed is decorative/autoplay/looping motion.

**Ask before deciding a specific animation's reduced-motion behavior — don't assume "stop it" is always right.** Two real examples that landed differently:
- `Skeleton` shimmer (`skeleton.module.scss`) — purely decorative, communicates nothing a static placeholder doesn't. Stopped under reduced motion (`animation: none`).
- `Loading` spinner (`loading.module.scss`) — a functional state indicator (the only signal a background operation is still running), not decorative. Deliberately left spinning under reduced motion; flagged with a comment so it doesn't look like an oversight.

## See also

`core/src/components/application/styles/Motion.stories.tsx` (Storybook `Foundations/Motion`) for an overview with live examples.
