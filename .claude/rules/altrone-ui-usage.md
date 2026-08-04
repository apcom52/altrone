# Using altrone-ui in Consumer Projects

Applies to projects that consume the `altrone-ui` library (currently: `docs`). Does not apply to `core`, which is the library itself.

- All markup and UI must be built with `altrone-ui` components, not raw HTML elements or hand-rolled CSS
- Before adding custom styling, check whether an existing `altrone-ui` component already covers the need
- If a required component doesn't exist in `altrone-ui`, that's a signal to add it upstream in `core` rather than working around it locally
