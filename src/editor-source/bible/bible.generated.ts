/*
  СОБРАНО СКРИПТОМ — руками не править.

  Источник: src/docs/json-bible.md. Пересобрать: npm run bible.
  Правка этого файла молча разойдётся с исходником, а адреса блоков — с теми,
  на которых висят комментарии разработчика.
*/

/** Уровень заголовка внутри документа. */
export type BibleHeadingLevel = 2 | 3 | 4;

/*
  Блок документа. Поле id — адрес, по которому к блоку привязан комментарий:
  «bible::якорь-раздела::вид::хэш-текста». Пока текст блока не изменили, адрес
  держится (см. ids.ts, тот же приём на страницах сайта).

  Поле md несёт разметку для показа (жирный, ссылки, код в строке), text — тот
  же кусок без разметки: из него считается адрес и снимок для панели замечаний.
*/
export type BibleBlock =
  | {
      kind: "heading";
      id: string;
      level: BibleHeadingLevel;
      md: string;
      text: string;
      /** Якорь для оглавления и ссылки на раздел. */
      anchor: string;
    }
  | { kind: "para"; id: string; md: string; text: string }
  | { kind: "quote"; id: string; md: string; text: string }
  | { kind: "list"; id: string; items: string[]; text: string }
  | { kind: "table"; id: string; header: string[]; rows: string[][]; text: string }
  | { kind: "code"; id: string; lang: string; body: string; text: string };

/** Пункт оглавления: разделы (2) и компоненты внутри них (3). */
export type BibleTocItem = { level: number; anchor: string; text: string };

