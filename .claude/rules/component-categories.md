# Component Categories

Six categories, split by **role** (what the component is for), not by size or importance. This is the single source of truth for the docs sidebar (`docs/content/navigation.json`, URLs `/components/<category>/<slug>`) and Storybook titles (`Components/<Category>/<Name>`) — keep them in sync with this file.

| Category (slug)       | Storybook | Components |
| --------------------- | --------- | ---------- |
| **Layout** (`layout`) | `Components/Layout/*` | Application, Screen, Box, Grid, Flex, Splitter, Scrollable, Toolbar, Spoiler, CollapsedList, Divider |
| **Overlays** (`overlays`) | `Components/Overlays/*` | Modal, Dialog, Drawer, Popover, Dropdown, Tooltip |
| **Controls** (`controls`) | `Components/Controls/*` | Button, Form, Label, TextInput, PasswordInput, NumberInput, TextArea, AutocompleteInput, Search, Select, Checkbox, Switch, Radio, Slider, DatePicker, ColorPicker, FilePicker, CloseButton |
| **Content** (`content`) | `Components/Content/*` | Text, Image, Avatar, DataTable, Tags, Calendar |
| **Feedback** (`feedback`) | `Components/Feedback/*` | Notifications, Message, Loading, Skeleton, Progress, Result |
| **Navigation** (`navigation`) | `Components/Navigation/*` | Tabs, NavigationList, SideNavigation, BottomNavigation, Breadcrumbs, Pagination |

## Placement rules

- **Layout** — structure and arrangement of other things (page shell, primitives, containers, dividers).
- **Overlays** — anything rendered in a portal above the page: modal/drawer/popover/dropdown/tooltip and the imperative `Dialog` (`showAlert`/`showConfirm`/`showPrompt`).
- **Controls** — anything the user acts on or enters data into, including `Form` (it owns the fields) and `Label`.
- **Content** — shows content or data to read (text, images, people, tags, calendar, tables).
- **Feedback** — tells the user what the system is doing: messages, results, progress, loading states, toasts/notifications. `Notifications` stays here even though it is imperative and portaled.
- **Navigation** — moves the user between places.
- Borderline: `Toolbar` is Layout (an action container), `Calendar` is Content (`DatePicker` is the input in Controls), `Application` is Layout (the root of the tree).
- A new component goes into the category by role, never into a new "misc"/size-based bucket. Adding a seventh category needs discussion.
