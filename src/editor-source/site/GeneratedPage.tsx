import * as React from "react";
import { useLocation } from "react-router-dom";
import { scrollToId } from "@/lib/scroll";
import type { Doc } from "@/editor-source/source/contentTree";
import { pageBySlug } from "./pageMap";
import { useModuleDoc } from "./useModuleDoc";
import { SiteInspector } from "./SiteInspector";
import { pageChildren, pageToc } from "./pageStructure";
import { hiddenFromToc, pageParts } from "./pageOutline";

/*
  СТРАНИЦА САЙТА ИЗ ИСТОЧНИКА — сразу разворачивается в инструмент сверки.

  Врастает в реальные маршруты «Основ» (/general/…). Контент собирается из
  источника по карте страниц — сайт растёт из компонентного результата, а не
  пишется руками. Главную (/) не трогаем — она отдельная.

  Страница = ОДНО дерево узлов (pageChildren): «вы узнаете» + секции + форма
  мнения + «Читайте также». И сайт, и JSON, и выгрузка строятся из него —
  поэтому совпадают. Термина «модуль» на сайте нет: он остаётся в редакторе.
*/

export function GeneratedPage() {
  const location = useLocation();
  const { pathname } = location;
  const page = pageBySlug(pathname);
  const doc = useModuleDoc(page?.module ?? "");

  /*
    Переход из карты блоков (/blocks): в состоянии перехода лежит якорь
    заголовка, к которому нужно прокрутить. Ждём, пока страница соберётся
    (doc), иначе прокручивать ещё не к чему. Адрес при этом не меняется —
    у нас хеш-роутер, и второй решётки в адресе быть не должно.
  */
  const anchor = (location.state as { anchor?: string } | null)?.anchor;
  React.useEffect(() => {
    if (!anchor || !doc) return;
    const t = setTimeout(() => scrollToId(anchor), 80);
    return () => clearTimeout(t);
  }, [anchor, doc]);

  if (!page)
    return <div className="mx-auto max-w-prose px-6 py-16 text-muted-foreground">Страница не из карты: {pathname}</div>;
  if (!doc) return <div className="mx-auto max-w-prose px-6 py-16 text-muted-foreground">Загрузка…</div>;

  // Разделы страницы и её вступление. Если у страницы заявлена перекройка
  // (outline), разделы нарезаются заново — по карте, а не по уровням источника.
  // Вступление идёт отдельно от разделов: в темах и в оглавлении его быть не
  // должно.
  const { chosen, intro } = pageParts(doc, page);

  /*
    Оглавление «На этой странице» (правое меню) — секции H2 и подзаголовки H3.
    Врезки и другие заголовки, отмеченные в карте, из него убираем: уровень у
    них при этом остаётся своим (см. hiddenFromToc).
  */
  const tocItems = pageToc(chosen, page.slug, hiddenFromToc(page));

  // Полная страница одним деревом: обвязка + секции. module оставляем в Doc для
  // сборки (правки/логотипы), но в JSON/выгрузку он не попадает.
  const pageDoc: Doc = {
    module: page.module,
    children: pageChildren(chosen, page.slug, intro),
  };

  return <SiteInspector page={page} pageDoc={pageDoc} tocItems={tocItems} />;
}
