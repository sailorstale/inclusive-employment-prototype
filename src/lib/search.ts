import { routeTitles } from "@/data/nav";

// Единый источник простого клиентского поиска по страницам (по заголовкам).
// Используется и в шапке (SiteSearch), и в мобильном меню (MobileNavDrawer),
// чтобы логика фильтра не расходилась.

export type PageHit = { path: string; title: string };

export const allPages: PageHit[] = Object.entries(routeTitles)
  .filter(([path]) => path !== "/")
  .map(([path, title]) => ({ path, title }));

/** Страницы, чей заголовок содержит запрос (пусто при пустом запросе). */
export function searchPages(query: string): PageHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allPages.filter((p) => p.title.toLowerCase().includes(q));
}
