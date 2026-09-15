# Инструкция по переходу: `children` → именованные пропы

Рефакторинг для `4.0.0`. Принцип, к которому приводим библиотеку:

> **`children` — это контент компонента.** Всё, что не контент (экшены, триггер,
> подпись, элементы служебных слотов), передаётся именованным пропом с явным типом.

Ломающие изменения допустимы: `4.0.0-beta` даёт свободу менять публичный API.

Связанный документ: [`differences.md`](./differences.md) — полный аудит расхождений
(разделы **A**, **G**, **H**, **M** пересекаются с этим переходом).

---

## Содержание

- [Этап 1. `DataTable`: общие экшены из `children` в `actions`](#этап-1-datatable-общие-экшены-из-children-в-actions)
- [Этап 2. Единый тип для всех `actions`](#этап-2-единый-тип-для-всех-actions)
- [Этап 3. Остальные не-контентные `children`](#этап-3-остальные-не-контентные-children)
- [Чеклист на каждый этап](#чеклист-на-каждый-этап)
- [Сводная таблица миграции для консьюмера](#сводная-таблица-миграции-для-консьюмера)

---

## Этап 1. `DataTable`: общие экшены из `children` в `actions`

**Статус:** решено, можно делать сразу. Изолировано, не задевает другие компоненты.

### Что сейчас

`DataTableProps` заново добавляет `children` поверх `Omit<…, 'children'>`, и это
единственный канал для экшенов уровня таблицы:

```ts
// core/src/components/dataTable/DataTable.types.ts:137
export interface DataTableProps<T extends object>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?:
    | ReactElement
    | ReactElement[]
    | ((context: DataTableRenderContext<T>) => ReactElement | ReactElement[]);
  …
  rowActions?: RenderFunction<
    StrictReactElements<DataTableRowActionProps>,
    DataTableRenderRowActionsContext<T>
  >;
}
```

Асимметрия видна в JSX: строковые экшены — проп, табличные — дети.

### Что должно стать

```ts
// DataTable.types.ts — убрать блок children целиком, добавить:

/**
 * Rendered in the table header, before the filtering control. One
 * `DataTable.Action` or several.
 */
actions?: RenderFunction<
  StrictReactElements<DataTableActionProps>,
  DataTableRenderContext<T>
>;
```

Тип `RenderFunction<T, Ctx> = T | ((ctx: Ctx) => T)` уже есть в `utils/types.ts` —
тот же, что у `rowActions`. `DataTableRenderContext<T>` (`{ selectableMode, selectedItems }`)
остаётся без изменений.

### Файлы

| Файл | Что сделать |
|---|---|
| `dataTable/DataTable.types.ts` | Удалить `children`; добавить `actions`; `DataTableRenderContext` оставить |
| `dataTable/DataTable.tsx` | `children` → `actions` в деструктуризации и в `<Header>`; переписать `headerVisible` |
| `dataTable/inner/Header.tsx` | Переименовать проп `children` → `actions`, тип взять из `DataTableProps['actions']` |
| `dataTable/components/Action.tsx` | Попутно починить `label`/`showLabel` (см. ниже) |
| `dataTable/DataTable.stories.tsx` | 3 места: строки ~352, ~432, ~534 |
| `mcp/docs/DataTable.md` | Секция `DataTable.Action` + пример со `selectedItems` (строки ~81, ~196) |
| `changelogs/v4/2026-09/…` | Запись «Что изменилось / Зачем» |

`core/cypress/component/DataTable.cy.tsx` **трогать не нужно** — он использует только
`rowActions`. В `docs/content/**` `DataTable` не документирован, там тоже нечего править.

### `headerVisible`

Сейчас считается через `Children.count`:

```ts
// DataTable.tsx:118
const headerVisible = useMemo(
  () =>
    Children.count(children) > 0 ||
    columns.some((column) => column.filterable) ||
    selectable,
  [children, columns, selectable],
);
```

После перехода `actions` может быть функцией, и `Children.count` для неё бессмысленен.
Достаточно проверки на наличие:

```ts
const headerVisible = useMemo(
  () =>
    Boolean(actions) ||
    columns.some((column) => column.filterable) ||
    selectable,
  [actions, columns, selectable],
);
```

Осторожно: функция, вернувшая `<></>` (в сторис такой кейс есть), даст пустую шапку.
Если это нежелательно — разворачивать `actions` до расчёта `headerVisible` и проверять
результат так же, как `Modal` делает это через `hasRenderableNodes`
(`modal/Modal.tsx:129`). Импорт `Children` из `react` после правки станет лишним.

### Попутный фикс в `Action.tsx`

```tsx
// сейчас — обнуляет доступное имя кнопки
<Button title={label} label={showLabel ? label : ''} … />
```

`Button` уже сам умеет `showLabel={false}` (оставляет `label` как accessible name
и показывает авто-тултип). Правильно — просто пробросить оба пропа:

```tsx
<Button ref={ref} label={label} showLabel={showLabel} disabled={loading} {...restProps} />
```

И убрать из `DataTableActionProps` повторное объявление `showLabel?: boolean` —
оно уже есть в `ButtonProps`:

```ts
export interface DataTableActionProps extends ButtonProps {}
```

### Миграция консьюмера

```tsx
// было — простые экшены
<DataTable data={data} columns={columns}>
  <DataTable.Action label="Add employee" onClick={add} />
</DataTable>

// стало
<DataTable
  data={data}
  columns={columns}
  actions={<DataTable.Action label="Add employee" onClick={add} />}
/>
```

```tsx
// было — экшены, зависящие от выделения
<DataTable data={data} columns={columns} selectable mode={mode} onModeChange={setMode}>
  {({ selectableMode, selectedItems }) =>
    selectableMode ? (
      <DataTable.Action label={`Email ${selectedItems.length}`} onClick={email} />
    ) : (
      <></>
    )
  }
</DataTable>

// стало
<DataTable
  data={data}
  columns={columns}
  selectable
  mode={mode}
  onModeChange={setMode}
  actions={({ selectableMode, selectedItems }) =>
    selectableMode
      ? [<DataTable.Action key="email" label={`Email ${selectedItems.length}`} onClick={email} />]
      : null
  }
/>
```

Два отличия от старой формы, о которых надо сказать в changelog:

- «ничего не рендерить» — это `null`, а не `<></>` (`StrictReactElements` допускает
  `null`/`undefined` и массив с ними);
- несколько экшенов — массив с `key`, а не фрагмент. Так же, как у `rowActions`.

---

## Этап 2. Единый тип для всех `actions`

**Статус:** требует решения по двум пунктам (см. ниже), остальное механически.

Сейчас в библиотеке **семь** форм одного и того же пропа:

| Компонент | Тип сейчас |
|---|---|
| `DataTable.rowActions` | `RenderFunction<StrictReactElements<…>, Ctx>` ← канон |
| `DataTable.actions` | (этап 1) |
| `NavigationList.Link.actions` | `RenderFunction<ReactElement, Ctx>` — без `StrictReactElements` |
| `NavigationList.Group.actions` | `ReactElement \| (() => ReactElement)` — инлайн-юнион, **без контекста** |
| `Modal.actions` / `.leftActions` | `ModalRenderProp<ReactElement \| ReactElement[]>` |
| `Drawer.startActions` / `.endActions` | `DrawerRenderProp<ReactNode>` |
| `Message.actions` | `ReactElement[]` — **только массив**, функциональной формы нет |
| `Result.actions` | `ReactNode` |
| `NotificationOptions.actions` | `NotificationAction[]` — **data-объекты**, не элементы |
| `ToastOptions.action` | `ToastAction` — единственное число |

### 2.1. Ввести общий тип

```ts
// core/src/utils/types.ts
export type ActionsProp<Ctx = undefined> = RenderFunction<
  StrictReactElements<AnyObject>,
  Ctx
>;
```

Экспортировать из `utils/index.ts` (он уже реэкспортируется в публичный API через
`src/index.ts`), чтобы консьюмер мог типизировать свою обёртку.

### 2.2. Удалить локальные дубликаты `RenderFunction`

```ts
// modal/Modal.types.ts — удалить
type ModalRenderProp<T> = T | ((context: ModalContext) => T);

// drawer/Drawer.types.ts — удалить
type DrawerRenderProp<T> = T | ((context: DrawerContext) => T);
```

Это буквально `RenderFunction` с зафиксированным контекстом. `content`/`footer` в этих
компонентах перевести на `RenderFunction<ReactElement, ModalContext>` /
`RenderFunction<ReactElement, DrawerContext>`, `actions` — на `ActionsProp<ModalContext>` /
`ActionsProp<DrawerContext>`.

### 2.3. Привести к канону

```ts
NavigationList.Group.actions : ActionsProp                            // + больше не только () => Element
NavigationList.Link.actions  : ActionsProp<NavigationListLinkActionsContext>
Modal.actions                : ActionsProp<ModalContext>
Drawer.startActions/endActions: ActionsProp<DrawerContext>
Message.actions              : ActionsProp                            // + появляется функциональная форма
Result.actions               : ActionsProp
```

`Message.actions` и `Result.actions` расширяются без ломающих изменений: массив
элементов остаётся валидным, добавляется форма-функция. `NavigationList.Group.actions`
получает контекст — тоже совместимо (старая `() => Element` продолжает работать,
аргумент просто игнорируется).

### 2.4. 🔴 Требует решения: `Modal.leftActions`

`Modal` и `Drawer` — один паттерн (оверлей с шапкой/футером и двумя группами кнопок),
но оси названы по-разному:

```ts
Modal:  leftActions  + actions      // физическая ось, и у правой группы нет имени оси
Drawer: startActions + endActions   // логическая ось
```

Предложение — привести `Modal` к `Drawer`:

```ts
// было
leftActions?: …
actions?: …

// стало
startActions?: ActionsProp<ModalContext>;
endActions?: ActionsProp<ModalContext>;
```

Это ломает самый частый проп `Modal` (`actions` используется почти во всех примерах
и задокументирован в `docs/content/ru/modal.md`). Альтернатива — оставить `actions`
как есть и переименовать только `leftActions` → `startActions`, но тогда пара
остаётся асимметричной.

**Затронутые файлы:** `modal/Modal.types.ts`, `modal/Modal.tsx` (строки 68, 124–129, 237),
`modal/Modal.stories.tsx` (73, 79, 90), `modal/stories/Modal.story.DeleteWorkspace.tsx:42`,
`modal/stories/Modal.story.PublishPost.tsx:152`, `mcp/docs/Modal.md` (строки 21, 38, 68),
`docs/content/ru/modal.md` (строки 7, 13, 36, 92, 116, 122, 125, 150, 154 — включая
`:::prop[…]`-директивы).

`dialog/DialogProvider.tsx` **не затронут** — он складывает кнопки внутрь `content`,
а не в `actions`.

### 2.5. 🔴 Требует решения: `Notifications` — data-объекты вместо элементов

```ts
// сейчас
toast('Saved', { action: { label: 'Undo', onClick: undo } });
notification({ content: '…', actions: [{ label: 'Reply', onClick: reply, danger: false }] });
```

Единственное место в библиотеке, где кнопка описывается объектом, а не элементом.
`ToastAction` и `NotificationAction` различаются только полем `danger`.

Предложение:

```ts
// ToastOptions
action?: ReactNode;          // action → одна кнопка; имя в единственном числе оставить
// NotificationOptions
actions?: ActionsProp;
```

```tsx
toast('Saved', { action: <Button label="Undo" onClick={undo} /> });
notification({ content: '…', actions: [<Button key="reply" label="Reply" onClick={reply} />] });
```

`toast()`/`notification()` вызываются из кода приложения, где JSX доступен, так что
ограничение искусственное. Заодно исчезают `ToastAction`/`NotificationAction` из
публичных типов, а `danger` уезжает на `Button` (как везде).

**Затронутые файлы:** `notifications/Notifications.types.ts`,
`notifications/components/Toast.tsx` и `NotificationCard.tsx`,
`notifications/Notifications.stories.tsx` (8 мест: 105, 202, 215, 326, 347, 375, 388, 597),
`notifications/index.ts` (убрать экспорты типов), `mcp/docs/Notifications.md`.

---

## Этап 3. Остальные не-контентные `children`

**Статус:** зафиксировать решение до релиза, реализация — по готовности.

### 3.1. `Progress.children` — это подпись, а не контент

```ts
// progress/Progress.types.ts
children?: ReactNode | ((context: ProgressContext) => ReactNode);
```

`Progress.tsx:41` использует их как текст внутри полосы, с фолбэком `${percentage}%`,
и на строке 55 вытаскивает `aria-label` из `children`, только если это строка.

Предложение — `label`, как у всех остальных компонентов с подписью
(`Button`, `Tabs.Item`, `Toolbar.Title`, `Dropdown.Action`, …):

```ts
/** Omit for the default "{percentage}%". */
label?: RenderFunction<ReactNode, ProgressContext>;
```

`children` при этом исчезает совсем (у `Progress` базовый тип уже
`Omit<HTMLAttributes<HTMLDivElement>, 'children'>`).

### 3.2. `Result.children` — фолбэк для `title`/`description`

```ts
// result/Result.tsx:50
const body = description ?? children;
// + «одинокий children/description работает как заголовок»
```

Три пропа (`title`, `description`, `children`) с перекрывающейся семантикой и неявным
правилом «если только один — он заголовок». Предложение: оставить `title` +
`description`, `children` убрать. Правило «одна строка = заголовок» сохранить,
но на `description`.

### 3.3. Оверлеи: `children` — это триггер, `content` — содержимое

`Modal`, `Drawer`, `Popover`, `Dropdown`, `Tooltip` устроены наоборот от React-конвенции:
дети — это то, по чему кликают, а содержимое едет в проп. Плюс контракты не совпадают
между собой (`Drawer.children` обязателен, `Modal.children` — нет; `Dropdown.children`
принимает **только** функцию).

Вариант приведения к конвенции:

```tsx
// было
<Modal content={<Body />}><Button label="Open" /></Modal>

// стало
<Modal trigger={<Button label="Open" />}><Body /></Modal>
```

**Это самое дорогое изменение из всего документа** — затрагивает каждое использование
пяти компонентов в сторис, cypress, `mcp/docs` и `docs/content`. Вынесено в отдельный
этап осознанно: решать после этапов 1–2 и отдельным проходом.
Пока решение не принято — считать открытым, не «сделать по аналогии».

### 3.4. Где `children` остаётся как есть

Не трогаем — здесь `children` по делу:

- **Контент:** `Box`, `Text`, `Message`, `Flex`, `Grid`, `Screen.*`, `Splitter.Panel`,
  `Form.Field`, `Scrollable`, `Spoiler`, `Label`.
- **Список дочерних элементов:** `Radio`, `CollapsedList`, `Dropdown.Menu`,
  `Dropdown.RadioList`, `TextInput` (islands), `Tabs`, `Tags`, `Breadcrumbs`,
  `NavigationList`, `SideNavigation`, `BottomNavigation`, `Toolbar`.
- **`asChild`-цель:** `Button`, `CloseButton`, `Select`, `ColorPicker`, `Tags.Item`,
  `Application` — это конвенция Radix Slot, `children` там означает именно
  «элемент, на который смёржить пропы».
- **Кастомный элемент:** `Image.children` (свой `<picture>`/`next/image` вместо `src`) —
  документированная замена `src`, а не служебный слот.

---

## Чеклист на каждый этап

Проектные правила требуют этого в том же куске работы, а не потом:

- [ ] **Типы** — `*.types.ts`: проп добавлен/удалён, JSDoc в одну-две строки
- [ ] **Реализация** — `*.tsx`, лишние импорты (`Children`, локальные `*RenderProp`) убраны
- [ ] **Storybook** — сторис демонстрирует **новый** API, не старый; прозаические
      абзацы, где упоминается проп, переписаны (`storybook.md`)
- [ ] **Unit-тесты** — `core/vitest/<name>.test.tsx`
- [ ] **Cypress** — `core/cypress/component/*.cy.tsx`, если компонент там есть
- [ ] **`npm run lint`** в `core` (`--max-warnings 0`) и `npm run test:unit`
- [ ] **`mcp/docs/<Component>.md`** — таблица пропов и примеры (`sync-core-docs-mcp.md`)
- [ ] **`docs/content/{en,ru}/*.md`** — сниппеты и `:::prop[…]`-директивы
- [ ] **Changelog** — `changelogs/v4/YYYY-MM/DD-месяц.md`, разделы
      «Что изменилось» / «Зачем», по-русски (`changelog.md`)

Замечание по `docs`: `docs/content/en` сильно отстаёт от `ru` (18 файлов против 48,
`modal.md` в `en` нет вовсе). `docs-i18n.md` требует обе локали — при правке `ru/modal.md`
имеет смысл сразу завести `en/modal.md`, иначе расхождение закрепится в релизе.

---

## Сводная таблица миграции для консьюмера

Для changelog и раздела «Migration» в документации.

| Было | Стало | Этап |
|---|---|---|
| `<DataTable>{<DataTable.Action …/>}</DataTable>` | `<DataTable actions={<DataTable.Action …/>} />` | 1 |
| `<DataTable>{(ctx) => …}</DataTable>` | `<DataTable actions={(ctx) => […]} />` | 1 |
| возврат `<></>` из функции экшенов | возврат `null` | 1 |
| фрагмент с несколькими экшенами | массив с `key` | 1 |
| `Modal leftActions` | `Modal startActions` | 2 (🔴 решение) |
| `Modal actions` | `Modal endActions` | 2 (🔴 решение) |
| `Message actions={[…]}` | без изменений (+ появилась форма-функция) | 2 |
| `Result actions={…}` | без изменений (+ появилась форма-функция) | 2 |
| `toast('…', { action: { label, onClick } })` | `toast('…', { action: <Button … /> })` | 2 (🔴 решение) |
| `notification({ actions: [{ label, onClick }] })` | `notification({ actions: [<Button key … />] })` | 2 (🔴 решение) |
| `<Progress>{label}</Progress>` | `<Progress label={label} />` | 3 |
| `<Result>{text}</Result>` | `<Result description={text} />` | 3 |
| `<Modal content={…}>{trigger}</Modal>` | `<Modal trigger={…}>{content}</Modal>` | 3 (открыто) |

Удалённые из публичного API типы: `DataTableRowActionsProps` (уже удалён),
`ToastAction`, `NotificationAction` (этап 2, если 2.5 принят).
Новый публичный тип: `ActionsProp<Ctx>`.
