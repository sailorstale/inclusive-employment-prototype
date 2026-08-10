import { OSNOVY_PAGES } from "./pageMap";

/*
  «Читайте также» — какие страницы предложить внизу каждой (по 3 релевантных
  соседа). Это обвязка страницы, не контент источника. Адрес ссылки — путь от
  корня («/general/legal»), как нужно разработчику; решётку прототипа
  приписывает показ, а не данные.

  ПОДПИСЕЙ У КАРТОЧЕК БОЛЬШЕ НЕТ — замечание клиента 7 августа 2026: карточка
  показывает только название страницы. Прежние подписи пересказывали название
  своими словами, и читатель дважды получал одно и то же. Поле description у
  компонента осталось необязательным, так что вернуть их можно здесь же.
*/

// Три релевантных соседа для каждой страницы.
const RELATED: Record<string, string[]> = {
  /*
    Со страницы о самом проекте ведём ТОЛЬКО в «Основы» — замечание клиента
    7 августа 2026. Раньше отсюда предлагали «Шаг 1» из трека для компаний и
    «Запустить программу» из трека для НКО: читатель, который ещё не прочёл ни
    строчки про инклюзивное трудоустройство, попадал сразу в чужую практику.

    Три страницы — это путь новичка по «Основам»: сперва про само явление, потом
    про то, как устроен наём, потом про общение с человеком.
  */
  "/general/about": ["/general/start", "/general/how", "/general/team"],
  "/general/start": ["/general/how", "/general/legal/contract", "/general/team"],
  "/general/how": ["/general/legal/contract", "/general/team", "/general/start"],
  "/general/legal/contract": [
    "/general/legal/benefits",
    "/general/legal/formats",
    "/general/legal/quotas",
  ],
  "/general/legal/benefits": [
    "/general/legal/formats",
    "/general/legal/contract",
    "/general/legal/quotas",
  ],
  "/general/legal/formats": [
    "/general/legal/benefits",
    "/general/legal/contract",
    "/general/legal/quotas",
  ],
  "/general/legal/quotas": [
    "/general/legal/benefits",
    "/general/legal/formats",
    "/general/legal/contract",
  ],
  /*
    «Полезные документы» — список нормативки без своих разделов, и до сих пор
    это была единственная страница сайта без «Читайте также»: читатель дочитывал
    список законов, и дальше идти было некуда. Ведём в те три правовые страницы,
    чьи темы этот список и разбирает: постановление о квоте — «Квоты и
    господдержка», Трудовой кодекс и порядок ИПРА — «Договор и оформление»,
    льготы и гарантии — «Льготы сотрудников».
  */
  "/general/legal/documents": [
    "/general/legal/quotas",
    "/general/legal/contract",
    "/general/legal/benefits",
  ],
  "/general/team": ["/general/how", "/general/start", "/general/legal/contract"],

  // Внутри трека ведём читателя по шагам: следующий, через один и предыдущий.
  "/companies/hire/step-1": [
    "/companies/hire/step-2",
    "/companies/hire/step-3",
    "/general/how",
  ],
  "/companies/hire/step-2": [
    "/companies/hire/step-3",
    "/companies/hire/step-4",
    "/companies/hire/step-1",
  ],
  "/companies/hire/step-3": [
    "/companies/hire/step-4",
    "/companies/hire/step-5",
    "/companies/hire/step-2",
  ],
  "/companies/hire/step-4": [
    "/companies/hire/step-5",
    "/companies/hire/step-6",
    "/companies/hire/step-3",
  ],
  "/companies/hire/step-5": [
    "/companies/hire/step-6",
    "/companies/hire/step-4",
    "/general/team",
  ],
  "/companies/hire/step-6": [
    "/companies/hire/step-1",
    "/companies/hire/step-5",
    "/general/legal/quotas",
  ],

  "/ngo/start": ["/ngo/audience", "/ngo/candidates", "/ngo/employers"],
  "/ngo/audience": ["/ngo/candidates", "/ngo/employers", "/ngo/start"],
  "/ngo/candidates": [
    "/ngo/candidates/guidance",
    "/ngo/candidates/psychology",
    "/ngo/candidates/vacancies",
  ],
  "/ngo/candidates/guidance": [
    "/ngo/candidates/psychology",
    "/ngo/candidates/vacancies",
    "/ngo/candidates",
  ],
  "/ngo/candidates/psychology": [
    "/ngo/candidates/vacancies",
    "/ngo/candidates/guidance",
    "/ngo/candidates",
  ],
  /*
    Три страницы подбора идут друг за другом по ходу работы: сначала выбор
    вакансии, потом резюме, потом подготовка к встрече. Поэтому первая карточка
    у каждой — следующий шаг этого пути.
  */
  "/ngo/candidates/vacancies": [
    "/ngo/candidates/resume",
    "/ngo/candidates/interview",
    "/ngo/candidates/guidance",
  ],
  "/ngo/candidates/resume": [
    "/ngo/candidates/interview",
    "/ngo/candidates/vacancies",
    "/ngo/candidates",
  ],
  "/ngo/candidates/interview": [
    "/ngo/support",
    "/ngo/candidates/resume",
    "/ngo/candidates/vacancies",
  ],
  "/ngo/employers": ["/ngo/employers/talks", "/ngo/support", "/general/how"],
  "/ngo/employers/talks": ["/ngo/support", "/ngo/employers", "/general/how"],
  "/ngo/support": ["/ngo/roadmap", "/ngo/scale", "/ngo/employers/talks"],
  "/ngo/roadmap": ["/ngo/scale", "/ngo/funding", "/ngo/support"],
  "/ngo/scale": ["/ngo/funding", "/ngo/roadmap", "/ngo/start"],
  "/ngo/funding": ["/ngo/scale", "/ngo/roadmap", "/ngo/audience"],
};

export type RelatedCard = { title: string; href: string };

/** Карточки «Читайте также» для страницы по её slug. */
export function relatedFor(slug: string): RelatedCard[] {
  return (RELATED[slug] ?? [])
    .map((s) => {
      const page = OSNOVY_PAGES.find((p) => p.slug === s);
      if (!page) return null;
      /*
        Адрес — обычный путь от корня, без решётки: он уезжает разработчику, а
        на боевом сайте решётки нет. Прототип приписывает её при показе сам
        (previewHref в richText).
      */
      return { title: page.title, href: s };
    })
    .filter((x): x is RelatedCard => x !== null);
}
