# Theming / CSS Variables (core)

- All colors and typography are CSS custom properties defined in `src/components/application/altroneApplication.module.scss`. Never use hardcoded color values.
- Use CSS variables from `application/colors`, `application/styles`, and `application/altroneApplication.module.scss`. A component can also have its own CSS variables, but they belong in the component's own `<component>.module.scss` — don't create special variables inside individual sub-components, put them in the main component's stylesheet.
- Some variables are legacy — don't use them: `--primary-500`, `--danger-500`, `--paragraphFontSize`.
- Avoid `@import` inside `.scss` files — also legacy style.
- Dark mode is toggled via the `data-altrone-theme` attribute.
- Don't modify `src/components/application/index.css` — it's auto-generated.

## Naming

CSS custom properties are kebab-case: `--component-css-variable-name`. For a variable scoped to one component, the component name comes **first**, then what the variable controls — e.g. `--data-table-cell-text-color`, not `--cell-text-color-data-table` or `--dataTableCellTextColor`.

Global/token-level variables (not scoped to a single component — spacing, radius, elevation, status colors, etc.) skip the component prefix and just name the role: `--space-inline`, `--elevation-modal-shadow`, `--danger-text-1`.

Some existing components still use camelCase (`--dataTableHeaderBackgroundColor`) — legacy, don't copy it into new variables. Not a green light to rename them wholesale either; that's a separate, deliberate cleanup, not something to do opportunistically while touching a file for an unrelated reason.

## Don't

- Don't use inline styles for colors or typography — use CSS vars + mixins.
