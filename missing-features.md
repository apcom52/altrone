# Altrone 3.5 → текущая версия: что потеряно / не реализовано

Сравнение старой версии (`altrone-ui` 3.5, `/Users/apcom/tst/altrone-ui/`) и текущей версии в разработке
(`core/` в этом воркспейсе, target-архитектура "v4"). Не включает `useConfiguration()` (удалено осознанно,
см. `configuration.md`) и смену стиля `ref`-форвардинга (не потеря).

## Полностью отсутствующие компоненты

- **`list`** — `/Users/apcom/tst/altrone-ui/src/components/list`. Универсальный компонент рендер-пропа для списков:
  `data` + `renderItem` + `keyExtractor` + `skipRule` (фильтрация) + `SeparatorComponent` + `showEmptyBanner`
  (при пустом списке рендерил `Empty`), обёрнутый в вертикальный `Flex`. В новой версии подобного примитива нет
  (`NavigationList`/`CollapsedList` решают другие, более узкие задачи — навигационное меню и "показать N + развернуть").
  Судя по всему, ожидается, что потребитель теперь сам собирает список через `Flex` + `.map()`.

- **`photoViewer`** — `/Users/apcom/tst/altrone-ui/src/components/photoViewer`. Полноэкранный лайтбокс/галерея фото:
  namespace `PhotoViewer.Image`, навигация next/prev, caption/description, toolbar с закрытием (`onNext`/`onPrevious`/
  `onClose`, `startsFrom`). В новой версии компонента нет вообще; новый `Image` — это просто одна картинка с
  preloader/broken-fallback/caption, не галерея. В `src/locales/en.ts` и других словарях новой версии остались
  мёртвые ключи локализации `photoViewer.*` (previous/next/progressLabel/progress/description/noDescription) —
  сироты без компонента, который бы их использовал.

## Компоненты с потерянными возможностями

- **`icon` (old) → нет прямого эквивалента (new)** — старый `Icon` (`/Users/apcom/tst/altrone-ui/src/components/icon`)
  был публичным компонентом, рендерившим Material Symbols по строковому имени (`i="cancel_presentation"`,
  `iconStyle`). В новой версии отдельного компонента `Icon` нет — библиотека полностью перешла на `lucide-react`,
  и все компоненты принимают `icon?: ReactElement` (готовый React-элемент вместо строки). Зависимость
  `@material-symbols/font-500` в новом `core` отсутствует. Остался только узкий `IconSet`/`useIcons()`/
  `AltroneIcons` (`application/useIcons.tsx`) — переопределение фиксированного набора служебных иконок
  (prev/next/open/close/search/clear/error/help/info/success/warning/danger) через проп `Application.icons`.
  Итог: "рендер произвольной иконки по имени" как публичный механизм — потерян, заменён на "передавайте готовый
  React-элемент".

- **`button` (old → new)** — потеряны:
  - `severity`/`role: 'success' | 'warning'` (`Button.types.ts` old) — новый `ButtonProps` умеет только
    `danger?: boolean` и `variant: 'default'|'submit'|'text'`, семантических success/warning-кнопок больше нет.
  - `rainbowEffect?: boolean` — декоративный radial-glow эффект на ховере (`useRainbowEffect` в old `Button.tsx`) —
    в новом коде отсутствует полностью.
  - `ariaRole?: string` — возможность переопределить ARIA-роль кнопки — эквивалента нет.

- **`textInput` (old → new)** — потерян `rainbowEffect?: boolean` (`TextInput.types.ts` old), тот же декоративный
  эффект, что и у Button. Эквивалента в новом `TextInputProps` нет.

- **`popover` (old → new)** — потерян `showArrow?: boolean` (`Popover.types.ts:37` old, рендерился через
  `PopoverArrow`/`arrow()` middleware). В новом `Popover.tsx` упоминаний arrow нет вовсе — визуальная
  "стрелка-указатель" на триггер пропала.

- **`tooltip` (old → new)** — новый `TooltipProps` написан с нуля вместо наследования от `PopoverProps`, из-за
  чего потеряны:
  - Режимы триггера (`click`/`focus`/`hover`) — новый `Tooltip.tsx` жёстко использует только hover
    (`useHover(context, { delay: {open:500, close:0} })`).
  - `enabled?: boolean` — проброс disabled-состояния.
  - Управляемая видимость: `openedByDefault`/`onOpenChange` — новый tooltip нельзя контролировать/наблюдать извне.
  - `showCloseButton`, `focusTrap`, `focusTrapTargets`, `listNavigation` (унаследованные от Popover в old).

