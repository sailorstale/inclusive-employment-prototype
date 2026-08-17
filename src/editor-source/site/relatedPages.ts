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
  "/general/start": ["/general/how", "/general/contract", "/general/team"],
  "/general/how": ["/general/contract", "/general/team", "/general/start"],
  "/general/contract": [
    "/general/benefits",
    "/general/formats",
    "/general/quotas",
  ],
  "/general/benefits": [
    "/general/formats",
    "/general/contract",
    "/general/quotas",
  ],
  "/general/formats": [
    "/general/benefits",
    "/general/contract",
    "/general/quotas",
  ],
  "/general/quotas": [
    "/general/benefits",
    "/general/formats",
    "/general/contract",
  ],
  /*
    «Полезные документы» — список нормативки без своих разделов, и до сих пор
    это была единственная страница сайта без «Читайте также»: читатель дочитывал
    список законов, и дальше идти было некуда. Ведём в те три правовые страницы,
    чьи темы этот список и разбирает: постановление о квоте — «Квоты и
    господдержка», Трудовой кодекс и порядок ИПРА — «Договор и оформление»,
    льготы и гарантии — «Льготы сотрудников».
  */
  "/general/documents": [
    "/general/quotas",
    "/general/contract",
    "/general/benefits",
  ],
  "/general/team": ["/general/how", "/general/start", "/general/contract"],

  /*
    Внутри трека ведём читателя по шагам: следующий, через один и предыдущий.

    ВСЕ ТРИ КАРТОЧКИ — СВОЕГО РАЗДЕЛА (решение Мити от 13 августа 2026). Раньше
    у трёх шагов третья ссылка уводила в «Основы»: с первого шага — на «Как
    устроен наём», с пятого — на «Этику и коммуникацию», с шестого — на «Квоты
    и господдержку». Человек читает трек подряд, как инструкцию, и карточка в
    чужой раздел выбивала его из этого чтения.

    У первого шага предыдущего нет, поэтому там три следующих подряд.
  */
  "/companies/step-1": [
    "/companies/step-2",
    "/companies/step-3",
    "/companies/step-4",
  ],
  "/companies/step-2": [
    "/companies/step-3",
    "/companies/step-4",
    "/companies/step-1",
  ],
  "/companies/step-3": [
    "/companies/step-4",
    "/companies/step-5",
    "/companies/step-2",
  ],
  "/companies/step-4": [
    "/companies/step-5",
    "/companies/step-6",
    "/companies/step-3",
  ],
  "/companies/step-5": [
    "/companies/step-6",
    "/companies/step-4",
    "/companies/step-3",
  ],
  /*
    Шестой шаг последний, поэтому первой карточкой возвращаем читателя к началу
    трека: затраты считают, когда весь путь уже понятен, и естественный
    следующий ход — пройти его ещё раз осознанно.
  */
  "/companies/step-6": [
    "/companies/step-1",
    "/companies/step-5",
    "/companies/step-4",
  ],

  "/ngo/start": ["/ngo/audience", "/ngo/candidates", "/ngo/employers"],
  "/ngo/audience": ["/ngo/candidates", "/ngo/employers", "/ngo/start"],
  "/ngo/candidates": [
    "/ngo/guidance",
    "/ngo/psychology",
    "/ngo/vacancies",
  ],
  "/ngo/guidance": [
    "/ngo/psychology",
    "/ngo/vacancies",
    "/ngo/candidates",
  ],
  "/ngo/psychology": [
    "/ngo/vacancies",
    "/ngo/guidance",
    "/ngo/candidates",
  ],
  /*
    Три страницы подбора идут друг за другом по ходу работы: сначала выбор
    вакансии, потом резюме, потом подготовка к встрече. Поэтому первая карточка
    у каждой — следующий шаг этого пути.
  */
  "/ngo/vacancies": [
    "/ngo/resume",
    "/ngo/interview",
    "/ngo/guidance",
  ],
  "/ngo/resume": [
    "/ngo/interview",
    "/ngo/vacancies",
    "/ngo/candidates",
  ],
  "/ngo/interview": [
    "/ngo/support",
    "/ngo/resume",
    "/ngo/vacancies",
  ],
  /*
    Обе страницы про работодателей раньше третьей карточкой уводили в «Основы»,
    на «Как устроен наём». Теперь ведут по своему треку: с поиска работодателей
    — назад к аудитории программы (с кем работаем, тем и предлагаем людей), с
    разговора — вперёд к дорожной карте, которой этот разговор и заканчивается.
  */
  "/ngo/employers": ["/ngo/talks", "/ngo/support", "/ngo/audience"],
  "/ngo/talks": ["/ngo/support", "/ngo/employers", "/ngo/roadmap"],
  "/ngo/support": ["/ngo/roadmap", "/ngo/scale", "/ngo/talks"],
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
