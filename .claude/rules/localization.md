# Localization (core)

Text strings come from `useLocalization()`. Never hardcode user-visible strings.

```ts
const t = useLocalization();
<span>{t('componentName.label')}</span>
```

Add new keys to all eight dictionaries in `src/locales/`: `en`, `ru`, `fr`, `de`, `es`, `zh`, `pt`, `tr`.

## Don't

- Don't hardcode locale strings in JSX.
