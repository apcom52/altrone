# Категории компонентов

Компоненты `altrone-ui` разделены на 6 категорий по **роли** — по тому, для чего компонент нужен, а не по размеру или важности. Эта схема используется в сайдбаре документации (`docs/content/navigation.json`, URL `/components/<категория>/<компонент>`) и в названиях историй Storybook (`Components/<Категория>/<Имя>`).

Правила для Claude лежат в `.claude/rules/component-categories.md` и должны совпадать с этим файлом.

## Схема

| Категория | Slug | Storybook | Компоненты |
| --------- | ---- | --------- | ---------- |
| Макет (Layout) | `layout` | `Components/Layout/*` | Application, Screen, Box, Grid, Flex, Splitter, Scrollable, Toolbar, Spoiler, CollapsedList, Divider |
| Оверлеи (Overlays) | `overlays` | `Components/Overlays/*` | Modal, Dialog, Drawer, Popover, Dropdown, Tooltip |
| Элементы управления (Controls) | `controls` | `Components/Controls/*` | Button, Form, Label, TextInput, PasswordInput, NumberInput, TextArea, AutocompleteInput, Search, Select, Checkbox, Switch, Radio, Slider, DatePicker, ColorPicker, FilePicker, CloseButton |
| Контент (Content) | `content` | `Components/Content/*` | Text, Image, Avatar, DataTable, Tags, Calendar |
| Обратная связь (Feedback) | `feedback` | `Components/Feedback/*` | Notifications, Message, Loading, Skeleton, Progress, Result |
| Навигация (Navigation) | `navigation` | `Components/Navigation/*` | Tabs, NavigationList, SideNavigation, BottomNavigation, Breadcrumbs, Pagination |

## Что значит каждая категория

- **Макет** — структура и расположение других элементов: каркас страницы, примитивы, контейнеры, разделители.
- **Оверлеи** — всё, что рисуется в портале поверх страницы: модалки, панели, поповеры, выпадающие меню, тултипы и императивные `Dialog` (`showAlert`/`showConfirm`/`showPrompt`).
- **Элементы управления** — всё, с чем пользователь действует или во что вводит данные. `Form` здесь, потому что владеет полями, `Label` — потому что описывает поле.
- **Контент** — то, что показывают для чтения: текст, изображения, люди, теги, календарь, таблицы.
- **Обратная связь** — сообщает пользователю, что делает система: сообщения, результаты, прогресс, состояния загрузки, уведомления. `Notifications` остаётся здесь, хотя он императивный и в портале.
- **Навигация** — перемещает пользователя между местами.

## Спорные случаи

- `Toolbar` — Макет: это контейнер для действий.
- `Calendar` — Контент, а `DatePicker` (ввод даты) — Элементы управления.
- `Application` — Макет: корень дерева, провайдер.
- `Loading` и `Skeleton` — Обратная связь, а не отдельные «атомы».
- `CloseButton` — Элементы управления: это вариант кнопки.

## Добавление нового компонента

Компонент попадает в категорию по роли. Категории «разное» или «по размеру» (как прежние Atoms) не заводим. Седьмая категория — только после обсуждения.

## Что было раньше

Прежние группы Core, Containers, Display и Atoms делили компоненты по разным осям (важность, размер, роль), поэтому оверлеи, обратная связь и отображение данных оказались перемешаны. Страницы старых URL (`/components/core/*`, `/containers/*`, `/display/*`, `/atoms/*`) больше не существуют.
