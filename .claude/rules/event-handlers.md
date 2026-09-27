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

## Required vs. optional `event`

Whether `event` is required or optional is decided by one thing: does the callback have any invocation path with no real native event to give it?

- **Required** — the callback has exactly one trigger and it's always a direct user gesture on a native/host element (a click, a native `<input>` change, a key press). Example: `Pagination.onChange`, `Checkbox.onChange`, `Slider.onChange` (drag/keyboard on the track).
- **Optional** — at least one trigger path has no event to forward: a third-party control that doesn't expose DOM events (`ColorPicker`'s `react-colorful` picker), a formatting/parsing library that can fire programmatically (`NumberInput`'s `react-number-format`), or an imperative escape hatch exposed to consumer code that they can call with no event at all (`Modal`/`Drawer`'s `closeModal`/`closeDrawer`, `Select`'s `useSelectContext().clearValue`, `DatePicker`'s `asChild` trigger context `clear`).

Don't make `event` optional just because one internal call site happens to discard it — thread the event through instead (see `Select`'s option-click handler, which used to call `selectValue(option.value)` without forwarding the `Dropdown.Checkbox` click/`Enter` event it already had). Optional is for a genuine missing source, not a shortcut.

## Required vs. optional `onChange` itself

Not the `controlled`/`uncontrolled` label — a component can be controlled-only (`TextInput`) and still have optional `onChange`. The actual test: does the component have its own `default*` fallback (`defaultValue`, `defaultChecked`, `defaultPage`, ...) that lets it stay interactive and render a sensible state with no `onChange` at all?

- **No fallback → required.** `Select`, `ColorPicker`, `Slider`, `Radio`, `NumberInput`, `Dropdown.Checkbox`, `Dropdown.RadioList`, `Checkbox`/`Switch` — omit `onChange` and the control is dead: clicking/dragging/toggling does nothing, because there's no internal state to fall back to.
- **Has a fallback → optional.** `TextInput`/`Textarea` (native `defaultValue` passes through), `FilePicker` (`defaultValue`), `Calendar`/`DatePicker` (`defaultValue`/`defaultMonth`), `Pagination` (`defaultPage`) — these manage their own state and stay usable uncontrolled; `onChange` there is a notification, not a requirement.


