// Единый источник навигации (00 — Карта сайта и навигация, v2). Из него строятся
// крошки, активные пункты, боковое меню и подписи. Страницы не хардкодят навигацию.

export type Track = "general" | "companies" | "ngo" | "jobseekers";

/** Заголовок-крошка для каждого маршрута (Главная › … › текущая). */
export const routeTitles: Record<string, string> = {
  "/": "Главная",

  // Раздел «Основы» — общая база М1–М4 (один комплект страниц, оба
  // ролевых трека ведут сюда).
  "/general": "Основы",
  "/general/about": "О проекте",
  // Страницы «Правовые основы» больше нет: адрес /general/legal ведёт на первую
  // правовую страницу. Название оставлено для старых ссылок в тексте.
  "/general/legal/documents": "Полезные документы",
  "/general/start": "Реалии и мифы",
  "/general/how": "Как устроен наём",
  "/general/legal": "Правовые основы",
  "/general/legal/contract": "Договор и оформление",
  "/general/legal/benefits": "Льготы сотрудников",
  "/general/legal/formats": "Форматы занятости",
  "/general/legal/quotas": "Квоты и господдержка",
  "/general/team": "Этика и коммуникация",

  // Трек «Для компаний» (М5 — Наём по шагам). Хаб трека = страница найма по
  // шагам; отдельной страницы «Наём по шагам» больше нет (старый адрес
  // /companies/hire ведёт на /companies).
  "/companies": "Для компаний",
  "/companies/hire/step-1": "Шаг 1. Выбор вакансии",
  "/companies/hire/step-2": "Шаг 2. Аудит готовности",
  "/companies/hire/step-3": "Шаг 3. Создание среды",
  "/companies/hire/step-4": "Шаг 4. Поиск и оформление",
  "/companies/hire/step-5": "Шаг 5. Онбординг",
  "/companies/hire/step-6": "Шаг 6. Затраты",

  // Трек «Для НКО» — Программа НКО (М6)
  "/ngo": "Для НКО",
  "/ngo/start": "Запустить программу",
  "/ngo/candidates": "Работать с соискателем",
  "/ngo/employers": "Выходить на работодателей",
  "/ngo/support": "Сопровождать сотрудника",
  "/ngo/scale": "Развивать и масштабировать",
  "/ngo/funding": "Финансировать программу",

  // Трек «Для соискателей» — заглушка, без подразделов
  "/jobseekers": "Для соискателей",

  // Сквозные (следующий заход — оставлены как есть)
  "/unify": "Компоненты",
  "/yandex-jobs": "Трудоустройство в Яндексе",
  "/glossary": "Глоссарий",
  "/feedback": "Обратная связь",
  "/a11y": "Доступность",
};

/** Главное меню в шапке: один тип пунктов (крупные разделы-«входы» по аудиториям
 *  + общая база + сквозная витрина). Темы М1–М4 живут не здесь, а в боковом меню
 *  раздела «Общая информация» — верх отвечает на вопрос «куда я», а не «что почитать». */
export const mainMenu: {
  label: string;
  path: string;
  /** Внешняя ссылка (другое приложение) — рендерится как <a>, а не роутер-Link. */
  external?: boolean;
}[] = [
  { label: "Основы", path: "/general" },
  { label: "Для компаний", path: "/companies" },
  { label: "Для НКО", path: "/ngo" },
  { label: "Для соискателей", path: "/jobseekers" },
  /*
    Пункта «Редактор» здесь больше НЕТ (решение дизайнера): инструмент правки —
    не раздел сайта, и в меню читателя ему не место. Он никуда не делся и
    открывается по адресу /source.
  */
];

/** Активен ли пункт меню для текущего пути (сам путь либо его вложенность). */
export function isMenuActive(itemPath: string, pathname: string): boolean {
  return pathname === itemPath || pathname.startsWith(itemPath + "/");
}

export type SidebarItem = {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
};

/** Группа пунктов бокового меню. У трека может быть одна группа без заголовка
 *  (Компании, Соискатели) или несколько с заголовками (НКО: Основы / Программа). */
export type SidebarGroup = {
  label?: string;
  items: SidebarItem[];
};

export type SidebarSpec = {
  title: string;
  track: Track;
  groups: SidebarGroup[];
};

