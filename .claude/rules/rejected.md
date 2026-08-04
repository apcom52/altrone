# Rejected Directions

Don't re-propose these without new information — they were considered and turned down in the architecture discussion:

- **DSL/schema-driven screens** — rejected early on, too far from the desired scope; the scope is composition through `Application`/`Screen` components, not a schema-driven framework.
- **Monorepo split** for heavy components (DataTable/ColorPicker/DataGrid) — rejected: releases are synchronous and everything is tightly coupled; ESM tree-shaking already solves bundle size without the tooling overhead of a monorepo.
- **Density/compact mode** (a global density setting separate from `size`, à la Ant compact theme, Salesforce Lightning, Airtable row height) — rejected: no clear data-dense use case that `size` doesn't already cover.
- **`rem` for typography** — rejected for now (not permanently); see `v4-typography.md` for the known gap this leaves (OS/browser font-size settings won't affect Altrone text).
