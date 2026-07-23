import type { Doc, Node } from "./contentTree";

/*
  ЭТАЛОННАЯ СТРАНИЦА для разработчика.

  Задача — не «показать красиво», а дать ПОЛНЫЙ набор того, что вообще может
  появиться в выгрузке: каждый вид узла и каждый значимый вариант. Разработчик
  берёт JSON этой страницы, собирает её в конструкторе и сравнивает с превью
  справа. Сошлось — формат понят верно и на боевых модулях сюрпризов не будет.

  Собрано как настоящая страница, а не свалка компонентов: так проверяются и
  отступы между соседями, и вложенность, и склейка конвертов.

  Текст намеренно содержит инлайн-разметку (**жирный**, *курсив*, ссылка) —
  в выгрузке она превращается в теги, и это тоже нужно проверить.

  ВАЖНО: здесь только те узлы, которые умеет выдавать выгрузка. Compare, Quiz и
  Card Button есть в библиотеке компонентов, но раскладка их пока не собирает —
  в JSON они не появятся, поэтому и на эталон не выносим.
*/

/** Все фоны General Card: фон — это роль, а не украшение. */
const CARD_BG = [
  { bg: "blue", label: "Синий — обычная" },
  { bg: "yellow", label: "Жёлтый — важное" },
  { bg: "pink", label: "Розовый — опасное" },
  { bg: "green", label: "Зелёный — позитив" },
  { bg: "white", label: "Белый" },
  { bg: "beige", label: "Бежевый" },
  { bg: "gray", label: "Серый" },
];

const card = (bg: string, title: string, text: string): Node => ({
  component: "General Card",
  orient: "Vertical",
  bgColor: bg,
  title,
  children: [{ component: "Text", size: "M", text }],
});

