# Internationalization (docs)

Docs are available in two languages: English (`en`) and Russian (`ru`).

## Content organization

```
content/
├── en/
│   └── getting-started.md
└── ru/
    └── getting-started.md
```

Every page must exist in both languages. If a translation is missing, fall back to `en`.

## Routing

Uses `next-intl` with the locale as a URL prefix: `/en/docs/getting-started`, `/ru/docs/getting-started`. Locale config lives in `i18n.ts`; locale detection middleware is in `middleware.ts` (both at the project root).

## Reading content by locale

```ts
// lib/content.ts
export async function getDocContent(slug: string, locale: string) {
  const filePath = path.join(process.cwd(), 'content', locale, `${slug}.md`)
  try {
    return await fs.readFile(filePath, 'utf-8')
  } catch {
    const fallback = path.join(process.cwd(), 'content', 'en', `${slug}.md`)
    return await fs.readFile(fallback, 'utf-8')
  }
}
```

## Content conventions

- Files in both languages must have the **same structure** (same headings, same code blocks)
- Custom syntax elements (callouts, code fences) are identical across languages — only the text inside is translated
- File names are always in English regardless of language (`content/ru/getting-started.md`, not `content/ru/nachalo-raboty.md`)
