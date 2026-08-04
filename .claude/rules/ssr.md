# SSR Compatibility (core)

Write all components to be SSR-safe by default:

- Never access `window`, `document`, or `navigator` at module level or during render — only inside `useEffect` or behind a `typeof window !== 'undefined'` guard.
- Never use browser-only APIs (`localStorage`, `matchMedia`, etc.) during initial render. Read them in `useEffect` and set state.
- Mark components that are **impossible** to SSR (e.g. they require synchronous DOM measurements) with a comment: `// SSR: requires client — wrap in <ClientOnly> or lazy()`
- Prefer CSS for layout and visibility over JS-calculated dimensions where possible.

## Don't

- Don't access `window`/`document` during render or at module level.
