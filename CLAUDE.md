# CLAUDE.md — Altrone Workspace

## Overview

This is a workspace root that aggregates several independent git repositories, each maintained as its own repo but cloned side by side here for local development:

- `core/` — [altrone-ui](https://github.com/apcom52/altrone-ui), the React component library itself
- `mcp/` — `@altrone/mcp`, an MCP server exposing `altrone-ui` component docs to MCP clients
- `docs/` — the Altrone documentation site (Next.js), a consumer of `altrone-ui`

The root itself contains no application code, only workspace tooling.

## Workspace tooling

- `repositories.ts` — the list of repositories that make up this workspace (name, git URL, local path, optional branch)
- `scripts/install-repositories.ts` — clones/updates every entry from `repositories.ts` into this directory; run via `npm run install-repos [target dir]` (defaults to the workspace root)

When adding a new sub-project to the workspace, add it to `repositories.ts` rather than cloning it by hand.

## Rules

@.claude/rules/typescript.md
@.claude/rules/comments.md
@.claude/rules/communication.md
@.claude/rules/changelog.md
@.claude/rules/altrone-ui-usage.md
@.claude/rules/sync-core-docs-mcp.md
@.claude/rules/docs-dsl.md
@.claude/rules/docs-i18n.md
@.claude/rules/mcp-server.md

## Rules (core / altrone-ui)

@.claude/rules/components.md
@.claude/rules/testing.md
@.claude/rules/storybook.md
@.claude/rules/ref-forwarding.md
@.claude/rules/ssr.md
@.claude/rules/event-handlers.md
@.claude/rules/namespace-exports.md
@.claude/rules/theming.md
@.claude/rules/localization.md
@.claude/rules/application-provider.md
@.claude/rules/configuration.md
@.claude/rules/new-component-checklist.md
@.claude/rules/target-architecture-status.md
@.claude/rules/application-screen.md
@.claude/rules/box.md
@.claude/rules/radius.md
@.claude/rules/spacing.md
@.claude/rules/typography.md
@.claude/rules/elevation.md
@.claude/rules/color.md
@.claude/rules/motion.md
@.claude/rules/dark-theme.md
@.claude/rules/responsiveness.md
@.claude/rules/accessibility.md
@.claude/rules/rejected.md
