# Application / Screen

## Vision

Altrone stays a component library, but moves from "assemble a screen by hand from primitives" to "describe a screen through `Application`/`Screen`". This is explicitly **not** a DSL/schema-driven framework — just a clearer split of an app into screens via components.

## AltroneApplication

- Becomes a pure root provider: theme, locale, config, dialogs, toasts.
- **Breaking change**: no longer renders `<Screen>` internally and no longer owns `sidebar`/`header` props (current `AltroneApplication.tsx` does both — remove this).

## Screen

- Consumer places one or more `Screen` instances inside the application's `children`. Which screen is active is the consumer's concern (their own router/state), not the library's.
- API moves from the current `header`/`sidebar` props to namespace zones: `Screen.Header`, `Screen.Sidebar`, `Screen.Content`, `Screen.Footer`.
- New `size` prop (`mini/s/m/l/xl`) constrains content width.
- Keep the semantic tags already used in `Screen.tsx` (`<aside>`, `<header>`, `<main>`).
- **Decided**: presets are real subcomponents shipped in the library (not just Storybook recipes): `Screen.ListDetail`, `Screen.Dashboard`, `Screen.Form`, `Screen.Settings`, `Screen.DataView`, `Screen.Auth`, `Screen.Empty`.

## Open

- Migration strategy for the `AltroneApplication`/`Screen` breaking change is not discussed — ask before assuming a deprecation path.
