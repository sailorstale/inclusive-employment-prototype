import { mainMenu, sidebars, FOOTER_COLUMNS, type Track } from "@/data/nav";
import { pageBySlug } from "./pageMap";

/*
  МЕНЮ САЙТА В ВЫГРУЗКЕ — отдельный блок рядом со страницами.

  Разработчик собирает меню руками в конструкторе Яндекса, и до сих пор узнать о
  нём из выгрузки было неоткуда: в файле лежали только страницы. Пока подпись
  пункта совпадала с заголовком страницы, это сходило с рук — он брал h1. С
  новой структурой раздела «Для НКО» подписи стали короче названий («Поиск» под
  заголовком группы «Работодатели» вместо «Поиска работодателей»), и догадаться
  об этом по выгрузке стало невозможно.

  Вторая причина — заголовки групп. «Соискатели» и «Работодатели» страницами не
  являются: у них нет ни адреса, ни текста, ни меты. В списке страниц им места
  нет, и без отдельного блока они до разработчика не доезжают вовсе.

  ССЫЛКИ У ЗАГОЛОВКА ГРУППЫ НЕТ, и поля href у него тоже нет — не пустая строка
  и не null. Отсутствие поля читается однозначно: кликать не по чему. Пустая
  строка выглядит как недоделка, которую кто-нибудь однажды «починит».

  ПОРЯДОК ПУНКТОВ ЗАДАН ПОРЯДКОМ В МАССИВЕ. Никаких номеров и полей сортировки:
  как записано сверху вниз, так и рисуется.

  Адреса — пути от корня, без решётки, как и везде в выгрузке (см. decourse).
*/

export type MenuItem = { label: string; href: string };
/** Группа пунктов. У заголовка группы ссылки нет — поля href здесь тоже нет. */
export type MenuGroup = { label?: string; items: MenuItem[] };
export type MenuSection = { label: string; href: string; groups: MenuGroup[] };
export type MenuColumn = { label: string; items: MenuItem[] };

export type SiteMenu = {
  /** Верхнее меню в шапке — входы по аудиториям. */
  header: MenuItem[];
  /** Боковое меню каждого раздела. */
  sidebar: MenuSection[];
  /** Колонки ссылок в подвале. */
  footer: MenuColumn[];
};

/*
  Подпись страницы в боковом меню по её адресу. Считается из того же места, где
  меню и живёт (nav.ts), чтобы подпись в блоке меню и подпись внутри страницы не
  могли разъехаться.
*/
const NAV_LABELS = new Map<string, string>(
  Object.values(sidebars).flatMap((spec) =>
    spec.groups.flatMap((g) =>
      g.items.flatMap((item) => [
        [item.path, item.label] as [string, string],
        ...(item.children ?? []).map(
          (c) => [c.path, c.label] as [string, string],
        ),
      ]),
    ),
  ),
);

/*
  Подпись страницы для меню. Страницы вне бокового меню (заглушка «Для
  соискателей») подписи там не имеют — берём название страницы, оно всегда есть.
  Поле в выгрузке стоит у КАЖДОЙ страницы: поле, которого то нет, то есть,
  заставляет каждый раз проверять, не забыли ли мы его.
*/
export function navLabelFor(slug: string): string {
  return NAV_LABELS.get(slug) ?? pageBySlug(slug)?.title ?? "";
}

/** Меню всего сайта: шапка, боковые меню разделов и подвал. */
export function buildSiteMenu(): SiteMenu {
  const tracks = Object.keys(sidebars) as Track[];
  return {
    header: mainMenu.map((m) => ({ label: m.label, href: m.path })),
    sidebar: tracks
      .map((track): MenuSection => {
        const spec = sidebars[track];
        return {
          label: spec.title,
          href: mainMenu.find((m) => m.path.endsWith(track))?.path ?? "",
          groups: spec.groups.map((g) => ({
            ...(g.label ? { label: g.label } : {}),
            items: g.items.map((i) => ({ label: i.label, href: i.path })),
          })),
        };
      })
      /*
        Раздел «Для соискателей» ещё не написан: боковое меню у него пустое, и в
        выгрузке он выглядел бы разделом без единого пункта. Такой раздел
        разработчику нечего собирать, поэтому он сюда не попадает — вернётся
        сам, как только у него появятся страницы.
      */
      .filter((s) => s.groups.length > 0),
    footer: FOOTER_COLUMNS.map((c) => ({
      label: c.title,
      items: c.links.map((l) => ({ label: l.label, href: l.to })),
    })),
  };
}
