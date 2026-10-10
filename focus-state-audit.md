# Аудит фокусного состояния интерактивных компонентов

Дата: 2026-10-05. Источник: статический анализ `core/src/components/**` и `core/src/internal/**` (SCSS + TSX). В браузере результаты не проверялись.

## Эталон

Наше фокусное состояние: `outline: 2px solid var(--focus-color); outline-offset: 2px` на `:focus-visible` (для полей ввода — то же кольцо на `:focus-within` у `Box` `editable`). Источники: `box.module.scss` (`.Focusable`, `.Editable`), а также `checkbox`, `radio`, `switch`, `slider`, `filePicker`.

Эталон получают автоматически:

- Всё, что построено на `Button` / `Box focusable`: `Button`, `CloseButton`, `Pagination`, `Toolbar.Action`, кнопки в `Modal`, `Drawer`, `Popover`, `Notifications`, `DataTable`, `CollapsedList`, `Calendar` header.
- Всё, что построено на `TextInput`: `Textarea`, `NumberInput`, `PasswordInput`, `Search`, `Select` (поле), `AutocompleteInput` (поле), поля `DatePicker` и `ColorPicker`.
- Собственное эталонное кольцо: `Checkbox`, `Radio`, `Switch`, `Slider`, `FilePicker`.

## Результаты

### A. Нативное (браузерное) кольцо — своих правил outline нет

| Компонент | Элемент | Что есть сейчас |
| --- | --- | --- |
| `Breadcrumbs.Item` (`breadcrumbs/components/item.module.scss`) | `<a>`/router `<Link>` через `asChild` (по умолчанию `<div>`, не фокусируется) | на `:focus-visible` только смена цвета, outline не задан |
| `Text` с `link` (`text/text.module.scss:144`) | `<a>` | смена цвета + подчёркивание, outline не сброшен — поверх них рисуется UA-кольцо |
| `DatePicker` — кнопка текущей даты в шапке (`datePicker/inner/header.module.scss:29`) | `<button>` | только смена цвета |
| `Form.Field` — иконка подсказки (`form/components/field.module.scss`, `Field.tsx:45`) | `<button>` | focus-правил нет вообще |
| `ColorPicker` — пресет цвета (`colorPicker/inner/colorPreset.module.scss:40`) | `<button>` | на `:focus-visible` меняется прозрачность `::after`, outline не сброшен — UA-кольцо + эффект |

### B. Осознанно без кольца (согласовано, менять не нужно)

- `Dropdown.Action`, `Dropdown.Checkbox`, `Dropdown.RadioItem` (и опции `Select`) и подсказка `AutocompleteInput` — текущее состояние фокуса признано оптимальным, чёрная рамка не нужна. `outline: 0` в них остаётся и перебивает базовое правило (оно с нулевой специфичностью).
- `Splitter.Divider` — `outline: none`, на фокус `opacity: 1` у ручки. Тоже признано достаточным, `outline: none` остаётся.

### C. Легаси-миксин `@include focus` с несуществующей переменной

`global/mixins.scss:128` объявляет `outline: 4px solid var(--focus)`. Переменной `--focus` нигде нет (есть только `--focus-color`), а размер и отступ отличаются от эталона (4px/1px против 2px/2px). Объявление с неопределённой переменной становится невалидным на этапе вычисления, и, скорее всего, кольцо не рисуется вовсе (нужно проверить в браузере). Затронуты:

- `Tabs.Item` (`tabs/components/item.module.scss:24`)
- `SideNavigation` link (`sideNavigation/components/link.module.scss:18`)
- `BottomNavigation` link (`bottomNavigation/components/link.module.scss:22`)
- `Tooltip` — кнопка подсказки (`tooltip/tooltip.module.scss:40`)

Один общий фикс: перевести миксин на `2px solid var(--focus-color)` с `outline-offset: 2px` — исправит все четыре сразу.

### D. Свой стиль, но не эталонный (для сведения)

- `NavigationList` link и `Spoiler` — `2px solid var(--accent-8)`, offset 2px (тот же размер, другой токен; в тёмной теме не совпадает с `--focus-color`).
- `Tags.Item` (интерактивный) — цвет + подчёркивание, outline отключён осознанно (комментарий в коде).
- Ячейки `Calendar` и `DatePicker` — подложка `::after` вместо кольца.

### E. Отдельная проблема: элемент не фокусируется с клавиатуры

- `DataTable` — сортируемые заголовки колонок (`inner/ColumnHeaders.tsx:82`): `motion.div` с `onClick`, без `tabIndex`/`role`/обработчика клавиш — фокуса нет в принципе, сортировка недоступна с клавиатуры.
- `Toolbar.Title` с `clickable` (`toolbar/components/Title.tsx`) — `div`; фокусируемость зависит от обёртки, которую передаёт потребитель (`Dropdown`). Не проверялось.

## Статус

Группы A и C реализованы: `application/styles/_focus.scss` (токены + правило с нулевой специфичностью, исключает `tabindex="-1"`), миксин `focus` и его четыре использования удалены. Группа E не делалась.

## Приоритеты

1. C — одна правка миксина закрывает четыре компонента.
2. B — без действий: `Dropdown`, `AutocompleteInput` и `Splitter.Divider` — исключения.
3. A — пять компонентов с нативным кольцом.
4. E — `DataTable` заголовки.
5. D — решить, нужно ли унифицировать.

Не проверялось: реальное отображение в браузерах (особенно п. C), `docs/`, внутренний `sheet` (там `outline: none` только у неинтерактивной панели).
