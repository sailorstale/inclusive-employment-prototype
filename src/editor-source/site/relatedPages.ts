import { OSNOVY_PAGES } from "./pageMap";

/*
  «Читайте также» — какие страницы «Основ» предложить внизу каждой (по 3
  релевантных соседа) и короткая навигационная подпись к каждой. Подписи
  основаны на реальном содержании страниц; это обвязка страницы, не контент
  источника. Ссылки хэшевые (HashRouter): `#` + slug.
*/

// Короткая подпись страницы для карточки «Читайте также».
const BLURB: Record<string, string> = {
  "/general/start":
    "Медицинская и социальная модель, кто такие соискатели, мифы и факты.",
  "/general/how": "Участники найма, сценарии поиска и работа с НКО.",
  "/general/legal": "Оформление, льготы, квоты и особые ситуации — обзор раздела.",
  "/general/legal/contract":
    "Трудовой договор, справка об инвалидности, ИПРА, условия труда.",
  "/general/legal/benefits":
    "Льготы сотрудникам, ГПХ и самозанятость, сохранение пособий.",
  "/general/legal/quotas":
    "Что такое квоты, как их выполнить и меры господдержки.",
  "/general/legal/status":
    "Недееспособность и увольнение сотрудника с инвалидностью.",
  "/general/legal/faq": "Частые вопросы, ответы и короткая самопроверка.",
  "/general/team":
    "Как корректно говорить и общаться, инклюзивные мероприятия.",
};

// Три релевантных соседа для каждой страницы.
const RELATED: Record<string, string[]> = {
  "/general/start": ["/general/how", "/general/legal", "/general/team"],
  "/general/how": ["/general/legal", "/general/team", "/general/start"],
  "/general/legal": [
    "/general/legal/contract",
    "/general/legal/benefits",
    "/general/legal/quotas",
  ],
  "/general/legal/contract": [
    "/general/legal/benefits",
    "/general/legal/quotas",
    "/general/legal/status",
  ],
  "/general/legal/benefits": [
    "/general/legal/contract",
    "/general/legal/quotas",
    "/general/legal/faq",
  ],
  "/general/legal/quotas": [
    "/general/legal/benefits",
    "/general/legal/contract",
    "/general/legal/faq",
  ],
  "/general/legal/status": [
    "/general/legal/contract",
    "/general/legal/faq",
    "/general/legal/benefits",
  ],
  "/general/legal/faq": [
    "/general/legal/contract",
    "/general/legal/benefits",
    "/general/legal/quotas",
  ],
  "/general/team": ["/general/how", "/general/start", "/general/legal"],
};

export type RelatedCard = { title: string; description: string; href: string };

/** Карточки «Читайте также» для страницы по её slug. */
export function relatedFor(slug: string): RelatedCard[] {
  return (RELATED[slug] ?? [])
    .map((s) => {
      const page = OSNOVY_PAGES.find((p) => p.slug === s);
      if (!page) return null;
      return { title: page.title, description: BLURB[s] ?? "", href: `#${s}` };
    })
    .filter((x): x is RelatedCard => x !== null);
}
