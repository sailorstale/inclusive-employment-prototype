/*
  ОБЛОЖКИ СТРАНИЦ — изображение в шапке, на уровне h1 (своё на каждой странице).

  В JSON едет в блоке meta рядом с h1: { meta: { …, cover: { src } } }. Пока
  пусто — заполняется по мере появления ассетов; пустой src на сайте не
  рисуется, но место в структуре зарезервировано под каждую страницу.

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
  "/general/legal": { src: "" },
  "/general/legal/contract": { src: "" },
  "/general/legal/benefits": { src: "" },
  "/general/legal/quotas": { src: "" },
  "/general/legal/status": { src: "" },
  "/general/legal/faq": { src: "" },
  "/general/team": { src: "" },

  "/companies/hire/step-1": { src: "" },
  "/companies/hire/step-2": { src: "" },
  "/companies/hire/step-3": { src: "" },
  "/companies/hire/step-4": { src: "" },
  "/companies/hire/step-5": { src: "" },
  "/companies/hire/step-6": { src: "" },

  "/ngo/start": { src: "" },
  "/ngo/audience": { src: "" },
  "/ngo/candidates": { src: "" },
  "/ngo/candidates/guidance": { src: "" },
  "/ngo/candidates/psychology": { src: "" },
  "/ngo/candidates/vacancies": { src: "" },
  "/ngo/employers": { src: "" },
  "/ngo/employers/talks": { src: "" },
  "/ngo/support": { src: "" },
  "/ngo/scale": { src: "" },
  "/ngo/funding": { src: "" },
};

/** Обложка страницы по slug (пустая, если не задана). */
export function coverFor(slug: string): Cover {
  return COVERS[slug] ?? EMPTY;
}
