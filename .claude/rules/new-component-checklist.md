# Adding a New Component — Checklist (core)

1. Create `src/components/ComponentName/` with the full folder layout (see `components.md`).
2. Define all props in `ComponentName.types.ts`, extending `BasicComponentStyleConfig`.
3. If the component needs semantic/global config (not `className`/`style` — see `configuration.md`), add a config slice to `ConsumerConfigurationContext` in `AltroneConfiguration.context.ts` and read it via `useConfiguration()`.
4. Write SCSS using CSS vars and mixins only (see `theming.md`).
5. Add keys to all five locale files (see `localization.md`).
6. Export from `src/components/index.ts`.
7. Add a Storybook story with `StorybookDecorator`.
8. Add `size` (`mini/s/m/l/xl`) and `asChild` props where they make sense for this component.
