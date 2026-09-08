# Иконки сайта

Здесь 52 иконки — ровно те, что использует сайт. Набор —
[Lucide](https://lucide.dev), размер 24 на 24, цвет наследуется от текста
(`currentColor`).

**Папка собирается автоматически.** Команда: `npm run icons`. Руками сюда
ничего не кладите и файлы не правьте — следующая сборка всё сотрёт.

**Имя файла = ключ иконки в выгрузке JSON.** В выгрузке стоит
`"icon": "building-2"` — значит файл `building-2.svg`. Это же имя иконки на
lucide.dev: строчными, слова через дефис.

## Иконки содержания — 30

Едут разработчику в выгрузке полем `icon` у карточек и списков. Список
открытый: новая иконка заводится в реестре (`iconForText.tsx`) и появляется
здесь при следующей сборке.

- accessibility
- alert-triangle
- ban
- brain
- building-2
- check
- clock
- ear
- eye
- file-text
- graduation-cap
- hand
- handshake
- heart
- heart-pulse
- info
- lightbulb
- link
- list-checks
- message-square
- monitor-smartphone
- scale
- search
- shield-check
- speech
- target
- users
- volume-x
- wallet
- x

## Иконки интерфейса — 22

Шапка, меню, поиск, кнопки, главная страница. В выгрузке их нет — они часть
компонентов Figma, а не содержания.

- arrow-right
- arrow-up
- arrow-up-right
- briefcase
- camera
- car
- chevron-down
- clipboard-list
- copy
- download
- globe
- hammer
- image
- mail
- map-pin
- minus
- pen-line
- play
- send
- sparkles
- tag
- user

## Где имя на lucide.dev другое

- `alert-triangle.svg` — на lucide.dev эта иконка называется `triangle-alert`

Иконки редакторских инструментов (панель правок, замечания) в набор не входят:
сайту они не нужны.
