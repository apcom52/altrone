# useConfiguration — Config Slices (core)

Every component can read a config slice via `useConfiguration()`, populated by the `config` prop passed to `<AltroneApplication>`. `ComponentConfiguration<ExtraProps>` is the generic type for all config slices, defined in `ConsumerConfigurationContext`.

```ts
const { button: buttonConfig = {} } = useConfiguration();
```

**Scope this to semantic/global settings** (e.g. locale, date format, and similar app-wide defaults) — not to `className`/`style`. Merging `className`/`style` from `useConfiguration()` is a legacy pattern still present in some components (e.g. `Button`) that is being phased out; don't add it to new components. See `components.md` for the current guidance on `className`/`style`.

**Always merge consumer config last** so it overrides internal defaults, for the settings that do belong here.
