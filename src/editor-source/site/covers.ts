/*
  ОБЛОЖКИ СТРАНИЦ — изображение в шапке, на уровне h1 (своё на каждой странице).

  В ВЫГРУЗКУ ОБЛОЖКА НЕ ЕДЕТ — решение дизайнера 7 августа 2026. Недолго она
  лежала внутри meta полем image, но мета описывает страницу для браузера и
  поиска, а обложка — видимая картинка в шапке. Здесь остаётся список для
  сайта: пустой адрес не рисуется, место под каждую страницу зарезервировано и
  заполняется по мере появления ассетов.

  ПОДПИСИ (alt) у обложки НЕТ — замечание разработчика. Обложка декоративная:
  поверх неё лежит заголовок страницы, и он же несёт весь смысл. Подпись к
  такой картинке скринридер прочёл бы вторым заголовком, повторив то, что уже
  сказано. В разметке она остаётся картинкой с пустой подписью.
*/
export type Cover = { src: string };

const EMPTY: Cover = { src: "" };

const COVERS: Record<string, Cover> = {
  "/general/about": { src: "" },
  "/general/start": { src: "" },
  "/general/how": { src: "" },
  "/general/contract": { src: "" },
  "/general/benefits": { src: "" },
  "/general/formats": { src: "" },
  "/general/quotas": { src: "" },
  "/general/documents": { src: "" },
  "/general/team": { src: "" },

  "/companies/step-1": { src: "" },
  "/companies/step-2": { src: "" },
  "/companies/step-3": { src: "" },
  "/companies/step-4": { src: "" },
  "/companies/step-5": { src: "" },
  "/companies/step-6": { src: "" },

  "/ngo/start": { src: "" },
  "/ngo/audience": { src: "" },
  "/ngo/candidates": { src: "" },
  "/ngo/guidance": { src: "" },
  "/ngo/psychology": { src: "" },
  "/ngo/vacancies": { src: "" },
  "/ngo/resume": { src: "" },
  "/ngo/interview": { src: "" },
  "/ngo/employers": { src: "" },
  "/ngo/talks": { src: "" },
  "/ngo/support": { src: "" },
  "/ngo/roadmap": { src: "" },
  "/ngo/scale": { src: "" },
  "/ngo/funding": { src: "" },
};

/** Обложка страницы по slug (пустая, если не задана). */
export function coverFor(slug: string): Cover {
  return COVERS[slug] ?? EMPTY;
}
