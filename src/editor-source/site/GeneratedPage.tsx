import { useLocation } from "react-router-dom";
import type { Doc, SectionNode } from "@/editor-source/source/contentTree";
import type { TocItem } from "@/lib/toc";
import { pageBySlug } from "./pageMap";
import { useModuleDoc } from "./useModuleDoc";
import { SiteInspector } from "./SiteInspector";
import { pageChildren, sectionTitle } from "./pageStructure";

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
  const { pathname } = useLocation();
  const page = pageBySlug(pathname);
  const doc = useModuleDoc(page?.module ?? "");

  if (!page)
    return <div className="mx-auto max-w-prose px-6 py-16 text-muted-foreground">Страница не из карты: {pathname}</div>;
  if (!doc) return <div className="mx-auto max-w-prose px-6 py-16 text-muted-foreground">Загрузка…</div>;

  const byAnchor = new Map(
    doc.children
      .filter((n): n is SectionNode => (n as SectionNode).component === "Section Container")
      .map((n) => [n.anchor ?? "", n]),
  );
  const chosen = page.sections.map((a) => byAnchor.get(a)).filter(Boolean) as SectionNode[];

  /* Оглавление «На этой странице» (правое меню) — все секции страницы. */
  const tocItems: TocItem[] = chosen
    .map((s) => ({ label: sectionTitle(s) ?? "", anchor: s.anchor ?? "" }))
    .filter((t) => t.label && t.anchor);

  // Полная страница одним деревом: обвязка + секции. module оставляем в Doc для
  // сборки (правки/логотипы), но в JSON/выгрузку он не попадает.
  const pageDoc: Doc = { module: page.module, children: pageChildren(chosen, page.slug) };

  return <SiteInspector page={page} pageDoc={pageDoc} tocItems={tocItems} />;
}
