# altrone-mcp Server Conventions

- Purpose: MCP server that exposes `altrone-ui` component documentation to MCP clients (e.g. Claude Desktop)
- Each component has one Markdown file under `docs/`, named after the component, mirroring `core/src/components/<name>`
- Current tools: `list_components` (enumerate documented components), `get_component_docs` (full docs for one component by name) — new tools should follow the same shape: one focused MCP tool per query, backed by the `docs/` files
- Entry point is `src/index.ts`; production build goes through `tsc` to `dist/index.js`, exposed as the `altrone-mcp` bin
- For local development, run directly with `tsx src/index.ts` (`npm run dev`) — no build step needed
- Keep `docs/` in sync with `core`: when a component is added, renamed, or removed in `core`, update the matching Markdown file here
