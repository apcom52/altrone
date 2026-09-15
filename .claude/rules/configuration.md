# useConfiguration — Removed (core)

`useConfiguration()`/`<Configuration>`/the `config` prop on `<Application>` are gone. Removed as dead code, not deprecated — do not reintroduce them, and do not read from or write to `AltroneConfiguration.context.ts` (that file no longer exists).

**Why removed**: the backing context file had already been deleted from the repo while `Application.types.ts` and `useLocale.ts` still imported from it — a broken import in `main`, invisible until something tried to resolve it. Auditing actual usage found the mechanism's only real consumers were tests (`vitest/*.test.tsx`, one file per component) asserting `className`/`style` merging — exactly the legacy pattern `components.md` already flags as being phased out, not the semantic/global-setting use case (locale, date format) the mechanism was originally meant for. Nothing in `src` actually read a config slice for semantic settings either. See `application-provider.md`.

**If a component needs a per-instance style override**, that's `className`/`style` passed directly as props — not a global config slice.

**If a component needs a semantic/global default** (locale, date format, and similar app-wide settings), that's an explicit prop on `<Application>` (see `language`/`customLabels`) or a dedicated hook, not a generic config-slice system — ask before adding a new one rather than reviving `useConfiguration`.

Several other components' test files (`vitest/icon.test.tsx`, `text.test.tsx`, `list.test.tsx`, `button.test.tsx`, `search.test.tsx`, `textarea.test.tsx`, `closeButton.test.tsx`, `colorPicker.test.tsx`, `datePicker.test.tsx`, `dropdown.test.tsx`, `passwordInput.test.tsx`, `autocompleteInput.test.tsx`) still have a `check that X configuration works` case exercising the same dead mechanism and are currently failing — not cleaned up yet, that's separate follow-up work per component, not part of this removal.
