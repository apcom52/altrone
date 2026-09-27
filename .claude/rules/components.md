# altrone-ui Component Authoring (core)

## File layout

Each component lives in its own folder under `src/components/<name>/` (camelCase folder name). Full layout — do not deviate:

**Internal-only components** (composed by other components, never part of the public API) live under `src/internal/<name>/` with the exact same layout. They are not re-exported from `src/components/index.ts` and get no `mcp/docs` page; import them via `internal/<name>`. Move a component there when exposing it publicly would only add doc/support surface for no consumer gain (see `src/internal/README.md`).

```
ComponentName/
├── ComponentName.tsx          # main component
├── ComponentName.types.ts     # all Props interfaces for this component
├── ComponentName.context.ts   # React context (only if needed)
├── componentName.module.scss  # styles (camelCase filename, class keys in PascalCase)
├── ComponentName.stories.tsx  # Storybook stories (required)
├── ComponentName.test.tsx     # Vitest unit tests (if applicable)
├── index.ts                   # public exports (barrel — no logic here)
└── components/                # sub-components, same layout, recursively
    └── index.ts
```

## Component pattern

- `ref` is accepted as a plain prop and forwarded to the root DOM element — see `ref-forwarding.md` (this replaces the older `forwardRef` + `memo` pattern still seen in some existing components; don't copy `forwardRef` into new code)
- Components with sub-components are exported as a namespace object — see `namespace-exports.md`
- Support an `asChild` prop (Radix Slot polymorphism) that merges the component's props/ref onto a single child element instead of rendering its own root element, for consumers who need a fully custom root (e.g. a router `<Link>`). `renderFunc` (a custom render-function prop, the pattern `asChild` replaced) has been removed everywhere — don't reintroduce it; `asChild` is the only polymorphism mechanism going forward
- Internal-only props consumed by the component itself (e.g. `showLabel`, `leftIcon`) must be stripped from `restProps` before spreading onto the DOM node
- Class names are built with `clsx`, combining the CSS module object (`s`) with conditional flags:
  ```ts
  clsx(s.Button, { [s.Primary]: severity === 'primary' }, className)
  ```
- `useConfiguration()` has been removed entirely (dead code, see `configuration.md`) — don't reintroduce a global config-slice mechanism for `className`/`style`. A few existing components' tests still assert the old behavior; that's leftover cleanup, not a pattern to copy
- Deprecated props are not removed outright — flag them with `GlobalUtils.deprecatedMessage('ComponentName', 'oldProp', 'newProp', 'targetVersion')` inside a `useEffect`, and keep them working until that version
- Add `size` (`mini/s/m/l/xl`) and `asChild` (custom renderer support) props where they make sense for the component

## Imports

- Prefer the `components/x` path alias over deep relative imports (`../../components/x`) when importing sibling components
- Shared types come from the `types` alias
