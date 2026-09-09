# Spacing — Semantic Roles

**Problem found in the codebase**: a semantic scale already exists (`--narrow-gap`, `--xs-gap`, `--s-gap`, `--gap`, `--l-gap`, `--xl-gap`, `--xxl-gap` in `altroneApplication.module.scss`), but it's not used — 100+ places in components hardcode px directly.

- **Decided**: spacing is a separate concern from `size` — don't reuse the `mini/s/m/l/xl` dictionary for spacing.
- Roles are named by **purpose**, not by magnitude.
- The current `--s-gap` (`6px`) breaks the 4px grid — decided to snap it onto the grid (likely to `8px`, or drop that tier).
- Draft role list (leaning "yes", not finalized):
  - `--space-control-x` / `--space-control-y` — internal control padding
  - `--space-inline` — icon↔text gap
  - `--space-stack` — vertical rhythm between fields/list items
  - `--space-content` — padding inside content containers
  - `--space-section` — gap between large layout blocks
  - `--space-inset-compact` — dense lists/tables
- **Important nuance**: control-roles must vary by component `size` (mini/s/m/l/xl) — i.e. this is a role × size matrix, not flat values, because radius (see `radius.md`) depends on the same spacing value.
- **Implemented**: non-control roles (`--space-inline`, `--space-stack`, `--space-content`, `--space-section`, `--space-inset-compact`) and the control-role matrix (`--space-control-{x,y}-{mini,s,m,l,xl}`) exist as aliases over the existing primitive scale — see `core/src/components/application/styles/_spacing.scss` and `core/src/components/application/styles/Spacing.stories.tsx`. `NavigationList` (header/footer) and `Tabs.Item` were migrated as zero-diff proof; the ~100 remaining hardcoded-px spots and the control-role matrix are not migrated — that's real per-component design review, not a mechanical rename (see `Button`'s per-size padding, which doesn't match the matrix seed).
- **Still open**: the `--s-gap` (6px) grid-snap decision is not resolved — it backs the public `Flex`/`Grid` `gap="s"` prop, so snapping it to 8px would make `gap="s"` render identically to `gap="m"`. Needs a design call (snap vs. drop the tier), not an assumption.