export function buildSampleDoc(): Doc {
  return {
    module: "sample",
    children: [
      /*
        Page Summary живёт ВНЕ секций — это вступление всей страницы. Свой
        заголовок («На этой странице вы узнаете») компонент рисует сам, поэтому
        Heading внутрь не кладём: он бы задвоился.
      */
      {
        component: "Page Summary",
        children: [
          {
            component: "Text",
            size: "L",
            text: "Эталонный набор компонентов для проверки выгрузки в конструкторе.",
          },
          {
            component: "List Container",
            ordered: false,
            children: [
              {
                component: "List Item",
                size: "L",
                type: "Dot",
                text: "каждый вид узла, который встречается в JSON;",
              },
              {
                component: "List Item",
                size: "L",
                type: "Dot",
                text: "все варианты фона, размеров и состояний;",
              },
              {
                component: "List Item",
                size: "L",
                type: "Dot",
                text: "инлайн-разметка: теги в тексте.",
              },
            ],
          },
        ],
      },

      // ── Секция 1: типографика ───────────────────────────────────────────
      {
        component: "Section Container",
        anchor: "typography",
        children: [
          { component: "Heading", level: "H2", text: "Заголовки и текст" },
          { component: "Heading", level: "H3", text: "Заголовок третьего уровня" },
          { component: "Heading", level: "H4", text: "Заголовок четвёртого уровня" },
          { component: "Heading", level: "H5", text: "Заголовок пятого уровня" },
          {
            component: "Text",
            size: "XL",
            text: "Text XL — лид страницы, крупный вводный абзац.",
          },
          {
            component: "Text",
            size: "L",
            text: "Text L — основной текст страницы. Здесь **жирное начертание**, здесь *курсив*, а здесь [ссылка на источник](https://inclusion.yandex.ru/job/). В выгрузке всё это станет тегами.",
          },
          {
            component: "Text",
            size: "M",
            text: "Text M — пояснение. Такой размер используется внутри карточек и аккордеонов.",
          },
          { component: "Text", size: "S", text: "Text S — сноска, мелкий текст." },
          {
            component: "Card Container",
            orientation: "Vertical",
            children: [
              {
                component: "Phrase",
                size: "L",
                text: "Phrase L — фраза-врезка: акцентная мысль без автора.",
              },
              {
                component: "Phrase",
                size: "M",
                text: "Phrase M — компактная врезка.",
              },
            ],
          },
        ],
      },

      // ── Секция 2: списки ────────────────────────────────────────────────
      {
        component: "Section Container",
        anchor: "lists",
        children: [
          { component: "Heading", level: "H2", text: "Списки" },
          { component: "Heading", level: "H4", text: "Маркированный, маркер «точка»" },
          {
            component: "List Container",
            ordered: false,
            children: [
              { component: "List Item", size: "L", type: "Dot", text: "первый пункт;" },
              { component: "List Item", size: "L", type: "Dot", text: "второй пункт;" },
              {
                component: "List Item",
                size: "L",
                type: "Dot",
                text: "третий пункт с **выделением** внутри.",
              },
            ],
          },
          { component: "Heading", level: "H4", text: "Маркер «галочка»" },
          {
            component: "List Container",
            ordered: false,
            children: [
              { component: "List Item", size: "L", type: "Icon", text: "подходит для перечня решений;" },
              { component: "List Item", size: "L", type: "Icon", text: "визуально мягче точки." },
            ],
          },
          { component: "Heading", level: "H4", text: "Нумерованный" },
          {
            component: "List Container",
            ordered: true,
            children: [
              { component: "List Item", size: "L", type: "Number", text: "первый шаг;" },
              { component: "List Item", size: "L", type: "Number", text: "второй шаг;" },
              { component: "List Item", size: "L", type: "Number", text: "третий шаг." },
            ],
          },
          { component: "Heading", level: "H4", text: "Размер M (внутри компонентов)" },
          {
            component: "List Container",
            ordered: false,
            children: [
              { component: "List Item", size: "M", type: "Dot", text: "пункт размера M;" },
              { component: "List Item", size: "M", type: "Dot", text: "используется в карточках." },
            ],
          },
        ],
      },

      // ── Секция 3: карточки ──────────────────────────────────────────────
      {
        component: "Section Container",
        anchor: "cards",
        children: [
          { component: "Heading", level: "H2", text: "Карточки" },
          {
            component: "Text",
            size: "L",
            text: "Фон карточки — это её роль, а не украшение. Ниже все варианты.",
          },
          // Каждая роль — в СВОЁМ конверте: разные по сущности не склеиваются.
          ...CARD_BG.map(
            (c): Node => ({
              component: "Card Container",
              orientation: "Vertical",
              children: [
                card(c.bg, c.label, `Пример карточки с фоном «${c.bg}».`),
              ],
            }),
          ),
          { component: "Heading", level: "H4", text: "Пара в ряд (Horizontal)" },
          {
            component: "Card Container",
            orientation: "Horizontal",
            children: [
              card("blue", "Первая", "Две карточки по половине колонки."),
              card("blue", "Вторая", "Ориентация задаётся конверту, не карточке."),
            ],
          },
          { component: "Heading", level: "H4", text: "С иконкой и без заголовка" },
          {
            component: "Card Container",
            orientation: "Vertical",
            children: [
              {
                component: "General Card",
                orient: "Vertical",
                bgColor: "blue",
                icon: "Users",
                title: "С иконкой",
                children: [
                  { component: "Text", size: "M", text: "Иконка подбирается по смыслу текста." },
                ],
              },
              {
                component: "General Card",
                orient: "Vertical",
                bgColor: "gray",
                children: [
                  { component: "Text", size: "M", text: "Карточка без заголовка — только текст." },
                ],
              },
            ],
          },
        ],
      },

      // ── Секция 4: аккордеоны ────────────────────────────────────────────
      {
        component: "Section Container",
        anchor: "accordions",
        children: [
          { component: "Heading", level: "H2", text: "Аккордеоны" },
          {
            component: "Card Container",
            orientation: "Vertical",
            children: [
              {
                component: "Accordion",
                state: "Collapsed",
                question: "Свёрнутый по умолчанию",
                children: [
                  {
                    component: "Text",
                    size: "M",
                    text: "Ответ раскрывается по клику. Внутри может быть любой контент.",
                  },
                  {
                    component: "List Container",
                    ordered: false,
                    children: [
                      { component: "List Item", size: "M", type: "Dot", text: "в том числе список;" },
                      { component: "List Item", size: "M", type: "Dot", text: "и несколько абзацев." },
                    ],
                  },
                ],
              },
              {
                component: "Accordion",
                state: "Expanded",
                question: "Раскрытый по умолчанию",
                children: [
                  {
                    component: "Text",
                    size: "M",
                    text: "Состояние задаётся в директиве и попадает в выгрузку.",
                  },
                ],
              },
            ],
          },
        ],
      },

      // ── Секция 5: цитаты ────────────────────────────────────────────────
      {
        component: "Section Container",
        anchor: "quotes",
        children: [
          { component: "Heading", level: "H2", text: "Цитаты" },
          {
            component: "Card Container",
            orientation: "Vertical",
            children: [
              {
                component: "Quote",
                size: "L",
                author: "Имя Фамилия",
                role: "должность в компании",
                org: "Еверленд",
                logo: "everlend",
                paragraphs: [
                  "Цитата размера L — акцентная, с автором, должностью и логотипом организации.",
                  "Второй абзац цитаты.",
                ],
              },
            ],
          },
          {
            component: "Card Container",
            orientation: "Vertical",
            children: [
              {
                component: "Quote",
                size: "S",
                author: "Имя Фамилия",
                role: "эксперт по инклюзивному трудоустройству",
                yandex: true,
                paragraphs: ["Цитата размера S — спокойная, автор из Яндекса."],
              },
            ],
          },
        ],
      },

      // ── Секция 6: таблица ───────────────────────────────────────────────
      {
        component: "Section Container",
        anchor: "table",
        children: [
          { component: "Heading", level: "H2", text: "Таблица" },
          {
            component: "Card Container",
            orientation: "Vertical",
            children: [
              {
                component: "Table",
                header: ["Критерий", "Трудовой договор", "Самозанятость"],
                rows: [
                  ["Оплачиваемый отпуск", "30 календарных дней", "Нет"],
                  ["Больничный", "Да", "Нет"],
                  ["Закрытие квоты", "**Да**", "Нет"],
                ],
              },
            ],
          },
        ],
      },

      // ── Секция 7: медиа и заготовка ─────────────────────────────────────
      {
        component: "Section Container",
        anchor: "media",
        children: [
          { component: "Heading", level: "H2", text: "Медиа и заготовка" },
          { component: "Heading", level: "H4", text: "Картинка" },
          {
            component: "Card Container",
            orientation: "Vertical",
            children: [
              {
                component: "Image",
                src: "/figma/illustrations/teamwork.svg",
                alt: "Иллюстрация: совместная работа",
              },
            ],
          },
          { component: "Heading", level: "H4", text: "Видео" },
          {
            component: "Card Container",
            orientation: "Vertical",
            children: [{ component: "Video" }],
          },
          { component: "Heading", level: "H4", text: "Заготовка «Скопировать»" },
          {
            component: "Card Container",
            orientation: "Vertical",
            children: [
              {
                component: "Prompt",
                title: "Шаблон письма кандидату",
                warning: "Проверьте текст перед отправкой.",
                text: "Здравствуйте! Мы рассмотрели ваш отклик и хотели бы пригласить вас на встречу.",
              },
            ],
          },
        ],
      },
    ],
  };
}
