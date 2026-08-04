# TypeScript / General Code Style

- Language: TypeScript, strict mode is enabled — don't disable it locally for convenience
- Formatting: Prettier, single quotes (`singleQuote: true`)
- Linting: ESLint, zero warnings allowed (`--max-warnings 0` in core) — don't silence rules with `eslint-disable` unless truly necessary
- Don't write comments explaining WHAT the code does — only WHEN there's a non-obvious reason (a workaround, an invariant, a migration deadline). See `comments.md` for format and detail
- Don't add abstractions/generalizations for hypothetical future use — only what the current task needs
