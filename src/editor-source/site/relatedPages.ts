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

  "/ngo/start":
    "Роль НКО, этапы работы, анализ аудитории и каналы продвижения.",
  "/ngo/candidates":
    "Первичное интервью, профориентация, подбор вакансий и собеседование.",
  "/ngo/employers":
    "Где искать работодателей, как говорить с ними и отвечать на возражения.",
  "/ngo/support":
    "Два формата сопровождения, кризис-менеджмент и дорожная карта.",
  "/ngo/scale":
    "Как вырасти, не теряя качества, и поделиться своей экспертизой.",
  "/ngo/funding": "Затраты программы и как сделать проект устойчивым.",
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

  "/ngo/start": ["/ngo/candidates", "/ngo/employers", "/ngo/scale"],
  "/ngo/candidates": ["/ngo/employers", "/ngo/support", "/ngo/start"],
  "/ngo/employers": ["/ngo/support", "/ngo/candidates", "/general/how"],
  "/ngo/support": ["/ngo/scale", "/ngo/funding", "/ngo/employers"],
  "/ngo/scale": ["/ngo/funding", "/ngo/start", "/ngo/support"],
  "/ngo/funding": ["/ngo/scale", "/ngo/start", "/ngo/candidates"],
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
