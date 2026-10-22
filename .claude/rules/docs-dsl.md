# Custom Markdown DSL (docs)

Content is standard Markdown extended via `remark-directive`.

## Paragraphs

Standard paragraphs, separated by a blank line. No special syntax.

## Headings

Standard `#` syntax. Use levels `h1`–`h4` only. `h5`/`h6` are not used — if content needs that much nesting, restructure it instead.

```md
# Page title (h1, one per page)
## Section (h2)
### Subsection (h3)
#### Detail (h4)
```

## Callouts

Directive syntax `:::type`. Available types:

| Type      | Purpose                                  |
| --------- | ----------------------------------------- |
| `note`    | Neutral note, extra context                |
| `warning` | Warning, caution                           |
| `danger`  | Critical info, destructive actions         |
| `tip`     | Tip, best practice                         |

```md
:::note Optional title
Body text. Supports **bold**, _italic_, and `inline code`.
:::

:::warning
Title is optional — plain text works too.
:::
```

The title is optional; body text supports inline Markdown.

## Code fences

Standard fenced code blocks with a language tag, plus an optional meta string passed as attributes to the `CodeBlock` component:

````md
```tsx filename="app/page.tsx" highlight="3,5"
export default function Page() {
  return <main>Hello</main>
}
```
````

Supported meta attributes:

| Attribute  | Type   | Description                          |
| ---------- | ------ | ------------------------------------- |
| `filename` | string | File name shown above the block       |
| `highlight`| string | Comma-separated line numbers to highlight |

## Prop blocks

Directive syntax for documenting a single component prop, rendered as a name/type/default/version card via the `prop-block` component (`PropBlock.tsx`):

```md
:::prop[size]{type="'mini' | 's' | 'm' | 'l' | 'xl'" default="'m'"}
Description text, supports inline Markdown.
:::

:::prop[value*]{type="string" version="41" deprecated="true"}
A trailing `*` on the label marks the prop required; `deprecated="true"` flags it visually.
:::
```

Supported attributes: `type`, `default`, `version` (rendered as `MAJOR.MINOR` — only shown once parsed as a number `> 40`), `deprecated` (`"true"` to flag). The `[label]` is the prop name; append `*` to mark it required.

## Spoiler

Container directive `:::spoiler[Title]` — a collapsed-by-default block (altrone-ui `Spoiler`). The label is the always-visible title; the body is regular Markdown (code, tables, playgrounds). Use it for secondary how-to material that would otherwise push the main content down.

```md
:::spoiler[How to override variables]
Body text, code fences, `::playground{...}` — all supported.
:::
```

## Release block

A spoiler for one major version on the "Change history" tab (see `docs-tabs.md`), split into two columns 4/12 and 8/12 (stacked on phones). The left column shows the component's logo and its name **as it was called in that version**; the right column is the regular Markdown body (the changes). `:::release[Title]` — the label is the always-visible spoiler title. Consecutive release blocks are wrapped automatically in a vertical `Flex` with no gap — don't group them by hand.

```md
:::release[Altrone 4 Decent Dragon]{icon="/logos/altrone-4.png" logo="Application" name="Application" open="true"}
**4.0**

- Added `asChild`.
:::
```

| Attribute | Description |
| --------- | ----------- |
| `icon`    | Path to the release logo in `docs/public/logos/` (`/logos/altrone-N.png`), shown at 32×32 before the title. |
| `logo`    | Export name from `altrone-ui/logos` (`Application`, `Button`, …), shown on a dark badge in both themes. Used for the current major (4). |
| `image`   | Path to a picture in `docs/public/logos/` shown 72px tall (width follows the aspect ratio) with rounded corners instead of `logo`. Per-component version logos are named `<component>-<version>.png` (`/logos/text-2.png`); the Altrone release artwork is `/logos/altrone-N.png` (used for `Application`). |
| — | With neither `image` nor `logo` (a version that has no logo) a neutral dashed placeholder with a generic icon is shown. |
| `name`    | Component name shown under the logo — the historical name for that version (`AltroneApplication`, `Application`). |
| `open`    | `"true"` expands the block by default. |

### Removed component

Inline text directive `:removed[text]` renders red, semibold text (`--danger-text-1`). Use it in a release block for the version in which the component was removed, instead of describing the removal:

```md
**3.0**

- :removed[The component was removed.]
```

## CSS variable cards

A grid of visible cards (background, 1px border, rounded corners, generous padding), three per row (two on tablets, one on phones), documenting CSS custom properties. The outer `::::css-vars` (four colons — it nests) is the grid; each `:::css-var[--name]` is one card:

```md
::::css-vars
:::css-var[--box-fill]{kind="fill" type="Fill color" color="var(--accent-9)"}
Description text, supports inline Markdown.
:::

:::css-var[--button-gap]{kind="gap" type="Spacing"}
Space between the icon and the label.
:::
::::
```

Each card is vertical and center-aligned, and shows, top to bottom: a large **indicator** (48px), the variable **name** in semibold monospace, the **description**, and the **type** as a muted caption.

**Keep the description to a short phrase plus the default value** — what the variable controls, then ``Default: `value` `` (`По умолчанию:` in ru), e.g. "Label font size. Default: `14px`". Give one default — for a variable that varies by component `size`, the default `m` value, never a per-size scale. For a theme-dependent value give the light-theme one and say so. Don't add other details; those belong in the override spoiler or the Overview.

