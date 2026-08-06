import { OSNOVY_PAGES } from "./pageMap";

/*
  «Читайте также» — какие страницы «Основ» предложить внизу каждой (по 3
  релевантных соседа) и короткая навигационная подпись к каждой. Подписи
  основаны на реальном содержании страниц; это обвязка страницы, не контент
  источника. Адрес ссылки — путь от корня («/general/legal»), как нужно
  разработчику; решётку прототипа приписывает показ, а не данные.
*/

// Короткая подпись страницы для карточки «Читайте также».
const BLURB: Record<string, string> = {
  "/general/about": "Кто сделал сайт, кому он полезен и что где лежит.",
  "/general/start":
    "Медицинская и социальная модель, кто такие соискатели, мифы и факты.",
  "/general/how": "Участники найма, сценарии поиска и работа с НКО.",
  "/general/legal": "Оформление, льготы, квоты и особые ситуации — обзор раздела.",
  "/general/legal/contract":
    "Трудовой договор, справка об инвалидности, ИПРА, условия труда.",
  "/general/legal/benefits":
    "Льготы по трудовому договору и что будет с пенсией и пособиями.",
  "/general/legal/formats":
    "Договор ГПХ и самозанятость: чем отличаются и что выбрать.",
  "/general/legal/quotas":
    "Что такое квоты, как их выполнить и меры господдержки.",
  "/general/team":
    "Как корректно говорить и общаться, инклюзивные мероприятия.",

  "/companies/hire/step-1":
    "С какой вакансии начать инклюзивный наём и как её выбрать.",
  "/companies/hire/step-2":
    "Аудит рабочей среды, процессов и материалов — и типичные ошибки.",
  "/companies/hire/step-3":
    "Инклюзивная среда: что меняют в помещении, процессах и общении.",
  "/companies/hire/step-4":
    "Описание вакансии, где искать кандидатов, собеседование и оформление.",
  "/companies/hire/step-5":
    "Адаптация новичка, кто помогает и что делать, если идёт не по плану.",
  "/companies/hire/step-6":
    "Первоначальные и регулярные расходы и как их оптимизировать.",

  "/ngo/start": "Роль НКО, программа трудоустройства и этапы работы.",
  "/ngo/audience":
    "Кто ваша аудитория, где её искать и как оценить привлечение.",
  "/ngo/candidates":
    "Как провести первую встречу и собрать портрет соискателя.",
  "/ngo/candidates/guidance":
    "Когда нужна профориентация и пошаговый план для НКО.",
  "/ngo/candidates/psychology":
    "Как поддержать соискателя, которому мешает страх и неуверенность.",
  "/ngo/candidates/vacancies":
    "Восемь шагов: от приоритетов до разбора состоявшегося собеседования.",
  "/ngo/employers": "Где искать компании, готовые к сотрудничеству.",
  "/ngo/employers/talks":
    "Как готовиться к разговору, представить кандидата и отвечать на возражения.",
  "/ngo/support":
    "Два формата сопровождения, кризис-менеджмент и дорожная карта.",
  "/ngo/scale":
    "Как вырасти, не теряя качества, и поделиться своей экспертизой.",
  "/ngo/funding": "Затраты программы и как сделать проект устойчивым.",
};

// Три релевантных соседа для каждой страницы.
const RELATED: Record<string, string[]> = {
  /*
    Со страницы о самом сайте ведём в три точки входа: общая часть и первые
    страницы обоих практических треков. Хабы («Для компаний», «Для НКО») сюда
    не годятся — карточки собираются только из страниц карты.
  */
  "/general/about": ["/general/start", "/companies/hire/step-1", "/ngo/start"],
  "/general/start": ["/general/how", "/general/legal", "/general/team"],
  "/general/how": ["/general/legal", "/general/team", "/general/start"],
  "/general/legal": [
    "/general/legal/contract",
    "/general/legal/benefits",
    "/general/legal/quotas",
  ],
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
  "/general/team": ["/general/how", "/general/start", "/general/legal"],

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
  "/ngo/candidates/vacancies": [
    "/ngo/employers",
    "/ngo/candidates",
    "/ngo/candidates/guidance",
  ],
  "/ngo/employers": ["/ngo/employers/talks", "/ngo/support", "/general/how"],
  "/ngo/employers/talks": ["/ngo/support", "/ngo/employers", "/general/how"],
  "/ngo/support": ["/ngo/scale", "/ngo/funding", "/ngo/employers/talks"],
  "/ngo/scale": ["/ngo/funding", "/ngo/start", "/ngo/support"],
  "/ngo/funding": ["/ngo/scale", "/ngo/start", "/ngo/audience"],
};

export type RelatedCard = { title: string; description: string; href: string };

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
      return { title: page.title, description: BLURB[s] ?? "", href: s };
    })
    .filter((x): x is RelatedCard => x !== null);
}
