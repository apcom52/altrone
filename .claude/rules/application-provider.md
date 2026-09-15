# Application — Root Provider Tree (core)

`<Application>` renders providers in this order (innermost first):

```
ThemeContext → AltroneLocalization → DialogProvider → Notifications → children
```

- `ThemeContext` — current theme (`light`/`dark`) + `setTheme`
- `AltroneLocalization` — i18n dictionary and language
- `DialogProvider` — manages the `<Dialog>` portal and its state
- `Notifications` — manages the toast + notification stacks

Don't add new global providers outside this chain without discussion.

`Configuration`/`useConfiguration()` used to sit between `AltroneLocalization` and `DialogProvider` — removed as dead code (its backing context file was deleted from the repo while callers still referenced it, and its only real use was `className`/`style` merging, the legacy pattern `configuration.md` already says not to extend). See `configuration.md`.

`Application` also accepts `asChild` (Radix Slot polymorphism, see `components.md`) to merge its root attributes onto a single child element instead of rendering a wrapping `<div>` — e.g. a consumer's own `<body>`.

Note: under the target architecture, `Application` becomes a pure provider root and no longer renders `<Screen>` or owns `sidebar`/`header` props — see `application-screen.md`.
