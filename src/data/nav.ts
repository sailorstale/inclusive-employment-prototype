// Единый источник навигации (00 — Карта сайта и навигация, v2). Из него строятся
// крошки, активные пункты, боковое меню и подписи. Страницы не хардкодят навигацию.

export type Track = "general" | "companies" | "ngo" | "jobseekers";

/** Заголовок-крошка для каждого маршрута (Главная › … › текущая). */
export const routeTitles: Record<string, string> = {
  "/": "Главная",

  // Раздел «Основы» — общая база М1–М4 (один комплект страниц, оба
  // ролевых трека ведут сюда).
  "/general": "Основы",
  "/general/start": "Реалии и мифы",
  "/general/how": "Как устроен наём",
  "/general/legal": "Правовые основы",
  "/general/legal/contract": "Договор и оформление",
  "/general/legal/benefits": "Льготы и формы занятости",
  "/general/legal/quotas": "Квоты и господдержка",
  "/general/legal/status": "Особые ситуации",
  "/general/legal/faq": "Вопросы и ответы",
  "/general/team": "Команда и коммуникация",

  // Трек «Для компаний» (М5 — Наём по шагам)
  "/companies": "Для компаний",
  "/companies/hire": "Наём по шагам",
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

  // Трек «Для соискателей» (следующий заход — оставлен как есть)
  "/jobseekers": "Для соискателей",
  "/jobseekers/guide": "Гид по удалённым профессиям",
  "/jobseekers/tools": "Инструменты для работы",
  "/jobseekers/employers": "Куда устроиться в Яндекс",
  "/jobseekers/stories": "Истории коллег",
  "/jobseekers/resources": "Полезные материалы",

  // Сквозные (следующий заход — оставлены как есть)
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
  // Редакторский раздел — инструмент «Редактура источника» (/source): три колонки,
  // слева Google-док клиента, по центру спарсенный источник, справа правки.
  { label: "Редактор", path: "/source" },
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
          { label: "Реалии и мифы", path: "/general/start" },
          { label: "Как устроен наём", path: "/general/how" },
          {
            label: "Правовые основы",
            path: "/general/legal",
            children: [
              {
                label: "Договор и оформление",
                path: "/general/legal/contract",
              },
              {
                label: "Льготы и формы занятости",
                path: "/general/legal/benefits",
              },
              {
                label: "Квоты и господдержка",
                path: "/general/legal/quotas",
              },
              { label: "Особые ситуации", path: "/general/legal/status" },
              { label: "Вопросы и ответы", path: "/general/legal/faq" },
            ],
          },
          { label: "Команда и коммуникация", path: "/general/team" },
        ],
      },
    ],
  },
  companies: {
    title: "Для компаний",
    track: "companies",
    groups: [
      {
        items: [
          {
            label: "Наём по шагам",
            path: "/companies/hire",
            children: [
              {
                label: "Шаг 1. Выбор вакансии",
                path: "/companies/hire/step-1",
              },
              {
                label: "Шаг 2. Аудит готовности",
                path: "/companies/hire/step-2",
              },
              {
                label: "Шаг 3. Создание среды",
                path: "/companies/hire/step-3",
              },
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
    ],
  },
  ngo: {
    title: "Для НКО",
    track: "ngo",
    groups: [
      {
        items: [
          { label: "Запустить программу", path: "/ngo/start" },
          { label: "Работать с соискателем", path: "/ngo/candidates" },
          { label: "Выходить на работодателей", path: "/ngo/employers" },
          { label: "Сопровождать сотрудника", path: "/ngo/support" },
          { label: "Развивать и масштабировать", path: "/ngo/scale" },
          { label: "Финансировать программу", path: "/ngo/funding" },
        ],
      },
    ],
  },
  jobseekers: {
    title: "Для соискателей",
    track: "jobseekers",
    groups: [
      {
        items: [
          { label: "Гид по удалённым профессиям", path: "/jobseekers/guide" },
          { label: "Инструменты для работы", path: "/jobseekers/tools" },
          { label: "Куда устроиться в Яндекс", path: "/jobseekers/employers" },
          { label: "Истории коллег", path: "/jobseekers/stories" },
          { label: "Полезные материалы", path: "/jobseekers/resources" },
        ],
      },
    ],
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

export type Crumb = { label: string; path: string; current: boolean };

/** Крошки: Главная › все предки по пути › текущая (без ссылки). */
export function getBreadcrumbs(pathname: string): Crumb[] {
  if (pathname === "/" || !routeTitles[pathname]) return [];
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: "Главная", path: "/", current: false }];
  let acc = "";
  segments.forEach((seg, i) => {
    acc += "/" + seg;
    const title = routeTitles[acc];
    if (!title) return;
    crumbs.push({
      label: title,
      path: acc,
      current: i === segments.length - 1,
    });
  });
  return crumbs;
}
