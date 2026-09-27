# Сводка изменений: 14–23 сентября 2026

## Switch (бывший Switcher)

- Переименован `Switcher` → `Switch` во всех репозиториях (core/mcp/docs)
- Первый аргумент `onChange` `state` → `checked`, `onChange` стал обязательным
- Добавлена поддержка `size`/`disabled`/`name` через `useFormField()`

## Slider (бывший Range)

- Переименован `Range` → `Slider` (CSS-переменные, тесты, доки)
- Исправлен z-index всплывающего лейбла значения (несколько итераций: не перекрывать Modal/Select/Screen.Header)
- `direction` → `orientation`
- `activeTrackClassName` → `activeClassName` (+ твин `activeStyle`)
- `onValueCommit` → `onChangeEnd`
- Добавлены `name`/`disabled`/`size` через форм-контекст
- `touch-action: none` — страница больше не скроллится вместе с ползунком на тач-устройствах
- `setPointerCapture` — отпускание ползунка больше не триггерит клик по элементу под курсором
- Вариант `fill`: слэб теперь всегда pill-формы, value-чип позиционируется относительно размера слэба

## TextArea (бывший Textarea)

- Переименован `Textarea` → `TextArea` (правильный camelCase)
- Убран проп `shape` (форма зашита в стили)
- `className`/`style` через новые `inputClassName`/`inputStyle`
- Убран zoom-на-фокус в Safari iOS (через общий фикс TextInput)

## TextInput

- Убран проп `shape` (обёртка всегда `pill`)
- `className`/`style`/`ref` теперь ведут на корневой `Box`, а не на `<input>`; добавлены `inputClassName`/`inputStyle`, удалены `wrapperClassName`/`wrapperStyle`
- Убран zoom-на-фокус в Safari iOS для размера `m` (`@media (pointer: coarse)`)

## DataTable

- Убран саб-компонент `RowActions`, проп `renderRowActions` → `rowActions`
- Экшены тулбара перенесены из `children` в `actions`; шапка переведена на `Toolbar`, `actions` разбирается по регионам (Leading/Center/Trailing)
- Добавлен controlled-режим `page`/`sort`/`filters` (+ несколько багфиксов: сломанная пагинация, пустая панель фильтров, откат страницы)
- `onPageChange`/`onSortChange`/`onFilterChange`/`onModeChange` получили нативный `event`
- `DataTable.RowAction.onClick` — обычный нативный `MouseEvent`
- Горизонтальный скролл вместо распирания страницы; шапка синхронно едет с телом
- Скругление и отступ sticky-шапки реагируют на горизонтальный скролл
- Исправлен пропадающий фон/граница строк в зоне горизонтального скролла
- Увеличен радиус скругления таблицы с 24 до 28px
- Исправлены «уши» у шапки колонок без строки действий (без actions/фильтров/selectable)
- Добавлен `getRowId` — экшены строки больше не отвязываются от сущности при внешней перестановке `data`
- Убраны кнопки перехода на первую/последнюю страницу в пагинации таблицы

## Pagination

- Добавлен неуправляемый режим (`defaultPage`, `currentPage`/`onChange` стали опциональными)
- Добавлен проп `size`
- В `DataTable` отключены edge-кнопки (первая/последняя страница)

## Splitter

- Добавлен controlled-режим размеров панелей (`sizes`/`onSizesChange`)
- `Splitter.Panel` теперь принимает `ref`/`className`/`style`/HTML-атрибуты
- `min`/`max` → `minSize`/`maxSize`
- Расширена тач-область у ручки ресайза (невидимая накладка до 24px)

## Modal / Drawer (общие)

- Убран `children`-триггер, открытие только через `open`/`onClose`; `openedByDefault` → `defaultOpen`
- `Modal.leftActions` → `.additionalActions`; `Drawer.startActions`/`.endActions` → `.additionalActions`/`.actions`
- `onClose` получил `event?: MouseEvent | KeyboardEvent`
- Оба переведены на новый внутренний примитив `Sheet` (общая анимация, backdrop, focus-trap)
- Методы контекста `closeModal`/`closeDrawer` → `hide`
- Render-prop `content` унифицирован (`RenderFunction`)

## Modal

- Добавлен `showCloseButton`
- При переезде на `Sheet`: исправлен z-index обёртки по `elevation`, исправлен уводящий панель `autoFocus` у кнопки закрытия

