# AltroneApplication — Root Provider Tree (core)

`<AltroneApplication>` renders providers in this order (innermost first):

```
ThemeContext → AltroneLocalization → Configuration → DialogProvider → Toast → children
```

- `ThemeContext` — current theme (`light`/`dark`) + `setTheme`
- `AltroneLocalization` — i18n dictionary and language
- `Configuration` — global component style overrides
- `DialogProvider` — manages the `<Dialog>` portal and its state
- `Toast` — manages toast notifications

Don't add new global providers outside this chain without discussion.

Note: under the target architecture, `AltroneApplication` becomes a pure provider root and no longer renders `<Screen>` or owns `sidebar`/`header` props — see `application-screen.md`.