export const bibleBlocks: BibleBlock[] = [
  {
    "id": "bible::ustroystvo-fayla::heading::19ndc6d",
    "kind": "heading",
    "level": 2,
    "md": "Устройство файла",
    "text": "Устройство файла",
    "anchor": "ustroystvo-fayla"
  },
  {
    "id": "bible::koren::heading::1bxcwyz",
    "kind": "heading",
    "level": 3,
    "md": "Корень",
    "text": "Корень",
    "anchor": "koren"
  },
  {
    "id": "bible::koren::para::1pp1n5x",
    "kind": "para",
    "md": "Вся выгрузка — один файл, один объект с двумя полями.",
    "text": "Вся выгрузка — один файл, один объект с двумя полями."
  },
  {
    "id": "bible::koren::code::1mrucdw",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"section\": \"Сайт\",\n  \"pages\": []\n}",
    "text": "{\n  \"section\": \"Сайт\",\n  \"pages\": []\n}"
  },
  {
    "id": "bible::koren::table::1khwd21",
    "kind": "table",
    "header": [
      "Поле",
      "Что это"
    ],
    "rows": [
      [
        "`section`",
        "Название свода. Сейчас всегда «Сайт»."
      ],
      [
        "`pages`",
        "Массив страниц. Сейчас их 29."
      ]
    ],
    "text": "Поле | Что это | section | Название свода. Сейчас всегда «Сайт». | pages | Массив страниц. Сейчас их 29."
  },
  {
    "id": "bible::koren::para::1j6y7p4",
    "kind": "para",
    "md": "**Меню сайта в файле нет** — убрано 17 августа 2026 по просьбе разработчика. До этого рядом со страницами ехал блок `menu`: верхнее меню, боковые меню разделов и колонки подвала. Шапку, меню и подвал разработчик собирает в конструкторе руками и данные для них из файла не берёт, поэтому блок только занимал место. От меню в выгрузке осталась одна вещь — подпись самой страницы, поле `navTitle` ([siteExport.ts:83](prototype/src/editor-source/site/siteExport.ts:83)).",
    "text": "Меню сайта в файле нет — убрано 17 августа 2026 по просьбе разработчика. До этого рядом со страницами ехал блок menu: верхнее меню, боковые меню разделов и колонки подвала. Шапку, меню и подвал разработчик собирает в конструкторе руками и данные для них из файла не берёт, поэтому блок только занимал место. От меню в выгрузке осталась одна вещь — подпись самой страницы, поле navTitle (siteExport.ts:83)."
  },
  {
    "id": "bible::koren::para::gal49m",
    "kind": "para",
    "md": "Поля `module` в выгрузке нет намеренно. Это сайт, а не курс, и термин остался внутри редактора ([siteExport.ts:41](prototype/src/editor-source/site/siteExport.ts:41)).",
    "text": "Поля module в выгрузке нет намеренно. Это сайт, а не курс, и термин остался внутри редактора (siteExport.ts:41)."
  },
  {
    "id": "bible::stranica::heading::ua8mh",
    "kind": "heading",
    "level": 3,
    "md": "Страница",
    "text": "Страница",
    "anchor": "stranica"
  },
  {
    "id": "bible::stranica::code::kvppdo",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"slug\": \"/ngo/guidance\",\n  \"navTitle\": \"Профориентация\",\n  \"navGroup\": \"Соискатели\",\n  \"meta\": {\n    \"title\": \"Профориентация — Инклюзия в Яндексе\",\n    \"description\": \"Как НКО помогает кандидату выбрать направление работы…\",\n    \"favicon\": \"favicon.svg\"\n  },\n  \"meta-og\": {\n    \"title\": \"Профориентация — Инклюзия в Яндексе\",\n    \"description\": \"Как НКО помогает кандидату выбрать направление работы…\",\n    \"image\": \"\"\n  },\n  \"h1\": \"Профориентация\",\n  \"article\": []\n}",
    "text": "{\n  \"slug\": \"/ngo/guidance\",\n  \"navTitle\": \"Профориентация\",\n  \"navGroup\": \"Соискатели\",\n  \"meta\": {\n    \"title\": \"Профориентация — Инклюзия в Яндексе\",\n    \"description\": \"Как НКО помогает кандидату выбрать направление работы…\",\n    \"favicon\": \"favicon.svg\"\n  },\n  \"meta-og\": {\n    \"title\": \"Профориентация — Инклюзия в Яндексе\",\n    \"description\": \"Как НКО помогает кандидату выбрать направление работы…\",\n    \"image\": \"\"\n  },\n  \"h1\": \"Профориентация\",\n  \"article\": []\n}"
  },
  {
    "id": "bible::stranica::para::1sy9p06",
    "kind": "para",
    "md": "Обязательны шесть полей, и порядок в файле именно такой. Седьмое, `navGroup`, стоит только у страниц внутри группы ([siteExport.ts:69](prototype/src/editor-source/site/siteExport.ts:69)).",
    "text": "Обязательны шесть полей, и порядок в файле именно такой. Седьмое, navGroup, стоит только у страниц внутри группы (siteExport.ts:69)."
  },
  {
    "id": "bible::stranica::table::f4k174",
    "kind": "table",
    "header": [
      "Поле",
      "Тип",
      "Что значит"
    ],
    "rows": [
      [
        "`slug`",
        "строка",
        "Адрес страницы, полный путь от корня сайта. Уникален на весь сайт."
      ],
      [
        "`navTitle`",
        "строка",
        "Подпись страницы в боковом меню."
      ],
      [
        "`navGroup`",
        "строка",
        "Заголовок группы бокового меню, в которой стоит страница. Есть только у страниц внутри групп — сейчас это 14 страниц раздела «Для НКО»."
      ],
      [
        "`meta`",
        "объект",
        "Что о странице узнают браузер и поисковик."
      ],
      [
        "`meta-og`",
        "объект",
        "Что о странице узнают мессенджеры и соцсети. Имя с дефисом, поэтому в JSON всегда в кавычках."
      ],
      [
        "`h1`",
        "строка",
        "Заголовок, который читатель видит в шапке страницы."
      ],
      [
        "`article`",
        "массив узлов",
        "Содержимое страницы."
      ]
    ],
    "text": "Поле | Тип | Что значит | slug | строка | Адрес страницы, полный путь от корня сайта. Уникален на весь сайт. | navTitle | строка | Подпись страницы в боковом меню. | navGroup | строка | Заголовок группы бокового меню, в которой стоит страница. Есть только у страниц внутри групп — сейчас это 14 страниц раздела «Для НКО». | meta | объект | Что о странице узнают браузер и поисковик. | meta-og | объект | Что о странице узнают мессенджеры и соцсети. Имя с дефисом, поэтому в JSON всегда в кавычках. | h1 | строка | Заголовок, который читатель видит в шапке страницы. | article | массив узлов | Содержимое страницы."
  },
  {
    "id": "bible::stranica::para::17u3v2a",
    "kind": "para",
    "md": "Четыре пояснения, почему поля названы и разложены так.",
    "text": "Четыре пояснения, почему поля названы и разложены так."
  },
  {
    "id": "bible::stranica::para::1sqx5dq",
    "kind": "para",
    "md": "**`slug` — ровно два уровня, и папок-пустышек в нём нет.** До 17 августа 2026 часть адресов несла лишний уровень, оставшийся от курса: `/general/legal/quotas`, `/companies/hire/step-1`, `/ngo/candidates/guidance`. Ни «legal», ни «hire», ни «candidates» страницами не были и ничего не значили — это были имена глав курса. Теперь адреса плоские: `/general/quotas`, `/companies/step-1`, `/ngo/guidance`. Старые адреса на прототипе продолжают работать перенаправлением, но в выгрузке их больше нет.",
    "text": "slug — ровно два уровня, и папок-пустышек в нём нет. До 17 августа 2026 часть адресов несла лишний уровень, оставшийся от курса: /general/legal/quotas, /companies/hire/step-1, /ngo/candidates/guidance. Ни «legal», ни «hire», ни «candidates» страницами не были и ничего не значили — это были имена глав курса. Теперь адреса плоские: /general/quotas, /companies/step-1, /ngo/guidance. Старые адреса на прототипе продолжают работать перенаправлением, но в выгрузке их больше нет."
  },
  {
    "id": "bible::stranica::para::ayt36g",
    "kind": "para",
    "md": "**`navGroup` — это разделитель меню, а не уровень адреса.** «Соискатели» и «Работодатели» страницами не являются: у них нет ни адреса, ни текста, ни меты, и в списке страниц им места нет. Раньше заголовки групп приезжали блоком `menu`; блок убран, и теперь группу называет сама страница. У «Основ» и «Для компаний» меню одноуровневое, групп там нет вовсе — и поля у этих страниц тоже нет. Пустая строка читалась бы как «группа есть, но её забыли назвать» ([navLabel.ts](prototype/src/editor-source/site/navLabel.ts)).",
    "text": "navGroup — это разделитель меню, а не уровень адреса. «Соискатели» и «Работодатели» страницами не являются: у них нет ни адреса, ни текста, ни меты, и в списке страниц им места нет. Раньше заголовки групп приезжали блоком menu; блок убран, и теперь группу называет сама страница. У «Основ» и «Для компаний» меню одноуровневое, групп там нет вовсе — и поля у этих страниц тоже нет. Пустая строка читалась бы как «группа есть, но её забыли назвать» (navLabel.ts)."
  },
  {
    "id": "bible::stranica::para::1h1oflv",
    "kind": "para",
    "md": "**`navTitle` намеренно отличается от `h1`.** Пункт меню читается под заголовком своей группы, и повторять её слова незачем: под «Работодателями» стоит «Поиск», а не «Поиск работодателей». Поле есть у каждой страницы, даже когда подпись совпадает с заголовком: поле, которого то нет, то есть, заставляет каждый раз проверять, не забыли ли мы его ([siteExport.ts:72](prototype/src/editor-source/site/siteExport.ts:72)). До 17 августа 2026 поле звалось `nav` — переименовано по просьбе разработчика, чтобы имя говорило, что внутри подпись, а не кусок навигации.",
    "text": "navTitle намеренно отличается от h1. Пункт меню читается под заголовком своей группы, и повторять её слова незачем: под «Работодателями» стоит «Поиск», а не «Поиск работодателей». Поле есть у каждой страницы, даже когда подпись совпадает с заголовком: поле, которого то нет, то есть, заставляет каждый раз проверять, не забыли ли мы его (siteExport.ts:72). До 17 августа 2026 поле звалось nav — переименовано по просьбе разработчика, чтобы имя говорило, что внутри подпись, а не кусок навигации."
  },
  {
    "id": "bible::stranica::para::195g3yp",
    "kind": "para",
    "md": "**`h1` лежит отдельно, а не внутри меты.** Мета описывает страницу для машин, а `h1` — видимая часть страницы. По той же причине в мете нет обложки: обложка это картинка в шапке, а не мета ([siteExport.ts:59](prototype/src/editor-source/site/siteExport.ts:59)).",
    "text": "h1 лежит отдельно, а не внутри меты. Мета описывает страницу для машин, а h1 — видимая часть страницы. По той же причине в мете нет обложки: обложка это картинка в шапке, а не мета (siteExport.ts:59)."
  },
  {
    "id": "bible::stranica::para::1aygal3",
    "kind": "para",
    "md": "**`article` раньше звалось `children`.** Имя поменяли, потому что у узлов внутри тоже есть `children`, и на верхнем уровне это читалось как «дети чего?» ([siteExport.ts:65](prototype/src/editor-source/site/siteExport.ts:65)).",
    "text": "article раньше звалось children. Имя поменяли, потому что у узлов внутри тоже есть children, и на верхнем уровне это читалось как «дети чего?» (siteExport.ts:65)."
  },
  {
    "id": "bible::meta::heading::8670wo",
    "kind": "heading",
    "level": 3,
    "md": "Мета",
    "text": "Мета",
    "anchor": "meta"
  },
  {
    "id": "bible::meta::para::1ovgrvp",
    "kind": "para",
    "md": "`meta` — три поля: `title`, `description`, `favicon`. Значок вкладки сейчас всегда `favicon.svg`.",
    "text": "meta — три поля: title, description, favicon. Значок вкладки сейчас всегда favicon.svg."
  },
  {
    "id": "bible::meta::para::1x7vewa",
    "kind": "para",
    "md": "`meta-og` — три поля: `title`, `description`, `image`. Картинка для карточки в мессенджере пока не нарисована, поэтому `image` едет пустой строкой. Это единственное место, где пустая строка допустима.",
    "text": "meta-og — три поля: title, description, image. Картинка для карточки в мессенджере пока не нарисована, поэтому image едет пустой строкой. Это единственное место, где пустая строка допустима."
  },
  {
    "id": "bible::vosem-skvoznyh-pravil::heading::o2uatu",
    "kind": "heading",
    "level": 2,
    "md": "Восемь сквозных правил",
    "text": "Восемь сквозных правил",
    "anchor": "vosem-skvoznyh-pravil"
  },
  {
    "id": "bible::vosem-skvoznyh-pravil::para::1xq14pd",
    "kind": "para",
    "md": "Эти правила действуют на всю выгрузку, независимо от компонента. Дальше в каталоге они не повторяются.",
    "text": "Эти правила действуют на всю выгрузку, независимо от компонента. Дальше в каталоге они не повторяются."
  },
  {
    "id": "bible::1-imya-komponenta-iz-zakrytogo-spiska-title-case-s-probelami::heading::mj7u35",
    "kind": "heading",
    "level": 3,
    "md": "1. Имя компонента — из закрытого списка, Title Case с пробелами",
    "text": "1. Имя компонента — из закрытого списка, Title Case с пробелами",
    "anchor": "1-imya-komponenta-iz-zakrytogo-spiska-title-case-s-probelami"
  },
  {
    "id": "bible::1-imya-komponenta-iz-zakrytogo-spiska-title-case-s-probelami::para::gdh38r",
    "kind": "para",
    "md": "Имя в поле `component` — единственный мост между макетом в Figma, прототипом и конструктором, поэтому оно везде пишется одинаково. Список закрыт и состоит из 24 имён:",
    "text": "Имя в поле component — единственный мост между макетом в Figma, прототипом и конструктором, поэтому оно везде пишется одинаково. Список закрыт и состоит из 24 имён:"
  },
  {
    "id": "bible::1-imya-komponenta-iz-zakrytogo-spiska-title-case-s-probelami::para::1rovt2m",
    "kind": "para",
    "md": "`Section Container` · `Page Summary` · `Heading` · `Text` · `Phrase` · `Stack` · `List Item` · `Block` · `General Card` · `Accordion` · `Quote` · `Table` · `Table cell` · `Image` · `Video` · `Person Item` · `Prompt` · `Card Button` · `Compare` · `Compare Card` · `Quiz` · `Feedback` · `Read More` · `Read More Item`",
    "text": "Section Container · Page Summary · Heading · Text · Phrase · Stack · List Item · Block · General Card · Accordion · Quote · Table · Table cell · Image · Video · Person Item · Prompt · Card Button · Compare · Compare Card · Quiz · Feedback · Read More · Read More Item"
  },
  {
    "id": "bible::1-imya-komponenta-iz-zakrytogo-spiska-title-case-s-probelami::para::15pfr6y",
    "kind": "para",
    "md": "Список стережёт не один механизм, а два. Если компонент добавили в дерево, но не внесли в контракт, сборка просто не проходит — это проверка типом ([contentTree.ts:4537](prototype/src/editor-source/source/contentTree.ts:4537)). Если незнакомое имя всё же оказалось в готовом файле, о нём говорит проверка выгрузки ([exportChecks.ts:163](prototype/src/editor-source/site/exportChecks.ts:163)).",
    "text": "Список стережёт не один механизм, а два. Если компонент добавили в дерево, но не внесли в контракт, сборка просто не проходит — это проверка типом (contentTree.ts:4537). Если незнакомое имя всё же оказалось в готовом файле, о нём говорит проверка выгрузки (exportChecks.ts:163)."
  },
  {
    "id": "bible::1-imya-komponenta-iz-zakrytogo-spiska-title-case-s-probelami::para::oz82m1",
    "kind": "para",
    "md": "Одно имя из списка выбивается из правила: `Table cell` пишется со строчной буквы во втором слове. Так оно называется в Figma, и мы держим имя ровно как в макете ([КОМПОНЕНТЫ.md:231](КОМПОНЕНТЫ.md:231)).",
    "text": "Одно имя из списка выбивается из правила: Table cell пишется со строчной буквы во втором слове. Так оно называется в Figma, и мы держим имя ровно как в макете (КОМПОНЕНТЫ.md:231)."
  },
  {
    "id": "bible::2-znacheniya-perechisleniya-edut-strochnymi-shkaly-zaglavnym::heading::19auh44",
    "kind": "heading",
    "level": 3,
    "md": "2. Значения-перечисления едут строчными, шкалы — заглавными",
    "text": "2. Значения-перечисления едут строчными, шкалы — заглавными",
    "anchor": "2-znacheniya-perechisleniya-edut-strochnymi-shkaly-zaglavnym"
  },
  {
    "id": "bible::2-znacheniya-perechisleniya-edut-strochnymi-shkaly-zaglavnym::para::8exjgz",
    "kind": "para",
    "md": "Строчными приезжают значения пяти полей: `marker`, `variant`, `orientation`, `state`, `tone` ([contentTree.ts:4574](prototype/src/editor-source/source/contentTree.ts:4574)). Поле `mode` у квиза тоже строчное, но оно строчное изначально и принудительно не переводится.",
    "text": "Строчными приезжают значения пяти полей: marker, variant, orientation, state, tone (contentTree.ts:4574). Поле mode у квиза тоже строчное, но оно строчное изначально и принудительно не переводится."
  },
  {
    "id": "bible::2-znacheniya-perechisleniya-edut-strochnymi-shkaly-zaglavnym::para::wwpxti",
    "kind": "para",
    "md": "Заглавными остаются обозначения шкалы: размеры `L`, `M`, `S` и уровни заголовков `H2`…`H5`. Это не слова, а деления линейки, и «l» с «h2» читались бы хуже.",
    "text": "Заглавными остаются обозначения шкалы: размеры L, M, S и уровни заголовков H2…H5. Это не слова, а деления линейки, и «l» с «h2» читались бы хуже."
  },
  {
    "id": "bible::2-znacheniya-perechisleniya-edut-strochnymi-shkaly-zaglavnym::para::19q2avt",
    "kind": "para",
    "md": "Внутри нашего кода часть значений записана с заглавной буквы (`Dot`, `Vertical`, `Collapsed`). Разработчику они всегда приезжают строчными — на это можно опираться.",
    "text": "Внутри нашего кода часть значений записана с заглавной буквы (Dot, Vertical, Collapsed). Разработчику они всегда приезжают строчными — на это можно опираться."
  },
  {
    "id": "bible::3-pustyh-poley-v-fayle-net::heading::1hc65ys",
    "kind": "heading",
    "level": 3,
    "md": "3. Пустых полей в файле нет",
    "text": "3. Пустых полей в файле нет",
    "anchor": "3-pustyh-poley-v-fayle-net"
  },
  {
    "id": "bible::3-pustyh-poley-v-fayle-net::para::1he8hb4",
    "kind": "para",
    "md": "Не едут `undefined`, `null`, `false`, пустая строка и пустой массив ([contentTree.ts:4655](prototype/src/editor-source/source/contentTree.ts:4655)). Поэтому отсутствие поля — это и есть значение: нет `icon` — иконки нет, нет `title` — заголовка нет.",
    "text": "Не едут undefined, null, false, пустая строка и пустой массив (contentTree.ts:4655). Поэтому отсутствие поля — это и есть значение: нет icon — иконки нет, нет title — заголовка нет."
  },
  {
    "id": "bible::3-pustyh-poley-v-fayle-net::para::850pzb",
    "kind": "para",
    "md": "Единственное исключение — `rows` у таблицы. Пустой массив строк едет как есть и означает «строк нет и в источнике». Без поля разработчик решил бы, что строки потерялись при раскладке ([contentTree.ts:4656](prototype/src/editor-source/source/contentTree.ts:4656)).",
    "text": "Единственное исключение — rows у таблицы. Пустой массив строк едет как есть и означает «строк нет и в источнике». Без поля разработчик решил бы, что строки потерялись при раскладке (contentTree.ts:4656)."
  },
  {
    "id": "bible::3-pustyh-poley-v-fayle-net::para::18ne7y8",
    "kind": "para",
    "md": "Второе исключение — `image` в `meta-og`, оно едет пустой строкой, пока нет картинки.",
    "text": "Второе исключение — image в meta-og, оно едет пустой строкой, пока нет картинки."
  },
  {
    "id": "bible::4-sluzhebnyh-poley-net::heading::l9ycex",
    "kind": "heading",
    "level": 3,
    "md": "4. Служебных полей нет",
    "text": "4. Служебных полей нет",
    "anchor": "4-sluzhebnyh-poley-net"
  },
  {
    "id": "bible::4-sluzhebnyh-poley-net::para::xday9x",
    "kind": "para",
    "md": "Всё, что нужно только нашему инструменту, срезается на границе.",
    "text": "Всё, что нужно только нашему инструменту, срезается на границе."
  },
  {
    "id": "bible::4-sluzhebnyh-poley-net::table::p6ce9q",
    "kind": "table",
    "header": [
      "Что срезается",
      "Что это было"
    ],
    "rows": [
      [
        "поле `at`",
        "Адреса блоков источника, из которых собран узел."
      ],
      [
        "поле `join`",
        "Пометка «этот конверт можно склеить с соседним»."
      ],
      [
        "поле `ordered` у `Stack`",
        "Дублировало `marker: \"number\"`."
      ],
      [
        "`anchor` у `Section Container`",
        "Повторял якорь первого заголовка внутри, и у разработчика получались неуникальные id. Убрано по просьбе разработчика 3 августа 2026."
      ],
      [
        "узлы `note` целиком",
        "Пометки редактора для дизайнера."
      ]
    ],
    "text": "Что срезается | Что это было | поле at | Адреса блоков источника, из которых собран узел. | поле join | Пометка «этот конверт можно склеить с соседним». | поле ordered у Stack | Дублировало marker: \"number\". | anchor у Section Container | Повторял якорь первого заголовка внутри, и у разработчика получались неуникальные id. Убрано по просьбе разработчика 3 августа 2026. | узлы note целиком | Пометки редактора для дизайнера."
  },
  {
    "id": "bible::4-sluzhebnyh-poley-net::para::dlk0cj",
    "kind": "para",
    "md": "Якорь у `Heading` при этом едет и нужен: из него разработчик делает id элемента.",
    "text": "Якорь у Heading при этом едет и нужен: из него разработчик делает id элемента."
  },
  {
    "id": "bible::5-tekst-edet-s-tegami-a-ne-v-markdown::heading::1s3z9x2",
    "kind": "heading",
    "level": 3,
    "md": "5. Текст едет с тегами, а не в markdown",
    "text": "5. Текст едет с тегами, а не в markdown",
    "anchor": "5-tekst-edet-s-tegami-a-ne-v-markdown"
  },
  {
    "id": "bible::5-tekst-edet-s-tegami-a-ne-v-markdown::para::fprj0y",
    "kind": "para",
    "md": "Внутри инструмента текст живёт в markdown, но на границе переводится в теги. Звёздочек и квадратных скобок в файле быть не должно — если они там есть, перевод где-то сломался.",
    "text": "Внутри инструмента текст живёт в markdown, но на границе переводится в теги. Звёздочек и квадратных скобок в файле быть не должно — если они там есть, перевод где-то сломался."
  },
  {
    "id": "bible::5-tekst-edet-s-tegami-a-ne-v-markdown::table::3wi5r4",
    "kind": "table",
    "header": [
      "Что было",
      "Что приезжает"
    ],
    "rows": [
      [
        "`**жирный**`",
        "`<b>жирный</b>`"
      ],
      [
        "`*курсив*`",
        "`<i>курсив</i>`"
      ],
      [
        "ссылка наружу",
        "`<a href=\"https://trudvsem.ru/\" rel=\"external\">Службы занятости</a>`"
      ],
      [
        "ссылка внутрь сайта",
        "`<a href=\"/general/quotas\">квоты и господдержка</a>`"
      ],
      [
        "подсказка к термину",
        "`<tooltip title=\"ГИТ\" description=\"Государственная инспекция труда…\">ГИТ</tooltip>`"
      ],
      [
        "перенос строки внутри пункта списка",
        "`<br>`"
      ],
      [
        "несколько абзацев в одном поле",
        "`<p>…</p><p>…</p>`"
      ],
      [
        "перечисление внутри поля",
        "`<ul><li>…</li></ul>`"
      ]
    ],
    "text": "Что было | Что приезжает | жирный | <b>жирный</b> | *курсив* | <i>курсив</i> | ссылка наружу | <a href=\"https://trudvsem.ru/\" rel=\"external\">Службы занятости</a> | ссылка внутрь сайта | <a href=\"/general/quotas\">квоты и господдержка</a> | подсказка к термину | <tooltip title=\"ГИТ\" description=\"Государственная инспекция труда…\">ГИТ</tooltip> | перенос строки внутри пункта списка | <br> | несколько абзацев в одном поле | <p>…</p><p>…</p> | перечисление внутри поля | <ul><li>…</li></ul>"
  },
  {
    "id": "bible::5-tekst-edet-s-tegami-a-ne-v-markdown::para::47s0qm",
    "kind": "para",
    "md": "Теги ставятся только в полях, которые несут текст для читателя: `text`, `question`, `title`, `alt`, `author`, `role`, `org`, `subtitle`, `caption`, `description`, `explanation`, плюс массив `header` у таблицы ([contentTree.ts:4793](prototype/src/editor-source/source/contentTree.ts:4793)).",
    "text": "Теги ставятся только в полях, которые несут текст для читателя: text, question, title, alt, author, role, org, subtitle, caption, description, explanation, плюс массив header у таблицы (contentTree.ts:4793)."
  },
  {
    "id": "bible::5-tekst-edet-s-tegami-a-ne-v-markdown::para::18tun6v",
    "kind": "para",
    "md": "Одиночный абзац едет голой строкой, без `<p>`: тег там нечего отделять от соседа. **У цитаты правило другое** — там абзац обёрнут всегда, даже когда он один, см. раздел `Quote`.",
    "text": "Одиночный абзац едет голой строкой, без <p>: тег там нечего отделять от соседа. У цитаты правило другое — там абзац обёрнут всегда, даже когда он один, см. раздел Quote."
  },
  {
    "id": "bible::5-tekst-edet-s-tegami-a-ne-v-markdown::para::1j769ga",
    "kind": "para",
    "md": "Всё, что не является нашим тегом, экранируется: `&` становится `&amp;`, угловые скобки — `&lt;` и `&gt;`, а внутри атрибутов ещё и кавычка. Разметка вкладывается друг в друга — ссылка внутри жирного разбирается правильно.",
    "text": "Всё, что не является нашим тегом, экранируется: & становится &amp;, угловые скобки — &lt; и &gt;, а внутри атрибутов ещё и кавычка. Разметка вкладывается друг в друга — ссылка внутри жирного разбирается правильно."
  },
  {
    "id": "bible::6-ssylka-naruzhu-s-protokolom-i-s-pometkoy::heading::fz3zm3",
    "kind": "heading",
    "level": 3,
    "md": "6. Ссылка наружу — с протоколом и с пометкой",
    "text": "6. Ссылка наружу — с протоколом и с пометкой",
    "anchor": "6-ssylka-naruzhu-s-protokolom-i-s-pometkoy"
  },
  {
    "id": "bible::6-ssylka-naruzhu-s-protokolom-i-s-pometkoy::para::1cpjjt5",
    "kind": "para",
    "md": "Правило простое и мы держим его с нашей стороны: **внешняя ссылка всегда с протоколом** (`https://…`), **внутренняя всегда путь от корня** (`/general/quotas`). Вдобавок внешняя помечена атрибутом `rel=\"external\"` — по нему разработчик берёт компонент со стрелкой.",
    "text": "Правило простое и мы держим его с нашей стороны: внешняя ссылка всегда с протоколом (https://…), внутренняя всегда путь от корня (/general/quotas). Вдобавок внешняя помечена атрибутом rel=\"external\" — по нему разработчик берёт компонент со стрелкой."
  },
  {
    "id": "bible::6-ssylka-naruzhu-s-protokolom-i-s-pometkoy::para::hslinn",
    "kind": "para",
    "md": "Адрес проходит через белый список протоколов: `http://`, `https://`, `mailto:`, путь от корня и якорь. Всё остальное, включая `javascript:`, ссылкой не становится — текст при этом сохраняется ([safeUrl.ts:9](prototype/src/editor-source/safeUrl.ts:9)).",
    "text": "Адрес проходит через белый список протоколов: http://, https://, mailto:, путь от корня и якорь. Всё остальное, включая javascript:, ссылкой не становится — текст при этом сохраняется (safeUrl.ts:9)."
  },
  {
    "id": "bible::6-ssylka-naruzhu-s-protokolom-i-s-pometkoy::para::1rnbwws",
    "kind": "para",
    "md": "Напоминание про систему, чтобы стрелка не расползлась по тексту: **стрелка означает уход с сайта, пунктир — пояснение термина, обычная ссылка — переход внутри сайта.**",
    "text": "Напоминание про систему, чтобы стрелка не расползлась по тексту: стрелка означает уход с сайта, пунктир — пояснение термина, обычная ссылка — переход внутри сайта."
  },
  {
    "id": "bible::7-ikonka-edet-klyuchom-a-ne-kartinkoy::heading::1vitr9l",
    "kind": "heading",
    "level": 3,
    "md": "7. Иконка едет ключом, а не картинкой",
    "text": "7. Иконка едет ключом, а не картинкой",
    "anchor": "7-ikonka-edet-klyuchom-a-ne-kartinkoy"
  },
  {
    "id": "bible::7-ikonka-edet-klyuchom-a-ne-kartinkoy::para::woq02z",
    "kind": "para",
    "md": "Иконки приезжают каноническими именами Lucide — строчными через дефис, как на [lucide.dev](https://lucide.dev). Разработчик один раз привязывает ключ к своей иконке и переиспользует.",
    "text": "Иконки приезжают каноническими именами Lucide — строчными через дефис, как на lucide.dev. Разработчик один раз привязывает ключ к своей иконке и переиспользует."
  },
  {
    "id": "bible::7-ikonka-edet-klyuchom-a-ne-kartinkoy::para::1dlv9i9",
    "kind": "para",
    "md": "Сейчас в реестре 23 имени:",
    "text": "Сейчас в реестре 23 имени:"
  },
  {
    "id": "bible::7-ikonka-edet-klyuchom-a-ne-kartinkoy::para::1l8ynhe",
    "kind": "para",
    "md": "`file-text` · `scale` · `clock` · `wallet` · `graduation-cap` · `alert-triangle` · `list-checks` · `search` · `message-square` · `shield-check` · `accessibility` · `building-2` · `heart` · `handshake` · `users` · `target` · `lightbulb` · `info` · `link` · `monitor-smartphone` · `ban` · `check` · `x`",
    "text": "file-text · scale · clock · wallet · graduation-cap · alert-triangle · list-checks · search · message-square · shield-check · accessibility · building-2 · heart · handshake · users · target · lightbulb · info · link · monitor-smartphone · ban · check · x"
  },
  {
    "id": "bible::7-ikonka-edet-klyuchom-a-ne-kartinkoy::para::ezhgdv",
    "kind": "para",
    "md": "Список открыт по решению дизайнера: новую иконку Lucide мы берём, когда она нужна, но обязательно заводим в реестре и говорим о ней разработчику. Имя, которого в реестре нет, прототип нарисовать не может — вместо иконки встаёт заглушка, и проверка ловит ровно это ([iconForText.tsx:104](prototype/src/editor-source/source/iconForText.tsx:104)).",
    "text": "Список открыт по решению дизайнера: новую иконку Lucide мы берём, когда она нужна, но обязательно заводим в реестре и говорим о ней разработчику. Имя, которого в реестре нет, прототип нарисовать не может — вместо иконки встаёт заглушка, и проверка ловит ровно это (iconForText.tsx:104)."
  },
  {
    "id": "bible::7-ikonka-edet-klyuchom-a-ne-kartinkoy::para::12t8vwj",
    "kind": "para",
    "md": "**Стикер-иллюстрация устроена так же.** С 17 августа 2026 поле `image` у карточки едет не русским названием сюжета, а слагом: `important`, `example`. Слаг совпадает с именем файла в `figma/illustrations/`, так что картинка заводится по тому же ключу, что и иконка. Полный список сюжетов и их слагов — в разделе `Small Image`.",
    "text": "Стикер-иллюстрация устроена так же. С 17 августа 2026 поле image у карточки едет не русским названием сюжета, а слагом: important, example. Слаг совпадает с именем файла в figma/illustrations/, так что картинка заводится по тому же ключу, что и иконка. Полный список сюжетов и их слагов — в разделе Small Image."
  },
  {
    "id": "bible::7-ikonka-edet-klyuchom-a-ne-kartinkoy::para::ezobik",
    "kind": "para",
    "md": "Если у пункта списка стоит `marker: \"icon\"`, но поля `icon` нет, рисуется галочка.",
    "text": "Если у пункта списка стоит marker: \"icon\", но поля icon нет, рисуется галочка."
  },
  {
    "id": "bible::8-marker-spiska-svoystvo-spiska-a-ne-punkta::heading::1qqdqf6",
    "kind": "heading",
    "level": 3,
    "md": "8. Маркер списка — свойство списка, а не пункта",
    "text": "8. Маркер списка — свойство списка, а не пункта",
    "anchor": "8-marker-spiska-svoystvo-spiska-a-ne-punkta"
  },
  {
    "id": "bible::8-marker-spiska-svoystvo-spiska-a-ne-punkta::para::1kfaa6m",
    "kind": "para",
    "md": "Поля `marker`, `size` и `icon` стоят у контейнера `Stack`, а не у каждого пункта. Пункт состоит только из `component` и `text`.",
    "text": "Поля marker, size и icon стоят у контейнера Stack, а не у каждого пункта. Пункт состоит только из component и text."
  },
  {
    "id": "bible::8-marker-spiska-svoystvo-spiska-a-ne-punkta::code::tw83r6",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Stack\",\n  \"marker\": \"icon\",\n  \"size\": \"L\",\n  \"icon\": \"check\",\n  \"children\": [\n    { \"component\": \"List Item\", \"text\": \"меньше рисков по безопасности,\" },\n    { \"component\": \"List Item\", \"text\": \"набор задач понятнее,\" }\n  ]\n}",
    "text": "{\n  \"component\": \"Stack\",\n  \"marker\": \"icon\",\n  \"size\": \"L\",\n  \"icon\": \"check\",\n  \"children\": [\n    { \"component\": \"List Item\", \"text\": \"меньше рисков по безопасности,\" },\n    { \"component\": \"List Item\", \"text\": \"набор задач понятнее,\" }\n  ]\n}"
  },
  {
    "id": "bible::8-marker-spiska-svoystvo-spiska-a-ne-punkta::para::1bzol7",
    "kind": "para",
    "md": "Маркер и размер поднимаются в контейнер всегда, по первому пункту. Иконка — только если она одинаковая у всех пунктов: в одном списке законно бывают галочка и крестик, и стирать это различие нельзя ([contentTree.ts:4589](prototype/src/editor-source/source/contentTree.ts:4589)).",
    "text": "Маркер и размер поднимаются в контейнер всегда, по первому пункту. Иконка — только если она одинаковая у всех пунктов: в одном списке законно бывают галочка и крестик, и стирать это различие нельзя (contentTree.ts:4589)."
  },
  {
    "id": "bible::kak-sobiraetsya-stranica::heading::1813fvs",
    "kind": "heading",
    "level": 2,
    "md": "Как собирается страница",
    "text": "Как собирается страница",
    "anchor": "kak-sobiraetsya-stranica"
  },
  {
    "id": "bible::kak-sobiraetsya-stranica::para::1ssaib0",
    "kind": "para",
    "md": "Содержимое страницы лежит в `article` и почти всегда состоит из разделов. Порядок такой: вступление, разделы материала, форма мнения, «Читайте также».",
    "text": "Содержимое страницы лежит в article и почти всегда состоит из разделов. Порядок такой: вступление, разделы материала, форма мнения, «Читайте также»."
  },
  {
    "id": "bible::kak-sobiraetsya-stranica::code::mvbkdb",
    "kind": "code",
    "lang": "text",
    "body": "article\n├── Section Container        вступление: первые абзацы, без заголовка H2\n├── Section Container        раздел материала: начинается с Heading H2\n├── Section Container        ещё раздел\n├── Feedback                 форма мнения\n└── Read More                «Читайте также»",
    "text": "article\n├── Section Container        вступление: первые абзацы, без заголовка H2\n├── Section Container        раздел материала: начинается с Heading H2\n├── Section Container        ещё раздел\n├── Feedback                 форма мнения\n└── Read More                «Читайте также»"
  },
  {
    "id": "bible::glavnoe-pravilo-raskladki::heading::fn9u15",
    "kind": "heading",
    "level": 3,
    "md": "Главное правило раскладки",
    "text": "Главное правило раскладки",
    "anchor": "glavnoe-pravilo-raskladki"
  },
  {
    "id": "bible::glavnoe-pravilo-raskladki::para::16gpih6",
    "kind": "para",
    "md": "Это самое важное правило формата, и из него следует, почему в файле так много узлов `Block`.",
    "text": "Это самое важное правило формата, и из него следует, почему в файле так много узлов Block."
  },
  {
    "id": "bible::glavnoe-pravilo-raskladki::quote::hx9l47",
    "kind": "quote",
    "md": "**Проза кладётся прямо в `Section Container`. Всё остальное сначала заворачивается в `Block`.**",
    "text": "Проза кладётся прямо в Section Container. Всё остальное сначала заворачивается в Block."
  },
  {
    "id": "bible::glavnoe-pravilo-raskladki::para::1lkuaj7",
    "kind": "para",
    "md": "Прозой считаются заголовок (`Heading`), абзац (`Text`), акцентная фраза (`Phrase`) и список (`Stack`). Цитата, карточка, таблица, аккордеон, квиз, картинка, видео, пара сравнения — всё это лежит внутри `Block`, даже если блок один. Единственное исключение — кнопка в потоке текста: её ставят через `Card Button` напрямую.",
    "text": "Прозой считаются заголовок (Heading), абзац (Text), акцентная фраза (Phrase) и список (Stack). Цитата, карточка, таблица, аккордеон, квиз, картинка, видео, пара сравнения — всё это лежит внутри Block, даже если блок один. Единственное исключение — кнопка в потоке текста: её ставят через Card Button напрямую."
  },
  {
    "id": "bible::glavnoe-pravilo-raskladki::code::1oyno6t",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Section Container\",\n  \"children\": [\n    { \"component\": \"Heading\", \"level\": \"H2\", \"text\": \"Документы\", \"anchor\": \"dokumenty\" },\n    { \"component\": \"Text\", \"size\": \"L\", \"text\": \"На собеседование стоит взять копию резюме…\" },\n    {\n      \"component\": \"Block\",\n      \"orientation\": \"vertical\",\n      \"children\": [{ \"component\": \"Image\", \"src\": \"/source-media/m5/img2.png\" }]\n    }\n  ]\n}",
    "text": "{\n  \"component\": \"Section Container\",\n  \"children\": [\n    { \"component\": \"Heading\", \"level\": \"H2\", \"text\": \"Документы\", \"anchor\": \"dokumenty\" },\n    { \"component\": \"Text\", \"size\": \"L\", \"text\": \"На собеседование стоит взять копию резюме…\" },\n    {\n      \"component\": \"Block\",\n      \"orientation\": \"vertical\",\n      \"children\": [{ \"component\": \"Image\", \"src\": \"/source-media/m5/img2.png\" }]\n    }\n  ]\n}"
  },
  {
    "id": "bible::glavnoe-pravilo-raskladki::para::p25nzr",
    "kind": "para",
    "md": "Нарушение этого правила ловит проверка `в-секции-без-конверта` ([exportChecks.ts:216](prototype/src/editor-source/site/exportChecks.ts:216)).",
    "text": "Нарушение этого правила ловит проверка в-секции-без-конверта (exportChecks.ts:216)."
  },
  {
    "id": "bible::otstupy-i-shirina::heading::1lvejf2",
    "kind": "heading",
    "level": 3,
    "md": "Отступы и ширина",
    "text": "Отступы и ширина",
    "anchor": "otstupy-i-shirina"
  },
  {
    "id": "bible::otstupy-i-shirina::para::7nb9pi",
    "kind": "para",
    "md": "Отступы уже внутри компонентов, и добавлять свои не нужно — удвоятся. Отступы только сверху, нижних нет ни у кого: расстояние между блоками задаёт следующий блок, а не предыдущий.",
    "text": "Отступы уже внутри компонентов, и добавлять свои не нужно — удвоятся. Отступы только сверху, нижних нет ни у кого: расстояние между блоками задаёт следующий блок, а не предыдущий."
  },
  {
    "id": "bible::otstupy-i-shirina::para::1w8hg6b",
    "kind": "para",
    "md": "Ширина не является свойством компонента. Компоненты резиновые, ширину задаёт родитель — колонка контента, карточка, половина сравнения.",
    "text": "Ширина не является свойством компонента. Компоненты резиновые, ширину задаёт родитель — колонка контента, карточка, половина сравнения."
  },
  {
    "id": "bible::katalog-tekst-i-spiski::heading::1ex740c",
    "kind": "heading",
    "level": 2,
    "md": "Каталог: текст и списки",
    "text": "Каталог: текст и списки",
    "anchor": "katalog-tekst-i-spiski"
  },
  {
    "id": "bible::heading::heading::1xz14fp",
    "kind": "heading",
    "level": 3,
    "md": "Heading",
    "text": "Heading",
    "anchor": "heading"
  },
  {
    "id": "bible::heading::para::tv9fii",
    "kind": "para",
    "md": "Заголовок раздела. Заголовка первого уровня в наборе нет: главный заголовок страницы едет отдельным полем `h1` и внутри `article` не встречается.",
    "text": "Заголовок раздела. Заголовка первого уровня в наборе нет: главный заголовок страницы едет отдельным полем h1 и внутри article не встречается."
  },
  {
    "id": "bible::heading::table::ceiiro",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Heading\"`",
        "да",
        ""
      ],
      [
        "`level`",
        "`H2` · `H3` · `H4` · `H5`",
        "да",
        "Уровень от крупного к мелкому. Разрыв между `H2` и `H3` большой, `H4` и `H5` на глаз почти не различаются."
      ],
      [
        "`text`",
        "строка с тегами",
        "да",
        "Текст заголовка."
      ],
      [
        "`anchor`",
        "строка из латинских букв, цифр и дефисов",
        "да",
        "Из него разработчик делает id элемента, по нему работает оглавление страницы. Уникален в пределах страницы."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Heading\" | да |  | level | H2 · H3 · H4 · H5 | да | Уровень от крупного к мелкому. Разрыв между H2 и H3 большой, H4 и H5 на глаз почти не различаются. | text | строка с тегами | да | Текст заголовка. | anchor | строка из латинских букв, цифр и дефисов | да | Из него разработчик делает id элемента, по нему работает оглавление страницы. Уникален в пределах страницы."
  },
  {
    "id": "bible::heading::code::c78itc",
    "kind": "code",
    "lang": "json",
    "body": "{ \"component\": \"Heading\", \"level\": \"H3\", \"text\": \"НКО\", \"anchor\": \"nko\" }",
    "text": "{ \"component\": \"Heading\", \"level\": \"H3\", \"text\": \"НКО\", \"anchor\": \"nko\" }"
  },
  {
    "id": "bible::heading::para::bofkt3",
    "kind": "para",
    "md": "Якорь есть у всех 598 заголовков в выгрузке. Пустой якорь, якорь не латиницей и повтор якоря на одной странице ловятся проверками.",
    "text": "Якорь есть у всех 598 заголовков в выгрузке. Пустой якорь, якорь не латиницей и повтор якоря на одной странице ловятся проверками."
  },
  {
    "id": "bible::heading::para::1e0eceh",
    "kind": "para",
    "md": "Раздел страницы начинается с `H2`, и он же попадает в оглавление справа.",
    "text": "Раздел страницы начинается с H2, и он же попадает в оглавление справа."
  },
  {
    "id": "bible::text::heading::h8361q",
    "kind": "heading",
    "level": 3,
    "md": "Text",
    "text": "Text",
    "anchor": "text"
  },
  {
    "id": "bible::text::para::ujaoa8",
    "kind": "para",
    "md": "Абзац прозы. Единственный компонент, которым набирается основной текст.",
    "text": "Абзац прозы. Единственный компонент, которым набирается основной текст."
  },
  {
    "id": "bible::text::table::1exu73z",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Text\"`",
        "да",
        ""
      ],
      [
        "`size`",
        "`L` · `M` · `S`",
        "да",
        "Размер по смыслу, а не по вкусу."
      ],
      [
        "`text`",
        "строка с тегами",
        "да",
        ""
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Text\" | да |  | size | L · M · S | да | Размер по смыслу, а не по вкусу. | text | строка с тегами | да | "
  },
  {
    "id": "bible::text::table::gxvhx9",
    "kind": "table",
    "header": [
      "Размер",
      "Когда берут",
      "Сколько в выгрузке"
    ],
    "rows": [
      [
        "`L`",
        "Основной текст, значение по умолчанию.",
        "1831"
      ],
      [
        "`M`",
        "Пояснения, второстепенное, текст внутри карточек и ячеек таблицы.",
        "345"
      ],
      [
        "`S`",
        "Сноски, подписи, дисклеймеры.",
        "не встречается"
      ]
    ],
    "text": "Размер | Когда берут | Сколько в выгрузке | L | Основной текст, значение по умолчанию. | 1831 | M | Пояснения, второстепенное, текст внутри карточек и ячеек таблицы. | 345 | S | Сноски, подписи, дисклеймеры. | не встречается"
  },
  {
    "id": "bible::text::para::12biqm3",
    "kind": "para",
    "md": "**Размера `XL` больше нет.** До 15 августа 2026 он стоял у первого абзаца вступления и назывался лидом — по одному на страницу, двадцать два на весь сайт. Дизайнер решил, что крупного абзаца на сайте не будет: вступление читается тем же кеглем, что и остальная проза. Все двадцать два блока переехали в `L`. Если в старой выгрузке вам попадётся `\"size\": \"XL\"` — это до-августовский файл, собирайте такой блок как `L`.",
    "text": "Размера XL больше нет. До 15 августа 2026 он стоял у первого абзаца вступления и назывался лидом — по одному на страницу, двадцать два на весь сайт. Дизайнер решил, что крупного абзаца на сайте не будет: вступление читается тем же кеглем, что и остальная проза. Все двадцать два блока переехали в L. Если в старой выгрузке вам попадётся \"size\": \"XL\" — это до-августовский файл, собирайте такой блок как L."
  },
  {
    "id": "bible::text::code::zxjdge",
    "kind": "code",
    "lang": "json",
    "body": "{ \"component\": \"Text\", \"size\": \"L\", \"text\": \"Если вы только начинаете заниматься инклюзивным наймом…\" }",
    "text": "{ \"component\": \"Text\", \"size\": \"L\", \"text\": \"Если вы только начинаете заниматься инклюзивным наймом…\" }"
  },
  {
    "id": "bible::phrase::heading::xawfvs",
    "kind": "heading",
    "level": 3,
    "md": "Phrase",
    "text": "Phrase",
    "anchor": "phrase"
  },
  {
    "id": "bible::phrase::para::1lcibw6",
    "kind": "para",
    "md": "Акцентная фраза-врезка: курсив с вертикальной чертой слева. Это не цитата — автора у неё нет. Так выделяют мысль или инструкцию прямо в потоке текста.",
    "text": "Акцентная фраза-врезка: курсив с вертикальной чертой слева. Это не цитата — автора у неё нет. Так выделяют мысль или инструкцию прямо в потоке текста."
  },
  {
    "id": "bible::phrase::table::lh19t1",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз."
    ],
    "rows": [
      [
        "`component`",
        "`\"Phrase\"`",
        "да"
      ],
      [
        "`size`",
        "`L` · `M`",
        "да"
      ],
      [
        "`text`",
        "строка с тегами",
        "да"
      ]
    ],
    "text": "Поле | Значения | Обяз. | component | \"Phrase\" | да | size | L · M | да | text | строка с тегами | да"
  },
  {
    "id": "bible::phrase::para::1j9y1fj",
    "kind": "para",
    "md": "В выгрузке шесть штук, все размера `L`. Как и проза, кладётся прямо в `Section Container`.",
    "text": "В выгрузке шесть штук, все размера L. Как и проза, кладётся прямо в Section Container."
  },
  {
    "id": "bible::stack::heading::28es2n",
    "kind": "heading",
    "level": 3,
    "md": "Stack",
    "text": "Stack",
    "anchor": "stack"
  },
  {
    "id": "bible::stack::para::1p6ngez",
    "kind": "para",
    "md": "Вертикальный стек с равным шагом. Обычно это список, но внутри бывают и другие блоки — например две цитаты подряд. Кладётся куда угодно: в раздел, в карточку, в аккордеон, в половину сравнения.",
    "text": "Вертикальный стек с равным шагом. Обычно это список, но внутри бывают и другие блоки — например две цитаты подряд. Кладётся куда угодно: в раздел, в карточку, в аккордеон, в половину сравнения."
  },
  {
    "id": "bible::stack::table::16oytdj",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Stack\"`",
        "да",
        ""
      ],
      [
        "`marker`",
        "`dot` · `icon` · `number`",
        "да",
        "Маркер пунктов. Точка — 418 списков, иконка — 10, номер — 7."
      ],
      [
        "`size`",
        "`L` · `M`",
        "да",
        "Размер пунктов."
      ],
      [
        "`icon`",
        "ключ Lucide",
        "нет",
        "Только при `marker: \"icon\"`. Если поля нет — галочка."
      ],
      [
        "`children`",
        "массив узлов",
        "да",
        "Обычно `List Item`."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Stack\" | да |  | marker | dot · icon · number | да | Маркер пунктов. Точка — 418 списков, иконка — 10, номер — 7. | size | L · M | да | Размер пунктов. | icon | ключ Lucide | нет | Только при marker: \"icon\". Если поля нет — галочка. | children | массив узлов | да | Обычно List Item."
  },
  {
    "id": "bible::stack::code::18r4nln",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Stack\",\n  \"marker\": \"dot\",\n  \"size\": \"L\",\n  \"children\": [\n    { \"component\": \"List Item\", \"text\": \"есть ли в городе филиалы крупных компаний;\" },\n    { \"component\": \"List Item\", \"text\": \"какие отрасли наиболее развиты;\" }\n  ]\n}",
    "text": "{\n  \"component\": \"Stack\",\n  \"marker\": \"dot\",\n  \"size\": \"L\",\n  \"children\": [\n    { \"component\": \"List Item\", \"text\": \"есть ли в городе филиалы крупных компаний;\" },\n    { \"component\": \"List Item\", \"text\": \"какие отрасли наиболее развиты;\" }\n  ]\n}"
  },
  {
    "id": "bible::stack::para::1mb3ii8",
    "kind": "para",
    "md": "При `marker: \"number\"` нумерацию считает разработчик у себя — номера в данных не приезжают.",
    "text": "При marker: \"number\" нумерацию считает разработчик у себя — номера в данных не приезжают."
  },
  {
    "id": "bible::list-item::heading::eqvp6c",
    "kind": "heading",
    "level": 3,
    "md": "List Item",
    "text": "List Item",
    "anchor": "list-item"
  },
  {
    "id": "bible::list-item::para::6ynbux",
    "kind": "para",
    "md": "Пункт списка. В файле у него ровно два поля: маркер, размер и иконка живут у контейнера.",
    "text": "Пункт списка. В файле у него ровно два поля: маркер, размер и иконка живут у контейнера."
  },
  {
    "id": "bible::list-item::table::1wqm7ka",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз."
    ],
    "rows": [
      [
        "`component`",
        "`\"List Item\"`",
        "да"
      ],
      [
        "`text`",
        "строка с тегами",
        "да"
      ]
    ],
    "text": "Поле | Значения | Обяз. | component | \"List Item\" | да | text | строка с тегами | да"
  },
  {
    "id": "bible::list-item::code::1r5rwnn",
    "kind": "code",
    "lang": "json",
    "body": "{ \"component\": \"List Item\", \"text\": \"ИНН;\" }",
    "text": "{ \"component\": \"List Item\", \"text\": \"ИНН;\" }"
  },
  {
    "id": "bible::list-item::para::11kohuc",
    "kind": "para",
    "md": "Перенос строки внутри пункта приезжает тегом `<br>`: перенос значащий (ссылка, а следом описание), но пункт остаётся одним пунктом.",
    "text": "Перенос строки внутри пункта приезжает тегом <br>: перенос значащий (ссылка, а следом описание), но пункт остаётся одним пунктом."
  },
  {
    "id": "bible::katalog-konteynery::heading::u4mjq1",
    "kind": "heading",
    "level": 2,
    "md": "Каталог: контейнеры",
    "text": "Каталог: контейнеры",
    "anchor": "katalog-konteynery"
  },
  {
    "id": "bible::section-container::heading::3abg17",
    "kind": "heading",
    "level": 3,
    "md": "Section Container",
    "text": "Section Container",
    "anchor": "section-container"
  },
  {
    "id": "bible::section-container::para::17hqj8l",
    "kind": "para",
    "md": "Каркас смыслового раздела. Сам не рисует ничего — ни фона, ни рамки. Его работа в том, чтобы отбить раздел сверху и держать колонку. Один раздел страницы — один `Section Container`.",
    "text": "Каркас смыслового раздела. Сам не рисует ничего — ни фона, ни рамки. Его работа в том, чтобы отбить раздел сверху и держать колонку. Один раздел страницы — один Section Container."
  },
  {
    "id": "bible::section-container::table::10i0drg",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз."
    ],
    "rows": [
      [
        "`component`",
        "`\"Section Container\"`",
        "да"
      ],
      [
        "`children`",
        "массив узлов",
        "да"
      ]
    ],
    "text": "Поле | Значения | Обяз. | component | \"Section Container\" | да | children | массив узлов | да"
  },
  {
    "id": "bible::section-container::para::1qxiiu5",
    "kind": "para",
    "md": "Якоря у раздела в файле нет: он повторял якорь первого заголовка внутри, и id получались неуникальными.",
    "text": "Якоря у раздела в файле нет: он повторял якорь первого заголовка внутри, и id получались неуникальными."
  },
  {
    "id": "bible::block::heading::1gg5fya",
    "kind": "heading",
    "level": 3,
    "md": "Block",
    "text": "Block",
    "anchor": "block"
  },
  {
    "id": "bible::block::para::lwmdep",
    "kind": "para",
    "md": "Универсальный конверт для всего, что не проза. Это не «обёртка для карточек»: в него заворачивают цитату, таблицу, картинку, аккордеон, квиз — всё, кроме заголовков, абзацев, фраз и списков. Обязателен даже вокруг одного блока.",
    "text": "Универсальный конверт для всего, что не проза. Это не «обёртка для карточек»: в него заворачивают цитату, таблицу, картинку, аккордеон, квиз — всё, кроме заголовков, абзацев, фраз и списков. Обязателен даже вокруг одного блока."
  },
  {
    "id": "bible::block::table::v9mlhy",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Block\"`",
        "да",
        ""
      ],
      [
        "`orientation`",
        "`vertical` · `horizontal`",
        "да",
        "Столбиком или в ряд с переносом. Ряд карточек и ряд людей собираются горизонтальным блоком."
      ],
      [
        "`children`",
        "массив узлов",
        "да",
        ""
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Block\" | да |  | orientation | vertical · horizontal | да | Столбиком или в ряд с переносом. Ряд карточек и ряд людей собираются горизонтальным блоком. | children | массив узлов | да | "
  },
  {
    "id": "bible::block::para::1ifjvlr",
    "kind": "para",
    "md": "В выгрузке 194 блока, из них горизонтальных всего два.",
    "text": "В выгрузке 194 блока, из них горизонтальных всего два."
  },
  {
    "id": "bible::block::para::1ji3txm",
    "kind": "para",
    "md": "В Figma компонент пока называется `Card Container`. Переименование в `Block` согласовано с разработчиком 30 июля 2026, в макете правка ещё не сделана. То же самое со `Stack` — в Figma он пока `List Container`.",
    "text": "В Figma компонент пока называется Card Container. Переименование в Block согласовано с разработчиком 30 июля 2026, в макете правка ещё не сделана. То же самое со Stack — в Figma он пока List Container."
  },
  {
    "id": "bible::page-summary::heading::rvngfi",
    "kind": "heading",
    "level": 3,
    "md": "Page Summary",
    "text": "Page Summary",
    "anchor": "page-summary"
  },
  {
    "id": "bible::page-summary::para::180v19n",
    "kind": "para",
    "md": "Зелёная карточка-анонс «На этой странице вы узнаете» со списком тем.",
    "text": "Зелёная карточка-анонс «На этой странице вы узнаете» со списком тем."
  },
  {
    "id": "bible::page-summary::para::6zmkp1",
    "kind": "para",
    "md": "**В выгрузке её сейчас нет ни на одной странице.** Блок убрали со страниц, но сборка сохранена и формат зафиксирован — если решим вернуть, он появится в файле в таком виде ([pageStructure.ts:177](prototype/src/editor-source/site/pageStructure.ts:177)):",
    "text": "В выгрузке её сейчас нет ни на одной странице. Блок убрали со страниц, но сборка сохранена и формат зафиксирован — если решим вернуть, он появится в файле в таком виде (pageStructure.ts:177):"
  },
  {
    "id": "bible::page-summary::code::ga71pn",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Page Summary\",\n  \"marker\": \"dot\",\n  \"size\": \"L\",\n  \"children\": [{ \"component\": \"List Item\", \"text\": \"…\" }]\n}",
    "text": "{\n  \"component\": \"Page Summary\",\n  \"marker\": \"dot\",\n  \"size\": \"L\",\n  \"children\": [{ \"component\": \"List Item\", \"text\": \"…\" }]\n}"
  },
  {
    "id": "bible::page-summary::para::15qxsft",
    "kind": "para",
    "md": "Поля `marker`, `size` и `icon` поднимаются в него из пунктов так же, как у `Stack`.",
    "text": "Поля marker, size и icon поднимаются в него из пунктов так же, как у Stack."
  },
  {
    "id": "bible::katalog-kartochki-i-vrezki::heading::15ahub6",
    "kind": "heading",
    "level": 2,
    "md": "Каталог: карточки и врезки",
    "text": "Каталог: карточки и врезки",
    "anchor": "katalog-kartochki-i-vrezki"
  },
  {
    "id": "bible::general-card::heading::1bn2w37",
    "kind": "heading",
    "level": 3,
    "md": "General Card",
    "text": "General Card",
    "anchor": "general-card"
  },
  {
    "id": "bible::general-card::para::4y5c88",
    "kind": "para",
    "md": "Универсальная карточка на цветном фоне. Так вынимают кусок смысла из сплошного текста: шаг инструкции, важное замечание, пример. Берут, когда фрагменты равнозначны и их удобно сравнивать взглядом. Не берут для обычной последовательной прозы — карточка рвёт чтение.",
    "text": "Универсальная карточка на цветном фоне. Так вынимают кусок смысла из сплошного текста: шаг инструкции, важное замечание, пример. Берут, когда фрагменты равнозначны и их удобно сравнивать взглядом. Не берут для обычной последовательной прозы — карточка рвёт чтение."
  },
  {
    "id": "bible::general-card::table::alrudj",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"General Card\"`",
        "да",
        ""
      ],
      [
        "`orientation`",
        "`vertical` · `horizontal`",
        "да",
        "В выгрузке все 122 карточки вертикальные: ряд карточек собирается горизонтальным `Block`, а сами карточки при этом остаются вертикальными."
      ],
      [
        "`bgColor`",
        "`blue` · `yellow` · `pink` · `green` · `white` · `beige` · `gray`",
        "да",
        "Цвет фона со смыслом, см. таблицу ниже."
      ],
      [
        "`title`",
        "строка с тегами",
        "нет по формату, но есть у всех",
        "Заголовок карточки. Карточка без заголовка почти всегда означает, что заголовок остался первым абзацем внутри — на это ругается проверка."
      ],
      [
        "`icon`",
        "ключ Lucide",
        "нет",
        "Круг с иконкой. Есть у 14 карточек из 122."
      ],
      [
        "`image`",
        "слаг сюжета",
        "нет",
        "Иллюстрация-стикер в углу. Это слаг сюжета из набора `Small Image` (`important`, `example`), он же имя файла картинки. Есть у 66 карточек."
      ],
      [
        "`children`",
        "массив узлов",
        "да",
        "Внутрь кладут `Text`, `Stack`, кнопку."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"General Card\" | да |  | orientation | vertical · horizontal | да | В выгрузке все 122 карточки вертикальные: ряд карточек собирается горизонтальным Block, а сами карточки при этом остаются вертикальными. | bgColor | blue · yellow · pink · green · white · beige · gray | да | Цвет фона со смыслом, см. таблицу ниже. | title | строка с тегами | нет по формату, но есть у всех | Заголовок карточки. Карточка без заголовка почти всегда означает, что заголовок остался первым абзацем внутри — на это ругается проверка. | icon | ключ Lucide | нет | Круг с иконкой. Есть у 14 карточек из 122. | image | слаг сюжета | нет | Иллюстрация-стикер в углу. Это слаг сюжета из набора Small Image (important, example), он же имя файла картинки. Есть у 66 карточек. | children | массив узлов | да | Внутрь кладут Text, Stack, кнопку."
  },
  {
    "id": "bible::general-card::table::t09o7c",
    "kind": "table",
    "header": [
      "Цвет",
      "Смысл"
    ],
    "rows": [
      [
        "`blue`",
        "Обычная карточка, значение по умолчанию. Встречается 74 раза."
      ],
      [
        "`yellow`",
        "Важное. 34 раза."
      ],
      [
        "`pink`",
        "Очень важное, опасное, предупреждающее. 3 раза."
      ],
      [
        "`green`",
        "Радостное, позитивное. 6 раз."
      ],
      [
        "`beige` · `white` · `gray`",
        "Нейтральные, без закреплённого смысла. `beige` встречается 5 раз, остальные пока не встречаются."
      ]
    ],
    "text": "Цвет | Смысл | blue | Обычная карточка, значение по умолчанию. Встречается 74 раза. | yellow | Важное. 34 раза. | pink | Очень важное, опасное, предупреждающее. 3 раза. | green | Радостное, позитивное. 6 раз. | beige · white · gray | Нейтральные, без закреплённого смысла. beige встречается 5 раз, остальные пока не встречаются."
  },
  {
    "id": "bible::general-card::para::1o9qvtu",
    "kind": "para",
    "md": "Белая карточка на белом фоне не читается как блок, поэтому `white` уместен только на тонированной подложке — внутри аккордеона.",
    "text": "Белая карточка на белом фоне не читается как блок, поэтому white уместен только на тонированной подложке — внутри аккордеона."
  },
  {
    "id": "bible::general-card::code::1t348l",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"General Card\",\n  \"orientation\": \"vertical\",\n  \"bgColor\": \"blue\",\n  \"icon\": \"building-2\",\n  \"title\": \"Работа с работодателями\",\n  \"children\": [\n    { \"component\": \"Text\", \"size\": \"L\", \"text\": \"Поиск и обсуждение вакансий, коммуникация с компаниями\" }\n  ]\n}",
    "text": "{\n  \"component\": \"General Card\",\n  \"orientation\": \"vertical\",\n  \"bgColor\": \"blue\",\n  \"icon\": \"building-2\",\n  \"title\": \"Работа с работодателями\",\n  \"children\": [\n    { \"component\": \"Text\", \"size\": \"L\", \"text\": \"Поиск и обсуждение вакансий, коммуникация с компаниями\" }\n  ]\n}"
  },
  {
    "id": "bible::quote::heading::p6etfb",
    "kind": "heading",
    "level": 3,
    "md": "Quote",
    "text": "Quote",
    "anchor": "quote"
  },
  {
    "id": "bible::quote::para::1s7edac",
    "kind": "para",
    "md": "Карточка прямой речи: реальная цитата человека с именем и должностью. Берут там, где есть конкретный автор. Для обезличенных мыслей и лозунгов берут обычную карточку или `Phrase`.",
    "text": "Карточка прямой речи: реальная цитата человека с именем и должностью. Берут там, где есть конкретный автор. Для обезличенных мыслей и лозунгов берут обычную карточку или Phrase."
  },
  {
    "id": "bible::quote::table::1du6yb3",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Quote\"`",
        "да",
        ""
      ],
      [
        "`size`",
        "`L` · `S`",
        "да",
        "Размер задаёт место, а не желание: в тексте страницы цитата всегда `L`, внутри аккордеона — всегда `S`. В выгрузке все 37 цитат размера `L`."
      ],
      [
        "`text`",
        "строка с тегами",
        "да",
        "Речь целиком: абзацы в `<p>`, перечисления в `<ul><li>`."
      ],
      [
        "`author`",
        "строка",
        "нет",
        "Имя."
      ],
      [
        "`role`",
        "строка",
        "нет",
        "Должность."
      ],
      [
        "`org`",
        "строка",
        "нет",
        "Организация. Уходит в подпись логотипа, поэтому пишется именем, а не куском фразы."
      ],
      [
        "`logo`",
        "имя файла без расширения",
        "нет",
        "Логотип организации."
      ],
      [
        "`photo`",
        "имя файла без расширения",
        "нет",
        "Портрет автора."
      ],
      [
        "`noPhoto`",
        "`true`",
        "нет",
        "Фото не будет и не появится — решение по конкретной цитате. Отличается от «фото ещё не нашли»: там на месте портрета стоит кружок-заглушка, а здесь и кружок лишний."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Quote\" | да |  | size | L · S | да | Размер задаёт место, а не желание: в тексте страницы цитата всегда L, внутри аккордеона — всегда S. В выгрузке все 37 цитат размера L. | text | строка с тегами | да | Речь целиком: абзацы в <p>, перечисления в <ul><li>. | author | строка | нет | Имя. | role | строка | нет | Должность. | org | строка | нет | Организация. Уходит в подпись логотипа, поэтому пишется именем, а не куском фразы. | logo | имя файла без расширения | нет | Логотип организации. | photo | имя файла без расширения | нет | Портрет автора. | noPhoto | true | нет | Фото не будет и не появится — решение по конкретной цитате. Отличается от «фото ещё не нашли»: там на месте портрета стоит кружок-заглушка, а здесь и кружок лишний."
  },
  {
    "id": "bible::quote::para::1f7tn9n",
    "kind": "para",
    "md": "**Логотип и фото едут именами файлов, а не адресами.** Разработчик забирает картинки с прототипа: логотипы лежат в `figma/logos/<logo>.png`, портреты в `figma/avatars/<photo>.jpg` (квадрат 400 на 400 точек). Ссылок в выгрузке нет намеренно — иначе пришлось бы держать два разных правила сборки адреса.",
    "text": "Логотип и фото едут именами файлов, а не адресами. Разработчик забирает картинки с прототипа: логотипы лежат в figma/logos/<logo>.png, портреты в figma/avatars/<photo>.jpg (квадрат 400 на 400 точек). Ссылок в выгрузке нет намеренно — иначе пришлось бы держать два разных правила сборки адреса."
  },
  {
    "id": "bible::quote::code::8ivzoc",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Quote\",\n  \"size\": \"L\",\n  \"author\": \"Ксения Ломакина\",\n  \"role\": \"дизайнер продукта на коляске в HR Tech Яндекса\",\n  \"org\": \"Яндекс\",\n  \"logo\": \"yandex\",\n  \"photo\": \"kseniya-lomakina\",\n  \"text\": \"<p>Обычно достаточно общаться с людьми на коляске так же, как с любыми другими людьми.</p>\"\n}",
    "text": "{\n  \"component\": \"Quote\",\n  \"size\": \"L\",\n  \"author\": \"Ксения Ломакина\",\n  \"role\": \"дизайнер продукта на коляске в HR Tech Яндекса\",\n  \"org\": \"Яндекс\",\n  \"logo\": \"yandex\",\n  \"photo\": \"kseniya-lomakina\",\n  \"text\": \"<p>Обычно достаточно общаться с людьми на коляске так же, как с любыми другими людьми.</p>\"\n}"
  },
  {
    "id": "bible::quote::para::1tcr0e7",
    "kind": "para",
    "md": "**Речь едет одним полем `text`.** До 17 августа 2026 у цитаты был массив `paragraphs` — по абзацу на строку, — и цитата оставалась единственным компонентом со своим устройством текста. Разработчик попросил привести её к общему виду.",
    "text": "Речь едет одним полем text. До 17 августа 2026 у цитаты был массив paragraphs — по абзацу на строку, — и цитата оставалась единственным компонентом со своим устройством текста. Разработчик попросил привести её к общему виду."
  },
  {
    "id": "bible::quote::para::zxlozs",
    "kind": "para",
    "md": "**Абзац речи ВСЕГДА обёрнут в `<p>`, даже когда он один.** Это исключение из сквозного правила: у остальных полей одна фраза едет голой строкой, а теги появляются, только когда есть что разделять. У цитаты так не годится. Из 41 цитаты 10 состоят ровно из одного абзаца, и они уезжали без единого тега, а остальные 31 приезжали с тегами — вставлять речь одним движением было нельзя, каждый раз приходилось смотреть, что пришло на этот раз. Теперь у всех 41 текст начинается с тега.",
    "text": "Абзац речи ВСЕГДА обёрнут в <p>, даже когда он один. Это исключение из сквозного правила: у остальных полей одна фраза едет голой строкой, а теги появляются, только когда есть что разделять. У цитаты так не годится. Из 41 цитаты 10 состоят ровно из одного абзаца, и они уезжали без единого тега, а остальные 31 приезжали с тегами — вставлять речь одним движением было нельзя, каждый раз приходилось смотреть, что пришло на этот раз. Теперь у всех 41 текст начинается с тега."
  },
  {
    "id": "bible::quote::para::15fi05y",
    "kind": "para",
    "md": "Цитата в несколько абзацев со списком внутри выглядит так:",
    "text": "Цитата в несколько абзацев со списком внутри выглядит так:"
  },
  {
    "id": "bible::quote::code::5qg1yy",
    "kind": "code",
    "lang": "json",
    "body": "\"text\": \"<p>Главное — не бойтесь. Если я не поняла, переспрошу.</p><p>Совета всего три:</p><ul><li>смотрите прямо в лицо при разговоре;</li><li>не кричите, лучше говорите чуть медленнее и чётче;</li></ul>\"",
    "text": "\"text\": \"<p>Главное — не бойтесь. Если я не поняла, переспрошу.</p><p>Совета всего три:</p><ul><li>смотрите прямо в лицо при разговоре;</li><li>не кричите, лучше говорите чуть медленнее и чётче;</li></ul>\""
  },
  {
    "id": "bible::quote::para::6x8hle",
    "kind": "para",
    "md": "**По замыслу у цитаты есть всё: имя, должность, организация и логотип.** Цитата без логотипа не задумана — либо логотип организации, либо знак Яндекса. Но по факту на сегодня три цитаты из 37 неполные. У двух нет логотипа, потому что мы не нашли его файл. У третьей нет ни имени, ни организации, ни логотипа: на странице «Инклюзивное трудоустройство» говорит не человек, а фонд ОРБИ, и подписью работает название фонда. Проверка на эти цитаты ругается, и это честное состояние дел, а не особенность формата.",
    "text": "По замыслу у цитаты есть всё: имя, должность, организация и логотип. Цитата без логотипа не задумана — либо логотип организации, либо знак Яндекса. Но по факту на сегодня три цитаты из 37 неполные. У двух нет логотипа, потому что мы не нашли его файл. У третьей нет ни имени, ни организации, ни логотипа: на странице «Инклюзивное трудоустройство» говорит не человек, а фонд ОРБИ, и подписью работает название фонда. Проверка на эти цитаты ругается, и это честное состояние дел, а не особенность формата."
  },
  {
    "id": "bible::quote::para::10wb3py",
    "kind": "para",
    "md": "Длинная цитата на странице обрезается с многоточием и раскрывается ссылкой «Далее». В данных этого нет — обрезку делает компонент.",
    "text": "Длинная цитата на странице обрезается с многоточием и раскрывается ссылкой «Далее». В данных этого нет — обрезку делает компонент."
  },
  {
    "id": "bible::accordion::heading::1js6ugp",
    "kind": "heading",
    "level": 3,
    "md": "Accordion",
    "text": "Accordion",
    "anchor": "accordion"
  },
  {
    "id": "bible::accordion::para::1r2kj9x",
    "kind": "para",
    "md": "Свёрнутый блок «вопрос — ответ». Берут, когда контента много, а читателю нужен не весь: частые вопросы, возражения, длинные оговорки. Не берут для того, что читатель обязан прочесть — свёрнутое не читают.",
    "text": "Свёрнутый блок «вопрос — ответ». Берут, когда контента много, а читателю нужен не весь: частые вопросы, возражения, длинные оговорки. Не берут для того, что читатель обязан прочесть — свёрнутое не читают."
  },
  {
    "id": "bible::accordion::table::1n6zgbk",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Accordion\"`",
        "да",
        ""
      ],
      [
        "`state`",
        "`collapsed` · `expanded`",
        "да",
        "Состояние при загрузке страницы. Все 40 аккордеонов в выгрузке свёрнуты."
      ],
      [
        "`question`",
        "строка с тегами",
        "да",
        "Строка-вопрос, которая видна всегда."
      ],
      [
        "`children`",
        "массив узлов",
        "да",
        "Ответ."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Accordion\" | да |  | state | collapsed · expanded | да | Состояние при загрузке страницы. Все 40 аккордеонов в выгрузке свёрнуты. | question | строка с тегами | да | Строка-вопрос, которая видна всегда. | children | массив узлов | да | Ответ."
  },
  {
    "id": "bible::accordion::code::z93png",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Accordion\",\n  \"state\": \"collapsed\",\n  \"question\": \"С людьми с инвалидностью стоит обращаться на равных…\",\n  \"children\": [\n    { \"component\": \"Text\", \"size\": \"M\", \"text\": \"<b>Это правда</b>\" },\n    { \"component\": \"Text\", \"size\": \"M\", \"text\": \"Равное отношение — основа инклюзивной среды.\" }\n  ]\n}",
    "text": "{\n  \"component\": \"Accordion\",\n  \"state\": \"collapsed\",\n  \"question\": \"С людьми с инвалидностью стоит обращаться на равных…\",\n  \"children\": [\n    { \"component\": \"Text\", \"size\": \"M\", \"text\": \"<b>Это правда</b>\" },\n    { \"component\": \"Text\", \"size\": \"M\", \"text\": \"Равное отношение — основа инклюзивной среды.\" }\n  ]\n}"
  },
  {
    "id": "bible::accordion::para::1hir4nq",
    "kind": "para",
    "md": "Внутри аккордеона заголовков нет: подписи вроде «Как действовать» приезжают жирной строкой обычного текста. Настоящий заголовок здесь один — сам вопрос.",
    "text": "Внутри аккордеона заголовков нет: подписи вроде «Как действовать» приезжают жирной строкой обычного текста. Настоящий заголовок здесь один — сам вопрос."
  },
  {
    "id": "bible::accordion::para::7v3yqm",
    "kind": "para",
    "md": "Карточка внутри аккордеона белая и лежит в `Stack`. У аккордеона свой тонированный фон, и цветная карточка на нём спорит с фоном.",
    "text": "Карточка внутри аккордеона белая и лежит в Stack. У аккордеона свой тонированный фон, и цветная карточка на нём спорит с фоном."
  },
  {
    "id": "bible::prompt::heading::1lmzxp7",
    "kind": "heading",
    "level": 3,
    "md": "Prompt",
    "text": "Prompt",
    "anchor": "prompt"
  },
  {
    "id": "bible::prompt::para::rt7484",
    "kind": "para",
    "md": "Врезка с готовым текстом, который читатель заберёт себе: формулировка для договора, шаблон запроса, промпт для нейросети. Суть не в тексте, а в паре «предупреждение плюс кнопка Скопировать»: отдаём сырьё и сразу говорим, что вслепую применять нельзя.",
    "text": "Врезка с готовым текстом, который читатель заберёт себе: формулировка для договора, шаблон запроса, промпт для нейросети. Суть не в тексте, а в паре «предупреждение плюс кнопка Скопировать»: отдаём сырьё и сразу говорим, что вслепую применять нельзя."
  },
  {
    "id": "bible::prompt::table::1gzgbj3",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз."
    ],
    "rows": [
      [
        "`component`",
        "`\"Prompt\"`",
        "да"
      ],
      [
        "`title`",
        "строка",
        "да"
      ],
      [
        "`subtitle`",
        "строка",
        "да"
      ],
      [
        "`text`",
        "строка с тегами",
        "да"
      ]
    ],
    "text": "Поле | Значения | Обяз. | component | \"Prompt\" | да | title | строка | да | subtitle | строка | да | text | строка с тегами | да"
  },
  {
    "id": "bible::prompt::code::ezbon8",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Prompt\",\n  \"title\": \"Пример обращения\",\n  \"subtitle\": \"Проверьте текст перед использованием — вслепую применять нельзя.\",\n  \"text\": \"<p>«Добрый день! Меня зовут ..., я представляю НКО ...</p><p>Мы помогаем людям с инвалидностью…</p>\"\n}",
    "text": "{\n  \"component\": \"Prompt\",\n  \"title\": \"Пример обращения\",\n  \"subtitle\": \"Проверьте текст перед использованием — вслепую применять нельзя.\",\n  \"text\": \"<p>«Добрый день! Меня зовут ..., я представляю НКО ...</p><p>Мы помогаем людям с инвалидностью…</p>\"\n}"
  },
  {
    "id": "bible::prompt::para::1pcg6w1",
    "kind": "para",
    "md": "Структура жёсткая, слота внутри нет. В выгрузке пять штук.",
    "text": "Структура жёсткая, слота внутри нет. В выгрузке пять штук."
  },
  {
    "id": "bible::compare-i-compare-card::heading::1whipnf",
    "kind": "heading",
    "level": 3,
    "md": "Compare и Compare Card",
    "text": "Compare и Compare Card",
    "anchor": "compare-i-compare-card"
  },
  {
    "id": "bible::compare-i-compare-card::para::7tddn",
    "kind": "para",
    "md": "Пара сравнения «за и против». `Compare` — контейнер, который держит ровно две половины бок о бок. `Compare Card` — половина: сверху короткая формулировка с иконкой, ниже пояснение.",
    "text": "Пара сравнения «за и против». Compare — контейнер, который держит ровно две половины бок о бок. Compare Card — половина: сверху короткая формулировка с иконкой, ниже пояснение."
  },
  {
    "id": "bible::compare-i-compare-card::table::m0ujl8",
    "kind": "table",
    "header": [
      "Поле `Compare Card`",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Compare Card\"`",
        "да",
        ""
      ],
      [
        "`tone`",
        "`positive` · `negative`",
        "да",
        "Смысл половины. Зелёная заливка с галочкой или розовая с крестиком."
      ],
      [
        "`title`",
        "строка с тегами",
        "да",
        "Формулировка сверху. В Figma этот слой пока зовётся `txt` — в данных он `title`."
      ],
      [
        "`children`",
        "массив узлов",
        "да",
        "Пояснение: `Text`, `Stack`."
      ]
    ],
    "text": "Поле Compare Card | Значения | Обяз. | Что значит | component | \"Compare Card\" | да |  | tone | positive · negative | да | Смысл половины. Зелёная заливка с галочкой или розовая с крестиком. | title | строка с тегами | да | Формулировка сверху. В Figma этот слой пока зовётся txt — в данных он title. | children | массив узлов | да | Пояснение: Text, Stack."
  },
  {
    "id": "bible::compare-i-compare-card::code::1ajx395",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Compare\",\n  \"children\": [\n    {\n      \"component\": \"Compare Card\",\n      \"tone\": \"positive\",\n      \"title\": \"Что даёт компании\",\n      \"children\": [\n        {\n          \"component\": \"Stack\",\n          \"marker\": \"dot\",\n          \"size\": \"M\",\n          \"children\": [{ \"component\": \"List Item\", \"text\": \"расширяется круг кандидатов;\" }]\n        }\n      ]\n    },\n    {\n      \"component\": \"Compare Card\",\n      \"tone\": \"negative\",\n      \"title\": \"Что придётся учесть\",\n      \"children\": [\n        {\n          \"component\": \"Stack\",\n          \"marker\": \"dot\",\n          \"size\": \"M\",\n          \"children\": [{ \"component\": \"List Item\", \"text\": \"адаптация рабочего места;\" }]\n        }\n      ]\n    }\n  ]\n}",
    "text": "{\n  \"component\": \"Compare\",\n  \"children\": [\n    {\n      \"component\": \"Compare Card\",\n      \"tone\": \"positive\",\n      \"title\": \"Что даёт компании\",\n      \"children\": [\n        {\n          \"component\": \"Stack\",\n          \"marker\": \"dot\",\n          \"size\": \"M\",\n          \"children\": [{ \"component\": \"List Item\", \"text\": \"расширяется круг кандидатов;\" }]\n        }\n      ]\n    },\n    {\n      \"component\": \"Compare Card\",\n      \"tone\": \"negative\",\n      \"title\": \"Что придётся учесть\",\n      \"children\": [\n        {\n          \"component\": \"Stack\",\n          \"marker\": \"dot\",\n          \"size\": \"M\",\n          \"children\": [{ \"component\": \"List Item\", \"text\": \"адаптация рабочего места;\" }]\n        }\n      ]\n    }\n  ]\n}"
  },
  {
    "id": "bible::compare-i-compare-card::para::pq5r34",
    "kind": "para",
    "md": "**В выгрузке сайта этой пары пока нет.** Формат зафиксирован заранее, пример выше взят с эталонной страницы `/source/sample`. Компонент появится в файле, когда мы разметим под него содержимое.",
    "text": "В выгрузке сайта этой пары пока нет. Формат зафиксирован заранее, пример выше взят с эталонной страницы /source/sample. Компонент появится в файле, когда мы разметим под него содержимое."
  },
  {
    "id": "bible::card-button::heading::6djpi1",
    "kind": "heading",
    "level": 3,
    "md": "Card Button",
    "text": "Card Button",
    "anchor": "card-button"
  },
  {
    "id": "bible::card-button::para::fgskd9",
    "kind": "para",
    "md": "Способ поставить кнопку в поток текста, не сбив ритм колонки.",
    "text": "Способ поставить кнопку в поток текста, не сбив ритм колонки."
  },
  {
    "id": "bible::card-button::table::68f76l",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз."
    ],
    "rows": [
      [
        "`component`",
        "`\"Card Button\"`",
        "да"
      ],
      [
        "`text`",
        "строка",
        "да"
      ],
      [
        "`variant`",
        "`primary` · `secondary` · `outline` · `ghost`",
        "да"
      ]
    ],
    "text": "Поле | Значения | Обяз. | component | \"Card Button\" | да | text | строка | да | variant | primary · secondary · outline · ghost | да"
  },
  {
    "id": "bible::card-button::code::13qee9o",
    "kind": "code",
    "lang": "json",
    "body": "{ \"component\": \"Card Button\", \"text\": \"Скачать шаблон трудового договора\", \"variant\": \"primary\" }",
    "text": "{ \"component\": \"Card Button\", \"text\": \"Скачать шаблон трудового договора\", \"variant\": \"primary\" }"
  },
  {
    "id": "bible::card-button::para::t54qps",
    "kind": "para",
    "md": "Это единственный компонент, который кладут прямо в `Section Container`, минуя `Block`.",
    "text": "Это единственный компонент, который кладут прямо в Section Container, минуя Block."
  },
  {
    "id": "bible::card-button::para::iah84c",
    "kind": "para",
    "md": "**В выгрузке сайта кнопок пока нет.** В исходном тексте кнопок не было: кнопка — это не текст, а действие, и расставить их нужно осознанно. Формат зафиксирован, пример взят с эталонной страницы.",
    "text": "В выгрузке сайта кнопок пока нет. В исходном тексте кнопок не было: кнопка — это не текст, а действие, и расставить их нужно осознанно. Формат зафиксирован, пример взят с эталонной страницы."
  },
  {
    "id": "bible::card-button::para::18lz5uv",
    "kind": "para",
    "md": "Про кнопки есть незакрытая договорённость: мы предложили разработчику передавать иконку ключом (`\"icon\": \"download\"`) и её место отдельным полем (`\"iconPosition\": \"left\" | \"right\" | \"only\"`). В формат эти поля ещё не заведены — ждём подтверждения.",
    "text": "Про кнопки есть незакрытая договорённость: мы предложили разработчику передавать иконку ключом (\"icon\": \"download\") и её место отдельным полем (\"iconPosition\": \"left\" | \"right\" | \"only\"). В формат эти поля ещё не заведены — ждём подтверждения."
  },
  {
    "id": "bible::katalog-tablicy::heading::1jdmwn4",
    "kind": "heading",
    "level": 2,
    "md": "Каталог: таблицы",
    "text": "Каталог: таблицы",
    "anchor": "katalog-tablicy"
  },
  {
    "id": "bible::table::heading::1no2um7",
    "kind": "heading",
    "level": 3,
    "md": "Table",
    "text": "Table",
    "anchor": "table"
  },
  {
    "id": "bible::table::para::1o25vm1",
    "kind": "para",
    "md": "Таблицу берут, когда сравнивают несколько объектов по одним и тем же признакам. Готовой «Таблицы» в Figma нет — там её собирали руками из ячеек, поэтому у нас это отдельный компонент. Число колонок любое.",
    "text": "Таблицу берут, когда сравнивают несколько объектов по одним и тем же признакам. Готовой «Таблицы» в Figma нет — там её собирали руками из ячеек, поэтому у нас это отдельный компонент. Число колонок любое."
  },
  {
    "id": "bible::table::table::pvl0g7",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Table\"`",
        "да",
        ""
      ],
      [
        "`header`",
        "массив строк",
        "да",
        "Шапка: по строке на колонку."
      ],
      [
        "`rows`",
        "массив строк таблицы",
        "да",
        "Каждая строка — массив ячеек. Пустой массив едет как есть и означает, что строк нет и в источнике."
      ],
      [
        "`caption`",
        "строка",
        "нет по формату, есть у всех 51",
        "Подпись для скринридера, визуально скрытая."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Table\" | да |  | header | массив строк | да | Шапка: по строке на колонку. | rows | массив строк таблицы | да | Каждая строка — массив ячеек. Пустой массив едет как есть и означает, что строк нет и в источнике. | caption | строка | нет по формату, есть у всех 51 | Подпись для скринридера, визуально скрытая."
  },
  {
    "id": "bible::table::para::cfd0vc",
    "kind": "para",
    "md": "**Про `caption`.** Это решение разработчика: подписи только для скринридеров, генерируем сами и прячем визуально. Подпись собирается из ближайшего заголовка и списка колонок, чтобы незрячий читатель понял, о чём таблица, не читая её целиком.",
    "text": "Про caption. Это решение разработчика: подписи только для скринридеров, генерируем сами и прячем визуально. Подпись собирается из ближайшего заголовка и списка колонок, чтобы незрячий читатель понял, о чём таблица, не читая её целиком."
  },
  {
    "id": "bible::table::para::v158za",
    "kind": "para",
    "md": "**Ячейка бывает двух видов.** Обычная ячейка — просто строка с тегами. Ячейка-узел `Table cell` появляется в двух случаях: когда внутри перечисление и когда ячейка объединена с соседними.",
    "text": "Ячейка бывает двух видов. Обычная ячейка — просто строка с тегами. Ячейка-узел Table cell появляется в двух случаях: когда внутри перечисление и когда ячейка объединена с соседними."
  },
  {
    "id": "bible::table::code::4tybfu",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Table\",\n  \"caption\": \"Как нейросети помогают в работе. Столбцы: Группа сотрудников, Какие решения можно использовать\",\n  \"header\": [\"Группа сотрудников\", \"Какие решения можно использовать\"],\n  \"rows\": [\n    [\n      { \"component\": \"Table cell\", \"text\": \"Сотрудники с инвалидностью по слуху\", \"rowSpan\": 2 },\n      \"Переводить речь в текст\"\n    ],\n    [\"Добавлять субтитры на видео в Интернете\"]\n  ]\n}",
    "text": "{\n  \"component\": \"Table\",\n  \"caption\": \"Как нейросети помогают в работе. Столбцы: Группа сотрудников, Какие решения можно использовать\",\n  \"header\": [\"Группа сотрудников\", \"Какие решения можно использовать\"],\n  \"rows\": [\n    [\n      { \"component\": \"Table cell\", \"text\": \"Сотрудники с инвалидностью по слуху\", \"rowSpan\": 2 },\n      \"Переводить речь в текст\"\n    ],\n    [\"Добавлять субтитры на видео в Интернете\"]\n  ]\n}"
  },
  {
    "id": "bible::table-cell::heading::1bpg4d",
    "kind": "heading",
    "level": 3,
    "md": "Table cell",
    "text": "Table cell",
    "anchor": "table-cell"
  },
  {
    "id": "bible::table-cell::para::1cspdnr",
    "kind": "para",
    "md": "Ячейка-узел. Появляется внутри `rows` вместо обычной строки в двух случаях: когда внутри перечисление и когда ячейка объединена с соседними.",
    "text": "Ячейка-узел. Появляется внутри rows вместо обычной строки в двух случаях: когда внутри перечисление и когда ячейка объединена с соседними."
  },
  {
    "id": "bible::table-cell::table::18yy0ym",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Table cell\"`",
        "да",
        ""
      ],
      [
        "`text`",
        "строка с тегами",
        "нет",
        "Простой текст ячейки. Либо он, либо `children`."
      ],
      [
        "`children`",
        "массив узлов",
        "нет",
        "Содержимое сложнее одной строки: вступительная фраза и список."
      ],
      [
        "`rowSpan`",
        "число",
        "нет",
        "На сколько строк вниз растянута ячейка. Без поля — на одну."
      ],
      [
        "`colSpan`",
        "число",
        "нет",
        "На сколько колонок вправо растянута ячейка. Без поля — на одну."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Table cell\" | да |  | text | строка с тегами | нет | Простой текст ячейки. Либо он, либо children. | children | массив узлов | нет | Содержимое сложнее одной строки: вступительная фраза и список. | rowSpan | число | нет | На сколько строк вниз растянута ячейка. Без поля — на одну. | colSpan | число | нет | На сколько колонок вправо растянута ячейка. Без поля — на одну."
  },
  {
    "id": "bible::table-cell::code::1370l1l",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Table cell\",\n  \"children\": [\n    { \"component\": \"Text\", \"size\": \"M\", \"text\": \"<b>Да</b>\" },\n    { \"component\": \"Text\", \"size\": \"M\", \"text\": \"Если есть чёткие инструкции.\" }\n  ]\n}",
    "text": "{\n  \"component\": \"Table cell\",\n  \"children\": [\n    { \"component\": \"Text\", \"size\": \"M\", \"text\": \"<b>Да</b>\" },\n    { \"component\": \"Text\", \"size\": \"M\", \"text\": \"Если есть чёткие инструкции.\" }\n  ]\n}"
  },
  {
    "id": "bible::table-cell::para::qm7q9v",
    "kind": "para",
    "md": "Текст внутри ячейки всегда размера `M`.",
    "text": "Текст внутри ячейки всегда размера M."
  },
  {
    "id": "bible::kak-rabotaet-tablica-s-obedinennymi-yacheykami::heading::b42ygt",
    "kind": "heading",
    "level": 2,
    "md": "Как работает таблица с объединёнными ячейками",
    "text": "Как работает таблица с объединёнными ячейками",
    "anchor": "kak-rabotaet-tablica-s-obedinennymi-yacheykami"
  },
  {
    "id": "bible::kak-rabotaet-tablica-s-obedinennymi-yacheykami::para::q6i1db",
    "kind": "para",
    "md": "Объединять можно любые ячейки: вниз, вбок и то и другое сразу. Раньше формат умел склеивать только повторы в первой колонке, теперь это ограничение снято.",
    "text": "Объединять можно любые ячейки: вниз, вбок и то и другое сразу. Раньше формат умел склеивать только повторы в первой колонке, теперь это ограничение снято."
  },
  {
    "id": "bible::glavnoe-pravilo::heading::1ep2f7v",
    "kind": "heading",
    "level": 3,
    "md": "Главное правило",
    "text": "Главное правило",
    "anchor": "glavnoe-pravilo"
  },
  {
    "id": "bible::glavnoe-pravilo::para::8q3qt4",
    "kind": "para",
    "md": "**Объединение живёт у самой ячейки, а поглощённые ячейки в файл не едут вовсе.**",
    "text": "Объединение живёт у самой ячейки, а поглощённые ячейки в файл не едут вовсе."
  },
  {
    "id": "bible::glavnoe-pravilo::para::1x74kt4",
    "kind": "para",
    "md": "Ячейка, которая растянута, несёт `rowSpan` (на сколько строк вниз) или `colSpan` (на сколько колонок вправо). Места, которые она заняла, из своих строк просто исчезают: пустышек, заглушек или `null` вместо них нет.",
    "text": "Ячейка, которая растянута, несёт rowSpan (на сколько строк вниз) или colSpan (на сколько колонок вправо). Места, которые она заняла, из своих строк просто исчезают: пустышек, заглушек или null вместо них нет."
  },
  {
    "id": "bible::glavnoe-pravilo::para::ww743z",
    "kind": "para",
    "md": "Из этого следует то, что важнее всего при чтении: **строки в таблице разной длины, и это норма.** Строка, над которой висит растянутая ячейка, будет короче остальных ровно на столько мест, сколько эта ячейка у неё забрала.",
    "text": "Из этого следует то, что важнее всего при чтении: строки в таблице разной длины, и это норма. Строка, над которой висит растянутая ячейка, будет короче остальных ровно на столько мест, сколько эта ячейка у неё забрала."
  },
  {
    "id": "bible::glavnoe-pravilo::para::6qx1xk",
    "kind": "para",
    "md": "Правило устроено так же, как в обычной вёрстке таблиц, поэтому знакомый способ сборки подходит без изменений.",
    "text": "Правило устроено так же, как в обычной вёрстке таблиц, поэтому знакомый способ сборки подходит без изменений."
  },
  {
    "id": "bible::obedinenie-vniz::heading::1f9yhxb",
    "kind": "heading",
    "level": 3,
    "md": "Объединение вниз",
    "text": "Объединение вниз",
    "anchor": "obedinenie-vniz"
  },
  {
    "id": "bible::obedinenie-vniz::para::1w842vv",
    "kind": "para",
    "md": "Так выглядит таблица, где название группы стоит один раз на три строки:",
    "text": "Так выглядит таблица, где название группы стоит один раз на три строки:"
  },
  {
    "id": "bible::obedinenie-vniz::code::1a3ctmi",
    "kind": "code",
    "lang": "text",
    "body": "┌───────────────────────┬──────────────────────────────┐\n│ Группа сотрудников    │ Какие решения использовать   │  ← шапка\n├───────────────────────┼──────────────────────────────┤\n│                       │ Переводить речь в текст      │\n│ Сотрудники с          ├──────────────────────────────┤\n│ инвалидностью         │ Добавлять субтитры на видео  │\n│ по слуху              ├──────────────────────────────┤\n│                       │ Делать расшифровки встреч    │\n└───────────────────────┴──────────────────────────────┘",
    "text": "┌───────────────────────┬──────────────────────────────┐\n│ Группа сотрудников    │ Какие решения использовать   │  ← шапка\n├───────────────────────┼──────────────────────────────┤\n│                       │ Переводить речь в текст      │\n│ Сотрудники с          ├──────────────────────────────┤\n│ инвалидностью         │ Добавлять субтитры на видео  │\n│ по слуху              ├──────────────────────────────┤\n│                       │ Делать расшифровки встреч    │\n└───────────────────────┴──────────────────────────────┘"
  },
  {
    "id": "bible::obedinenie-vniz::para::dw7xev",
    "kind": "para",
    "md": "В файле это выглядит так:",
    "text": "В файле это выглядит так:"
  },
  {
    "id": "bible::obedinenie-vniz::code::1rvtrqp",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Table\",\n  \"header\": [\"Группа сотрудников\", \"Какие решения использовать\"],\n  \"rows\": [\n    [\n      { \"component\": \"Table cell\", \"text\": \"Сотрудники с инвалидностью по слуху\", \"rowSpan\": 3 },\n      \"Переводить речь в текст\"\n    ],\n    [\"Добавлять субтитры на видео\"],\n    [\"Делать расшифровки встреч\"]\n  ]\n}",
    "text": "{\n  \"component\": \"Table\",\n  \"header\": [\"Группа сотрудников\", \"Какие решения использовать\"],\n  \"rows\": [\n    [\n      { \"component\": \"Table cell\", \"text\": \"Сотрудники с инвалидностью по слуху\", \"rowSpan\": 3 },\n      \"Переводить речь в текст\"\n    ],\n    [\"Добавлять субтитры на видео\"],\n    [\"Делать расшифровки встреч\"]\n  ]\n}"
  },
  {
    "id": "bible::obedinenie-vniz::para::mq65ph",
    "kind": "para",
    "md": "В первой строке две ячейки, во второй и третьей — по одной. Первой колонки у них нет, потому что её занимает растянутая ячейка сверху.",
    "text": "В первой строке две ячейки, во второй и третьей — по одной. Первой колонки у них нет, потому что её занимает растянутая ячейка сверху."
  },
  {
    "id": "bible::obedinenie-vbok::heading::141mllm",
    "kind": "heading",
    "level": 3,
    "md": "Объединение вбок",
    "text": "Объединение вбок",
    "anchor": "obedinenie-vbok"
  },
  {
    "id": "bible::obedinenie-vbok::para::41fzwl",
    "kind": "para",
    "md": "Так выглядит таблица, где одна ячейка накрывает обе колонки:",
    "text": "Так выглядит таблица, где одна ячейка накрывает обе колонки:"
  },
  {
    "id": "bible::obedinenie-vbok::code::1y38qah",
    "kind": "code",
    "lang": "text",
    "body": "┌───────────────────────┬──────────────────────────────┐\n│ Этап                  │ Что делаем                   │  ← шапка\n├───────────────────────┴──────────────────────────────┤\n│ До выхода сотрудника                                 │  ← на всю ширину\n├───────────────────────┬──────────────────────────────┤\n│ Подготовка места      │ Проверить доступность входа  │\n└───────────────────────┴──────────────────────────────┘",
    "text": "┌───────────────────────┬──────────────────────────────┐\n│ Этап                  │ Что делаем                   │  ← шапка\n├───────────────────────┴──────────────────────────────┤\n│ До выхода сотрудника                                 │  ← на всю ширину\n├───────────────────────┬──────────────────────────────┤\n│ Подготовка места      │ Проверить доступность входа  │\n└───────────────────────┴──────────────────────────────┘"
  },
  {
    "id": "bible::obedinenie-vbok::para::n37wfg",
    "kind": "para",
    "md": "В файле:",
    "text": "В файле:"
  },
  {
    "id": "bible::obedinenie-vbok::code::1arxtyr",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"rows\": [\n    [{ \"component\": \"Table cell\", \"text\": \"До выхода сотрудника\", \"colSpan\": 2 }],\n    [\"Подготовка места\", \"Проверить доступность входа\"]\n  ]\n}",
    "text": "{\n  \"rows\": [\n    [{ \"component\": \"Table cell\", \"text\": \"До выхода сотрудника\", \"colSpan\": 2 }],\n    [\"Подготовка места\", \"Проверить доступность входа\"]\n  ]\n}"
  },
  {
    "id": "bible::obedinenie-vbok::para::1g4q1v8",
    "kind": "para",
    "md": "В первой строке одна ячейка вместо двух, потому что она занимает обе колонки.",
    "text": "В первой строке одна ячейка вместо двух, потому что она занимает обе колонки."
  },
  {
    "id": "bible::oba-obedineniya-srazu::heading::hjmfk9",
    "kind": "heading",
    "level": 3,
    "md": "Оба объединения сразу",
    "text": "Оба объединения сразу",
    "anchor": "oba-obedineniya-srazu"
  },
  {
    "id": "bible::oba-obedineniya-srazu::para::adgrec",
    "kind": "para",
    "md": "Ячейка может нести и `rowSpan`, и `colSpan` одновременно. Внутри объединённой ячейки бывает не только простой текст, но и перечисление — тогда вместо `text` у неё стоит `children`:",
    "text": "Ячейка может нести и rowSpan, и colSpan одновременно. Внутри объединённой ячейки бывает не только простой текст, но и перечисление — тогда вместо text у неё стоит children:"
  },
  {
    "id": "bible::oba-obedineniya-srazu::code::w1pi7g",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Table cell\",\n  \"rowSpan\": 2,\n  \"colSpan\": 2,\n  \"children\": [\n    { \"component\": \"Text\", \"size\": \"M\", \"text\": \"Что проверить до выхода:\" },\n    {\n      \"component\": \"Stack\",\n      \"marker\": \"dot\",\n      \"size\": \"M\",\n      \"children\": [\n        { \"component\": \"List Item\", \"text\": \"доступность входа,\" },\n        { \"component\": \"List Item\", \"text\": \"рабочее место.\" }\n      ]\n    }\n  ]\n}",
    "text": "{\n  \"component\": \"Table cell\",\n  \"rowSpan\": 2,\n  \"colSpan\": 2,\n  \"children\": [\n    { \"component\": \"Text\", \"size\": \"M\", \"text\": \"Что проверить до выхода:\" },\n    {\n      \"component\": \"Stack\",\n      \"marker\": \"dot\",\n      \"size\": \"M\",\n      \"children\": [\n        { \"component\": \"List Item\", \"text\": \"доступность входа,\" },\n        { \"component\": \"List Item\", \"text\": \"рабочее место.\" }\n      ]\n    }\n  ]\n}"
  },
  {
    "id": "bible::kak-chitat-stroki-pri-sborke::heading::1yvn895",
    "kind": "heading",
    "level": 3,
    "md": "Как читать строки при сборке",
    "text": "Как читать строки при сборке",
    "anchor": "kak-chitat-stroki-pri-sborke"
  },
  {
    "id": "bible::kak-chitat-stroki-pri-sborke::para::in8sqf",
    "kind": "para",
    "md": "Идти по строкам сверху вниз и держать список мест, занятых объединениями сверху. Порядок такой.",
    "text": "Идти по строкам сверху вниз и держать список мест, занятых объединениями сверху. Порядок такой."
  },
  {
    "id": "bible::kak-chitat-stroki-pri-sborke::para::1ipuztm",
    "kind": "para",
    "md": "Возьмите строку и первую свободную колонку слева. Если эта колонка занята ячейкой, растянутой из строки выше, пропустите её и переходите к следующей. Если свободна, поставьте туда очередную ячейку из строки.",
    "text": "Возьмите строку и первую свободную колонку слева. Если эта колонка занята ячейкой, растянутой из строки выше, пропустите её и переходите к следующей. Если свободна, поставьте туда очередную ячейку из строки."
  },
  {
    "id": "bible::kak-chitat-stroki-pri-sborke::para::1s30svt",
    "kind": "para",
    "md": "Когда у ячейки есть `colSpan`, она занимает столько колонок подряд, сколько там написано, и следующая ячейка встаёт уже за ними. Когда у ячейки есть `rowSpan`, запомните её колонки как занятые для стольких строк вниз, сколько указано.",
    "text": "Когда у ячейки есть colSpan, она занимает столько колонок подряд, сколько там написано, и следующая ячейка встаёт уже за ними. Когда у ячейки есть rowSpan, запомните её колонки как занятые для стольких строк вниз, сколько указано."
  },
  {
    "id": "bible::kak-proverit-chto-tablica-celaya::heading::n5pmwf",
    "kind": "heading",
    "level": 3,
    "md": "Как проверить, что таблица целая",
    "text": "Как проверить, что таблица целая",
    "anchor": "kak-proverit-chto-tablica-celaya"
  },
  {
    "id": "bible::kak-proverit-chto-tablica-celaya::para::s0jwhk",
    "kind": "para",
    "md": "Ширина строки считается с учётом объединений, а не по числу ячеек. Для каждой строки сложите три вещи: количество колонок, занятых ячейками, растянутыми сверху; сумму `colSpan` у ячеек этой строки (ячейка без `colSpan` считается за одну); и всё. Полученное число обязано совпасть с количеством колонок в шапке.",
    "text": "Ширина строки считается с учётом объединений, а не по числу ячеек. Для каждой строки сложите три вещи: количество колонок, занятых ячейками, растянутыми сверху; сумму colSpan у ячеек этой строки (ячейка без colSpan считается за одну); и всё. Полученное число обязано совпасть с количеством колонок в шапке."
  },
  {
    "id": "bible::kak-proverit-chto-tablica-celaya::para::311gj5",
    "kind": "para",
    "md": "Если не совпало, таблица собралась неверно. У нас это ловит машинная проверка с правилом `таблица-рваная`, и в сообщении она пишет посчитанную ширину.",
    "text": "Если не совпало, таблица собралась неверно. У нас это ловит машинная проверка с правилом таблица-рваная, и в сообщении она пишет посчитанную ширину."
  },
  {
    "id": "bible::chego-v-obedineniyah-ne-byvaet::heading::16u5n5m",
    "kind": "heading",
    "level": 3,
    "md": "Чего в объединениях не бывает",
    "text": "Чего в объединениях не бывает",
    "anchor": "chego-v-obedineniyah-ne-byvaet"
  },
  {
    "id": "bible::chego-v-obedineniyah-ne-byvaet::para::1lfbhrj",
    "kind": "para",
    "md": "Объединения не пересекаются между собой: одно место не может принадлежать двум ячейкам сразу. Объединение не выходит за границы таблицы ни вниз, ни вправо. Шапка в объединениях не участвует — она всегда ровно из одной строки, по ячейке на колонку.",
    "text": "Объединения не пересекаются между собой: одно место не может принадлежать двум ячейкам сразу. Объединение не выходит за границы таблицы ни вниз, ни вправо. Шапка в объединениях не участвует — она всегда ровно из одной строки, по ячейке на колонку."
  },
  {
    "id": "bible::otkuda-obedineniya-berutsya-u-nas::heading::10uh9rc",
    "kind": "heading",
    "level": 3,
    "md": "Откуда объединения берутся у нас",
    "text": "Откуда объединения берутся у нас",
    "anchor": "otkuda-obedineniya-berutsya-u-nas"
  },
  {
    "id": "bible::otkuda-obedineniya-berutsya-u-nas::para::14chpvn",
    "kind": "para",
    "md": "Мы склеиваем ячейки там, где в исходном документе клиента они были склеены, и повтор названия группы в каждой строке был бы ошибкой. Такие таблицы названы поимённо в коде, потому что одинаковые соседние ячейки бывают и законными: колонка ответов «Нет / Да / Да / Да» или четыре строки подряд про Санкт-Петербург в списке городов. Склеить их означало бы соврать читателю.",
    "text": "Мы склеиваем ячейки там, где в исходном документе клиента они были склеены, и повтор названия группы в каждой строке был бы ошибкой. Такие таблицы названы поимённо в коде, потому что одинаковые соседние ячейки бывают и законными: колонка ответов «Нет / Да / Да / Да» или четыре строки подряд про Санкт-Петербург в списке городов. Склеить их означало бы соврать читателю."
  },
  {
    "id": "bible::otkuda-obedineniya-berutsya-u-nas::para::sdw3lv",
    "kind": "para",
    "md": "Сейчас в выгрузке объединение есть у одной таблицы из 51 — «Как нейросети помогают в работе» на странице «Шаг 3. Создание инклюзивной среды».",
    "text": "Сейчас в выгрузке объединение есть у одной таблицы из 51 — «Как нейросети помогают в работе» на странице «Шаг 3. Создание инклюзивной среды»."
  },
  {
    "id": "bible::katalog-media-i-lyudi::heading::15jdv1d",
    "kind": "heading",
    "level": 2,
    "md": "Каталог: медиа и люди",
    "text": "Каталог: медиа и люди",
    "anchor": "katalog-media-i-lyudi"
  },
  {
    "id": "bible::image::heading::ophmze",
    "kind": "heading",
    "level": 3,
    "md": "Image",
    "text": "Image",
    "anchor": "image"
  },
  {
    "id": "bible::image::para::jghmt2",
    "kind": "para",
    "md": "Содержательная картинка в теле страницы: иллюстрация, схема, скриншот. Стикер-декор — это другое, см. `Small Image` ниже.",
    "text": "Содержательная картинка в теле страницы: иллюстрация, схема, скриншот. Стикер-декор — это другое, см. Small Image ниже."
  },
  {
    "id": "bible::image::table::1fy3s1k",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Image\"`",
        "да",
        ""
      ],
      [
        "`src`",
        "путь от корня сайта",
        "да",
        "Например `/source-media/m5/img2.png`. Файл лежит на прототипе по тому же пути, разработчик забирает его оттуда."
      ],
      [
        "`alt`",
        "строка",
        "нет",
        "Подпись для скринридера. Сейчас её нет ни у одной из пяти картинок — это дырка в содержании, закрыть её можно только руками."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Image\" | да |  | src | путь от корня сайта | да | Например /source-media/m5/img2.png. Файл лежит на прототипе по тому же пути, разработчик забирает его оттуда. | alt | строка | нет | Подпись для скринридера. Сейчас её нет ни у одной из пяти картинок — это дырка в содержании, закрыть её можно только руками."
  },
  {
    "id": "bible::image::para::16rsyty",
    "kind": "para",
    "md": "Обратите внимание на разницу: у картинки в `src` лежит **путь**, а у логотипа, портрета в цитате и фото человека — **голое имя файла**. Так вышло из договорённостей и так и осталось.",
    "text": "Обратите внимание на разницу: у картинки в src лежит путь, а у логотипа, портрета в цитате и фото человека — голое имя файла. Так вышло из договорённостей и так и осталось."
  },
  {
    "id": "bible::video::heading::pd0tu4",
    "kind": "heading",
    "level": 3,
    "md": "Video",
    "text": "Video",
    "anchor": "video"
  },
  {
    "id": "bible::video::para::1c7rpot",
    "kind": "para",
    "md": "Ролик в теле страницы, например интервью.",
    "text": "Ролик в теле страницы, например интервью."
  },
  {
    "id": "bible::video::table::1ps15ie",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз."
    ],
    "rows": [
      [
        "`component`",
        "`\"Video\"`",
        "да"
      ],
      [
        "`href`",
        "внешний адрес ролика",
        "да фактически"
      ]
    ],
    "text": "Поле | Значения | Обяз. | component | \"Video\" | да | href | внешний адрес ролика | да фактически"
  },
  {
    "id": "bible::video::code::1ph2c5c",
    "kind": "code",
    "lang": "json",
    "body": "{ \"component\": \"Video\", \"href\": \"https://disk.yandex.ru/i/Zux_cqxP1sRgKQ\" }",
    "text": "{ \"component\": \"Video\", \"href\": \"https://disk.yandex.ru/i/Zux_cqxP1sRgKQ\" }"
  },
  {
    "id": "bible::person-item::heading::13z3aj3",
    "kind": "heading",
    "level": 3,
    "md": "Person Item",
    "text": "Person Item",
    "anchor": "person-item"
  },
  {
    "id": "bible::person-item::para::31kbvb",
    "kind": "para",
    "md": "Человек: круглый портрет, под ним имя и должность. Ряд людей лежит прямо в горизонтальном `Block`, своей обёртки у ряда нет.",
    "text": "Человек: круглый портрет, под ним имя и должность. Ряд людей лежит прямо в горизонтальном Block, своей обёртки у ряда нет."
  },
  {
    "id": "bible::person-item::table::5spubz",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Person Item\"`",
        "да",
        ""
      ],
      [
        "`name`",
        "строка",
        "да",
        "Имя и фамилия."
      ],
      [
        "`photo`",
        "имя файла без расширения",
        "да",
        "Как у цитат: файл разработчик забирает с прототипа. Снимки квадратные, 800 на 800 точек, рассчитаны на круг."
      ],
      [
        "`role`",
        "строка",
        "да",
        "Должность."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Person Item\" | да |  | name | строка | да | Имя и фамилия. | photo | имя файла без расширения | да | Как у цитат: файл разработчик забирает с прототипа. Снимки квадратные, 800 на 800 точек, рассчитаны на круг. | role | строка | да | Должность."
  },
  {
    "id": "bible::person-item::para::1281kyi",
    "kind": "para",
    "md": "**Обязательны все три поля.** Человек без имени, без должности или без портрета выглядит в ряду недоделкой, и разработчику не нужно решать, чем заполнять пустое место. Если у нас чего-то из трёх нет, человек в выгрузку не поедет вовсе, а в инструменте встанет пометка, что именно не хватает.",
    "text": "Обязательны все три поля. Человек без имени, без должности или без портрета выглядит в ряду недоделкой, и разработчику не нужно решать, чем заполнять пустое место. Если у нас чего-то из трёх нет, человек в выгрузку не поедет вовсе, а в инструменте встанет пометка, что именно не хватает."
  },
  {
    "id": "bible::person-item::code::c2ps1q",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Person Item\",\n  \"photo\": \"yuliya-ermilova\",\n  \"name\": \"Юлия Ермилова\",\n  \"role\": \"руководитель программ Благотворительного фонда Яндекса «Помощь рядом»\"\n}",
    "text": "{\n  \"component\": \"Person Item\",\n  \"photo\": \"yuliya-ermilova\",\n  \"name\": \"Юлия Ермилова\",\n  \"role\": \"руководитель программ Благотворительного фонда Яндекса «Помощь рядом»\"\n}"
  },
  {
    "id": "bible::person-item::para::l5xngq",
    "kind": "para",
    "md": "У самой фотографии подписи для скринридера нет намеренно: имя и должность стоят рядом обычным текстом, и читалка произнесла бы их дважды.",
    "text": "У самой фотографии подписи для скринридера нет намеренно: имя и должность стоят рядом обычным текстом, и читалка произнесла бы их дважды."
  },
  {
    "id": "bible::person-item::para::jt4v6v",
    "kind": "para",
    "md": "**Этого компонента в Figma пока нет** — он появился в прототипе раньше макета, и его нужно нарисовать.",
    "text": "Этого компонента в Figma пока нет — он появился в прототипе раньше макета, и его нужно нарисовать."
  },
  {
    "id": "bible::small-image::heading::9kftxt",
    "kind": "heading",
    "level": 3,
    "md": "Small Image",
    "text": "Small Image",
    "anchor": "small-image"
  },
  {
    "id": "bible::small-image::para::1orkv6h",
    "kind": "para",
    "md": "Иллюстрация-стикер в углу карточки: подсказка глазом, о чём блок. Смысла сама по себе не несёт — текст без неё читается полностью.",
    "text": "Иллюстрация-стикер в углу карточки: подсказка глазом, о чём блок. Смысла сама по себе не несёт — текст без неё читается полностью."
  },
  {
    "id": "bible::small-image::para::r9oniz",
    "kind": "para",
    "md": "**Своего узла в выгрузке у неё нет.** Стикер приезжает значением поля `image` у `General Card`, и это единственный способ, которым он попадает на страницу.",
    "text": "Своего узла в выгрузке у неё нет. Стикер приезжает значением поля image у General Card, и это единственный способ, которым он попадает на страницу."
  },
  {
    "id": "bible::small-image::para::1ifte25",
    "kind": "para",
    "md": "В поле лежит **слаг сюжета** — он же имя файла картинки в `figma/illustrations/`. До 17 августа 2026 там стояло русское название («Важная информация»), и разработчик просил заменить его слагом: теперь картинка заводится по тому же ключу, что и иконка, а искать файл по русскому названию больше не нужно.",
    "text": "В поле лежит слаг сюжета — он же имя файла картинки в figma/illustrations/. До 17 августа 2026 там стояло русское название («Важная информация»), и разработчик просил заменить его слагом: теперь картинка заводится по тому же ключу, что и иконка, а искать файл по русскому названию больше не нужно."
  },
  {
    "id": "bible::small-image::para::t59umh",
    "kind": "para",
    "md": "В наборе 19 сюжетов, в выгрузке сейчас встречаются два: `important` (51 раз) и `example` (15 раз).",
    "text": "В наборе 19 сюжетов, в выгрузке сейчас встречаются два: important (51 раз) и example (15 раз)."
  },
  {
    "id": "bible::small-image::table::yqp1z7",
    "kind": "table",
    "header": [
      "Сюжет в Figma",
      "Слаг в выгрузке",
      "Файл"
    ],
    "rows": [
      [
        "Важная информация",
        "`important`",
        "`important.png`"
      ],
      [
        "Пример",
        "`example`",
        "`example.png`"
      ]
    ],
    "text": "Сюжет в Figma | Слаг в выгрузке | Файл | Важная информация | important | important.png | Пример | example | example.png"
  },
  {
    "id": "bible::small-image::para::ripgm2",
    "kind": "para",
    "md": "Остальные семнадцать сюжетов набора (`resume`, `frame`, `apply`, `interview`, `onboarding`, `teamwork`, `computer`, `search`, `checklist`, `pin`, `clip`, `check`, `window`, `desktop`, `documents`, `bubbles`, `ai`) в содержимом страниц пока не встречаются — они ждут своих карточек. Правило то же: слаг равен имени файла ([smallImageFiles.ts](prototype/src/figma/smallImageFiles.ts)).",
    "text": "Остальные семнадцать сюжетов набора (resume, frame, apply, interview, onboarding, teamwork, computer, search, checklist, pin, clip, check, window, desktop, documents, bubbles, ai) в содержимом страниц пока не встречаются — они ждут своих карточек. Правило то же: слаг равен имени файла (smallImageFiles.ts)."
  },
  {
    "id": "bible::small-image::para::g6pabf",
    "kind": "para",
    "md": "Рисунок назначается не по теме текста, а по роли карточки: «Важно» и «Важно понять» получают `important`, «Пример» получает `example`. Роль важнее темы: читатель листает длинную страницу и по картинке понимает, что перед ним предупреждение или разбор случая.",
    "text": "Рисунок назначается не по теме текста, а по роли карточки: «Важно» и «Важно понять» получают important, «Пример» получает example. Роль важнее темы: читатель листает длинную страницу и по картинке понимает, что перед ним предупреждение или разбор случая."
  },
  {
    "id": "bible::katalog-kviz::heading::ogl5ba",
    "kind": "heading",
    "level": 2,
    "md": "Каталог: квиз",
    "text": "Каталог: квиз",
    "anchor": "katalog-kviz"
  },
  {
    "id": "bible::quiz::heading::1m6nthw",
    "kind": "heading",
    "level": 3,
    "md": "Quiz",
    "text": "Quiz",
    "anchor": "quiz"
  },
  {
    "id": "bible::quiz::para::hzif1j",
    "kind": "para",
    "md": "Блок самопроверки: вопрос, варианты ответа, кнопка «Проверить» и разбор. Берут после куска обучающего материала. Не берут для сбора данных — это форма, а не квиз.",
    "text": "Блок самопроверки: вопрос, варианты ответа, кнопка «Проверить» и разбор. Берут после куска обучающего материала. Не берут для сбора данных — это форма, а не квиз."
  },
  {
    "id": "bible::quiz::table::cz36pv",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Quiz\"`",
        "да",
        ""
      ],
      [
        "`items`",
        "массив вариантов",
        "да",
        "См. ниже."
      ],
      [
        "`mode`",
        "`single` · `multiple`",
        "да",
        "Один верный вариант или несколько. **Руками не проставляется** — считается по числу верных вариантов, поэтому разъехаться с содержанием не может. Из 55 квизов 46 с одним верным ответом, 9 с несколькими."
      ],
      [
        "`question`",
        "строка с тегами",
        "нет",
        "Вопрос. Есть у 50 квизов из 55: у квиза-темы вопрос целиком в заголовке."
      ],
      [
        "`title`",
        "строка с тегами",
        "нет",
        "Заголовок темы. Есть у 21."
      ],
      [
        "`description`",
        "строка с тегами",
        "нет",
        "Вводный текст перед вопросом, бывает из нескольких абзацев и списков. Есть у 12."
      ],
      [
        "`explanation`",
        "строка с тегами",
        "нет",
        "Разбор после проверки. Есть у 43."
      ],
      [
        "`instant`",
        "`true`",
        "нет",
        "Разбор виден сразу по выбору, без кнопки «Проверить». Стоит у 4 квизов."
      ],
      [
        "`noVerdict`",
        "`true`",
        "нет",
        "Не показывать строку-вердикт над разбором. Стоит у 10 квизов на страницах, где вариант либо верный, либо нет, и слово «частично» сбивало читателя."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Quiz\" | да |  | items | массив вариантов | да | См. ниже. | mode | single · multiple | да | Один верный вариант или несколько. Руками не проставляется — считается по числу верных вариантов, поэтому разъехаться с содержанием не может. Из 55 квизов 46 с одним верным ответом, 9 с несколькими. | question | строка с тегами | нет | Вопрос. Есть у 50 квизов из 55: у квиза-темы вопрос целиком в заголовке. | title | строка с тегами | нет | Заголовок темы. Есть у 21. | description | строка с тегами | нет | Вводный текст перед вопросом, бывает из нескольких абзацев и списков. Есть у 12. | explanation | строка с тегами | нет | Разбор после проверки. Есть у 43. | instant | true | нет | Разбор виден сразу по выбору, без кнопки «Проверить». Стоит у 4 квизов. | noVerdict | true | нет | Не показывать строку-вердикт над разбором. Стоит у 10 квизов на страницах, где вариант либо верный, либо нет, и слово «частично» сбивало читателя."
  },
  {
    "id": "bible::quiz::para::1sbkud6",
    "kind": "para",
    "md": "Вариант ответа — объект из трёх полей:",
    "text": "Вариант ответа — объект из трёх полей:"
  },
  {
    "id": "bible::quiz::table::pyrtnk",
    "kind": "table",
    "header": [
      "Поле варианта",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`text`",
        "строка с тегами",
        "да",
        "Текст варианта."
      ],
      [
        "`correct`",
        "`true`",
        "нет",
        "Стоит только у верных. У неверных поля нет вовсе — `false` в файл не едет."
      ],
      [
        "`feedback`",
        "строка с тегами",
        "нет",
        "Разбор конкретного варианта. Есть у 12 квизов, 40 вариантов."
      ]
    ],
    "text": "Поле варианта | Значения | Обяз. | Что значит | text | строка с тегами | да | Текст варианта. | correct | true | нет | Стоит только у верных. У неверных поля нет вовсе — false в файл не едет. | feedback | строка с тегами | нет | Разбор конкретного варианта. Есть у 12 квизов, 40 вариантов."
  },
  {
    "id": "bible::quiz::code::f4aggy",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Quiz\",\n  \"title\": \"Вакансия: Консультант по психологической поддержке на горячей линии\",\n  \"description\": \"<p>Функции:</p><ul><li>внимательно слушать собеседника,</li><li>задавать уточняющие вопросы</li></ul>\",\n  \"question\": \"Люди с какой формой инвалидности лучше всего подходят для этой вакансии?\",\n  \"mode\": \"single\",\n  \"items\": [\n    { \"text\": \"Люди с инвалидностью по зрению\", \"correct\": true },\n    { \"text\": \"Люди с инвалидностью по слуху\" }\n  ],\n  \"explanation\": \"Ключевые задачи связаны со слуховым восприятием, эмпатией и аналитическим мышлением.\"\n}",
    "text": "{\n  \"component\": \"Quiz\",\n  \"title\": \"Вакансия: Консультант по психологической поддержке на горячей линии\",\n  \"description\": \"<p>Функции:</p><ul><li>внимательно слушать собеседника,</li><li>задавать уточняющие вопросы</li></ul>\",\n  \"question\": \"Люди с какой формой инвалидности лучше всего подходят для этой вакансии?\",\n  \"mode\": \"single\",\n  \"items\": [\n    { \"text\": \"Люди с инвалидностью по зрению\", \"correct\": true },\n    { \"text\": \"Люди с инвалидностью по слуху\" }\n  ],\n  \"explanation\": \"Ключевые задачи связаны со слуховым восприятием, эмпатией и аналитическим мышлением.\"\n}"
  },
  {
    "id": "bible::tri-vida-stroki-otveta-i-otkuda-oni-berutsya::heading::1qytyy",
    "kind": "heading",
    "level": 3,
    "md": "Три вида строки ответа и откуда они берутся",
    "text": "Три вида строки ответа и откуда они берутся",
    "anchor": "tri-vida-stroki-otveta-i-otkuda-oni-berutsya"
  },
  {
    "id": "bible::tri-vida-stroki-otveta-i-otkuda-oni-berutsya::para::xqwf5p",
    "kind": "para",
    "md": "**У строки ответа после проверки три вида, и каждый со своим цветом.** «Верно» — зелёный, «неверно» — красный, «частично» — жёлтый. Третий вид полноценный, а не оттенок первого: его нужно нарисовать отдельно.",
    "text": "У строки ответа после проверки три вида, и каждый со своим цветом. «Верно» — зелёный, «неверно» — красный, «частично» — жёлтый. Третий вид полноценный, а не оттенок первого: его нужно нарисовать отдельно."
  },
  {
    "id": "bible::tri-vida-stroki-otveta-i-otkuda-oni-berutsya::table::kplieq",
    "kind": "table",
    "header": [
      "Вид строки",
      "Цвет",
      "Когда показывается"
    ],
    "rows": [
      [
        "Верно",
        "зелёный",
        "Читатель отметил вариант, и вариант верный."
      ],
      [
        "Неверно",
        "красный",
        "Читатель отметил вариант, а вариант неверный."
      ],
      [
        "Частично",
        "жёлтый",
        "Читатель **не** отметил вариант, а вариант верный. То есть он его пропустил."
      ]
    ],
    "text": "Вид строки | Цвет | Когда показывается | Верно | зелёный | Читатель отметил вариант, и вариант верный. | Неверно | красный | Читатель отметил вариант, а вариант неверный. | Частично | жёлтый | Читатель не отметил вариант, а вариант верный. То есть он его пропустил."
  },
  {
    "id": "bible::tri-vida-stroki-otveta-i-otkuda-oni-berutsya::para::8yaxaj",
    "kind": "para",
    "md": "**В данных этих видов нет, и вот почему.** Вид зависит от того, что сделал читатель, а этого до его ответа не существует. В файле едет только содержание — какой вариант верный (`correct: true`). Вид строки складывается уже на странице из двух вещей: отмечен вариант или нет и верный он или нет. Таблица выше и есть всё правило целиком.",
    "text": "В данных этих видов нет, и вот почему. Вид зависит от того, что сделал читатель, а этого до его ответа не существует. В файле едет только содержание — какой вариант верный (correct: true). Вид строки складывается уже на странице из двух вещей: отмечен вариант или нет и верный он или нет. Таблица выше и есть всё правило целиком."
  },
  {
    "id": "bible::tri-vida-stroki-otveta-i-otkuda-oni-berutsya::para::rvb39u",
    "kind": "para",
    "md": "Отсюда практическое следствие для сборки компонента. Вариант ответа должен уметь показываться в трёх видах, а переключать их будет логика проверки, а не поле в данных. Если в конструкторе вид ставится руками, то по одному варианту из файла нужно собрать все три вида и выбирать нужный после нажатия «Проверить».",
    "text": "Отсюда практическое следствие для сборки компонента. Вариант ответа должен уметь показываться в трёх видах, а переключать их будет логика проверки, а не поле в данных. Если в конструкторе вид ставится руками, то по одному варианту из файла нужно собрать все три вида и выбирать нужный после нажатия «Проверить»."
  },
  {
    "id": "bible::tri-vida-stroki-otveta-i-otkuda-oni-berutsya::para::18s5fc1",
    "kind": "para",
    "md": "Счёт «верно 2 из 3» считается так: «частично» в числитель не идёт, но в знаменателе стоит. Если верных вариантов три, а читатель отметил два, он видит «Верно 2 из 3», и третья строка горит жёлтым как пропущенная.",
    "text": "Счёт «верно 2 из 3» считается так: «частично» в числитель не идёт, но в знаменателе стоит. Если верных вариантов три, а читатель отметил два, он видит «Верно 2 из 3», и третья строка горит жёлтым как пропущенная."
  },
  {
    "id": "bible::tri-vida-stroki-otveta-i-otkuda-oni-berutsya::para::103wa2m",
    "kind": "para",
    "md": "Строку-вердикт над разбором можно погасить полем `noVerdict`. Это сделано для страниц, где вариант либо верный, либо нет, и слово «частично» сбивало читателя.",
    "text": "Строку-вердикт над разбором можно погасить полем noVerdict. Это сделано для страниц, где вариант либо верный, либо нет, и слово «частично» сбивало читателя."
  },
  {
    "id": "bible::katalog-hvost-stranicy::heading::j855ti",
    "kind": "heading",
    "level": 2,
    "md": "Каталог: хвост страницы",
    "text": "Каталог: хвост страницы",
    "anchor": "katalog-hvost-stranicy"
  },
  {
    "id": "bible::feedback::heading::detaua",
    "kind": "heading",
    "level": 3,
    "md": "Feedback",
    "text": "Feedback",
    "anchor": "feedback"
  },
  {
    "id": "bible::feedback::para::lcwnk6",
    "kind": "para",
    "md": "Форма мнения в конце содержательной страницы, перед «Читайте также». Это не заявка, не подписка и не контакт продаж: полей имени и телефона в ней нет.",
    "text": "Форма мнения в конце содержательной страницы, перед «Читайте также». Это не заявка, не подписка и не контакт продаж: полей имени и телефона в ней нет."
  },
  {
    "id": "bible::feedback::table::89y4lq",
    "kind": "table",
    "header": [
      "Поле",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Feedback\"`",
        "да",
        ""
      ],
      [
        "`defaultRole`",
        "строка",
        "нет",
        "Роль, выбранная заранее. На страницах трека читатель уже назвал себя тем, что открыл раздел: в «Для НКО» это сотрудник НКО, в «Для компаний» — сотрудник компании. На страницах «Основ» поля нет, их читают обе аудитории."
      ],
      [
        "`roles`",
        "массив строк",
        "нет",
        "Подписи вариантов роли. Раскладка его не заполняет; значения по умолчанию зашиты в компонент."
      ]
    ],
    "text": "Поле | Значения | Обяз. | Что значит | component | \"Feedback\" | да |  | defaultRole | строка | нет | Роль, выбранная заранее. На страницах трека читатель уже назвал себя тем, что открыл раздел: в «Для НКО» это сотрудник НКО, в «Для компаний» — сотрудник компании. На страницах «Основ» поля нет, их читают обе аудитории. | roles | массив строк | нет | Подписи вариантов роли. Раскладка его не заполняет; значения по умолчанию зашиты в компонент."
  },
  {
    "id": "bible::feedback::code::xekid4",
    "kind": "code",
    "lang": "json",
    "body": "{ \"component\": \"Feedback\", \"defaultRole\": \"Сотрудник НКО\" }",
    "text": "{ \"component\": \"Feedback\", \"defaultRole\": \"Сотрудник НКО\" }"
  },
  {
    "id": "bible::feedback::para::11d45p9",
    "kind": "para",
    "md": "Все видимые тексты формы — заголовок, пояснение, подписи полей, кнопка, экран благодарности — в файл не приезжают. Они зашиты в компонент, и разработчик берёт их оттуда.",
    "text": "Все видимые тексты формы — заголовок, пояснение, подписи полей, кнопка, экран благодарности — в файл не приезжают. Они зашиты в компонент, и разработчик берёт их оттуда."
  },
  {
    "id": "bible::feedback::para::r7bv1v",
    "kind": "para",
    "md": "Форма стоит на всех страницах, кроме «О проекте».",
    "text": "Форма стоит на всех страницах, кроме «О проекте»."
  },
  {
    "id": "bible::read-more-i-read-more-item::heading::15u9poi",
    "kind": "heading",
    "level": 3,
    "md": "Read More и Read More Item",
    "text": "Read More и Read More Item",
    "anchor": "read-more-i-read-more-item"
  },
  {
    "id": "bible::read-more-i-read-more-item::para::14sxpe1",
    "kind": "para",
    "md": "«Читайте также» внизу каждой страницы. Стоит во всю ширину страницы, а не колонки.",
    "text": "«Читайте также» внизу каждой страницы. Стоит во всю ширину страницы, а не колонки."
  },
  {
    "id": "bible::read-more-i-read-more-item::table::8igcvk",
    "kind": "table",
    "header": [
      "Поле `Read More`",
      "Значения",
      "Обяз."
    ],
    "rows": [
      [
        "`component`",
        "`\"Read More\"`",
        "да"
      ],
      [
        "`title`",
        "строка",
        "нет фактически, есть у всех 29"
      ],
      [
        "`children`",
        "массив `Read More Item`",
        "да"
      ]
    ],
    "text": "Поле Read More | Значения | Обяз. | component | \"Read More\" | да | title | строка | нет фактически, есть у всех 29 | children | массив Read More Item | да"
  },
  {
    "id": "bible::read-more-i-read-more-item::table::cr5tun",
    "kind": "table",
    "header": [
      "Поле `Read More Item`",
      "Значения",
      "Обяз.",
      "Что значит"
    ],
    "rows": [
      [
        "`component`",
        "`\"Read More Item\"`",
        "да",
        ""
      ],
      [
        "`title`",
        "строка",
        "да",
        "Название страницы."
      ],
      [
        "`href`",
        "путь от корня",
        "да",
        "Адрес."
      ],
      [
        "`description`",
        "строка",
        "нет",
        "Подпись. Сейчас её нет ни у одной карточки: по замечанию клиента от 7 августа 2026 подписи убрали, потому что они пересказывали название своими словами. Поле осталось в формате — вернуть подписи можно, не трогая компонент."
      ]
    ],
    "text": "Поле Read More Item | Значения | Обяз. | Что значит | component | \"Read More Item\" | да |  | title | строка | да | Название страницы. | href | путь от корня | да | Адрес. | description | строка | нет | Подпись. Сейчас её нет ни у одной карточки: по замечанию клиента от 7 августа 2026 подписи убрали, потому что они пересказывали название своими словами. Поле осталось в формате — вернуть подписи можно, не трогая компонент."
  },
  {
    "id": "bible::read-more-i-read-more-item::code::1lw0ku8",
    "kind": "code",
    "lang": "json",
    "body": "{\n  \"component\": \"Read More\",\n  \"title\": \"Читайте также\",\n  \"children\": [\n    { \"component\": \"Read More Item\", \"title\": \"Дорожная карта\", \"href\": \"/ngo/roadmap\" }\n  ]\n}",
    "text": "{\n  \"component\": \"Read More\",\n  \"title\": \"Читайте также\",\n  \"children\": [\n    { \"component\": \"Read More Item\", \"title\": \"Дорожная карта\", \"href\": \"/ngo/roadmap\" }\n  ]\n}"
  },
  {
    "id": "bible::chego-v-fayle-net::heading::85ukz5",
    "kind": "heading",
    "level": 2,
    "md": "Чего в файле нет",
    "text": "Чего в файле нет",
    "anchor": "chego-v-fayle-net"
  },
  {
    "id": "bible::karkas-stranicy::heading::n7rgg3",
    "kind": "heading",
    "level": 3,
    "md": "Каркас страницы",
    "text": "Каркас страницы",
    "anchor": "karkas-stranicy"
  },
  {
    "id": "bible::karkas-stranicy::para::2cm6py",
    "kind": "para",
    "md": "Шапка с большим заголовком (`Hero`), боковое меню (`SidebarMenu`), оглавление страницы (`TableOfContents`), поиск (`Search`) и подвал (`Footer`) в `article` не приезжают. Это обвязка, одинаковая на всём сайте: разработчик собирает её один раз. Данных для верхнего меню и подвала в файле нет вовсе — их он держит у себя. От страницы обвязка берёт два поля: `h1` для шапки и `navTitle` для пункта бокового меню.",
    "text": "Шапка с большим заголовком (Hero), боковое меню (SidebarMenu), оглавление страницы (TableOfContents), поиск (Search) и подвал (Footer) в article не приезжают. Это обвязка, одинаковая на всём сайте: разработчик собирает её один раз. Данных для верхнего меню и подвала в файле нет вовсе — их он держит у себя. От страницы обвязка берёт два поля: h1 для шапки и navTitle для пункта бокового меню."
  },
  {
    "id": "bible::karkas-stranicy::para::itash5",
    "kind": "para",
    "md": "Оглавление страницы строится из заголовков `H2` и их якорей — отдельного блока для него в файле нет.",
    "text": "Оглавление страницы строится из заголовков H2 и их якорей — отдельного блока для него в файле нет."
  },
  {
    "id": "bible::komponenty-bez-svoego-uzla::heading::1u6ie9b",
    "kind": "heading",
    "level": 3,
    "md": "Компоненты без своего узла",
    "text": "Компоненты без своего узла",
    "anchor": "komponenty-bez-svoego-uzla"
  },
  {
    "id": "bible::komponenty-bez-svoego-uzla::para::dvp58q",
    "kind": "para",
    "md": "`Small Image` приезжает полем `image` у карточки — слагом сюжета. `External Link` и `Tooltip` живут внутри текста тегами, а не отдельными узлами: и ссылка, и подсказка — часть предложения, вынуть их в блок нельзя.",
    "text": "Small Image приезжает полем image у карточки — слагом сюжета. External Link и Tooltip живут внутри текста тегами, а не отдельными узлами: и ссылка, и подсказка — часть предложения, вынуть их в блок нельзя."
  },
  {
    "id": "bible::komponenty-bez-svoego-uzla::para::1vmss3n",
    "kind": "para",
    "md": "Кнопка (`Button`), поля ввода (`Input`, `Textarea`, `Dropdown`, `Search`) и переключатели (`Checkbox`, `Radio`) в содержимом страниц не встречаются: они собираются внутри формы мнения и внутри квиза, а те приезжают своими узлами.",
    "text": "Кнопка (Button), поля ввода (Input, Textarea, Dropdown, Search) и переключатели (Checkbox, Radio) в содержимом страниц не встречаются: они собираются внутри формы мнения и внутри квиза, а те приезжают своими узлами."
  },
  {
    "id": "bible::to-chto-est-v-formate-no-poka-ne-vstrechaetsya::heading::olacj1",
    "kind": "heading",
    "level": 3,
    "md": "То, что есть в формате, но пока не встречается",
    "text": "То, что есть в формате, но пока не встречается",
    "anchor": "to-chto-est-v-formate-no-poka-ne-vstrechaetsya"
  },
  {
    "id": "bible::to-chto-est-v-formate-no-poka-ne-vstrechaetsya::para::1ohkx0v",
    "kind": "para",
    "md": "`Page Summary`, `Card Button`, `Compare` и `Compare Card` описаны в формате и показаны на эталонной странице `/source/sample`, но в выгрузке сайта их сейчас нет. Причины разные: анонс страницы убрали с сайта, кнопки ещё не расставили, пары сравнения не разметили.",
    "text": "Page Summary, Card Button, Compare и Compare Card описаны в формате и показаны на эталонной странице /source/sample, но в выгрузке сайта их сейчас нет. Причины разные: анонс страницы убрали с сайта, кнопки ещё не расставили, пары сравнения не разметили."
  },
  {
    "id": "bible::chego-net-v-samoy-sisteme::heading::12rw7ne",
    "kind": "heading",
    "level": 3,
    "md": "Чего нет в самой системе",
    "text": "Чего нет в самой системе",
    "anchor": "chego-net-v-samoy-sisteme"
  },
  {
    "id": "bible::chego-net-v-samoy-sisteme::para::1y55geb",
    "kind": "para",
    "md": "Это не пробелы формата, а известные дыры набора компонентов. Ссылки как отдельного компонента нет. Именованной врезки «Важно» нет — её роль закрывает карточка с жёлтым фоном. Крошек и переходов «предыдущая и следующая страница» нет. Разделительной линии в потоке текста нет.",
    "text": "Это не пробелы формата, а известные дыры набора компонентов. Ссылки как отдельного компонента нет. Именованной врезки «Важно» нет — её роль закрывает карточка с жёлтым фоном. Крошек и переходов «предыдущая и следующая страница» нет. Разделительной линии в потоке текста нет."
  },
  {
    "id": "bible::chto-proveryaet-mashina::heading::10y9pz3",
    "kind": "heading",
    "level": 2,
    "md": "Что проверяет машина",
    "text": "Что проверяет машина",
    "anchor": "chto-proveryaet-mashina"
  },
  {
    "id": "bible::chto-proveryaet-mashina::para::a39cwr",
    "kind": "para",
    "md": "Договорённости с разработчиком переписаны в машинные проверки: [exportChecks.ts](prototype/src/editor-source/site/exportChecks.ts). Они идут по готовой выгрузке, а не по дереву внутри инструмента, потому что разработчик видит именно её. Результат виден на странице `/checks`. Сборку эти проверки не роняют — они показывают список проблем.",
    "text": "Договорённости с разработчиком переписаны в машинные проверки: exportChecks.ts. Они идут по готовой выгрузке, а не по дереву внутри инструмента, потому что разработчик видит именно её. Результат виден на странице /checks. Сборку эти проверки не роняют — они показывают список проблем."
  },
  {
    "id": "bible::chto-proveryaet-mashina::para::1rmpxn3",
    "kind": "para",
    "md": "Проверяется форма, а не содержание: пустое, битое, противоречивое, задвоенное, не по договорённости. Вкусовщину сюда не тащим, её ловит глаз.",
    "text": "Проверяется форма, а не содержание: пустое, битое, противоречивое, задвоенное, не по договорённости. Вкусовщину сюда не тащим, её ловит глаз."
  },
  {
    "id": "bible::chto-proveryaet-mashina::para::az6p8v",
    "kind": "para",
    "md": "Степени: **high** — везём разработчику брак, **medium** — разъезд с договорённостью, **low** — мелочь.",
    "text": "Степени: high — везём разработчику брак, medium — разъезд с договорённостью, low — мелочь."
  },
  {
    "id": "bible::na-lyubom-uzle::heading::l3qfvs",
    "kind": "heading",
    "level": 3,
    "md": "На любом узле",
    "text": "На любом узле",
    "anchor": "na-lyubom-uzle"
  },
  {
    "id": "bible::na-lyubom-uzle::table::1m2n1co",
    "kind": "table",
    "header": [
      "Правило",
      "Степень",
      "Что ловит"
    ],
    "rows": [
      [
        "`имя-компонента`",
        "high",
        "Компонента нет в списке из 24 имён."
      ],
      [
        "`пустой-конверт`",
        "high",
        "Контейнер без содержимого — на странице это пустая рамка."
      ],
      [
        "`служебное-поле`",
        "medium",
        "В файл уехало `at`, `join` или `ordered`."
      ],
      [
        "`перечисление-не-строчное`",
        "medium",
        "`marker`, `variant`, `orientation`, `state` или `tone` не строчными."
      ],
      [
        "`иконка-не-заведена`",
        "medium",
        "Опечатка в имени иконки либо иконка не заведена в реестре."
      ],
      [
        "`узел-задвоен`",
        "medium",
        "Два соседних узла совпадают слово в слово."
      ]
    ],
    "text": "Правило | Степень | Что ловит | имя-компонента | high | Компонента нет в списке из 24 имён. | пустой-конверт | high | Контейнер без содержимого — на странице это пустая рамка. | служебное-поле | medium | В файл уехало at, join или ordered. | перечисление-не-строчное | medium | marker, variant, orientation, state или tone не строчными. | иконка-не-заведена | medium | Опечатка в имени иконки либо иконка не заведена в реестре. | узел-задвоен | medium | Два соседних узла совпадают слово в слово."
  },
  {
    "id": "bible::v-tekste-lyubogo-polya::heading::1qspqko",
    "kind": "heading",
    "level": 3,
    "md": "В тексте любого поля",
    "text": "В тексте любого поля",
    "anchor": "v-tekste-lyubogo-polya"
  },
  {
    "id": "bible::v-tekste-lyubogo-polya::table::atfvse",
    "kind": "table",
    "header": [
      "Правило",
      "Степень",
      "Что ловит"
    ],
    "rows": [
      [
        "`остатки-разметки`",
        "high",
        "Звёздочки, ссылка в markdown, решётки, фигурные скобки, двойное экранирование — перевод в теги где-то не сработал."
      ],
      [
        "`пустой-текст`",
        "high",
        "Текстовое поле пустое."
      ],
      [
        "`битый-символ`",
        "high",
        "Ромбик вместо буквы: текст прошёл через неверную перекодировку."
      ],
      [
        "`список-символами`",
        "medium",
        "Маркер «•» внутри текста или перечисление дефисами в одной строке — списком это не станет."
      ],
      [
        "`перенос-в-поле`",
        "medium",
        "Перенос строки внутри поля: в вёрстке абзацы схлопнутся в один."
      ],
      [
        "`пустой-тег`",
        "medium",
        "Тег без содержимого."
      ],
      [
        "`след-курса`",
        "medium",
        "Слова курса на сайте: «модуль», «пройдите тест» и подобные."
      ],
      [
        "`двойной-пробел`",
        "low",
        "Два пробела подряд."
      ]
    ],
    "text": "Правило | Степень | Что ловит | остатки-разметки | high | Звёздочки, ссылка в markdown, решётки, фигурные скобки, двойное экранирование — перевод в теги где-то не сработал. | пустой-текст | high | Текстовое поле пустое. | битый-символ | high | Ромбик вместо буквы: текст прошёл через неверную перекодировку. | список-символами | medium | Маркер «•» внутри текста или перечисление дефисами в одной строке — списком это не станет. | перенос-в-поле | medium | Перенос строки внутри поля: в вёрстке абзацы схлопнутся в один. | пустой-тег | medium | Тег без содержимого. | след-курса | medium | Слова курса на сайте: «модуль», «пройдите тест» и подобные. | двойной-пробел | low | Два пробела подряд."
  },
  {
    "id": "bible::ssylki::heading::1w86fgn",
    "kind": "heading",
    "level": 3,
    "md": "Ссылки",
    "text": "Ссылки",
    "anchor": "ssylki"
  },
  {
    "id": "bible::ssylki::table::hg7194",
    "kind": "table",
    "header": [
      "Правило",
      "Степень",
      "Что ловит"
    ],
    "rows": [
      [
        "`ссылка-пустая`",
        "high",
        "Ссылка без адреса."
      ],
      [
        "`ссылка-заглушка`",
        "high",
        "Адрес с `localhost`, `example.com` или `TODO`."
      ],
      [
        "`ссылка-в-никуда`",
        "high",
        "Внутренняя ссылка ведёт на адрес, которого на сайте нет."
      ],
      [
        "`ссылка-протокол`",
        "high",
        "Адрес не по правилу «внешняя с протоколом, внутренняя от корня»."
      ],
      [
        "`ссылка-без-пометки`",
        "medium",
        "Внешняя ссылка без `rel=\"external\"`."
      ],
      [
        "`ссылка-без-шифрования`",
        "low",
        "Ссылка по `http://` вместо `https://`."
      ]
    ],
    "text": "Правило | Степень | Что ловит | ссылка-пустая | high | Ссылка без адреса. | ссылка-заглушка | high | Адрес с localhost, example.com или TODO. | ссылка-в-никуда | high | Внутренняя ссылка ведёт на адрес, которого на сайте нет. | ссылка-протокол | high | Адрес не по правилу «внешняя с протоколом, внутренняя от корня». | ссылка-без-пометки | medium | Внешняя ссылка без rel=\"external\". | ссылка-без-шифрования | low | Ссылка по http:// вместо https://."
  },
  {
    "id": "bible::raskladka-i-otdelnye-komponenty::heading::1x6tjnj",
    "kind": "heading",
    "level": 3,
    "md": "Раскладка и отдельные компоненты",
    "text": "Раскладка и отдельные компоненты",
    "anchor": "raskladka-i-otdelnye-komponenty"
  },
  {
    "id": "bible::raskladka-i-otdelnye-komponenty::table::khenav",
    "kind": "table",
    "header": [
      "Правило",
      "Степень",
      "Что ловит"
    ],
    "rows": [
      [
        "`в-секции-без-конверта`",
        "medium",
        "В раздел напрямую положили то, что нужно заворачивать в `Block`."
      ],
      [
        "`якорь-дубль`",
        "high",
        "Такой якорь на странице уже занят."
      ],
      [
        "`якорь-пустой` · `якорь-не-латиница`",
        "medium",
        "У заголовка нет якоря или он не из латинских букв, цифр и дефисов."
      ],
      [
        "`цитата-неполная`",
        "high",
        "У цитаты нет организации, логотипа или текста."
      ],
      [
        "`организация-битая`",
        "high и medium",
        "Непарная кавычка в названии, название со строчной буквы, имя автора внутри названия."
      ],
      [
        "`цитата-без-автора`",
        "medium",
        "У цитаты нет ни имени, ни фото."
      ],
      [
        "`цвет-карточки`",
        "medium",
        "`bgColor` не из семи цветов."
      ],
      [
        "`карточка-без-заголовка`",
        "medium",
        "У карточки нет `title` — вероятно, заголовок остался первым абзацем внутри."
      ],
      [
        "`таблица-рваная`",
        "high",
        "В строке ячеек не столько, сколько колонок в шапке."
      ],
      [
        "`таблица-без-шапки` · `таблица-без-строк`",
        "high",
        "Нет `header` или нет ни одной строки."
      ],
      [
        "`таблица-пустые-ячейки`",
        "medium",
        "Пустые ячейки — обычно съехавшая разметка после потерянного объединения."
      ],
      [
        "`таблица-без-подписи` · `подпись-не-называет`",
        "medium",
        "Нет `caption` либо подпись начинается со служебной строки и таблицу не называет."
      ],
      [
        "`квиз-без-вопроса` · `квиз-без-вариантов` · `квиз-без-верного`",
        "high",
        "Читателю нечего отвечать, нет вариантов, ни один не отмечен верным."
      ],
      [
        "`квиз-режим`",
        "high и medium",
        "`mode` разошёлся с числом верных вариантов."
      ],
      [
        "`квиз-пустой-вариант`",
        "high",
        "Пустой вариант ответа."
      ],
      [
        "`квиз-дубль-варианта`",
        "medium",
        "Вариант повторяется."
      ],
      [
        "`квиз-без-разбора`",
        "low",
        "Нет `explanation`."
      ],
      [
        "`список-смешанный`",
        "high",
        "Маркер контейнера не `icon`, а у части пунктов своя иконка — похоже, склеены два разных списка."
      ],
      [
        "`список-из-одного`",
        "low",
        "Нумерованный список из одного пункта: счёт начнётся заново у следующего."
      ],
      [
        "`медиа-без-адреса`",
        "high",
        "У картинки нет `src`, у видео нет `href`."
      ],
      [
        "`картинка-без-подписи`",
        "low",
        "У картинки нет `alt`."
      ],
      [
        "`человек-без-имени`",
        "high",
        "У человека нет имени."
      ],
      [
        "`человек-без-фото`",
        "low",
        "У человека нет фотографии."
      ],
      [
        "`фото-адресом`",
        "medium",
        "Фото задано путём, а у цитат — именем файла: два правила на одно и то же."
      ]
    ],
    "text": "Правило | Степень | Что ловит | в-секции-без-конверта | medium | В раздел напрямую положили то, что нужно заворачивать в Block. | якорь-дубль | high | Такой якорь на странице уже занят. | якорь-пустой · якорь-не-латиница | medium | У заголовка нет якоря или он не из латинских букв, цифр и дефисов. | цитата-неполная | high | У цитаты нет организации, логотипа или текста. | организация-битая | high и medium | Непарная кавычка в названии, название со строчной буквы, имя автора внутри названия. | цитата-без-автора | medium | У цитаты нет ни имени, ни фото. | цвет-карточки | medium | bgColor не из семи цветов. | карточка-без-заголовка | medium | У карточки нет title — вероятно, заголовок остался первым абзацем внутри. | таблица-рваная | high | В строке ячеек не столько, сколько колонок в шапке. | таблица-без-шапки · таблица-без-строк | high | Нет header или нет ни одной строки. | таблица-пустые-ячейки | medium | Пустые ячейки — обычно съехавшая разметка после потерянного объединения. | таблица-без-подписи · подпись-не-называет | medium | Нет caption либо подпись начинается со служебной строки и таблицу не называет. | квиз-без-вопроса · квиз-без-вариантов · квиз-без-верного | high | Читателю нечего отвечать, нет вариантов, ни один не отмечен верным. | квиз-режим | high и medium | mode разошёлся с числом верных вариантов. | квиз-пустой-вариант | high | Пустой вариант ответа. | квиз-дубль-варианта | medium | Вариант повторяется. | квиз-без-разбора | low | Нет explanation. | список-смешанный | high | Маркер контейнера не icon, а у части пунктов своя иконка — похоже, склеены два разных списка. | список-из-одного | low | Нумерованный список из одного пункта: счёт начнётся заново у следующего. | медиа-без-адреса | high | У картинки нет src, у видео нет href. | картинка-без-подписи | low | У картинки нет alt. | человек-без-имени | high | У человека нет имени. | человек-без-фото | low | У человека нет фотографии. | фото-адресом | medium | Фото задано путём, а у цитат — именем файла: два правила на одно и то же."
  },
  {
    "id": "bible::stranica-celikom::heading::1fg0n87",
    "kind": "heading",
    "level": 3,
    "md": "Страница целиком",
    "text": "Страница целиком",
    "anchor": "stranica-celikom"
  },
  {
    "id": "bible::stranica-celikom::table::1wfv63o",
    "kind": "table",
    "header": [
      "Правило",
      "Степень",
      "Что ловит"
    ],
    "rows": [
      [
        "`страница-без-h1`",
        "high",
        "У страницы нет заголовка."
      ],
      [
        "`мета-пусто`",
        "high",
        "Пустой `title` или `description`: вкладка и выдача поиска останутся без названия и подписи."
      ],
      [
        "`страница-дубль`",
        "high",
        "Такой адрес в выгрузке уже есть."
      ],
      [
        "`мета-дубль`",
        "medium",
        "Описание слово в слово совпадает с другой страницей — поиск сочтёт страницы одинаковыми."
      ],
      [
        "`страница-вне-навигации`",
        "medium",
        "Страница есть в выгрузке, но в меню её нет: читатель на неё не попадёт."
      ],
      [
        "`заголовок-задвоен`",
        "medium",
        "Два раздела с одинаковым `H2` — в оглавлении будут две одинаковые строки."
      ],
      [
        "`страница-тупик`",
        "medium",
        "Внизу нет «Читайте также» — читателю некуда идти дальше."
      ],
      [
        "`мета-длина`",
        "low",
        "`title` длиннее 65 знаков или `description` длиннее 160: в выдаче обрежется."
      ]
    ],
    "text": "Правило | Степень | Что ловит | страница-без-h1 | high | У страницы нет заголовка. | мета-пусто | high | Пустой title или description: вкладка и выдача поиска останутся без названия и подписи. | страница-дубль | high | Такой адрес в выгрузке уже есть. | мета-дубль | medium | Описание слово в слово совпадает с другой страницей — поиск сочтёт страницы одинаковыми. | страница-вне-навигации | medium | Страница есть в выгрузке, но в меню её нет: читатель на неё не попадёт. | заголовок-задвоен | medium | Два раздела с одинаковым H2 — в оглавлении будут две одинаковые строки. | страница-тупик | medium | Внизу нет «Читайте также» — читателю некуда идти дальше. | мета-длина | low | title длиннее 65 знаков или description длиннее 160: в выдаче обрежется."
  },
  {
    "id": "bible::chto-esche-ne-resheno::heading::znm90q",
    "kind": "heading",
    "level": 2,
    "md": "Что ещё не решено",
    "text": "Что ещё не решено",
    "anchor": "chto-esche-ne-resheno"
  },
  {
    "id": "bible::chto-esche-ne-resheno::para::1hq496b",
    "kind": "para",
    "md": "Здесь только то, что ждёт ответа или материалов. Всё решённое разошлось по разделам выше.",
    "text": "Здесь только то, что ждёт ответа или материалов. Всё решённое разошлось по разделам выше."
  },
  {
    "id": "bible::zhdem-otveta-razrabotchika::heading::w5elau",
    "kind": "heading",
    "level": 3,
    "md": "Ждём ответа разработчика",
    "text": "Ждём ответа разработчика",
    "anchor": "zhdem-otveta-razrabotchika"
  },
  {
    "id": "bible::zhdem-otveta-razrabotchika::table::13ybl5d",
    "kind": "table",
    "header": [
      "Вопрос",
      "Где мы сейчас"
    ],
    "rows": [
      [
        "Имена `Block` и `Stack` в самой Figma",
        "Переименование согласовано 30 июля 2026, в данных имена уже новые. В макете пока старые: `Card Container` и `List Container`. Там же ждут правки имена свойств `orient` и `txt`."
      ],
      [
        "Как устроен квиз в конструкторе",
        "Самый дорогой вопрос: от ответа зависит, что мы кладём в `items`."
      ],
      [
        "Состояние варианта ответа строкой вместо `correct: true`",
        "Мы возражаем и объяснили почему: состояние появляется только после ответа читателя."
      ],
      [
        "Набор иконок для кнопок",
        "Предложили `download`, `copy`, `arrow-right`, `check`, `external-link`, `mail`. В реестре прототипа из них заведён только `check`."
      ],
      [
        "Умолчание для места иконки в кнопке",
        "Мы предполагаем, что без поля иконка слева."
      ],
      [
        "Формат подсказки к термину",
        "Предлагали два варианта, в коде работает третий: `<tooltip title=\"…\" description=\"…\">`. Словаря терминов с ключами нет."
      ],
      [
        "Показывать ли подпись у сложных таблиц",
        "Сейчас все подписи визуально скрыты."
      ],
      [
        "Формат адреса логотипа",
        "Сейчас едет имя файла. Если у разработчика свой префикс пути, скажите какой."
      ],
      [
        "Оставляем ли размеры и уровни заголовков заглавными",
        "Мы предложили оставить, ответа не было."
      ],
      [
        "Иконки Lucide подходят или нужны свои",
        "Ответа не было."
      ]
    ],
    "text": "Вопрос | Где мы сейчас | Имена Block и Stack в самой Figma | Переименование согласовано 30 июля 2026, в данных имена уже новые. В макете пока старые: Card Container и List Container. Там же ждут правки имена свойств orient и txt. | Как устроен квиз в конструкторе | Самый дорогой вопрос: от ответа зависит, что мы кладём в items. | Состояние варианта ответа строкой вместо correct: true | Мы возражаем и объяснили почему: состояние появляется только после ответа читателя. | Набор иконок для кнопок | Предложили download, copy, arrow-right, check, external-link, mail. В реестре прототипа из них заведён только check. | Умолчание для места иконки в кнопке | Мы предполагаем, что без поля иконка слева. | Формат подсказки к термину | Предлагали два варианта, в коде работает третий: <tooltip title=\"…\" description=\"…\">. Словаря терминов с ключами нет. | Показывать ли подпись у сложных таблиц | Сейчас все подписи визуально скрыты. | Формат адреса логотипа | Сейчас едет имя файла. Если у разработчика свой префикс пути, скажите какой. | Оставляем ли размеры и уровни заголовков заглавными | Мы предложили оставить, ответа не было. | Иконки Lucide подходят или нужны свои | Ответа не было."
  },
  {
    "id": "bible::zhdem-nashey-raboty::heading::16fpgdp",
    "kind": "heading",
    "level": 3,
    "md": "Ждём нашей работы",
    "text": "Ждём нашей работы",
    "anchor": "zhdem-nashey-raboty"
  },
  {
    "id": "bible::zhdem-nashey-raboty::para::bgmezz",
    "kind": "para",
    "md": "Кнопки в содержании не расставлены: в исходном тексте их не было, и проставить их нужно осознанно. Термины в тексте не размечены — это отдельная работа по всем страницам. Пары сравнения тоже пока не размечены.",
    "text": "Кнопки в содержании не расставлены: в исходном тексте их не было, и проставить их нужно осознанно. Термины в тексте не размечены — это отдельная работа по всем страницам. Пары сравнения тоже пока не размечены."
  },
  {
    "id": "bible::zhdem-materialov::heading::1y3yi6q",
    "kind": "heading",
    "level": 3,
    "md": "Ждём материалов",
    "text": "Ждём материалов",
    "anchor": "zhdem-materialov"
  },
  {
    "id": "bible::zhdem-materialov::para::e3ar8l",
    "kind": "para",
    "md": "Картинка для карточки в мессенджерах не нарисована, поэтому `image` в `meta-og` едет пустым. Значок вкладки временный. Семь фотографий авторов цитат заказчик пока не прислал: имена файлов мы придумали заранее и положили под ними серые силуэты, поэтому верстать можно уже сейчас — когда фотографии придут, мы просто перезапишем файлы под теми же именами, и в выгрузке ничего не изменится.",
    "text": "Картинка для карточки в мессенджерах не нарисована, поэтому image в meta-og едет пустым. Значок вкладки временный. Семь фотографий авторов цитат заказчик пока не прислал: имена файлов мы придумали заранее и положили под ними серые силуэты, поэтому верстать можно уже сейчас — когда фотографии придут, мы просто перезапишем файлы под теми же именами, и в выгрузке ничего не изменится."
  },
  {
    "id": "bible::kak-zdes-ostavit-zamechanie::heading::1jdc6p6",
    "kind": "heading",
    "level": 2,
    "md": "Как здесь оставить замечание",
    "text": "Как здесь оставить замечание",
    "anchor": "kak-zdes-ostavit-zamechanie"
  },
  {
    "id": "bible::kak-zdes-ostavit-zamechanie::para::1u305ac",
    "kind": "para",
    "md": "Кликните по любому месту справочника — заголовку, абзацу, строке таблицы, примеру, — и справа откроется форма. Замечание привяжется именно к этому месту, и оно подсветится жёлтым, чтобы разговор было видно прямо в тексте.",
    "text": "Кликните по любому месту справочника — заголовку, абзацу, строке таблицы, примеру, — и справа откроется форма. Замечание привяжется именно к этому месту, и оно подсветится жёлтым, чтобы разговор было видно прямо в тексте."
  },
  {
    "id": "bible::kak-zdes-ostavit-zamechanie::para::3zxjwj",
    "kind": "para",
    "md": "Если замечание относится сразу к нескольким местам — например, к правилу и примеру под ним, — добавьте их кликом с зажатым Shift. Панель покажет, сколько мест выделено, и одно замечание встанет ко всем сразу.",
    "text": "Если замечание относится сразу к нескольким местам — например, к правилу и примеру под ним, — добавьте их кликом с зажатым Shift. Панель покажет, сколько мест выделено, и одно замечание встанет ко всем сразу."
  },
  {
    "id": "bible::kak-zdes-ostavit-zamechanie::para::11a0pt0",
    "kind": "para",
    "md": "Имя вводится один раз и дальше подставляется само. Замечания видят все: они лежат на общем сервере, а не в браузере автора.",
    "text": "Имя вводится один раз и дальше подставляется само. Замечания видят все: они лежат на общем сервере, а не в браузере автора."
  },
  {
    "id": "bible::kak-zdes-ostavit-zamechanie::para::nne8ea",
    "kind": "para",
    "md": "**Что происходит дальше.** Мы читаем замечание, правим справочник и, если речь про сам формат, правим код, который собирает выгрузку. После этого у замечания загорается зелёная метка «учтено», и рядом появляется разбор: что сделали, что именно тронули — только описание или уже и формат, — а также как было и как стало.",
    "text": "Что происходит дальше. Мы читаем замечание, правим справочник и, если речь про сам формат, правим код, который собирает выгрузку. После этого у замечания загорается зелёная метка «учтено», и рядом появляется разбор: что сделали, что именно тронули — только описание или уже и формат, — а также как было и как стало."
  },
  {
    "id": "bible::kak-zdes-ostavit-zamechanie::para::eqzhtp",
    "kind": "para",
    "md": "Если ответ не устроил, напишите реплику прямо под замечанием. Оно снова встанет в очередь работы с меткой «новый раунд», и мы вернёмся к нему ещё раз. Вся история разговора остаётся на месте: старые записи разбора не переписываются.",
    "text": "Если ответ не устроил, напишите реплику прямо под замечанием. Оно снова встанет в очередь работы с меткой «новый раунд», и мы вернёмся к нему ещё раз. Вся история разговора остаётся на месте: старые записи разбора не переписываются."
  },
  {
    "id": "bible::kak-podderzhivat-etot-dokument::heading::1p4len",
    "kind": "heading",
    "level": 2,
    "md": "Как поддерживать этот документ",
    "text": "Как поддерживать этот документ",
    "anchor": "kak-podderzhivat-etot-dokument"
  },
  {
    "id": "bible::kak-podderzhivat-etot-dokument::para::1mup6h",
    "kind": "para",
    "md": "Документ описывает формат на 12 августа 2026. Правда живёт в коде, поэтому при расхождении верить нужно коду, а документ править.",
    "text": "Документ описывает формат на 12 августа 2026. Правда живёт в коде, поэтому при расхождении верить нужно коду, а документ править."
  },
  {
    "id": "bible::kak-podderzhivat-etot-dokument::para::pcgvi8",
    "kind": "para",
    "md": "Что делать при изменениях:",
    "text": "Что делать при изменениях:"
  },
  {
    "id": "bible::kak-podderzhivat-etot-dokument::list::1bzzg8k",
    "kind": "list",
    "items": [
      "**Добавили компонент** — впишите его в список из 24 имён здесь и заведите в контракте выгрузки, иначе сборка не пройдёт.",
      "**Добавили поле** — опишите его в таблице соответствующего компонента: значение, обязательность, смысл.",
      "**Взяли новую иконку** — добавьте имя в список из 23 и заведите иконку в реестре прототипа, иначе разработчик получит ключ, который никто не подключал.",
      "**Разработчик ответил на вопрос** — перенесите ответ в нужный раздел и уберите строку из «Что ещё не решено»."
    ],
    "text": "Добавили компонент — впишите его в список из 24 имён здесь и заведите в контракте выгрузки, иначе сборка не пройдёт. ¶ Добавили поле — опишите его в таблице соответствующего компонента: значение, обязательность, смысл. ¶ Взяли новую иконку — добавьте имя в список из 23 и заведите иконку в реестре прототипа, иначе разработчик получит ключ, который никто не подключал. ¶ Разработчик ответил на вопрос — перенесите ответ в нужный раздел и уберите строку из «Что ещё не решено»."
  },
  {
    "id": "bible::kak-podderzhivat-etot-dokument::para::18anmyl",
    "kind": "para",
    "md": "Числа в документе (сколько карточек, какие цвета встречаются) — это срез живой выгрузки, а не правило. Они показывают, чем формат пользуются на самом деле, и устаревают вместе с содержанием.",
    "text": "Числа в документе (сколько карточек, какие цвета встречаются) — это срез живой выгрузки, а не правило. Они показывают, чем формат пользуются на самом деле, и устаревают вместе с содержанием."
  }
];

