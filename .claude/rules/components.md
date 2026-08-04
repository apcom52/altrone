# altrone-ui Component Authoring (core)

## File layout

Each component lives in its own folder under `src/components/<name>/` (camelCase folder name). Full layout — do not deviate:

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
- Support a `renderFunc` prop that lets consumers override the rendered root element; provide a sane default render function in the same file
- Internal-only props consumed by the component itself (e.g. `showLabel`, `leftIcon`) must be stripped from `restProps` before spreading onto the DOM node
- Class names are built with `clsx`, combining the CSS module object (`s`) with conditional flags:
  ```ts
  clsx(s.Button, { [s.Primary]: severity === 'primary' }, className)
  ```
- `useConfiguration()` is being phased out as a source of `className`/`style` — do NOT add new `className`/`style` merging through it (existing components like `Button` still do this; don't copy that part when writing new code). See `configuration.md` for what `useConfiguration()` is still for
- Deprecated props are not removed outright — flag them with `GlobalUtils.deprecatedMessage('ComponentName', 'oldProp', 'newProp', 'targetVersion')` inside a `useEffect`, and keep them working until that version
- Add `size` (`mini/s/m/l/xl`) and `asChild` (custom renderer support) props where they make sense for the component

## Imports

- Prefer the `components/x` path alias over deep relative imports (`../../components/x`) when importing sibling components
- Shared types come from the `types` alias
