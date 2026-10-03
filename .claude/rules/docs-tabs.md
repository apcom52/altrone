# Tabbed Component Pages (docs)

**Every component documentation page must be authored as a folder using this tabbed structure, not a single flat file.** This applies whenever writing a new component doc or substantially reworking an existing one — don't fall back to a plain `<slug>.md` for a component page. `button` and `popover` are tabbed today; bring every other component page to the same shape as it gets written or touched. (Non-component pages — `foundations/*` and standalone top-level pages like `getting-started` — stay single files; this rule is about component docs specifically.)

A component page is split into tabs by authoring it as a folder instead of a single file:

```
content/{en,ru}/button/
├── index.md        # Overview
├── guidelines.md   # Guidelines
├── css_vars.md     # CSS variables
└── icons.md        # Icons (only if the component renders icons itself)
```

## Which tabs exist and what goes in them

The set is fixed — `index`, `guidelines`, `css_vars`, `icons`, `history` — with localized titles in `lib/docTabs.ts`. Don't invent other tab files without adding them there.

- **`index` — Overview / Сведения.** The main article and the only required file: what the component is, variants, sizes, states, examples, the props list, and the "Related topics" section. Everything about how to *use* the component, including how it treats the icons a consumer passes in (`icon`, `showLabel={false}`, state icons), lives here — not in a separate tab.
- **`guidelines` — Guidelines / Гайдлайны.** Design and usage recommendations: naming, emphasis, when to disable, accessibility. Each recommendation is a short section of prose followed by a **Good / Bad comparison** (see `docs-dsl.md`) with **live examples** rather than code fragments. Accessibility can stay a plain list.
- **`css_vars` — CSS variables / CSS переменные.** The CSS custom properties the component reads **and that can be overridden**, shown as cards (see "CSS variable cards" in `docs-dsl.md`). Layout of the page, in this order:
  1. `# Title` and a one-paragraph intro.
  2. A collapsed `:::spoiler` with the override instructions: how to override (`style` prop, specificity), a demo, which overrides break hover/pressed/disabled states, and what can't be overridden.
  3. `## Internal variables` — only variables **defined by the component itself** (its own `--<component>-*`, e.g. `--button-gap`). A variable belongs here only if it exists nowhere else; anything owned by another primitive doesn't, even when it is set on the component's element.
  4. `## Global variables` — everything the component reads but doesn't define, in **one** `::::css-vars` grid: the `--box-*` variables of the primitives it is built on (e.g. `--box-fill`, `--box-tone-text`) and the global design tokens (`--accent-*`, `--danger-*`, `--gap`, `--radius-*`, …). Exactly two sections — don't split them into subsections.

  Each card is one variable: indicator (color → two circles for light/dark, border → two rings, otherwise an icon), name, a short one-phrase description ending with the single default value, type. Verify every entry against the SCSS — a variable that is set inline or hard-coded doesn't belong on the page.
- **`icons` — Icons / Иконки.** Only for **system icons the component renders itself** (e.g. the success/failure icons of `Button`, the chevron in `Select`/`Dropdown`, the help icon in `Form.Field`). If the component renders no icons of its own, there is no `icons` tab. Icons the *consumer* passes in (`icon`, `additionalIcon`) are documented in the Overview, not here. Layout of the page, in this order:
  1. `# Title` and a short intro: what the component draws itself, anything that can't be replaced (e.g. the loading spinner), and a link to the Overview for consumer-supplied icons.
  2. A collapsed `:::spoiler` with the replacement instructions: how to replace the icons (the props, a code example, a demo, sizing notes, using another icon library).
  3. `## Icons` — one `::::icon-cards` grid, one card per **replaceable** icon: the card title is the **prop name** (`successIcon`), the description is the icon's purpose. No type, no default value, no filters. An icon with no prop to replace it gets no card — mention it in the intro.
- **`history` — Change history / История изменений.** Source: `changelogs/release-history.md` at the workspace root (one section per component). Layout of the page:
  1. `# Title` only — no intro. The version the component first appeared in is the oldest `:::release` block.
  2. One `:::release[Altrone N Codename]` block (see `docs-dsl.md`) per **major** release, newest first, each with the logo and the component's name in that version. Only the current major (4) is expanded — `open="true"`; the rest stay collapsed.
  3. Inside a release block, one bold version line (`**4.0**`, `**2.1**` — minor level, not patch) followed by a bullet list of what changed. Patch fixes fold into their minor version. In the version where the component first appeared, write a single bullet: it was added to the library and, briefly, what it is for — no fixes or details of that release. No headings inside release blocks.

## Writing the Overview

- Give a topic a section only if it has enough to say. A single fact (e.g. that the button sizes its icon slot itself) is one sentence inside the related section, not its own heading, and not a table.
- Prefer tables only for genuinely tabular data; don't add one to restate what the prose or a demo already shows.
- Section titles are human, task-oriented names ("Toggle button", not "Selected state"; "Dangerous actions", not "Danger modifier").
- Name demo elements after what they do, so the example explains itself — e.g. the async-state demo has "Simulate success" and "Simulate failure" buttons, not "Save" and "Send".
- Usage advice ("when to use X", how to wire a button into a form) belongs in **Guidelines**, not in the Overview; the Overview says what the API *does*.
- Built-in icons and their replacement props (`successIcon`, `failedIcon`) belong on the **Icons** tab — the Overview only covers icons the consumer passes in.
- Order of the Overview: intro → variants / sizes / states / features, each with a live demo → `## Props` (prop blocks) → `## Related topics`.

## Which tabs to show

- A tab exists only if its file exists; a component with nothing to say for a tab simply omits the file.
- The tab bar is shown only when the folder has **two or more** tabs. A folder with just `index.md`, or a plain `<slug>.md`, renders as a normal single page.
- Both locales carry the same set of tabs (see `docs-i18n.md`).

## How tabs are arranged

- **Order is fixed:** Overview → Guidelines → CSS variables → Icons → Change history, regardless of which subset exists. `index` is always first.
- **Placement:** the tab bar sits directly **under the page's `# Title`** and above the rest of the article, centered. The page splits off the file's first `# ` line and renders the bar between it and the body. The "On this page" aside on the right shows the headings of the **active** tab only.
- **Size and icons:** the bar is large (`Tabs` `size="l"`) and every tab has an icon, mapped by tab id in `components/DocTabs.tsx` (Overview — `BookOpen`, Guidelines — `ListChecks`, CSS variables — `Palette`, Icons — `Shapes`, Change history — `History`). A new tab id needs its icon added there.
- **Routing:** every tab is its own route — `/components/<category>/<slug>` for Overview, then `.../<slug>/guidelines`, `.../<slug>/css-vars` (`_` in the file name becomes `-`), `.../<slug>/icons`, `.../<slug>/history`. The Overview URL never carries `index`. Unknown tab segments 404.
- **Sidebar:** the component stays highlighted on all its tabs.

## Writing tab files

- Every tab file starts with the same `# Title` (the component name) — it is rendered above the tab bar on every tab, so the title stays constant.
- The "Related topics" section goes in `index.md` only.
- Internal links inside a folder page must be absolute (`/en/foundations/color`, `/ru/foundations/color`) — a bare relative slug resolves differently on `/button` and `/button/css-vars`. To link to another tab, use its full URL.
- Code and demo text in examples is always English, in both locales; prose follows the locale.
- Headings within one tab must be unique (they become anchors) — don't reuse a heading text across sections and subsections.