export const bibleToc: BibleTocItem[] = [
  {
    "level": 2,
    "anchor": "ustroystvo-fayla",
    "text": "Устройство файла"
  },
  {
    "level": 3,
    "anchor": "koren",
    "text": "Корень"
  },
  {
    "level": 3,
    "anchor": "stranica",
    "text": "Страница"
  },
  {
    "level": 3,
    "anchor": "meta",
    "text": "Мета"
  },
  {
    "level": 2,
    "anchor": "vosem-skvoznyh-pravil",
    "text": "Восемь сквозных правил"
  },
  {
    "level": 3,
    "anchor": "1-imya-komponenta-iz-zakrytogo-spiska-title-case-s-probelami",
    "text": "1. Имя компонента — из закрытого списка, Title Case с пробелами"
  },
  {
    "level": 3,
    "anchor": "2-znacheniya-perechisleniya-edut-strochnymi-shkaly-zaglavnym",
    "text": "2. Значения-перечисления едут строчными, шкалы — заглавными"
  },
  {
    "level": 3,
    "anchor": "3-pustyh-poley-v-fayle-net",
    "text": "3. Пустых полей в файле нет"
  },
  {
    "level": 3,
    "anchor": "4-sluzhebnyh-poley-net",
    "text": "4. Служебных полей нет"
  },
  {
    "level": 3,
    "anchor": "5-tekst-edet-s-tegami-a-ne-v-markdown",
    "text": "5. Текст едет с тегами, а не в markdown"
  },
  {
    "level": 3,
    "anchor": "6-ssylka-naruzhu-s-protokolom-i-s-pometkoy",
    "text": "6. Ссылка наружу — с протоколом и с пометкой"
  },
  {
    "level": 3,
    "anchor": "7-ikonka-edet-klyuchom-a-ne-kartinkoy",
    "text": "7. Иконка едет ключом, а не картинкой"
  },
  {
    "level": 3,
    "anchor": "8-marker-spiska-svoystvo-spiska-a-ne-punkta",
    "text": "8. Маркер списка — свойство списка, а не пункта"
  },
  {
    "level": 2,
    "anchor": "kak-sobiraetsya-stranica",
    "text": "Как собирается страница"
  },
  {
    "level": 3,
    "anchor": "glavnoe-pravilo-raskladki",
    "text": "Главное правило раскладки"
  },
  {
    "level": 3,
    "anchor": "otstupy-i-shirina",
    "text": "Отступы и ширина"
  },
  {
    "level": 2,
    "anchor": "katalog-tekst-i-spiski",
    "text": "Каталог: текст и списки"
  },
  {
    "level": 3,
    "anchor": "heading",
    "text": "Heading"
  },
  {
    "level": 3,
    "anchor": "text",
    "text": "Text"
  },
  {
    "level": 3,
    "anchor": "phrase",
    "text": "Phrase"
  },
  {
    "level": 3,
    "anchor": "stack",
    "text": "Stack"
  },
  {
    "level": 3,
    "anchor": "list-item",
    "text": "List Item"
  },
  {
    "level": 2,
    "anchor": "katalog-konteynery",
    "text": "Каталог: контейнеры"
  },
  {
    "level": 3,
    "anchor": "section-container",
    "text": "Section Container"
  },
  {
    "level": 3,
    "anchor": "block",
    "text": "Block"
  },
  {
    "level": 3,
    "anchor": "page-summary",
    "text": "Page Summary"
  },
  {
    "level": 2,
    "anchor": "katalog-kartochki-i-vrezki",
    "text": "Каталог: карточки и врезки"
  },
  {
    "level": 3,
    "anchor": "general-card",
    "text": "General Card"
  },
  {
    "level": 3,
    "anchor": "quote",
    "text": "Quote"
  },
  {
    "level": 3,
    "anchor": "accordion",
    "text": "Accordion"
  },
  {
    "level": 3,
    "anchor": "prompt",
    "text": "Prompt"
  },
  {
    "level": 3,
    "anchor": "compare-i-compare-card",
    "text": "Compare и Compare Card"
  },
  {
    "level": 3,
    "anchor": "card-button",
    "text": "Card Button"
  },
  {
    "level": 2,
    "anchor": "katalog-tablicy",
    "text": "Каталог: таблицы"
  },
  {
    "level": 3,
    "anchor": "table",
    "text": "Table"
  },
  {
    "level": 3,
    "anchor": "table-cell",
    "text": "Table cell"
  },
  {
    "level": 2,
    "anchor": "kak-rabotaet-tablica-s-obedinennymi-yacheykami",
    "text": "Как работает таблица с объединёнными ячейками"
  },
  {
    "level": 3,
    "anchor": "glavnoe-pravilo",
    "text": "Главное правило"
  },
  {
    "level": 3,
    "anchor": "obedinenie-vniz",
    "text": "Объединение вниз"
  },
  {
    "level": 3,
    "anchor": "obedinenie-vbok",
    "text": "Объединение вбок"
  },
  {
    "level": 3,
    "anchor": "oba-obedineniya-srazu",
    "text": "Оба объединения сразу"
  },
  {
    "level": 3,
    "anchor": "kak-chitat-stroki-pri-sborke",
    "text": "Как читать строки при сборке"
  },
  {
    "level": 3,
    "anchor": "kak-proverit-chto-tablica-celaya",
    "text": "Как проверить, что таблица целая"
  },
  {
    "level": 3,
    "anchor": "chego-v-obedineniyah-ne-byvaet",
    "text": "Чего в объединениях не бывает"
  },
  {
    "level": 3,
    "anchor": "otkuda-obedineniya-berutsya-u-nas",
    "text": "Откуда объединения берутся у нас"
  },
  {
    "level": 2,
    "anchor": "katalog-media-i-lyudi",
    "text": "Каталог: медиа и люди"
  },
  {
    "level": 3,
    "anchor": "image",
    "text": "Image"
  },
  {
    "level": 3,
    "anchor": "video",
    "text": "Video"
  },
  {
    "level": 3,
    "anchor": "person-item",
    "text": "Person Item"
  },
  {
    "level": 3,
    "anchor": "small-image",
    "text": "Small Image"
  },
  {
    "level": 2,
    "anchor": "katalog-kviz",
    "text": "Каталог: квиз"
  },
  {
    "level": 3,
    "anchor": "quiz",
    "text": "Quiz"
  },
  {
    "level": 3,
    "anchor": "tri-vida-stroki-otveta-i-otkuda-oni-berutsya",
    "text": "Три вида строки ответа и откуда они берутся"
  },
  {
    "level": 2,
    "anchor": "katalog-hvost-stranicy",
    "text": "Каталог: хвост страницы"
  },
  {
    "level": 3,
    "anchor": "feedback",
    "text": "Feedback"
  },
  {
    "level": 3,
    "anchor": "read-more-i-read-more-item",
    "text": "Read More и Read More Item"
  },
  {
    "level": 2,
    "anchor": "chego-v-fayle-net",
    "text": "Чего в файле нет"
  },
  {
    "level": 3,
    "anchor": "karkas-stranicy",
    "text": "Каркас страницы"
  },
  {
    "level": 3,
    "anchor": "komponenty-bez-svoego-uzla",
    "text": "Компоненты без своего узла"
  },
  {
    "level": 3,
    "anchor": "to-chto-est-v-formate-no-poka-ne-vstrechaetsya",
    "text": "То, что есть в формате, но пока не встречается"
  },
  {
    "level": 3,
    "anchor": "chego-net-v-samoy-sisteme",
    "text": "Чего нет в самой системе"
  },
  {
    "level": 2,
    "anchor": "chto-proveryaet-mashina",
    "text": "Что проверяет машина"
  },
  {
    "level": 3,
    "anchor": "na-lyubom-uzle",
    "text": "На любом узле"
  },
  {
    "level": 3,
    "anchor": "v-tekste-lyubogo-polya",
    "text": "В тексте любого поля"
  },
  {
    "level": 3,
    "anchor": "ssylki",
    "text": "Ссылки"
  },
  {
    "level": 3,
    "anchor": "raskladka-i-otdelnye-komponenty",
    "text": "Раскладка и отдельные компоненты"
  },
  {
    "level": 3,
    "anchor": "stranica-celikom",
    "text": "Страница целиком"
  },
  {
    "level": 2,
    "anchor": "chto-esche-ne-resheno",
    "text": "Что ещё не решено"
  },
  {
    "level": 3,
    "anchor": "zhdem-otveta-razrabotchika",
    "text": "Ждём ответа разработчика"
  },
  {
    "level": 3,
    "anchor": "zhdem-nashey-raboty",
    "text": "Ждём нашей работы"
  },
  {
    "level": 3,
    "anchor": "zhdem-materialov",
    "text": "Ждём материалов"
  },
  {
    "level": 2,
    "anchor": "kak-zdes-ostavit-zamechanie",
    "text": "Как здесь оставить замечание"
  },
  {
    "level": 2,
    "anchor": "kak-podderzhivat-etot-dokument",
    "text": "Как поддерживать этот документ"
  }
];
