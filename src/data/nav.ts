// Единый источник навигации (00 — Карта сайта). Из него строятся
// крошки, активные пункты, боковое меню и подписи. Страницы не хардкодят навигацию.

export type Track = "companies" | "ngo" | "jobseekers";

/** Заголовок-крошка для каждого маршрута (Главная › … › текущая). */
export const routeTitles: Record<string, string> = {
  "/": "Главная",

  "/companies": "Для компаний",
  "/companies/start": "Стоит ли начинать",
  "/companies/legal": "Правила оформления",
  "/companies/legal/contract": "Договор и оформление",
  "/companies/legal/benefits": "Льготы и формы занятости",
  "/companies/legal/quotas": "Квоты и господдержка",
  "/companies/legal/status": "Особые ситуации",
  "/companies/legal/faq": "Вопросы и ответы",
  "/companies/hire": "Найм по шагам",
  "/companies/hire/step-1": "Шаг 1. Выбор вакансии",
  "/companies/hire/step-2": "Шаг 2. Аудит готовности",
  "/companies/hire/step-3": "Шаг 3. Создание среды",
  "/companies/hire/step-4": "Шаг 4. Поиск и оформление",
  "/companies/hire/step-5": "Шаг 5. Онбординг",
  "/companies/hire/step-6": "Шаг 6. Затраты",
  "/companies/team": "Команда и коммуникация",

  "/ngo": "Для НКО",
  "/ngo/start": "Запустить программу",
  "/ngo/candidates": "Работать с соискателем",
  "/ngo/employers": "Выходить на работодателей",
  "/ngo/support": "Сопровождать сотрудника",
  "/ngo/scale": "Развивать и масштабировать",
  "/ngo/funding": "Финансировать программу",

  "/jobseekers": "Для соискателей",
  "/jobseekers/guide": "Гид по удалённым профессиям",
  "/jobseekers/tools": "Инструменты для работы",
  "/jobseekers/employers": "Куда устроиться в Яндекс",
  "/jobseekers/stories": "Истории коллег",
  "/jobseekers/resources": "Полезные материалы",

  "/yandex-jobs": "Трудоустройство в Яндексе",
  "/glossary": "Глоссарий",
  "/feedback": "Обратная связь",
  "/a11y": "Доступность",
};

/** Три ролевых трека для главного меню в шапке. */
export const tracks: { track: Track; label: string; path: string }[] = [
  { track: "companies", label: "Для компаний", path: "/companies" },
  { track: "ngo", label: "Для НКО", path: "/ngo" },
  { track: "jobseekers", label: "Для соискателей", path: "/jobseekers" },
];

export type SidebarItem = {
  label: string;
  path: string;
  children?: { label: string; path: string }[];
};

export type SidebarSpec = {
  title: string;
  track: Track;
  items: SidebarItem[];
};

export const sidebars: Record<Track, SidebarSpec> = {
  companies: {
    title: "Для компаний",
    track: "companies",
    items: [
      { label: "Стоит ли начинать", path: "/companies/start" },
      {
        label: "Правила оформления",
        path: "/companies/legal",
        children: [
          { label: "Договор и оформление", path: "/companies/legal/contract" },
          { label: "Льготы и формы занятости", path: "/companies/legal/benefits" },
          { label: "Квоты и господдержка", path: "/companies/legal/quotas" },
          { label: "Особые ситуации", path: "/companies/legal/status" },
          { label: "Вопросы и ответы", path: "/companies/legal/faq" },
        ],
      },
      {
        label: "Найм по шагам",
        path: "/companies/hire",
        children: [
          { label: "Шаг 1. Выбор вакансии", path: "/companies/hire/step-1" },
          { label: "Шаг 2. Аудит готовности", path: "/companies/hire/step-2" },
          { label: "Шаг 3. Создание среды", path: "/companies/hire/step-3" },
          { label: "Шаг 4. Поиск и оформление", path: "/companies/hire/step-4" },
          { label: "Шаг 5. Онбординг", path: "/companies/hire/step-5" },
          { label: "Шаг 6. Затраты", path: "/companies/hire/step-6" },
        ],
      },
      { label: "Команда и коммуникация", path: "/companies/team" },
    ],
  },
  ngo: {
    title: "Для НКО",
    track: "ngo",
    items: [
      { label: "Запустить программу", path: "/ngo/start" },
      { label: "Работать с соискателем", path: "/ngo/candidates" },
      { label: "Выходить на работодателей", path: "/ngo/employers" },
      { label: "Сопровождать сотрудника", path: "/ngo/support" },
      { label: "Развивать и масштабировать", path: "/ngo/scale" },
      { label: "Финансировать программу", path: "/ngo/funding" },
    ],
  },
  jobseekers: {
    title: "Для соискателей",
    track: "jobseekers",
    items: [
      { label: "Гид по удалённым профессиям", path: "/jobseekers/guide" },
      { label: "Инструменты для работы", path: "/jobseekers/tools" },
      { label: "Куда устроиться в Яндекс", path: "/jobseekers/employers" },
      { label: "Истории коллег", path: "/jobseekers/stories" },
      { label: "Полезные материалы", path: "/jobseekers/resources" },
    ],
  },
};

/** Трек, к которому относится путь (для активного пункта шапки + бокового меню). */
export function getTrack(pathname: string): Track | null {
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
