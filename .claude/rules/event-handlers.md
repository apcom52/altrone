# Event Handler Signatures (core)

All custom event handler props must pass the native DOM `event` object as the **last argument**, after any semantic arguments:

```ts
// Correct
onChange: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
onSelect: (item: OptionType, event: React.MouseEvent<HTMLElement>) => void;
onRangeChange: (from: Date, to: Date, event: React.ChangeEvent) => void;

// Wrong — event missing or not last
onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
onSelect: (item: OptionType) => void;
```

Applies to every callback prop in every component. No exceptions.
