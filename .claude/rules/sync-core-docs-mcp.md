# Keeping docs and mcp in sync with core

`core` is the source of truth for `altrone-ui`. Whenever a component in `core/src/components/**` is added, renamed, removed, or has its public API (props, types, behavior) changed, the following must be updated in the same piece of work — not left as a follow-up:

- **mcp**: the matching Markdown file in `mcp/docs/<name>.md` (add/update/remove/rename to mirror the component change; see `mcp-server.md`)
- **docs**: any reference to that component in the documentation site content (`docs/content/en/**`, `docs/content/ru/**`) — usage examples, prop tables, code snippets

Concretely:

- New component in `core` → add its doc file in `mcp/docs/` and, if it's documented on the site, add/extend the relevant page(s) in `docs/content/{en,ru}/`
- Renamed/removed component in `core` → rename/remove the matching `mcp/docs/` file and update every `docs/content/**` reference, don't leave stale mentions
- Changed props/behavior in `core` → update the prop table / examples in `mcp/docs/<name>.md` and any affected `docs/content/**` snippets so they don't drift from the actual API

If a change only touches internals with no effect on the public API, docs/mcp updates are not required.