- **`numberInput` (old → new)** — потерян `showControls?: boolean` (кнопки инкремента/декремента степпера).
  В новом `NumberInput.types.ts` пропа нет, в `NumberInput.tsx` не осталось кода степпера/кнопок +/- вообще.

- **`dataTable` (old → new)**, малая потеря — убран выделенный тип колонки `'array'` с
  `options.arrayDelimiter`/`arrayAccessor` (кастомный разделитель при склейке массива в ячейке). Ближайший
  эквивалент — новый тип `'select'` (тот же `join(', ')`, те же правила фильтрации), но настраиваемый разделитель
  (`arrayDelimiter`) не переносится.

- **`flex` (old → new)** — потерян `tagName?: string` (рендер `Flex` произвольным HTML-тегом через `createElement`,
  например `'ul'`/`'nav'`, с несколькими детьми/текстом). Новый `asChild` требует ровно один валидный React-элемент
  в `children` для merge и не может заменить `tagName` для тегов с текстом или множественными детьми — реальный,
  объективно недостижимый через `asChild` кейс.

- **`scrollable` (old → new)** — потеряны:
  - `showShadows` (тени/fade по краям при скролле).
  - `maxWidth` (остался только `maxHeight`).
  - `offset` (внутренний отступ вокруг контента).
  - Единый переключатель `direction: 'vertical'|'horizontal'` — заменён на раздельные `overflowX`/`overflowY`,
    больше нет одного явного "горизонтального режима".

- **`text` (old → new)** — потеряны семантические заголовки: `Text.Heading` (уровни 0–6, роли
  title/heading/subheading/inner) и `Text.ScreenName`. Новый `Text` вообще не умеет рендерить `<h1>`–`<h6>`
  (это подтверждено собственным `core/src/components/text/ROADMAP.md` проекта как известный гэп). Также нет
  полиморфного `as`-пропа/произвольного тега — есть только `asChild` для merge на один child.

- **`toolbar` (old → new)** — потерян `compact` (принудительный icon-only режим для всех actions одной кнопкой).
  В новом `Toolbar` label-hiding полностью управляется автоматическим width-based overflow-механизмом
  (`Toolbar.Separator`/`ToolbarGroup`, приоритеты) — ручного жёсткого переключателя больше нет.

## Утилиты и хуки, которых больше нет

- **`CustomRenderFunction<Arguments>`** (тип) — `type CustomRenderFunction<Arguments> = (data: Arguments) => ReactNode`,
  был в `/Users/apcom/tst/altrone-ui/src/utils/types.ts:17`. В `/Users/apcom/projects/altrone/core/src/utils/types.ts`
  отсутствует. Вероятный функциональный преемник — новый тип `ActionsProp`, но это формально другой тип/имя,
  требует проверки мест использования при миграции.

Всё остальное содержимое `utils/` (включая `utils/hooks/`, `utils/components/`) в новой версии — паритет или
расширение: все экспорты `GlobalUtils`, `ArrayUtils`, `NumberUtils`, `DOMUtils`, `FileUtils`, `AsyncUtils`,
`Children`, `hooks/index.ts`, `ScrollSpy.tsx`, `useBoolean`, `useConstructor`, `useDebouncedEffect`, `useDidUpdate`,
`useMutationObserver`, `useNumber`, `useScrollObserver`, `useLocale`, `useMediaMatch`, `useResizeObserver`
сохранены (местами сделаны SSR-safer). Новая версия добавляет `ColorUtils`, `dayjsInstance`, `Slot.tsx`,
`useBreakpoint`, `useContainerQuery`, `useOverlayItemBackground`, `useShowControls`, `mergeRefs`, `cloneWithRef`.

## Запланировано, но ещё не реализовано

- **Типографика (контентные/контрольные роли)** — `title`/`subtitle`/`body`/`caption`/`code` и
  `--text-control-{mini,s,m,l,xl}` явно помечены как "черновик/не подтверждено" в `typography.md`; тема
  сознательно отложена ("return to it later").
- **`rem`-based Dynamic Type для типографики** — известный, осознанно отложенный (не отменённый) гэп: без него
  настройки размера шрифта в браузере/ОС не влияют на текст Altrone (`typography.md`).
