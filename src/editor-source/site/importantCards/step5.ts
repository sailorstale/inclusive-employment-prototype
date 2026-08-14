import type { PageCards } from "./types";

/*
  «Шаг 5. Онбординг» — /companies/hire/step-5, модуль m5-3.

  КАРТОЧКИ «ВАЖНО» ПО ЗАМЕЧАНИЯМ КЛИЕНТА. На каждом из этих абзацев стоит
  замечание «важное»: мысль подводит черту под разбором и обычным текстом
  теряется между соседними абзацами. Жёлтая карточка с названием «Важно» её
  выделяет.

  Адрес блока — «страница::раздел::вид::отпечаток», он же виден в карте блоков
  (/blocks). Блоки каждой карточки взяты по одному: клиент отметил ровно один
  абзац, и захватывать соседние нельзя.
*/
export const step5Cards: PageCards = {
  page: "/companies/hire/step-5",
  cards: [
    /* «Важно не путать разумную адаптацию с гиперопекой. Разумная…» */
    { blocks: ["/source/m5-3::pochemu-adaptaciya-vazhna-dlya-novichkov::paragraph::1ljvthu"], title: "Важно" },
    /* «Если сотрудника с инвалидностью чрезмерно оберегают, избег…» */
    { blocks: ["/source/m5-3::pochemu-adaptaciya-vazhna-dlya-novichkov::paragraph::gzei95"], title: "Важно" },
    /* «При этом важно не объяснять любые сложности инвалидностью …» */
    { blocks: ["/source/m5-3::chto-delat-esli-adaptaciya-idet-ne-po-planu::paragraph::m27eof"], title: "Важно" },
  ],
};
