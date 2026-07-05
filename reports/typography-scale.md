# Типо-шкала сайта (источник правды)

Единая шкала, к которой сведена типографика. Держится **в компонентах** (страницы своей типографики почти не задают — весь текст идёт пропами в общие компоненты). Меняешь размер роли — меняй в компоненте, не в странице.

| Роль | Стиль | Где живёт |
|---|---|---|
| H1 (заголовок страницы) | `text-4xl font-bold tracking-tight leading-tight` (лендинг `md:text-5xl`) | PageHero |
| H2 (раздел) | `text-2xl font-semibold tracking-tight` | ContentSection, RelatedLinks, ContactSection |
| H3 (подраздел) | `text-xl font-semibold tracking-tight` | ContentSection `level="h3"` |
| H4 / заголовок карточки/блока | `text-base font-semibold` | Card, PersonaCard, PromoBanner, CompareColumns, Disclosure-группа, StepsShelf |
| Лид | `text-lg leading-relaxed text-foreground` | PageHero, ContentSection lead, proseClasses |
| Абзац прозы | базовый 1rem `leading-relaxed text-foreground` | proseClasses.paragraph |
| Текст внутри компонентов | `text-sm leading-relaxed` | Callout, Card, DataTable, Blockquote, Disclosure, CompareColumns, аккордеоны, квиз |
| Подпись / сноска | `text-[0.8125rem]` (13px) `text-muted-foreground` | proseClasses.footnote, DataTable/CodeSnippet/ImagePlaceholder caption, подсказки QuizItem |
| Надзаголовок / метка | `text-xs font-semibold uppercase tracking-wide text-muted-foreground` | eyebrow PageHero, метки TOC/сайдбара/подвала, revealLabel квиза |

**Веса:** проза — обычный; акцент/ссылки — `font-medium`; заголовки — `font-semibold`; H1 и крупные числа-статы — `font-bold`.
**Цвет текста:** только `text-foreground` (основной) и `text-muted-foreground` (вторичный/метки/подписи). Исключения — семантические `ok/warn/bad` в статус-иконках/тегах и `text-brand` для числа-стата.
**Трекинг:** `tracking-tight` — заголовки; `tracking-wide` — uppercase-метки. `tracking-wider` не используем.
**Интерлиньяж:** проза/списки — `leading-relaxed`; заголовки — `leading-tight`/`snug`.

## Что было выправлено (аудит + правки)

Система была дисциплинированной; рассыпалась в ~10 точках, все — в компонентах:
- **Иерархия заголовков:** RelatedLinks h2 был `text-xl` (мельче такого же h2 в разделах) → `text-2xl`; h3 в ContentSection потерял `tracking-tight` → вернули; заголовки карточек шли тремя размерами (PromoBanner `text-lg`, прочие base) → все к `text-base`.
- **Компонентный текст к `text-sm`:** тело Blockquote (`text-base`→`text-sm`), раскрытый текст и триггеры Disclosure/accordion/CollapsibleBlock (base→`text-sm`).
- **Мелкие ступени к 13px:** ImagePlaceholder caption (14px→13px), подсказки/заметки QuizItem (12px→13px); SidebarNav-метка (11px + `tracking-wider` + полупрозрачный цвет → `text-xs tracking-wide muted`).
- **Роль-цвет:** вводный абзац ContactSection (muted→foreground); заголовки колонок подвала (обычный `text-sm` → метка uppercase); буква-разделитель DefinitionList (muted→foreground).

Ложное срабатывание аудита (НЕ правили): тело кейсов в QuizItem — `<Paragraph>` не задаёт размер и наследует `text-sm` от обёртки `context`, инверсии нет.
