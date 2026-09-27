# Аудит: использование `Scrollable`

Компонент `Scrollable` (`core/src/components/scrollable/`) — обёртка над `overlayscrollbars-react`, даёт кастомные автоскрывающиеся скроллбары вместо нативных.

## Где уже используется

| Компонент | Файл |
|---|---|
| AutocompleteInput | `core/src/components/autocompleteInput/AutocompleteInput.tsx:204` |
| Select | `core/src/components/select/Select.tsx:105` |
| DataTable | `core/src/components/dataTable/inner/Body.tsx:33` |
| Drawer | `core/src/components/drawer/Drawer.tsx:120` |
| NavigationList | `core/src/components/navigationList/NavigationList.tsx:136` |

## Где не используется, хотя должен (3 пробела)

### 1. `internal/sheet` — общий для `Modal` и `Drawer`
- `core/src/internal/sheet/sheet.module.scss:78` — `.ScrollContent { overflow-y: auto; overflow-x: hidden; }`, применяется в `Sheet.tsx:291` (auto-height / вертикальные placement'ы)
- `core/src/internal/sheet/sheet.module.scss:164` — `.Panel { overflow: auto; }`, применяется в `Sheet.tsx:345`

`Drawer` уже оборачивает свой контент в `<Scrollable>`, но сам `Sheet` под капотом всё равно скроллится через сырой `overflow: auto` в некоторых сценариях. **`Modal`** вообще не использует `Scrollable` нигде — его контент скроллится целиком через `Sheet.Panel`'s `overflow: auto`.

### 2. `Dropdown.Menu`
- `core/src/components/dropdown/components/action.module.scss:26` — `.Menu { overflow-y: auto; }`, применяется в `DropdownMenu.tsx:15`

Список опций дропдауна скроллится нативно, без `Scrollable`.

### 3. `Splitter`
- `core/src/components/splitter/splitter.module.scss:32` — `.Panel { overflow: auto; }`, применяется в `Splitter.tsx:197`

Контент каждой панели сплиттера скроллится нативно.

---

Во всех трёх папках нет ни одного упоминания `Scrollable` — это настоящие пропуски, а не случаи использования под другим именем.

## Исключено из аудита (ложные срабатывания)

- Большинство `overflow: hidden` по кодовой базе — это `text-overflow: ellipsis` (обрезание текста) или чистый клиппинг, не скролл-зоны.
- Inline `overflow`/`overflowX`/`overflowY` в `.stories.tsx` — демо-код, не реализация компонентов.
- `core/src/internal/sheet/scrollLock.ts` — блокировка скролла `document.body` при открытом оверлее, не скролл-контейнер.
- `overflowX`/`overflowY` в `Scrollable.tsx`, `Select.tsx`, `NavigationList.tsx`, `dataTable/inner/Body.tsx` — это пропсы самого `Scrollable`, уже учтены в разделе "где используется".
