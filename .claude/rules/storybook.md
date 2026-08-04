# Storybook Stories (core)

Every change to `core` must be reflected in Storybook as part of the same piece of work — not a follow-up.

- Every component needs `ComponentName.stories.tsx`. When props or behavior change, update the existing story to demonstrate the new behavior — don't leave it demonstrating the old API.
- Write new cases for new behavior — not just "it renders", but the realistic states/variants a consumer will actually hit (empty, loading, error, disabled, long content, edge sizes, etc. where relevant).
- Stories are documentation, not just visual smoke tests. Write them like a magazine or book article — real headings and prose paragraphs explaining the *why*, not a bare wall of unlabeled component instances. Compose headings/paragraphs with the library's own `Text`/`Flex` components rather than raw HTML. See `application/styles/Radius.stories.tsx` for the target shape of a docs-style story.
- For any interactive control inside a demo (a slider, an input, a toggle, ...), use the matching Altrone component (`Range`, `TextInput`, `Switcher`, ...) instead of a raw HTML element — the demo should look and feel like the library it's documenting, not like generic browser chrome.
- Granularity: a large feature or new primitive (a new component, a new design-token system, a new `Foundations/*` topic) gets its own story file. Small, closely related changes are added as a case inside the existing relevant story — don't fragment one topic across many tiny files.
- This applies beyond components: design tokens/foundations (spacing, radius, color, motion, etc.) get a documentation-style story under `Foundations/*` once implemented, following the same "article" treatment.
