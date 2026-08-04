# Theming / CSS Variables (core)

- All colors and typography are CSS custom properties defined in `src/components/application/altroneApplication.module.scss`. Never use hardcoded color values.
- Use CSS variables from `application/colors`, `application/styles`, and `application/altroneApplication.module.scss`. A component can also have its own CSS variables, but they belong in the component's own `<component>.module.scss` — don't create special variables inside individual sub-components, put them in the main component's stylesheet.
- Some variables are legacy — don't use them: `--primary-500`, `--danger-500`, `--paragraphFontSize`.
- Avoid `@import` inside `.scss` files — also legacy style.
- Dark mode is toggled via the `data-altrone-theme` attribute.
- Don't modify `src/components/application/index.css` — it's auto-generated.

## Don't

- Don't use inline styles for colors or typography — use CSS vars + mixins.