## Drawer

- Дефолтная кнопка «Готово» — текст вместо иконки-чекбокса
- Добавлены `dismissible` и `showCloseButton`
- При переезде на `Sheet`: z-index панели переехал с `--level-offcanvas` на `--level-popover` (роль overlay)

## Sheet (новый внутренний примитив)

- Добавлена панель, выезжающая с любого края экрана, с `dismissible`/`mobileBreakpoint`/адаптивной высотой `auto`
- Блокировка скролла страницы, пока открыт (со счётчиком вложенности)
- Исправлено: панель не прячется под клавиатурой на iOS (`useVisualViewport`)

## Progress

- `children` → `label`
- `activeSegmentClassName` → `activeClassName` (+ `activeStyle`)
- Трек переведён с `material="solid" tone="subtle"` на `material="pale"`

## Popover

- `openedByDefault` → `defaultOpen`, добавлен полноценный controlled-режим `open`/`onOpenChange`
- Унификация `opened` → `open` в контекстах и ref
- `ref` теперь настоящий DOM-ref (триггер); императив переехал на `controlRef`
- `openPopup`/`closePopup` → `show`/`hide`, `closeAllSequence` → `hideAllSequence`
- Render-prop `content`/`children` унифицирован до общего `RenderFunction`

## Spoiler

- `openedByDefault` → `defaultOpen`, добавлен controlled-режим `open`/`onToggle`

## Screen

- Исправлен z-index `Header` (не терялся под контентом)
- `Sidebar`/`Aside` получили controlled-режим (`collapsed`/`defaultCollapsed`)
- `Toolbar.SidebarToggleAction` научился работать без явной проводки состояния (через контекст `Screen`)
- Добавлены `--top-safe-area`/`--bottom-safe-area` — sticky-элементы контента больше не прячутся под шапкой/нижней навигацией
- Добавлен проп `Header.fixed` (шапка может быть нефиксированной)
- Исправлено схлопывание `Aside` (не совпадал CSS-селектор)
- `Sidebar`/`Drawer`'s `onClose` получил `event`

## Toolbar

- Убраны `BackAction`, `BackForwardAction`, `SearchAction`
- `placement` → `edge`
- `Title.label` → `.title`
- Добавлено схлопывание действий в overflow-меню при нехватке места (`priority`)
- `Toolbar.Group.align` → `.justify` (было неверно названо изначально)
- Исправлен баланс Leading/Trailing (не схлопывались впустую при наличии места)
- Исправлен гибкий `Separator`, портивший расчёт overflow
- Усилен блюр варианта `solid`

## Badge (internal)

- `placement` → `mode`

## Notifications

- `toastPlacement`/`notificationSide`/`notificationPlacement` сведены к одному `notificationPlacement` (угловые значения)
- `useNotifications()` удалён — заменён на глобальные функции `showToast`/`showNotification`/`dismissNotification`
- Исправлено позиционирование при вложенных провайдерах
- Увеличена иконка в кружке
- Зафиксирован порядок отрисовки в стеке (z-index по позиции)
- Устранён композитинг-глитч при появлении (blur за непрозрачной поверхностью)
- Добавлен заметный баунс при появлении
- Исправлена обрезающаяся кнопка закрытия у карточек без заголовка/иконки
- Внутренний отступ `Toast` переведён на `--space-content`

## Localization / Application

- Коды языков `ge`/`sp` → `de`/`es`; добавлен `zh`
- Добавлены `pt`/`tr`
- Исправлено: `DatePicker`/`DataTable`'s date-рендерер игнорировали `Application.language`
- Исправлен нерабочий переключатель языка в Storybook
- Добавлена кастомизация встроенных lucide-иконок компонентов (`Application.icons`, `useIcons()`)

## Radio

- `direction` → `orientation`
- `value` стал `undefined`-able (тип приведён в соответствие с реальным поведением)
- Добавлены `name`/`disabled`/`size` через форм-контекст

## Checkbox

- Первый аргумент `onChange`: `state` → `checked`
- `onChange` стал обязательным
- Добавлены `name`/`disabled`/`size` через форм-контекст

## Select

- Клик по опции стал прокидывать `event` дальше (раньше терялся)
- Курсор «рука» вместо текстового на нередактируемом поле
- Добавлены `disabled`/`size` через форм-контекст
- `useSelectContext().clearValue` → `.clear`