Each `::::css-vars` grid shows a row of **quick filters** above the cards: one toggle `Button` (`selected` when active) per distinct `type` present in that grid, in order of first appearance. Several filters can be active at once (cards matching any of them stay); with none active, all cards show. The row is built from the cards' own `type` values, so a type with no cards never appears, and a grid with **6 or fewer cards shows no filters**; with 7 or more it always does.

Clicking a card (or pressing Enter / Space on it) copies the variable name to the clipboard and shows a localized toast (`showToast`) confirming it.

| Attribute | Description |
| --------- | ----------- |
| `kind`    | Picks the indicator. `fill` / `text` → **two filled circles** (light theme, dark theme). `border` → **two rings** with a transparent fill and a colored border. Every circle and ring carries a 1px outline (a box-shadow in a theme-neutral gray), so near-white, near-black and transparent values stay visible on the card. Anything else → a single neutral circle with an icon: `font`, `gap`, `radius`, `shadow`, `blur`, or the default ruler for other sizes. |
| `type`    | Human-readable type label, localized: fill color, text color, border color, font size, spacing, corner radius, size, shadow, etc. |
| `color`   | For `fill` / `text` / `border`: a CSS color, normally a token expression such as `var(--accent-9)`. |
| `light`, `dark` | Optional per-theme overrides of `color`. |

The two circles are rendered in their own `data-altrone-root` scope with the light / dark theme, so a token expression in `color` resolves to the right value for each theme automatically — write `color="var(--accent-9)"`, not literal hex values. Use `light`/`dark` only when the two themes need genuinely different expressions.

## Icon cards

The same visible, centered card style as CSS variable cards, for documenting the **icons a component renders itself** and the props that replace them. `::::icon-cards` is the grid (no filters); each `:::icon-card[propName]` is one card:

```md
::::icon-cards
:::icon-card[successIcon]{icon="Check"}
Signals a successful outcome while `state` is `succeeded`
:::
::::
```

The card shows, top to bottom: the **icon** in a 48px neutral gray circle (same as the non-color indicators of CSS variable cards — no status coloring), the **prop name** in semibold monospace, and the **description**. There is no type caption and no default value. The description states the icon's **purpose** — a short phrase, e.g. "Signals a failed outcome while `state` is `failed`".

| Attribute | Description |
| --------- | ----------- |
| `icon`    | Icon name from the small map in `lib/parser/components/IconCard.tsx` (`Check`, `X`, `ImageOff`); add a lucide icon to that map when a new one is needed. |

Clicking a card copies the prop name and shows a localized toast, same as CSS variable cards.

## Good / Bad comparison

Two side-by-side columns (stacked on phones) for do/don't guidance. `::::good-bad` (four colons — it nests) holds one `:::good` and one `:::bad`; each column has a header — a **green circle with a checkmark** + "Good" (ru: "Хорошо") or a **red circle with a cross** + "Bad" (ru: "Плохо") — and any Markdown content below it, normally a live `::playground` example:

```md
::::good-bad
:::good
::playground{src=button/ButtonGuidelineNameGoodDemo caption="The label says what will happen"}
:::

:::bad
::playground{src=button/ButtonGuidelineNameBadDemo caption="The label says nothing about the action"}
:::
::::
```

- `::::good-bad{columns="1"}` stacks the two boxes in a single column instead of two side by side (default `columns="2"`). Use it when the examples are too wide for half the page, e.g. a long strip of controls.
- Give each column a `caption` on its playground that says **why** it's good or bad, in one short phrase.
- `:::good[Custom title]` overrides the header text.
- Prefer live examples to code fragments — show the thing, don't describe it. Use a code fence only when the point is the code itself (e.g. an API shape).

## Columns

Directive syntax `:::col-2` / `:::col-3` splits its content into 2 or 3 side-by-side columns. Separate columns with a thematic break (`---`) on its own line:

```md
:::col-2
Left column content.

---

Right column content.
:::
```

## Playground embeds

Leaf directive `::playground` embeds a live component demo from `docs/demo/<src>.tsx`:

```md
::playground{src="button-basic" caption="Basic usage"}
```

`src` is required (resolved as `@/demo/<src>`; demos live in a per-component folder, so it looks like `button/ButtonDefaultDemo` for `docs/demo/button/ButtonDefaultDemo.tsx`. New demos go into `docs/demo/<component>/`; the older flat demos move there when their page is touched); `caption` is optional text shown below the demo. Rendering failures (missing/broken demo module) show an inline error instead of crashing the page.

## Heading anchors

`h2`–`h4` headings automatically get a slugified `id` attribute (from their text content) for deep-linking — no author-facing syntax, nothing to opt into.

## Adding a new syntax element

1. Document the syntax in this file
2. Create a plugin in `lib/parser/plugins/<name>.ts`
3. Register the plugin in `lib/parser/index.ts`
4. Create a React component in `lib/parser/components/<Name>.tsx`
5. Add the mapping in `lib/parser/components/index.ts`

## Parser conventions (`lib/parser/`)

- Each custom syntax element is its own remark/rehype plugin under `plugins/`
- A plugin exports a single factory function: `() => (tree) => void`
- AST transforms go through `unist-util-visit`
- Final rendering goes through `rehype-react`, mapped in `components/index.ts`

## Renderer components

- Live in `lib/parser/components/`
- Plain React components that take `children` and hast attributes as props
- No external state — pure presentational components
