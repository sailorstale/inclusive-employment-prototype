import type { PageQuotes } from "./types";

/*
  «ЗАПУСК ПРОГРАММЫ» — /ngo/start, модуль m6-1.
*/

const SECTION = "/source/m6-1::pochemu-dlya-nko-vazhen-inklyuzivnyy-podhod";

/*
  БЛАГОДАРНОСТЬ СОФЬИ ЮДИНОЙ — замечание Юли от 10 августа 2026: «оформить как
  цитату, но без фото».

  Шесть абзацев подряд, которые сейчас читаются как обычный текст, — это прямая
  речь благополучателя фонда. Разделом выше на этой же странице уже стоит такая
  же цитата Людмилы Писаренко, и рядом с ней сплошной текст благодарности видно
  особенно хорошо.

  Блоков семь: строка авторства (её нет в источнике, она вставлена слоем правок —
  см. clientEdits/ngoStart.ts) и шесть абзацев речи.

  Логотип фонда «Спина бифида» подставится сам: он есть в каталоге
  (public/figma/logos/spina-bifida.png), а название разбор берёт из кавычек в
  строке авторства.
*/
export const ngoStartQuotes: PageQuotes = {
  page: "/ngo/start",
  quotes: [
    {
      blocks: [
        `${SECTION}::paragraph::1kbcqgo`,
        `${SECTION}::paragraph::sufei7`,
        `${SECTION}::paragraph::1lfv9h3`,
        `${SECTION}::paragraph::1wqmfld`,
        `${SECTION}::paragraph::1dyshvy`,
        `${SECTION}::paragraph::1mzuczm`,
        `${SECTION}::paragraph::6m9syw`,
      ],
      noPhoto: true,
    },
  ],
};