## ColorPicker

- У поповера появился заголовок
- Курсор «рука» вместо текстового
- Добавлены `disabled`/`size` через форм-контекст
- Материал `hatch` → `dotted` (для заглушки свотча)
- Постоянный блок действий Clear/Apply в футере
- Исправлена кнопка «Clear» — не очищала значение
- Плейсхолдер «Choose a color» (было «Pick a color»); превью пустого значения — материал `pale`

## DatePicker

- Исправлен date-рендерер, игнорировавший `Application.language`
- Курсор «рука» вместо текстового
- Добавлен `disabled` через форм-контекст
- Кнопка «Сегодня»/«Этот месяц»/«Этот год» блокируется вне диапазона `minDate`/`maxDate`

## Calendar

- `onMonthChange`/`onHover` получили нативный `event`
- Исправлен цвет выходного/сегодняшнего дня, перекрывавший стиль заблокированной даты

## AutocompleteInput

- Императивный `dropdownRef` переведён на `controlRef`

## Dropdown

- `Dropdown.Checkbox`/`.RadioList.onChange` получили `event`
- `Dropdown.Menu.onChangeFocusItemIndex` получил `event` в сигнатуре (сам хук остаётся не подключён — известный пробел)
- `hintText` у `Dropdown.Action` решено не переименовывать

## Avatar

- Явный дефолт `size="m"` в коде компонента (раньше только в CSS)
- Исправлен z-index инициалов, перекрывавший футер `DataTable`

## Message

- `header` → `title`
- `actions` переведён на общий тип `ActionsProp`
- Материал переведён с `translucent` на `pale`
- Внутренний отступ переведён на `--space-content`

## Result

- `description` удалён — `children` единственный способ передать тело

## Dialog (showAlert/showConfirm/showPrompt)

- `ConfirmOptions.rejectText` → `.cancelText`
- Исправлено: диалоги закрывались без анимации (Modal теперь смонтирован всегда)

## FilePicker

- Добавлен проп `disabled` (раньше отсутствовал целиком)

## Box

- `material="glass"` больше не зависит от `tone` (фиксированная плотная заливка)
- Материал `hatch` → `dotted` (переосмыслен как узор из точек)
- Добавлен материал `pale` (непрозрачная тонированная заливка), tone `subtle` удалён

## Label

- `rounding` → `shape`
- Переведён на `Box` (материалы/тона вместо собственных стилей)

## Tooltip

- `childrenClassName` → `triggerClassName`
- `TooltipProps` расширяет `HTMLAttributes` (id/aria-_/data-_/обработчики идут на триггер)

## Flex / Grid / Grid.Column

- `tagName` заменён на `asChild`
- `Flex.direction` → `.orientation`
- `Flex.align` переведён на общий тип `Align`

## NavigationList

- Убраны `GroupAction`/`LinkAction` — вместо них проп `actions` на `Group`/`Link`
- Саб-компонент `Item` → `Link` (также у `BottomNavigation`)
- Исправлено: длинные `label`/`title` вылезали за пределы сайдбара (`min-width: 0`)

## Общие механизмы и правила (Foundations)

- `renderFunc` удалён из библиотеки целиком — `asChild` единственный механизм полиморфизма
- `Slot` теперь мержит `className`/`style` (не только `ref`) — устраняет тихую потерю стилей консьюмера
- Единый тип `ActionsProp<Ctx>` для всех пропов `actions`
- `Direction` → `Orientation`; `Align` сужен до `start/center/end` (`between` — это `Justify`)
- `Toolbar.placement` → `.edge`; `Badge.placement` → `.mode`; notification-пропы про сторону схлопнуты в один угловой `notificationPlacement`
- Зафиксировано правило required/optional для `event` в обработчиках (`event-handlers.md`)
- Параметр `e` → `event` в сигнатурах типов
- `imperative-apis.md`: два канонических механизма — глобальные функции vs `controlRef`
- Экспортированы `*Props` для 39 компонентов, ранее не имевших публичного типа
- `size` закреплён только за тиром контрола (решения по `Modal`/`Screen`/`Grid.Column` → `width`/`span`, зафиксированы, но не реализованы в этот период)
- Габаритные пропы решено расширить до `number | string` (решение зафиксировано, не реализовано)
