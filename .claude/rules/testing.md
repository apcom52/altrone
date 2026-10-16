# Testing (core)

- Unit tests: Vitest — `npm run test:unit`, test files live in the top-level `vitest/` folder (e.g. `vitest/button.test.tsx`), not colocated with the source
- Every component needs a `ComponentName.stories.tsx` — see `storybook.md` for how stories should be written and kept in sync with changes
- E2E / visual regression tests: none — Cypress was removed (it was abandoned and no longer matched the API)
- Pre-release gate (`npm run test:pre-release`) = unit tests — new components/changes should pass this before publishing

## Unit test scope — quality over count

- One behavior = one test case. `fn(2) === 4`, `fn(5) === 10`, `fn(10) === 20` are not three test cases — they're the same claim ("returns the correct value") checked with different filler data. Pick one representative input for the happy path, not three.
- A new test case is justified by a genuinely different **scenario** — different branch, different input *shape* (not just a different number), a different usage context, an edge case. If a case doesn't exercise code the previous case didn't, don't add it.
- Don't generate tests for coverage's sake. A test that can't fail in a way that would surprise anyone is not worth writing.
- Prioritize edge cases and failure mechanisms over the happy path: boundary values, empty/null/undefined input, state that could silently break a function/hook/component's contract (e.g. an off-by-one, a value that flips a clamp from "expected" to "degenerate", a race in an async hook). These are the cases actually worth the maintenance cost of a test.
