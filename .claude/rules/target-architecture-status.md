# Target Architecture — Status

`application-screen.md`, `box.md`, `radius.md`, `spacing.md`, `typography.md`, `elevation.md`, `color.md`, `motion.md`, `dark-theme.md`, `responsiveness.md`, `accessibility.md`, and `rejected.md` describe the **target architecture** `altrone-ui` is being refactored toward, distilled from an architecture discussion (source: `core/ARCHITECTURE-V4.md`, session 2026-08-04).

- This is the direction to build **new** code toward. It is normal and expected that most existing components do not follow it yet — that's refactoring work, not a bug to "fix" opportunistically on unrelated tasks.
- When writing new code or substantially touching a component, prefer the target pattern over the legacy one it replaces, even though it diverges from most of the current codebase.
- Where a file says something is **not decided / open**, treat it as genuinely open — don't invent an answer, ask instead.
- Breaking changes are expected and accepted (API changes to `Application`/`Screen`, new `Box` primitive, token renames across spacing/radius/typography). No migration/codemod strategy has been decided yet — if that becomes relevant, ask rather than assume a deprecation period exists.
- Explicitly rejected directions are in `rejected.md` — don't propose them again without new information.
- For changelog purposes this refactor is tracked under the `v4` version bucket (see `changelog.md`) — that's just the placeholder release name, unrelated to how these rule files are organized.
