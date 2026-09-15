# Несоответствия в API `altrone-ui` (core)

Аудит перед релизом `4.0.0`. Цель — найти места, где одно и то же действие названо
или устроено по-разному, чтобы переименовать их **до** публикации, а не ломать API потом.

Анализ охватывает: 52 публичных компонента (`core/src/components/**`), 1 внутренний
(`core/src/internal/badge`), общие типы (`core/src/types`), утилиты, локали и SCSS-токены.

**Обозначения приоритета:**

- 🔴 **P1** — ломающее переименование публичного API. Дешево сейчас, дорого после релиза.
- 🟡 **P2** — расширение/выравнивание API. После релиза потребует deprecation-цикла.
- 🟢 **P3** — внутреннее, на публичный API не влияет. Можно чинить после релиза.

---

## Оглавление

1. [Сводка: топ-10 для решения до релиза](#сводка-топ-10-для-решения-до-релиза)
2. [A. Полиморфизм: три механизма для одного](#a-полиморфизм-три-механизма-для-одного)
3. [B. Словарь статусов: пять разных наборов](#b-словарь-статусов-пять-разных-наборов)
4. [C. Открытое/закрытое состояние](#c-открытоезакрытое-состояние)
5. [D. Сигнатуры обработчиков](#d-сигнатуры-обработчиков)
6. [E. Размеры и габариты](#e-размеры-и-габариты)
7. [F. Скругления: shape / rounding / radius](#f-скругления-shape--rounding--radius)
8. [G. Текстовые слоты: label / title / header / content](#g-текстовые-слоты-label--title--header--content)
9. [H. Позиционирование и направление](#h-позиционирование-и-направление)
10. [I. `className`/`ref` на вложенные элементы](#i-classnameref-на-вложенные-элементы)
11. [J. Controlled / uncontrolled](#j-controlled--uncontrolled)
12. [K. Публичные экспорты типов](#k-публичные-экспорты-типов)
13. [L. Имена компонентов и подкомпонентов](#l-имена-компонентов-и-подкомпонентов)
14. [M. Оверлеи: Modal / Drawer / Popover / Dropdown / Tooltip](#m-оверлеи-modal--drawer--popover--dropdown--tooltip)
15. [N. Императивные API](#n-императивные-api)
16. [O. Внутренние подходы](#o-внутренние-подходы)
17. [P. CSS-переменные](#p-css-переменные)
18. [Q. Локализация](#q-локализация)
19. [R. Инфраструктура: тесты и Storybook](#r-инфраструктура-тесты-и-storybook)
20. [Вопросы, на которые нужен ваш ответ](#вопросы-на-которые-нужен-ваш-ответ)

---

## Сводка: топ-10 для решения до релиза

| # | Проблема | Приоритет |
|---|----------|-----------|
| 1 | `opened` / `expanded` / `open` — три имени для «открыто» в публичных render-контекстах | 🔴 P1 |
| 2 | Пять словарей статуса (`severity`/`status`/`variant`/`tone`/`color`) с несовпадающими значениями (`error` vs `danger`, `default` vs `neutral`, `primary` vs `accent`) | 🔴 P1 |
| 3 | 39 из 52 компонентов не экспортируют свой `*Props` — консьюмер не может типизировать обёртку | 🔴 P1 |
| 4 | `Modal.leftActions` vs `Drawer.startActions` vs `Toolbar.Leading` — физические и логические оси вперемешку | 🔴 P1 |
| 5 | `shape` / `rounding` / `radius` — три пропа для скругления | 🔴 P1 |
| 6 | `asChild` / `renderFunc` / `tagName` — три механизма полиморфизма, местами на одном компоненте | 🔴 P1 |
| 7 | Нарушения правила «event последним аргументом» в ~12 обработчиках (в `DataTable` события нет вообще) | 🔴 P1 |
| 8 | `Toolbar.fixed` помечен «removed in v4», а версия уже `4.0.0-beta.1` | 🔴 P1 |
| 9 | Габаритные пропы: `string` / `number` / `number \| string` / `Size` без системы | 🟡 P2 |
| 10 | `Form` прокидывает `size`/`disabled`/`errorMessages` только в `TextInput`-семейство | 🟡 P2 |

---

## A. Полиморфизм: три механизма для одного

В библиотеке одновременно живут **три** способа подменить рендерящийся элемент.

| Механизм | Где | Сигнатура |
|---|---|---|
| `asChild` (Radix Slot) | `Box`, `Button`, `CloseButton`, `Text`, `Tags.Item`, `Tabs.Item`, `Breadcrumbs.Item`, `BottomNavigation.Item`, `NavigationList.Link`, `Dropdown.Action`, `TextInput`, `Select`, `ColorPicker`, `DatePicker`, `Application` | `asChild?: boolean` + `children` |
| `renderFunc` | `Select`, `ColorPicker`, `DatePicker`, `Dropdown.Action`, `Tabs.Item` ⚠️, `BottomNavigation.Item` ⚠️ | две несовместимые формы (ниже) |
| `tagName` | `Flex`, `Grid`, `Grid.Column` | `tagName?: keyof JSX.IntrinsicElements` |

🔴 **A1. `renderFunc` имеет две несовместимые сигнатуры.**

```ts
// Форма 1 — (ref, props) => JSX, тип RenderFuncProp
Tabs.Item:              renderFunc?: RenderFuncProp<HTMLAnchorElement, TabsItemProps>
BottomNavigation.Item:  renderFunc?: RenderFuncProp<HTMLAnchorElement, BottomNavigationItemProps>
Dropdown.Action:        renderFunc?: RenderFuncProp<HTMLButtonElement, DropdownActionProps & {...}>

// Форма 2 — (context) => ReactElement
Select:      renderFunc?: (context: SelectRenderContext) => ReactElement
DatePicker:  renderFunc?: (context: DatePickerRenderContext) => React.ReactElement
ColorPicker: renderFunc?: (props: ColorPickerRenderProps) => ReactElement
```

Причём имя параметра тоже плавает: `context` (Select, DatePicker) vs `props` (ColorPicker).

🔴 **A2. `renderFunc` помечен `@deprecated` только в двух местах из шести.**
`Tabs.Item` и `BottomNavigation.Item` — «Prefer `asChild`». У `Select`/`ColorPicker`/`DatePicker`/`Dropdown.Action`
он полноценный публичный API. Решение по `renderFunc` нужно принять целиком, до релиза.

🟡 **A3. `Flex`/`Grid` используют `tagName`, а не `asChild`.** Это единственные три компонента
с таким пропом. `Box.types.ts` уже содержит явное решение «никакого второго механизма
полиморфизма», но `Flex`/`Grid` в него не вписаны.

**Рекомендация:** оставить `asChild` единственным механизмом; `renderFunc` — только там, где
консьюмеру нужен *state* (Select/DatePicker/ColorPicker), и тогда с одной сигнатурой
`(context) => ReactElement` и одинаковым именем поля контекста. `tagName` заменить на `asChild`.

---

## B. Словарь статусов: пять разных наборов

Одна семантика («успех / ошибка / предупреждение») выражена пятью пропами с пятью наборами значений.

| Компонент | Проп | Значения |
|---|---|---|
| `Message` | `severity` | `Role` = `default \| primary \| success \| warning \| danger` |
| `Result` | `status` | `empty \| info \| success \| warning \| **error**` |
| Toast (`Notifications`) | `variant` | `default \| success \| warning \| danger` |
| `Box` | `tone` | `**neutral** \| **accent** \| danger \| success \| warning \| info` |
| `Label` | `color` | `default \| primary \| success \| danger \| warning` **+ 10 hue-имён** |
| `Text` | `color` | `success \| danger \| warning \| **muted**` |
| `Button`, `Checkbox`, `Dropdown.Action`, `NotificationAction` | `danger` | `boolean` |

🔴 **B1. `error` vs `danger`.** `ResultStatus` — единственное место во всей библиотеке, где
«ошибка» называется `error`. Везде (включая CSS-токены `--danger-*`) это `danger`.

🔴 **B2. `default`/`primary` vs `neutral`/`accent`.** `Role` (общий тип в `types/entity.ts`)
и `BoxTone` описывают одно и то же разными словами. При этом `Box` — базовый примитив
архитектуры v4, т.е. `BoxTone` будет расползаться по библиотеке.

🔴 **B3. `info` есть только в `BoxTone`.** В `Role`, `ToastVariant`, `Text.color` его нет,
хотя `_status.scss` определяет `info` как полноценную роль.

🔴 **B4. `Label.color` смешивает семантику и хью.** `'danger'` и `'teal'` в одном union —
тот же конфликт, который в `Box` уже решён разделением `tone` (семантика) и `color` (хью).

🟡 **B5. Булев `danger` vs значение словаря.** `Button`/`Checkbox` имеют `danger?: boolean`
вместо `tone`/`severity`. Это блокирует `success`/`warning`-кнопку без нового пропа.

**Рекомендация:** выбрать один проп-имя (`tone`, раз `Box` — фундамент) и один union
(`neutral | accent | info | success | warning | danger`), `Result.status='error'` → `danger`,
`Label.color` разделить на `tone` + `color` как в `Box`, булев `danger` задепрекейтить.

---

## C. Открытое/закрытое состояние

🔴 **C1. Три имени для «открыто» в публичных контекстах:**

```ts
PopoverChildrenContext.opened: boolean        // Popover
ColorPickerRenderProps.opened: boolean        // ColorPicker
SelectContextValue.expanded: boolean          // Select
DatePickerTriggerContextType.expanded: boolean// DatePicker
PopoverProps.onOpenChange(open: boolean, ...) // Popover — третье имя
```

Это напрямую видно консьюмеру: `renderFunc={({ expanded }) => …}` для `Select`,
но `renderFunc={({ opened }) => …}` для `ColorPicker`. Оба компонента — триггер + попап.

🔴 **C2. `openedByDefault` вместо React-конвенции `defaultOpen`/`defaultOpened`.**
Используется в `Modal`, `Popover`, `Spoiler`. Все остальные uncontrolled-значения
в библиотеке названы `default*`: `defaultValue`, `defaultMonth`, `defaultSize`,
`defaultPage`, `defaultSort`, `defaultFilters`, `defaultFocusItemIndex`.

🟡 **C3. `enabled` вместо `disabled`.** `Popover.enabled?: boolean` и `Modal.enabled?: boolean` —
единственные два инвертированных флага активности; везде в библиотеке `disabled`.

🟡 **C4. Имена событий смены состояния:** `Spoiler.onToggle(opened, e)`,
`Popover.onOpenChange(open, e, reason)`, `Splitter.onCollapse(i, collapsed, e)`,
`Screen.Sidebar.onClose()`. Четыре формы для «состояние раскрытия изменилось».

🟢 **C5. Негативные булевы пропы.** `CollapsedList.hideExpandButtonAfterUsage`,
`Flex.disableInnerMargins` — единственные два «выключающих» пропа среди ~15 `show*`.

---

## D. Сигнатуры обработчиков

Правило проекта (`event-handlers.md`): нативный `event` — **последним** аргументом, без исключений.

🔴 **D1. Обработчики вообще без `event`:**

| Компонент | Обработчик |
|---|---|
| `DataTable` | `onPageChange(currentPage)`, `onSortChange(sort?)`, `onFilterChange(filters)`, `onModeChange(mode)` |
| `DataTable.RowAction` | `onClick?: () => void` — **перекрывает** нативный `onClick` и теряет событие |
| `Dropdown.Checkbox` | `onChange(state: boolean)` |
| `Dropdown.RadioList` | `onChange(value: T)` |
| `Dropdown.Menu` | `onChangeFocusItemIndex(index)` |
| `Calendar` | `onMonthChange(month)`, `CalendarRenderDateProps.onHover(date)` |
| `Modal`, `Drawer`, `Message`, `Screen.Sidebar` | `onClose()` |
| `Drawer` | `onDone(): Promise<boolean \| void>` |

Особенно проблемный — `DataTable.RowAction.onClick`, потому что он *сужает* стандартный
DOM-контракт (`Omit<ButtonProps, 'onClick'>` + `onClick?: () => void`).

🟡 **D2. Event обязателен или опционален — без системы:**

```ts
Pagination.onChange(page, event)                        // обязателен
Checkbox.onChange(state, event)                         // обязателен
Range.onChange(value, event)                            // обязателен
Select.onChange(value, event?)                          // опционален
DatePicker.onChange(value?, event?)                     // опционален
ColorPicker.onChange(value, event?)                     // опционален
NumberInput.onChange(value?, e?)                        // опционален + имя `e`
```

🟡 **D3. Имя параметра `e` vs `event`.** `NumberInput.onChange(value?, e?)`,
`ToastAction.onClick(e)`, `NotificationAction.onClick(e)` — против `event` во всех остальных.

🟡 **D4. Имя первого аргумента в `Checkbox`/`Switcher`:** `onChange(state: boolean, …)`.
Везде первый аргумент называется по смыслу значения (`value`, `page`, `date`, `mode`);
здесь — `state`. Ожидаемое имя: `checked`.

🟡 **D5. «Изменение завершено»: `onValueCommit` vs `onResizeEnd`.**
`Range.onValueCommit` (терминология Radix) и `Splitter.onResizeEnd` — одна и та же идея
(коммит после окончания жеста), два разных стиля именования.

🟡 **D6. Nullable-значение в `onChange`.** `Select`, `ColorPicker`, `NumberInput`, `DatePicker`
отдают `value | undefined`; `TextInput`, `Checkbox`, `Range`, `Radio`, `Pagination` — всегда
определённое значение. Для `clearable`-компонентов это оправдано, но стоит зафиксировать
правило явно.

🟡 **D7. `onChange` обязателен у одних и опционален у других.**
Обязателен: `Select`, `ColorPicker`, `Range`, `Radio`, `Pagination`, `NumberInput`,
`Dropdown.Checkbox`, `Dropdown.RadioList`. Опционален: `TextInput`, `Textarea`, `Checkbox`,
`Switcher`, `FilePicker`, `Calendar`, `DatePicker`. Разделения «controlled / uncontrolled»
за этим не стоит — `TextInput` тоже controlled.

---

## E. Размеры и габариты

🔴 **E1. `size` означает три разные вещи:**

| Значение `size` | Компоненты |
|---|---|
| Тир контрола (`mini\|s\|m\|l\|xl`) | `Button`, `Checkbox`, `Radio`, `Switcher`, `Select`, `TextInput`, `ColorPicker`, `FilePicker`, `Range`, `Progress`, `Avatar`, `Label`, `Result`, `Form`, `Toolbar`, `Box`, `Badge`, `CloseButton` |
| Ширина контейнера | `Modal.size: Size`, `Screen.size: Size` |
| Число из своей шкалы | `Text.size: 1..9`, `Grid.Column.size: 1..12 \| 'auto'`, `Loading.size: number \| string` (px) |

`Modal.size="l"` и `Button.size="l"` означают принципиально разное. `target-architecture`
трактует `Size` как тир контрола — `Modal`/`Screen` его переиспользуют не по назначению.

🟡 **E2. Типы габаритных пропов не согласованы:**

```ts
Skeleton:   width/height/minWidth/… ?: string            // только строка
Image:      width/height            ?: number | string
Box:        width/height            ?: number | string
Drawer:     width                   ?: number            // только число (px)
DataTable:  column.width            ?: number
Tooltip:    maxWidth                ?: number | string
Screen:     sidebarWidth/asideWidth ?: string
Screen.Content: maxWidth            ?: number | string
Scrollable: maxHeight               ?: CSSProperties['maxHeight']
Select:     menuHeight              ?: number            // px
```

Пять разных типов для «задать размер». `number | string` (число = px) — самый частый,
имеет смысл сделать его единственным.

🟡 **E3. `BadgeSize` дублирует `Size`.** `internal/badge/Badge.types.ts` объявляет
`export type BadgeSize = 'mini' | 's' | 'm' | 'l' | 'xl'` вместо импорта `Size` из `types`.

🟢 **E4. `Avatar` — единственный компонент с `size`, у которого нет дефолта `'m'`**
в деструктуризации (`size` остаётся `undefined`, дефолт задан только в CSS).

🟡 **E5. Компоненты без `size`, где он напрашивается:** `Tabs`, `Tags`, `Breadcrumbs`,
`Pagination`, `Message`, `Textarea`, `NumberInput`, `PasswordInput`, `Search`,
`AutocompleteInput`, `DatePicker`, `Divider`, `SideNavigation`, `BottomNavigation`.
`new-component-checklist.md` требует `size` «где имеет смысл» — для inputs-семейства
(`NumberInput`/`PasswordInput`/`Search`/`AutocompleteInput`/`Textarea`) он приходит
из `TextInputProps`, но `DatePicker` его явно `Omit`-ит, а `Tabs`/`Pagination`/`Message`
не имеют вовсе.

---

## F. Скругления: shape / rounding / radius

🔴 **F1. Три публичных пропа для одного:**

```ts
Box.shape?: 'rect' | 'rounded' | 'squircle' | 'circle' | 'pill'
TextInput.shape?: BoxShape
Label.rounding?: 'rounded' | 'pill'
Image.radius?: number | string
Skeleton.radius?: string
Box.radius?: number | string     // ← и shape, и radius на одном компоненте
```

`Label.rounding` — единственное употребление слова «rounding» в публичном API,
при этом его значения (`rounded | pill`) — подмножество `BoxShape`.

🟡 **F2. Неиспользуемый тип `Radius`.** `types/entity.ts` экспортирует
`Radius = 'none' | 'mini' | 's' | 'm' | 'l' | 'xl' | 'circle'`, но **ни один** проп
его не использует (`radius` везде `number | string`). При этом он не реэкспортируется
из `types/index.ts` — то есть просто мёртвый код, который легко принять за контракт.

🟢 **F3. В SCSS то же самое в трёх именах** — см. [P. CSS-переменные](#p-css-переменные).

---

## G. Текстовые слоты: label / title / header / content

🔴 **G1. Заголовок называется по-разному:**

| Имя | Где |
|---|---|
| `title` | `Modal`, `Drawer`, `Popover`, `Spoiler`, `Result`, `Screen`, `SideNavigation`, `NavigationList.Group`, `Tooltip`, `NotificationOptions`, `AlertOptions`/`ConfirmOptions`/`PromptOptions` |
| `header` | `Message` |
| `label` | `Toolbar.Title`, `Button`, `Tabs.Item`, `Tags.Item`, `Breadcrumbs.Item`, `Dropdown.Action`, `NavigationList.Link`, `SideNavigation.Item`, `BottomNavigation.Item`, `CloseButton`, `Form.Field` |

`Message.header` — единственный. При этом `Result` уже использует `title` + `description`,
а `Message` — `header` + `children`.

🟡 **G2. Основной текст: `content` / `children` / `message` / `description`:**

```ts
Modal.content: ReactElement            // обязателен
Drawer.content?: ReactElement          // опционален
Popover.content: ReactElement | fn     // обязателен
Tooltip.content: string | ReactElement // обязателен
NotificationOptions.content: ReactNode
AlertOptions.message: string           // ← message
Result.description?: ReactNode         // ← description (+ children как fallback)
Message: children                      // ← только children
Label: children
```

🟡 **G3. `hintText` имеет два разных смысла:**
`Form.Field.hintText` — текст в тултипе у иконки «?» рядом с лейблом;
`Dropdown.Action.hintText` — вспомогательный текст справа в строке меню (шорткат/значение).

🟡 **G4. `Dialog`: `okText` / `confirmText` / `rejectText` / `cancelText`.**

```ts
AlertOptions:   { okText? }
ConfirmOptions: { confirmText?, rejectText? }   // ← rejectText
PromptOptions:  { confirmText?, cancelText? }   // ← cancelText, то же самое
```

Кнопка «отмена» в `ConfirmOptions` и `PromptOptions` названа по-разному.
В локали при этом есть `dialog.cancel` и `common.cancel`.

🟡 **G5. `Button.label` обязателен, `children` — только для `asChild`.**
Это сознательное решение (a11y для icon-only), но оно делает `Button` единственным
компонентом, куда нельзя передать текст через `children`. `Label`, `Text`, `Message`
работают ровно наоборот.

---

## H. Позиционирование и направление

🔴 **H1. Физические vs логические оси в одном API:**

```ts
Modal:  leftActions? , actions?          // ← left (физическая ось)
Drawer: startActions?, endActions?       // ← start/end (логическая)
Toolbar: Leading / Center / Trailing     // ← leading/trailing (третий словарь)
```

Три компонента, три вокабуляра для «слева/справа в шапке». `Modal` при этом
не имеет пары к `leftActions` (правые — просто `actions`).

🟡 **H2. `direction` vs `orientation`:**

```ts
Divider.direction?: Direction            // 'vertical' | 'horizontal'
Flex.direction?: Direction
Radio.direction?: Direction
Range.direction?: Direction
Splitter.orientation?: 'horizontal' | 'vertical'   // ← единственный orientation
```

🟡 **H3. `placement` означает разное:**

```ts
Drawer.placement?: 'start' | 'end'
Toolbar.placement?: 'top' | 'bottom' | 'left' | 'right'     // физическая ось
Tooltip/Popover.placement?: Placement (floating-ui)         // 'top-start' и т.д.
IslandPlacement = 'start' | 'end'                           // TextInput islands
BadgePlacement = 'inline' | 'corner'                        // не про ось вообще
NotificationPlacement = 'start' | 'end'
```

🟡 **H4. `Notifications`: `toastPlacement` / `notificationSide` / `notificationPlacement`.**
Три пропа одного типа `NotificationPlacement`, где `*Placement` = вертикаль,
а `*Side` = горизонталь. Разница читается только из JSDoc. Продублированы
на `Application` и на `NotificationsProviderProps`.

🟡 **H5. `Align` / `Justify` / инлайновые union'ы:**

```ts
types/entity.ts: Align   = 'start' | 'center' | 'end' | 'between'
types/entity.ts: Justify = 'start' | 'center' | 'end' | 'between'   // ← дубликат Align
types/entity.ts: Side    = 'start' | 'center' | 'end'               // не используется нигде

Flex.align?:  'start' | 'center' | 'end'            // инлайн, не Side и не Align
Flex.justify?: Justify
Toolbar.Group.align?: Align
Screen.contentAlign?: 'start' | 'center'            // инлайн
Text.align?: 'start' | 'center' | 'end' | 'justify' // инлайн, + 'justify'
```

`Align` и `Justify` идентичны по значениям; `Side` не используется вообще;
`Flex.align` и `Screen.contentAlign` объявлены инлайном вместо общего типа.

---

## I. `className`/`ref` на вложенные элементы

🔴 **I1. У `TextInput` `className` уходит НЕ на корень.**

```ts
/** Class for the visual wrapper. `className` targets the `<input>`. */
wrapperClassName?: string;
wrapperStyle?: React.CSSProperties;
```

Во всех остальных компонентах `className` попадает на корневой DOM-элемент.
У `TextInput` (и всего семейства — `Textarea`, `NumberInput`, `PasswordInput`,
`Search`, `AutocompleteInput`, а также `Select`/`ColorPicker`/`DatePicker`,
использующих его как триггер) — на внутренний `<input>`. Это самая неожиданная
инверсия в библиотеке.

Аналогично `ref`: `TextInput.ref` → визуальная обёртка (`Box`), `TextInput.inputRef` → `<input>`.
В остальной библиотеке `ref` — всегда корневой DOM-узел.

🟡 **I2. Пропы под вложенные элементы названы по-разному:**

```ts
Tooltip.childrenClassName        // обёртка триггера
TextInput.wrapperClassName       // визуальная обёртка
Progress.activeSegmentClassName  // заполненная часть
Range.activeTrackClassName       // заполненная часть
```

`Progress` и `Range` — одна и та же сущность («закрашенная часть шкалы»), два имени.
При этом `style`-двойника есть только у `TextInput`.

🟡 **I3. `Popover.ref` — не DOM-ref.**

```ts
PopoverProps.ref?: React.Ref<PopoverRef>   // императивный объект, не HTMLElement
```

Единственный компонент, где `ref` не указывает на DOM-узел. `Splitter` для той же
задачи (императивный API) завёл отдельный проп `controlRef`, оставив `ref` DOM-ссылкой.
Два решения одной задачи, причём `Popover` нарушает `ref-forwarding.md`.

🟡 **I4. `Splitter.Panel` не принимает ни `ref`, ни `className`, ни `style`** — единственный
публичный подкомпонент, не расширяющий `HTMLAttributes`:

```ts
export interface SplitterPanelProps {
  children?: React.ReactNode;
  collapsible?: boolean; defaultSize?: number;
  min?: number; max?: number; resizable?: boolean;
}
```

🟡 **I5. `Splitter.Panel`: `min`/`max` вместо `minSize`/`maxSize`.** Рядом с `defaultSize`
это читается как «минимальное значение», а не «минимальный размер».
Сравните `Range.min`/`Range.max` (значения) и `NumberInput.min`/`max` (значения).

---

## J. Controlled / uncontrolled

🟡 **J1. Компоненты решают это по-разному:**

| Компонент | Подход |
|---|---|
| `Calendar` | `value` + `defaultValue` + `onSelect` (полный React-контракт) |
| `FilePicker` | `value` + `defaultValue` + `onChange` |
| `DataTable` | только `default*` (`defaultPage`/`defaultSort`/`defaultFilters`) + `on*Change` — controlled-режима нет |
| `Pagination` | только controlled (`currentPage` обязателен, `defaultPage` нет) |
| `Splitter` | только `defaultSize` на панель; controlled-размеров нет |
| `Modal`/`Popover`/`Spoiler` | только `openedByDefault` + `onClose`/`onOpenChange` |
| `Screen.Sidebar`/`Screen.Aside` | только controlled (`collapsed` + `onClose`) |
| `Toolbar.SidebarToggleAction` | только controlled (`collapsed` обязателен) |

🟡 **J2. `Pagination.currentPage` vs общая конвенция `value`.** Единственный компонент,
где текущее значение называется не `value`. Плюс `onChange(page, event)` при
`currentPage` — имена не совпадают.

---

## K. Публичные экспорты типов

🔴 **K1. 39 из 52 компонентов не экспортируют свой главный `*Props`.**

Экспортируют (13): `Box`, `Calendar`, `ColorPicker`, `DataTable`, `DatePicker`, `Dropdown`,
`Image`, `Label`, `Popover`, `Result`, `Select`, `Splitter`, `Tooltip`.

Не экспортируют (39): `Application`, `AutocompleteInput`, `Avatar`, `BottomNavigation`,
`Breadcrumbs`, `Button`, `Checkbox`, `CloseButton`, `CollapsedList`, `Divider`, `Drawer`,
`FilePicker`, `Flex`, `Form`, `Grid`, `Loading`, `Message`, `Modal`, `NavigationList`,
`Notifications`, `NumberInput`, `Pagination`, `PasswordInput`, `Progress`, `Radio`, `Range`,
`Screen`, `Scrollable`, `Search`, `SideNavigation`, `Skeleton`, `Spoiler`, `Switcher`, `Tabs`,
`Tags`, `Text`, `TextInput`, `Textarea`, `Toolbar`.

Практическое следствие: консьюмер не может написать `const MyButton = (props: ButtonProps) => …`
или `Omit<ModalProps, 'content'>`. Для библиотеки компонентов это самый заметный пробел
публичного API, и исправляется он **без** ломающих изменений — но только если сделать
это до релиза, иначе потом придётся доносить типы вразнобой.

🟡 **K2. Вспомогательные типы, на которые ссылаются публичные пропы, тоже не экспортированы:**

```ts
FileItem, FilePickerUploadContext, FilePickerRemoveContext   // FilePickerProps.value/autoUploadFn
Picker                                                       // DatePicker view-mode
Role                                                         // Message.severity
Gap                                                          // Flex/Grid/CollapsedList.gap
Direction                                                    // Divider/Flex/Radio/Range
Size                                                         // почти везде
ToolbarVariant, ToolbarPlacement                             // Toolbar
RangeVariant, ImageFit(✓), BoxColorHue                       // BoxColorHue не в barrel'е box
IslandPlacement                                              // TextInput islands
```

`types/index.ts` реэкспортирует `Size`, `Role`, `Align`, `Justify`, `Direction`, `Gap` —
и они попадают в публичный API через `src/index.ts`. Но `Side`, `Radius`, `Surface`,
`LoadingState`, `Shadow` из того же файла — **нет**.

🟡 **K3. Мёртвые типы в `types/entity.ts`:**

| Тип | Использований в коде |
|---|---|
| `LoadingState` | 0 |
| `Shadow` | 0 |
| `Side` | 0 (только объявление) |
| `Surface` | 0 |
| `Radius` | 0 (см. F2) |

Плюс `types/types.ts`: `HTMLElements` (0 использований, ~130 строк),
`BasicComponentProps` (0 использований), `Point` (1), `Offset` (2).

🔴 **K4. Слишком общие имена в глобальном публичном пространстве имён.**
`src/index.ts` делает `export * from './components'`, поэтому наружу уходят:

```
Sort, Sorting          (DataTable)
Option, SelectValue    (Select)
Theme, Accent, Language(Application)
Size, Role, Gap, Align, Justify, Direction  (types)
ColorPreset            (ColorPicker)
```

`Option`, `Sort`, `Sorting`, `Theme`, `Language`, `Role`, `Size` — высокий риск коллизии
в проекте консьюмера. Префиксовать (`AltroneSize`, `DataTableSort`, `SelectOption`)
после релиза будет ломающим изменением.

🟡 **K5. `colorPresets` — одно имя, два несовместимых типа:**

```ts
ColorPickerProps.colorPresets?: ColorPreset[]      // { name, title, value }
DataTable column type:'color' → options.colorPresets?: string[]
```

При том что `DataTable`-колонка `color` рендерит именно `ColorPicker`.

🟢 **K6. Стиль экспорта в barrel'ах неоднороден:** `export * from './Label'` (label, colorPicker)
против явного `export { X } from './X.tsx'` во всех остальных. Из-за `export *`
состав публичного API этих двух модулей нельзя прочитать по `index.ts`.

---

## L. Имена компонентов и подкомпонентов

🟡 **L1. Расхождения с индустриальной конвенцией.** Для релиза это последний шанс:

| Сейчас | Общепринято | Комментарий |
|---|---|---|
| `Switcher` | `Switch` | Radix/MUI/Ant/shadcn — везде `Switch` |
| `Range` | `Slider` | `Range` читается как «диапазон дат/чисел», а это одиночный ползунок |
| `Spoiler` | `Disclosure` / `Accordion` | `Spoiler` — vk/mantine-специфичный термин |
| `Label` | `Badge` / `Chip` / `Tag` | см. L2 |
| `Textarea` | `TextArea` | рядом с `TextInput` выглядит как опечатка |
| `Result` | `EmptyState` / `Result` | ок (Ant-конвенция), но пересекается с `Message` |
| `CollapsedList` | `OverflowList` / `ItemGroup` | — |

🔴 **L2. `Label` — это чип, а не лейбл.** Компонент `Label` рендерит цветной pill
(`variant: solid|soft|outline`, `rounding: rounded|pill`). При этом:

- `label` — самый частый проп в библиотеке (23 объявления), означающий «текст подписи»;
- `Form.Field.label` — настоящий лейбл формы;
- `internal/badge/Badge` — почти то же самое, что `Label` (pill с `tone`, `size`, `placement`);
- `Tags.Item` — тоже чип-подобная сущность (сейчас — подчёркнутая ссылка без фона).

Итого три реализации «маленькой цветной плашки» (`Label`, `Badge`, `Tags.Item`) с разными
пропами (`color`+`variant`+`rounding` / `tone`+`placement` / только `label`), и имя `Label`
занято не тем. `Label` при этом **не построен на `Box`**, хотя `Badge` — построен.

🟡 **L3. `Screen.BottomNavigation` ≠ `BottomNavigation`.** Одно имя — два разных компонента:
зона-обёртка внутри `Screen` (рендерит `<nav>` с safe-area) и самостоятельный компонент
нижней навигации. В JSX это выглядит так:

```tsx
<Screen.BottomNavigation>
  <BottomNavigation floating={false}>…</BottomNavigation>
</Screen.BottomNavigation>
```

🟡 **L4. `DatePicker.MonthPicker` / `.YearPicker` / `.RangePicker` — заикание.**
Это не под-части `DatePicker`, а его братья-сиблинги, засунутые в его неймспейс.
`DatePicker.RangePicker` читается как «range picker внутри date picker'а».

🟡 **L5. Дубли контролов внутри `Dropdown`:**

```
Dropdown.Checkbox   vs  Checkbox
Dropdown.RadioList  vs  Radio
Dropdown.RadioItem  vs  Radio.Item
```

Причём `Dropdown.Checkbox.onChange(state)` и `Dropdown.RadioList.onChange(value)` теряют
`event`, в отличие от «настоящих» `Checkbox`/`Radio`.

🟡 **L6. Разделители: `Divider` и `Toolbar.Separator`.** Две сущности,
`Toolbar.Separator.variant: 'space' | 'line'` — причём `'space'` это вообще не разделитель,
а `flex: 1` spacer.

🟡 **L7. «Элемент списка» назван по-разному:** `Item` (`Tabs`, `Tags`, `Breadcrumbs`,
`Radio`, `SideNavigation`, `BottomNavigation`), но `Link` (`NavigationList`),
`Date` (`Calendar`), `Panel` (`Splitter`), `Column` (`Grid`), `Action` (`Dropdown`, `DataTable`),
`Field` (`Form`). Часть оправдана семантикой, но `NavigationList.Link` против
`SideNavigation.Item` и `BottomNavigation.Item` — три навигационных списка, два имени.

🟡 **L8. `NavigationList.GroupAction` / `.LinkAction` vs `Toolbar.BackAction` / `.SearchAction`.**
В первом случае `<Owner><Action>`, во втором `<Semantics><Action>`. Плюс `DataTable.Action`
и `DataTable.RowAction`, и `Dropdown.Action`. Четыре разных значения слова `Action`.

---

## M. Оверлеи: Modal / Drawer / Popover / Dropdown / Tooltip

Пять компонентов с одинаковой сутью «триггер + всплывающая панель» и пятью разными контрактами.

| | `Modal` | `Drawer` | `Popover` | `Dropdown` | `Tooltip` |
|---|---|---|---|---|---|
| Триггер | `children?` | `children` (обяз.) | `children` (обяз.) | `children` (обяз., **только функция**) | `children?` |
| Содержимое | `content` (обяз.) | `content?` | `content` (обяз.) | `content` (**только функция**) | `content` (обяз.) |
| Render-prop тип | `ModalRenderProp<T>` | `DrawerRenderProp<T>` | `ReactElement \| CustomRenderFunction` | `RenderFunction<ReactNode, Ctx>` | — |
| Uncontrolled open | `openedByDefault` | — | `openedByDefault` | (из `Popover`) | — |
| Выключение | `enabled` | — | `enabled` | (из `Popover`) | — |
| Закрытие | `onClose()` | `onClose()` | `onOpenChange(open, e, reason)` | (из `Popover`) | — |
| Метод в контексте | `closeModal` | `closeDrawer` | `closePopup` / `closeAllSequence` | (из `Popover`) | — |
| Кнопка закрытия | `showCancelButton` | всегда | `showCloseButton` | — | — |
| Размер | `size: Size` | `width: number` | `parentWidth: boolean` | (из `Popover`) | `maxWidth` |
| Футер | — (`actions`, `leftActions`) | `footer`, `startActions`, `endActions`, `onDone` | — | — | — |
| Заголовок | `title` | `title` | `title` | (из `Popover`) | `title` |

🔴 **M1. Четыре разных типа render-prop'а для «содержимое или функция от контекста»:**

```ts
utils/types.ts:  RenderFunction<Return, Args> = Return | ((data: Args) => Return)
utils/types.ts:  CustomRenderFunction<Args>   = (data: Args) => ReactNode
types/types.ts:  RenderFuncProp<El, Props>    = (ref, props) => JSX.Element
Modal.types.ts:  ModalRenderProp<T>           = T | ((ctx: ModalContext) => T)     // локальная копия RenderFunction
Drawer.types.ts: DrawerRenderProp<T>          = T | ((ctx: DrawerContext) => T)    // ещё одна копия
```

`ModalRenderProp` и `DrawerRenderProp` — буквально `RenderFunction` с зафиксированным контекстом.

🔴 **M2. Метод закрытия в контексте назван четырьмя способами:**
`closeModal` / `closeDrawer` / `closePopup` / `closeAllSequence`, плюс
`Select.clearValue`, `DatePicker.clear`, `Notifications.dismiss`.

🟡 **M3. `showCancelButton` (Modal) vs `showCloseButton` (Popover).** Одна кнопка, два имени,
причём в `Modal` это именно крестик закрытия, а не «Cancel».

🟡 **M4. `Tooltip` выпадает из общей типизации.** Единственный компонент, чей `Props`
не расширяет `HTMLAttributes` и объявляет `className`/`style` вручную —
значит, не принимает `id`, `aria-*`, `data-*`, обработчики событий.

---

## N. Императивные API

🟡 **N1. Три разных способа «показать что-то программно»:**

```ts
// 1. Глобальные функции модуля (Dialog)
import { showAlert, showConfirm, showPrompt } from 'altrone-ui';
await showConfirm({ title, message });

// 2. Хук (Notifications)
const { toast, notification, dismiss } = useNotifications();

// 3. Императивный ref (Popover, Splitter, Dropdown.Menu)
popoverRef.current.openPopup();
splitterRef.current.collapse(0);        // через отдельный проп controlRef
```

🟡 **N2. Именование в императивных API:**
`Popover`: `openPopup` / `closePopup`; `Splitter`: `collapse` / `expand` / `toggle` / `getSizes` / `getCollapsed`;
`Notifications`: `toast` / `notification` / `dismiss`; `Dialog`: `showAlert` / `showConfirm` / `showPrompt`.
Глаголы `show*` / `open*` / без префикса — три стиля.

🟡 **N3. `Notifications`: «toast» и «notification» как два разных вида.**
`ToastOptions` vs `NotificationOptions`, `ToastVariant` vs отсутствие `NotificationVariant`,
`ToastAction` vs `NotificationAction` (различаются только полем `danger`).
Плюс `Message` — четвёртая сущность того же семейства (inline-уведомление).

---

## O. Внутренние подходы

Не влияет на публичный API напрямую, но влияет на поведение (мердж пропов, ref'ы).

🟢 **O1. Три реализации `asChild`:**

| Механизм | Компоненты |
|---|---|
| `utils/components/Slot.tsx` | `Box`, `Select`, `ColorPicker`, `TextInput`, `Textarea`, `Tags.Item`, `Tabs.Item`, `Breadcrumbs.Item`, `NavigationList.Link`, `Dropdown.Action`, `DatePicker`, `Toolbar.Logo`, `NotificationCard` |
| `utils/utils/cloneWithRef.ts` | `Button`, `BottomNavigation.Item`, `Breadcrumbs.Item`, `Dropdown.Action` |
| голый `cloneElement` | `Application`, `NavigationList.Link`, `Text` |

`Breadcrumbs.Item`, `Dropdown.Action` и `NavigationList.Link` используют **по два** механизма сразу.

🟡 **O2. `Box` внедрён только в 8 компонентов** из 52: `Button`, `ColorPicker`, `Message`,
`Popover`, `Progress`, `TextInput`, `NotificationCard`, `internal/Badge`.
Остальные держат собственные фон/границу/радиус/тень в своих `.module.scss`.
Это ожидаемо для незавершённого рефакторинга v4, но означает, что `material`/`tone`/`elevation`
пока не универсальны — и любое их переименование потом затронет уже выпущенный API.

🟡 **O3. `Form` доходит только до `TextInput`-семейства.**
`useFormField`/`useFormContext` читают: `TextInput`, `Textarea`, `NumberInput`.
**Не читают:** `Select`, `Checkbox`, `Switcher`, `Radio`, `ColorPicker`, `FilePicker`,
`DatePicker`, `Range`, `AutocompleteInput`, `Search`, `PasswordInput`.
То есть `<Form size="l" disabled>` не влияет на `Select` внутри неё.

🟡 **O4. `invalid`/`aria-invalid` есть только у `TextInput`.**
`accessibility.md` требует `aria-invalid` + `aria-describedby` для валидации форм —
реализовано в одном компоненте из ~12 полей ввода.

🟢 **O5. `memo` применён непоследовательно.** 38 файлов обёрнуты в `memo`, остальные нет,
без видимого критерия (`Button` — да, `Checkbox` — нет; `Toolbar.*` — все да,
`Screen.*` — все нет). `components.md` от `memo` уже отказался в пользу нового паттерна,
но существующее состояние — лоскутное.

🟢 **O6. Стиль импорта React.** 25 `*.types.ts` используют `import React from 'react'` +
`React.HTMLAttributes<…>`, остальные — именованные импорты (`import type { HTMLAttributes }`).

🟢 **O7. Пути импорта.** В одном файле встречаются `from 'types'`, `from '../../types'`,
`from 'components/button/Button.types'`, `from '../button/Button.types.ts'` —
с расширением `.ts` и без, через алиас и относительно.

🟢 **O8. Именование файлов контекстов:** `X.context.ts` (9 шт.), `X.context.tsx` (2),
`X.contexts.ts` (`DatePicker`, `Dropdown` — множественное число), `DropdownHover.contexts.tsx`.
Плюс `dialog.ts` — единственный «главный» файл компонента со строчной буквы.

🟢 **O9. `useTheme.ts` экспортирует `useAltroneTheme`** — имя файла не совпадает с экспортом.
Из хуков только этот имеет префикс `Altrone` (`useLocalization`, `useNotifications`,
`useSelectContext`, `useBreakpoint` — без).

🟢 **O10. `export const` vs `export function` для хуков** — примерно поровну (45 / 14).

🟢 **O11. `collapsed-list.module.scss`** — единственный SCSS-модуль в kebab-case
среди ~95 camelCase. Плюс четыре файла с обезличенным именем `styles.module.scss`
(`Label`, и др.) вместо `<component>.module.scss`, как требует `components.md`.

---

## P. CSS-переменные

🟡 **P1. Скругление в трёх именах:**

```
--*-rounding        : bottom-navigation, bottom-navigation-item, checkbox, data-table,
                      data-table-header, label, message, navigation-list, navigation-list-link,
                      pagination, controlRounding
--*-radius          : calendar-cell, popover, tooltip, range-fill, radius-* (токены)
--*-border-radius   : drawer, modal, os-handle, os-track
```

Токен-система называется `--radius-*`, значит `rounding`/`border-radius` — отклонения.

🟡 **P2. Размер текста в двух именах:**

```
--*-text-size : avatar, breadcrumbs, bottom-navigation-item, calendar-cell, calendar-header,
                calendar-weekday, date-picker-cell, date-picker-header, navigation-list-group,
                navigation-list-link, side-navigation-item
--*-font-size : badge, button, dropdown-action, range-value, toolbar-title (+ все legacy camelCase)
```

Базовые токены называются `--text-size-1..9`, значит канон — `text-size`.

🟡 **P3. Фон в четырёх именах:** `--*-background-color` (большинство),
`--*-background` (`pagination`, `result-media`, `image-broken-media`, `disabled`, `app`),
`--*-fill` (`box-fill`, `toolbar-glass-fill`, `toolbar-pill-fill`, `range-thumb-fill`),
`--*-surface` (`toast-surface`).

🟡 **P4. 43 legacy camelCase-переменные** (`--paragraphFontSize`, `--headingLineHeight`,
`--controlRounding`, `--buttonShadow`, `--dataTableFilteringEmptyTextColor`,
`--stateTransitionDuration`, …). `theming.md` разрешает их не переименовывать оптом,
но часть из них — не легаси-мусор, а живые типографические токены, которые
наверняка попадут в публичную документацию темизации.

🟡 **P5. Две параллельные шкалы отступов:**
`--narrow-gap` / `--xs-gap` / `--s-gap` / `--gap` / `--l-gap` / `--xl-gap` / `--xxl-gap`
(примитивы, используются в компонентах) против `--space-inline` / `--space-stack` /
`--space-content` / `--space-section` / `--space-inset-compact` / `--space-control-{x,y}-{tier}`
(семантические роли, внедрены в 2 компонента). `spacing.md` фиксирует это как
незавершённую миграцию; для релиза важно, что публичный `Flex`/`Grid` `gap="s"`
привязан к `--s-gap` (6px), решение по грид-снапу которого ещё не принято.

🟡 **P6. Tailwind-шкала `--default-50..900` / `--primary-*` / `--danger-50..900`**
живёт в `components/application/index.css`, который нигде не импортируется.
`dark-theme.md` фиксирует, что все ссылавшиеся на них компоненты уже починены —
но сами определения остались и попадут в пакет. Их стоит удалить до релиза,
чтобы не публиковать заведомо мёртвый набор токенов.

---

## Q. Локализация

🟡 **Q1. Мёртвая секция `photoViewer`** (6 ключей: `previous`, `next`, `progressLabel`,
`progress`, `description`, `noDescription`) во всех пяти словарях. Компонента `PhotoViewer`
в `core` нет. Либо компонент не доехал, либо ключи забыли удалить.

🟡 **Q2. Ключи accessible-имён названы по-разному:**

```
breadcrumbs.label            loading.label
closeButton.ariaLabel        notifications.regionLabel
screen.sidebarLabel          screen.bottomNavigationLabel      screen.asideLabel
pagination.navigation
```

Четыре суффикса (`label`, `ariaLabel`, `regionLabel`, без суффикса) для одного и того же.

🟡 **Q3. Дублирование `common.*` и локальных ключей:**
`common.cancel` и `dialog.cancel`; `common.close` и `closeButton.ariaLabel`;
`loading.label`, `textInput.loading`, `image.loading` — три «Loading».
`result.empty` = `dataTable.empty` = `'No data'`.

🟢 **Q4. Коды языков нестандартные:** `ge` (немецкий обычно `de`; `ge` — это Грузия),
`sp` (испанский обычно `es`). Для публичного `Language`-типа это стоит поправить сейчас —
после релиза это ломающее изменение в `<Application language>`.

---

## R. Инфраструктура: тесты и Storybook

🟡 **R1. Тесты на несуществующие компоненты:** `vitest/empty.test.tsx`, `vitest/icon.test.tsx`,
`vitest/list.test.tsx` — компонентов `Empty`, `Icon`, `List` в `core/src/components` нет.

🟡 **R2. Нет unit-тестов для:** `Image`, `Result`, `Notifications`, `internal/Badge`.
Остальные 48 компонентов покрыты (`vitest/<name>.test.tsx`).

🟡 **R3. Таксономия Storybook смешивает атомарный дизайн и функциональные группы:**

```
Components/Atoms/*       — Avatar, CloseButton, Divider, Label, Loading, Skeleton
Components/Containers/*  — CollapsedList, Drawer, Dropdown, Flex, Form, Grid, Modal,
                           Popover, Scrollable, Splitter, Spoiler, Toolbar, Tooltip
Components/Controls/*    — все инпуты
Components/Core/*        — Box, Image, Screen, Text
Components/Display/*     — Calendar, DataTable, Dialogs, Message, Notifications,
                           Progress, Result, Tags
Components/Navigation/*  — BottomNavigation, Breadcrumbs, NavigationList, Pagination,
                           SideNavigation, Tabs
Foundations/*            — Color, Dark Theme, Elevation, Motion, Radius, Responsiveness, Spacing
Internal/Badge
```

`Atoms` — из другой системы координат, чем `Containers`/`Display`/`Navigation`.
`Tooltip`/`Popover`/`Dropdown` в `Containers`, хотя это оверлеи. `Label` в `Atoms`,
но `Tags` в `Display`. `Dialogs` — единственный заголовок во множественном числе.
`Image`/`Text` в `Core` рядом с `Box`/`Screen` (инфраструктура) — разноуровневые сущности.

🔴 **R4. `Toolbar.fixed` помечен «Will be removed in v4», версия уже `4.0.0-beta.1`.**
`GlobalUtils.deprecatedMessage('Toolbar', 'fixed', 'sticky', 'v4')` — либо удалить проп
сейчас, либо сдвинуть целевую версию на `v5`.

---

## Вопросы, на которые нужен ваш ответ

Ниже — развилки, где у меня нет данных, чтобы решить за вас. От ответов зависит,
что именно переименовывать.

1. **Насколько `4.0.0` — «свободный» релиз?** Это первый мажор с полной свободой ломать
   API (тогда имеет смысл делать все 🔴 разом), или бета уже роздана консьюмерам
   (`docs`, внешние проекты) и переименования надо ограничить топ-5?

2. **`Box` как единый фундамент.** Выбирать общий словарь статусов из `BoxTone`
   (`neutral`/`accent`/`danger`/…) или из `Role` (`default`/`primary`/…)?
   Первое логичнее по архитектуре v4, второе — меньше правок в существующих компонентах.

3. **`renderFunc`:** оставляем как публичный механизм «кастомный триггер со state»
   (тогда унифицировать сигнатуру) или депрекейтим целиком в пользу
   `asChild` + `useSelectContext()`-подобных хуков?

4. **Переименования компонентов** (`Switcher`→`Switch`, `Range`→`Slider`, `Spoiler`→`Disclosure`,
   `Label`→`Badge`/`Chip`, `Textarea`→`TextArea`) — делаем или это осознанный
   «фирменный» словарь Altrone, который менять не хотим?

5. **Коды языков `ge`/`sp`.** Менять на `de`/`es`? Это ломает `<Application language="ge">`
   у всех, кто уже использует бету.

6. **`Modal` vs `Drawer`.** Сводить их к одному контракту (`title`/`content`/`footer`/
   `startActions`/`endActions`/`defaultOpen`/`onOpenChange`) — или это осознанно разные
   компоненты с разными сценариями?

7. **`Form`-контекст.** Прокидывать `size`/`disabled`/`errorMessages` во все поля ввода
   до релиза (это меняет поведение `Select`/`Checkbox`/… внутри `Form`) или после?

8. **`photoViewer` в локалях** — забытые ключи или компонент в работе?

9. **`components/application/index.css`** (Tailwind-шкала `--default-*`/`--primary-*`) —
   удаляем из пакета до релиза?
