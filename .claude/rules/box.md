# Box — Universal Primitive

Purpose: shared visual primitive for "chip-like" components (Button, Input, Badge, Tag, Avatar, Card, Chip, etc). **Not** for structurally complex components (Splitter, Tabs, DataGrid, Range) — those use `Box` only for specific internal parts (e.g. `Splitter.Divider`), not as their whole implementation.

## Props (draft, not finalized)

```ts
interface BoxProps {
  shape?: 'square' | 'rounded' | 'capsule' | 'circle';
  material?: 'solid' | 'glass' | 'translucent' | 'transparent' | 'outline' | 'ghost';
  tone?: 'neutral' | 'accent' | 'danger' | 'success' | 'warning'; // + possibly 'info'
  size?: 'mini' | 's' | 'm' | 'l' | 'xl';
  elevation?: 'flat' | 'raised' | 'sticky' | 'overlay' | 'modal' | 'toast';
  pressable?: boolean;
  focusable?: boolean;
  editable?: boolean;
  asChild?: boolean;
  ref?: Ref<HTMLElement>;
}
```

## Hard constraint — SSR

**`Box` must be SSR-safe and must not hold its own React state.** Interactions (`pressable`/`focusable`/`editable`) are implemented purely through CSS pseudo-classes (`:active`, `:focus-visible`, `:focus-within`), never JS state — otherwise the whole library cascades into `'use client'`, since `Box` underlies almost every component.

## Interaction behavior

- **`pressable`** — for buttons, implemented by shifting background brightness (not a JS state-layer/wash). Works naturally with glass/translucency since those already have an alpha channel to darken/lighten.
- **`focusable`** — always the same `:focus-visible` ring regardless of material — predictability for screen-reader users matters more than visual customization here.
- **`editable`** — mode for `asChild` over `<input>`/`<textarea>`: the interaction trigger switches from hover/active to `:focus-within`, so hover styles don't fight the active state while typing.
- **Polymorphism**: `asChild` only (Radix Slot pattern) — no separate `as` prop.

## Materials — behavior table

| Material | Fill at rest | Blur | Border | Behavior when `pressable` |
|---|---|---|---|---|
| `solid` | 100% opaque | — | — | darker/lighter by tone |
| `translucent` | semi-transparent | none | — | alpha increases |
| `glass` | semi-transparent | yes (`backdrop-filter`) | — | shift alpha/saturate, not color |
| `transparent` | none | — | none | temporarily gets a translucent fill |
| `outline` | none | — | yes, static | fill/border strengthens |
| `ghost` | none | — | appears on interaction | temporarily gets a translucent fill |
