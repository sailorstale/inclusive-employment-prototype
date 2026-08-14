import type { PageCards } from "./types";

/*
  «Профориентация» — /ngo/candidates/guidance, модуль m6-2.

  КАРТОЧКИ «ВАЖНО» ПО ЗАМЕЧАНИЯМ КЛИЕНТА. На каждом из этих абзацев стоит
  замечание «важное»: мысль подводит черту под разбором и обычным текстом
  теряется между соседними абзацами. Жёлтая карточка с названием «Важно» её
  выделяет.

  Адрес блока — «страница::раздел::вид::отпечаток», он же виден в карте блоков
  (/blocks). Блоки каждой карточки взяты по одному: клиент отметил ровно один
  абзац, и захватывать соседние нельзя.
*/
export const ngoGuidanceCards: PageCards = {
  page: "/ngo/candidates/guidance",
  cards: [
    /* «Важно не путать профориентацию с подбором вакансий.…» */
    { blocks: ["/source/m6-2::chto-takoe-proforientaciya-i-kogda-ona-nuzhna::paragraph::16wdwo7"], title: "Важно" },
    /* «Результат второго этапа: есть понимание, какие направления…» */
    { blocks: ["/source/m6-2::kak-provodit-proforientaciyu-poshagovyy-plan-dly::paragraph::1721ag4"], title: "Важно" },
    /* «Результат этапа: заполненный профиль кандидата со всеми да…» */
    { blocks: ["/source/m6-2::kak-provodit-proforientaciyu-poshagovyy-plan-dly::paragraph::1nm8dip"], title: "Важно" },
    /* «Результат третьего этапа: соискатель с инвалидностью поним…» */
    { blocks: ["/source/m6-2::kak-provodit-proforientaciyu-poshagovyy-plan-dly::paragraph::bpn79r"], title: "Важно" },
    /* «Результат четвёртого этапа: у вас есть несколько карьерных…» */
    { blocks: ["/source/m6-2::kak-provodit-proforientaciyu-poshagovyy-plan-dly::paragraph::1qh2tx6"], title: "Важно" },
    /* «Результат этапа: одна или несколько гипотез стали понятнее…» */
    { blocks: ["/source/m6-2::kak-provodit-proforientaciyu-poshagovyy-plan-dly::paragraph::c8890b"], title: "Важно" },
    /* «Важно: экскурсия не обязывает соискателя соглашаться на ра…» */
    { blocks: ["/source/m6-2::kak-provodit-proforientaciyu-poshagovyy-plan-dly::paragraph::1c2pxlf"], title: "Важно" },
    /* «При выборе гипотезы ориентируйтесь на то, что:…» */
    { blocks: ["/source/m6-2::kak-provodit-proforientaciyu-poshagovyy-plan-dly::paragraph::8guri2"], title: "Важно" },
    /* «При этом важно, чтобы подготовительный этап не превращался…» */
    { blocks: ["/source/m6-2::kak-provodit-proforientaciyu-poshagovyy-plan-dly::paragraph::7oku8d"], title: "Важно" },
    /* «Важно: если человек пока не готов к трудоустройству, это н…» */
    { blocks: ["/source/m6-2::kak-provodit-proforientaciyu-poshagovyy-plan-dly::paragraph::1az3i5z"], title: "Важно" },
  ],
};
