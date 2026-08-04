# Localization (core)

Text strings come from `useLocalization()`. Never hardcode user-visible strings.

```ts
const t = useLocalization();
<span>{t('componentName.label')}</span>
```

Add new keys to all five dictionaries in `src/locales/`: `en`, `ru`, `fr`, `ge`, `sp`.

## Don't

- Don't hardcode locale strings in JSX.
