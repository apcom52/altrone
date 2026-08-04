# Code Comments

- Only comment when there's a non-obvious reason — a workaround, an invariant, a deadline, a subtle constraint (see `typescript.md`). Don't restate what the code already says.
- Keep it short — a sentence or two. If it's getting long, that's usually a sign the code itself needs a clearer name, not a longer comment.
- Format as a block comment (`/** ... */`), even for a single line — not `//`.
- Workarounds/hacks: say explicitly that it's a workaround and explain what it's working around (a bug, a browser quirk, a library limitation) — so a future reader knows it's not the ideal shape and can tell when it's safe to remove.
- Include a short usage example inside the comment when the non-obvious part is *how to call it* (a non-obvious signature, an edge-case argument), not just *why it exists*.

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
 *
 * @example
 * clampNonZero(15, 0, 10) // 10
 * clampNonZero(0, 0, 10)  // 0
 */
```
