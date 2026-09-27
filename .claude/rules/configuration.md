# useConfiguration — Removed (core)

`useConfiguration()`/`<Configuration>`/the `config` prop on `<Application>` are gone. Removed as dead code, not deprecated — do not reintroduce them, and do not read from or write to `AltroneConfiguration.context.ts` (that file no longer exists).

- **Per-instance style override** → `className`/`style` passed directly as props, not a global config slice.
- **Semantic/global default** (locale, date format, and similar app-wide settings) → an explicit prop on `<Application>` (see `language`/`customLabels`) or a dedicated hook — ask before adding a new generic config-slice system.

Several component test files (`vitest/icon.test.tsx`, `text.test.tsx`, `list.test.tsx`, `button.test.tsx`, `search.test.tsx`, `textarea.test.tsx`, `closeButton.test.tsx`, `colorPicker.test.tsx`, `datePicker.test.tsx`, `dropdown.test.tsx`, `passwordInput.test.tsx`, `autocompleteInput.test.tsx`) still have a stale `check that X configuration works` case exercising the removed mechanism and are currently failing — cleanup is separate per-component follow-up, not part of this rule.