export const sidebars: Record<Track, SidebarSpec> = {
  general: {
    title: "Основы",
    track: "general",
    groups: [
      {
        items: [
          // Первая страница раздела — рассказ о самом сайте: кто его сделал,
          // кому он полезен и что где лежит.
          { label: "О проекте", path: "/general/about" },
          { label: "Реалии и мифы", path: "/general/start" },
          { label: "Как устроен наём", path: "/general/how" },
          /*
            Правовые страницы стоят в общем ряду, без промежуточного пункта
            «Правовые основы» (решение дизайнера 5 августа 2026). Раньше он был
            и подписью группы, и страницей: на самой странице лежали только итог
            про формы занятости и список законов. Итог переехал на «Льготы и
            формы занятости», законы стали страницей «Полезные документы», а
            меню раздела стало одноуровневым.
          */
          { label: "Договор и оформление", path: "/general/legal/contract" },
          { label: "Льготы сотрудников", path: "/general/legal/benefits" },
          { label: "Форматы занятости", path: "/general/legal/formats" },
          { label: "Квоты и господдержка", path: "/general/legal/quotas" },
          { label: "Полезные документы", path: "/general/legal/documents" },
          { label: "Этика и коммуникация", path: "/general/team" },
        ],
      },
    ],
  },
  /*
    Меню компаний одноуровневое: заголовок раздела «Для компаний» — это и есть
    страница найма по шагам, а под ним сразу шаги. Промежуточного пункта «Наём
    по шагам» больше нет: он повторял бы заголовок раздела.
  */
  companies: {
    title: "Для компаний",
    track: "companies",
    groups: [
      {
        items: [
          { label: "Шаг 1. Выбор вакансии", path: "/companies/hire/step-1" },
          { label: "Шаг 2. Аудит готовности", path: "/companies/hire/step-2" },
          { label: "Шаг 3. Создание среды", path: "/companies/hire/step-3" },
          {
            label: "Шаг 4. Поиск и оформление",
            path: "/companies/hire/step-4",
          },
          { label: "Шаг 5. Онбординг", path: "/companies/hire/step-5" },
          { label: "Шаг 6. Затраты", path: "/companies/hire/step-6" },
        ],
      },
    ],
  },
  /*
    Меню НКО двухуровневое: большие темы («работа с соискателем», «выход на
    работодателей») разрезаны на несколько страниц, и заголовок группы держит
    их вместе. Заголовок группы — не ссылка: страницы-обёртки для него нет, и
    выдумывать её только ради пункта меню незачем.
  */
  ngo: {
    title: "Для НКО",
    track: "ngo",
    groups: [
      {
        items: [
          { label: "Запустить программу", path: "/ngo/start" },
          { label: "Аудитория программы", path: "/ngo/audience" },
        ],
      },
      {
        label: "Работа с соискателем",
        items: [
          { label: "Первичное интервью", path: "/ngo/candidates" },
          { label: "Профориентация", path: "/ngo/candidates/guidance" },
          {
            label: "Психологическая поддержка",
            path: "/ngo/candidates/psychology",
          },
          {
            label: "Подбор вакансий и собеседование",
            path: "/ngo/candidates/vacancies",
          },
        ],
      },
      {
        label: "Работодатели",
        items: [
          { label: "Поиск работодателей", path: "/ngo/employers" },
          { label: "Разговор с работодателем", path: "/ngo/employers/talks" },
        ],
      },
      {
        items: [
          { label: "Сопровождать сотрудника", path: "/ngo/support" },
          { label: "Развивать и масштабировать", path: "/ngo/scale" },
          { label: "Финансировать программу", path: "/ngo/funding" },
        ],
      },
    ],
  },
  jobseekers: {
    // Заглушка: без подразделов. В сайдбаре показывается простой ссылкой.
    title: "Для соискателей",
    track: "jobseekers",
    groups: [],
  },
};

/** Трек, к которому относится путь (для активного пункта шапки + бокового меню). */
export function getTrack(pathname: string): Track | null {
  if (pathname === "/general" || pathname.startsWith("/general/"))
    return "general";
  if (pathname === "/companies" || pathname.startsWith("/companies/"))
    return "companies";
  if (pathname === "/ngo" || pathname.startsWith("/ngo/")) return "ngo";
  if (pathname === "/jobseekers" || pathname.startsWith("/jobseekers/"))
    return "jobseekers";
  return null;
}

