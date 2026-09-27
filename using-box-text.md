# Использование Box и Text внутри компонентов `core`

Отчёт составлен по прямому импорту и рендеру `<Box>` / `<Text>` внутри исходников компонента (включая его `components/`, `inner/`, `renderers/` подпапки). Использование через промежуточный компонент (например, `Button` использует `Box`, а компонент, который рендерит `Button`, — нет) не засчитывается как прямое.

`Box` и `Text` сами по себе, а также `Application` (корневой провайдер) в таблицу не включены.

| Компонент | Box | Text | Комментарий |
| --- | :---: | :---: | --- |
| autocompleteInput | ✗ | ✗ | Строится на `TextInput`/`Dropdown`, сам `Box`/`Text` не рендерит |
| avatar | ✗ | ✗ | Своя разметка, `Box`/`Text` не используются |
| bottomNavigation | ✗ | ✅ | `components/Link.tsx` рендерит подпись через `Text` |
| breadcrumbs | ✗ | ✅ | `components/Item.tsx` рендерит подпись через `Text` |
| button | ✅ | ✗ | Корневой элемент — `Box` (`material` по варианту) |
| calendar | ✗ | ✗ | Сетка дней на нативной разметке, без `Box`/`Text` |
| checkbox | ✗ | ✗ | Своя разметка + SVG-иконка |
| closeButton | ✗ | ✗ | Простая кнопка на нативном `<button>` |
| collapsedList | ✗ | ✗ | Композиция чужих компонентов, своей разметки почти нет |
| colorPicker | ✅ | ✗ | `ColorPicker.tsx` использует `Box` для свотчей |
| dataTable | ✗ | ✅ | Значения ячеек и заголовки (`renderers/*`, `inner/ColumnHeaders.tsx`) рендерятся через `Text` |
| datePicker | ✗ | ✗ | Строится поверх `Calendar`/`TextInput`, напрямую `Box`/`Text` не использует |
| dialog | ✗ | ✅ | `DialogProvider.tsx` выводит текст алерта через `Text` (плюс `TextInput`/`TextArea` для `prompt`, это не в счёт) |
| divider | ✗ | ✗ | Простой `<hr>`-подобный элемент |
| drawer | ✗ | ✗ | Портал + своя разметка контейнера |
| dropdown | ✗ | ✗ | Пункты меню на своей разметке, без `Box`/`Text` |
| filePicker | ✗ | ✅ | `inner/File.tsx` выводит имя файла через `Text` |
| flex | ✗ | ✗ | Чистый layout-примитив на `div` |
| form | ✗ | ✗ | Провайдер контекста формы, разметки не рендерит |
| grid | ✗ | ✗ | Чистый layout-примитив на `div` |
| image | ✗ | ✅ | Текст fallback/ошибки через `Text` |
| label | ✅ | ✗ | Корневой элемент — `Box` (маппинг `color`→`tone`, `variant`→`material`) |
| loading | ✗ | ✗ | Спиннер на SVG/CSS |
| message | ✅ | ✗ | Корневой элемент — `Box` (`tone` по статусу) |
| modal | ✗ | ✗ | Портал + своя разметка контейнера |
| navigationList | ✗ | ✅ | `components/Group.tsx` и `components/Link.tsx` выводят подписи через `Text` |
| notifications | ✅ | ✗ | `components/NotificationCard.tsx` — карточка на `Box` (`material="plate"`) |
| numberInput | ✗ | ✗ | Строится на `TextInput`, напрямую `Box`/`Text` не использует |
| pagination | ✗ | ✗ | Кнопки страниц на своей разметке |
| passwordInput | ✗ | ✗ | Строится на `TextInput`, напрямую `Box`/`Text` не использует |
| popover | ✅ | ✗ | Всплывающая поверхность — `Box` |
| progress | ✅ | ✗ | Трек/индикатор прогресса — `Box` |
| radio | ✗ | ✗ | Своя разметка + SVG |
| result | ✗ | ✅ | Заголовок/описание через `Text` |
| screen | ✗ | ✗ | Layout-каркас приложения на `div`/CSS |
| scrollable | ✗ | ✗ | Обёртка-контейнер со скроллом |
| search | ✗ | ✗ | Строится на `TextInput`, напрямую `Box`/`Text` не использует |
| select | ✗ | ✗ | Строится на `Dropdown`, напрямую `Box`/`Text` не использует |
| sideNavigation | ✗ | ✅ | Заголовок секции через `Text` |
| skeleton | ✗ | ✗ | Плейсхолдер на `div`/CSS |
| slider | ✗ | ✗ | Трек/ползунок на своей разметке |
| splitter | ✗ | ✗ | Разделитель панелей на своей разметке |
| spoiler | ✗ | ✗ | Разворачиваемый контейнер, своя разметка |
| switch | ✗ | ✗ | Своя разметка тумблера |
| tabs | ✗ | ✅ | `components/Item.tsx` выводит подпись вкладки через `Text` |
| textInput | ✅ | ✗ | Обёртка поля ввода — `Box` |
| textarea | ✗ | ✗ | Нативный `<textarea>` без `Box`/`Text` |
| toolbar | ✗ | ✅ | `components/Title.tsx` выводит заголовок через `Text` |
| tooltip | ✗ | ✗ | Всплывающая подсказка на своей разметке (без `Box` — см. `elevation.md`, тень недоступна) |

## Итого

- **И `Box`, и `Text`**: ни один компонент не использует оба сразу напрямую.
- **Только `Box`**: `button`, `colorPicker`, `label`, `message`, `notifications`, `popover`, `progress`, `textInput` — 8 компонентов.
- **Только `Text`**: `bottomNavigation`, `breadcrumbs`, `dataTable`, `dialog`, `filePicker`, `image`, `navigationList`, `result`, `sideNavigation`, `tabs`, `toolbar` — 11 компонентов.
- **Ни то, ни другое**: остальные 26 компонентов из проверенных 45 — в основном примитивы (`flex`, `grid`, `divider`, `skeleton`), поля ввода, построенные поверх `TextInput` (`numberInput`, `passwordInput`, `search`, `autocompleteInput`, `datePicker`), и компоненты со своей нативной разметкой (`checkbox`, `radio`, `switch`, `slider`, `tooltip` и т.д.).