- **Material-3-style тональная elevation для тёмной темы** (тон поверхности, управляемый числовым elevation,
  независимо от `glass`-материала) — помечено как "не спроектировано" в `elevation.md`, вероятно будет привязано
  к материалам `Box`.
- **`forced-colors` (Windows High Contrast Mode)** — отмечено как реальный accessibility-гэп, отложено
  (`color.md`, раздел "Open").
- **Категориальная цветовая палитра не подключена к `Tags`/`Calendar`** — нет структурного хука (`Tags.Item` без
  chip-стилизации, `Calendar` без концепции категорий); требуется новое API компонентов (`color.md`).
- **Spacing: control-role матрица и ~100 участков с хардкодед-px** — не мигрированы (только `NavigationList` и
  `Tabs.Item` мигрированы как proof), это отдельная работа по каждому компоненту, а не механическое переименование
  (`spacing.md`).
- **Решение по `--s-gap` (6px, вне 4px-сетки)** — снапнуть к 8px или убрать уровень — открытый вопрос дизайна,
  не решено (`spacing.md`).
- **`Dropdown.Menu`'s `DropdownMenuRef`** (`selectedIndex`, `menuNode`) — объявлен в `Dropdown.types.ts`, но не
  подключён: `DropdownMenu.tsx` форвардит только обычный DOM `ref` — явный "known gap" в `imperative-apis.md`.
- **Полная адаптивность навигационных идиом Screen** (переключение tab bar ↔ sidebar) — модель described в
  `responsiveness.md` как "не просто ресайз, а смена идиомы навигации"; базовые хуки (`useBreakpoint`,
  `useContainerQuery`/`useElementSize`) уже реализованы, но нет подтверждения, что сама идиома-адаптивность
  `Screen`/List-Detail полностью выстроена во всех сценариях — требует отдельной проверки.
- Примечание: `target-architecture-status.md` ссылается на `application-screen.md` и `box.md` как источники
  дизайн-решений по `Screen`/`Box`, но по факту эти файлы отсутствуют в `.claude/rules/` — сами компоненты `Screen`
  и `Box` в коде уже реализованы, однако задокументированного design-rationale для них в правилах пока нет.

## Переименования / замены (без потери функциональности)

- `dummyBox` → `box` — старый `DummyBox` был примитивным плейсхолдером (`width`/`height`/`radius`); новый `Box` —
  полноценный примитив (shape/material/tone/color/size/elevation) с материалом `dotted` специально под старый
  use case заглушки.
- `empty` → `result` — старый `Empty` (иконка + текст "нет данных") расширен: новый `Result` поддерживает статусы
  `empty`/`info`/`success`/`warning`/`error`, `title`, `actions`.
- `range` → `slider` — та же модель значения (`value: number`, без dual-thumb ни там, ни там), новый `Slider`
  добавляет `variant`, `orientation`, `onChangeEnd`, событие в колбэках (соответствие `event-handlers.md`).
- `switcher` → `switch` — тождественный тип (`Omit<CheckboxProps, 'indeterminate'>`), чистое переименование.
- `toasts` (хук `useToast()`) → `notifications` (глобальные функции `showToast`/`showNotification`/
  `dismissNotification`) — соответствует правилу `imperative-apis.md`, возможности сохранены и объединены.
- `topNavigation` → композиция `Screen.Header` + `Toolbar` — вместо монолитного компонента с
  `TopNavigation.Logo`/`.Group`/`.Link` теперь используется `Screen.Header` (позиционирующая зона) с `Toolbar`
  внутри (`Toolbar.Logo`/`Toolbar.Action`/`Toolbar.Group` с overflow по приоритету).
- `badge` → `src/internal/badge` — не потеря публичного API: старый `Badge` уже не экспортировался из
  `src/components/index.ts` в old, так что публичной регрессии нет; теперь компонент официально внутренний,
  переписан поверх `Box`.
- `renderFunc`/`Component`-пропы (`select`, `dropdown`, `colorPicker`, `tags`, `textInput`, `textarea`, и др.) →
  `asChild` — подтверждено чтением исходников как эквивалентная замена везде, кроме `Flex.tagName` (см. раздел
  "потерянные возможности").
- `dataTable`: кастомный рендер ячейки (`Component`/`renderFunc`) → тип колонки `'custom'` с
  `options.renderReadMode`/`renderLoadingMode` — функционально эквивалентно.
- `useConfiguration()`/`<Configuration>`/`config`-проп — удалены осознанно (см. `configuration.md`), не потеря.
