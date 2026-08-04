# Changelog on Every Change

Every change to public API or internal/architectural behavior (only in `core`) must be recorded in a changelog entry as part of the same piece of work — not a follow-up. This is how the project keeps a readable history of what changed and why.

- **Scope**: public API changes (new/changed/removed component props, new components, behavior changes a consumer would notice) and meaningful internal/architectural changes (new design-token systems, refactors that change how something works internally, new conventions). Skip it for things with no lasting behavioral or architectural footprint — comment rewording, formatting, typo fixes, adding a test for existing behavior, moving code without changing it.
- Location: `changelogs/{VERSION}/YYYY-MM/DD-MMMM.md`, inside the repo where the change was made — e.g. `core/changelogs/v4/2026-08/04-августа.md`
- Current `VERSION`: `v4` (placeholder until an actual v4 release is cut — don't substitute a different value without being told to)
- One file per calendar day. If several changes land the same day, append a new section to the existing file instead of creating another one.
- Language: Russian.
- Each entry briefly covers:
  - **Что изменилось** — what changed
  - **Зачем** — the motivation/reason behind the change
- Keep entries short — a few sentences, not a full diff narrative.

Example entry (`core/changelogs/v4/2026-08/04-августа.md`):

```md
## Добавлен Box-примитив (черновик API)

Добавлен компонент `Box` с пропами shape/material/tone/size/elevation — универсальный примитив
для button-like компонентов в рамках архитектуры v4.

Зачем: унифицировать визуальные варианты (материалы, elevation) вместо дублирования
похожей логики в каждом отдельном компоненте.
```
