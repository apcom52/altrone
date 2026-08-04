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
