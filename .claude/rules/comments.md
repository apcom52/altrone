# Code Comments

- Only comment when there's a non-obvious reason — a workaround, an invariant, a deadline, a subtle constraint (see `typescript.md`). Don't restate what the code already says.
- Simple code gets no comment at all — don't add one just to explain what's already obvious from reading it.
- **Length is a hard constraint, not a suggestion: one sentence. Two only when the construct is genuinely complex — that's the rare exception, not the default.** Aim to fit every comment in two lines; going past that should be rare. Do not write multi-paragraph explanations, rationale essays, or comments that narrate the history of a fix — that belongs in the changelog (`changelog.md`), not inline.
- Format as a block comment (`/** ... */`), even for a single line — not `//`.
- Workarounds/hacks: say explicitly that it's a workaround and explain what it's working around (a bug, a browser quirk, a library limitation) — so a future reader knows it's not the ideal shape and can tell when it's safe to remove.
- Include a short usage example inside the comment when the non-obvious part is _how to call it_ (a non-obvious signature, an edge-case argument), not just _why it exists_.

```ts
/**
 * Workaround: Safari doesn't fire `resize` on autosizing `<textarea>`, so
 * we poll on animation frame instead. Remove once Safari ships
 * ResizeObserver support for textareas.
 */
```

```ts
/**
 * Clamps `value` toward `min`/`max`, but returns 0 unchanged — an
 * explicit 0 is treated as "opt out", not "clamp me".
 */
```
