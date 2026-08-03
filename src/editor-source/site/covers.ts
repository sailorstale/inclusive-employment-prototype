/*
  ОБЛОЖКИ СТРАНИЦ — изображение в шапке, на уровне h1 (своё на каждой странице).

  В JSON едет блоком header рядом с h1: { header: { h1, cover: { src, alt } } }.
  Пока пусто — заполняется по мере появления ассетов; пустой src на сайте
  не рисуется, но место в структуре зарезервировано под каждую страницу.
*/
export type Cover = { src: string; alt: string };

const EMPTY: Cover = { src: "", alt: "" };

const COVERS: Record<string, Cover> = {
  "/general/start": { src: "", alt: "" },
  "/general/how": { src: "", alt: "" },
  "/general/legal": { src: "", alt: "" },
  "/general/legal/contract": { src: "", alt: "" },
  "/general/legal/benefits": { src: "", alt: "" },
  "/general/legal/quotas": { src: "", alt: "" },
  "/general/legal/status": { src: "", alt: "" },
  "/general/legal/faq": { src: "", alt: "" },
  "/general/team": { src: "", alt: "" },

  "/companies/hire/step-1": { src: "", alt: "" },
  "/companies/hire/step-2": { src: "", alt: "" },
  "/companies/hire/step-3": { src: "", alt: "" },
  "/companies/hire/step-4": { src: "", alt: "" },
  "/companies/hire/step-5": { src: "", alt: "" },
  "/companies/hire/step-6": { src: "", alt: "" },

  "/ngo/start": { src: "", alt: "" },
  "/ngo/audience": { src: "", alt: "" },
  "/ngo/candidates": { src: "", alt: "" },
  "/ngo/candidates/guidance": { src: "", alt: "" },
  "/ngo/candidates/psychology": { src: "", alt: "" },
  "/ngo/candidates/vacancies": { src: "", alt: "" },
  "/ngo/employers": { src: "", alt: "" },
  "/ngo/employers/talks": { src: "", alt: "" },
  "/ngo/support": { src: "", alt: "" },
  "/ngo/scale": { src: "", alt: "" },
  "/ngo/funding": { src: "", alt: "" },
};

/** Обложка страницы по slug (пустая, если не задана). */
export function coverFor(slug: string): Cover {
  return COVERS[slug] ?? EMPTY;
}
