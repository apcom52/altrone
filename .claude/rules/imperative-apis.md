# Imperative "Show Something Programmatically" APIs

Two canonical mechanisms cover every case in the library — pick by whether the thing being shown has a real, externally-controlled JSX element in the tree:

- **No JSX trigger, or must be callable from outside React** (a store action, a non-component module, a plain async function) → **global functions**, module-level, backed by a stack of controllers registered by whichever provider instance is currently mounted (see `Dialog` — `core/src/components/dialog/dialog.ts` — and `Notifications` — `core/src/components/notifications/notificationsRegistry.ts` — for the reference shape: `register*`/`unregister*` push/splice a stack, the top entry handles new calls, unmounting falls back to the previous one).
- **A real, rendered JSX element that something outside it needs to control** (`Popover`, `Splitter`, `Dropdown.Menu`) → **`controlRef`** (a second `ref`-shaped prop, kept separate from the DOM `ref`), exposing plain verbs via `useImperativeHandle`.

Don't introduce a third shape (a hook that's the *only* way to trigger something, a bespoke event-emitter, etc.) without discussion — a hook can't be called from a store action or any other non-component code, which is why `useNotifications()` was removed in favor of `showToast`/`showNotification`/`dismissNotification`.

## Naming

- **Global functions**: `show<Thing>` to display, a bare kind-specific verb to reverse it (`dismiss<Thing>`, not `hide<Thing>`) — matches `showAlert`/`showConfirm`/`showPrompt` (`Dialog`) and `showToast`/`showNotification`/`dismissNotification` (`Notifications`).
- **`controlRef` methods**: bare verbs, no redundant component-name suffix — `collapse`/`expand`/`toggle` (`Splitter`), `show`/`hide` (`Popover`), not `openPopup`/`closePopup`. If the ref also exposes state, keep the state key name aligned with the component's own controlled-prop name (`Popover.open` state matches the `PopoverProps.open` controlled prop) — a separate, wider "open/opened/expanded" naming question tracked in `differences.md` (section C).

## Known gap

`Dropdown.Menu`'s `DropdownMenuRef` (`selectedIndex`, `menuNode`) is declared in `Dropdown.types.ts` but never wired up — `DropdownMenu.tsx` only forwards a plain DOM `ref`. Either implement it via `controlRef` following the pattern above, or remove the dead type; don't invent a third ref shape for it.
