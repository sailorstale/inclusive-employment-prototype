import * as React from "react";
import { useLocation } from "react-router-dom";
import { ResultView } from "@/editor-source/source/ResultView";
import type { Doc, SectionNode } from "@/editor-source/source/contentTree";
import { pageBySlug } from "./pageMap";
import { useModuleDoc } from "./useModuleDoc";

/*
  СТРАНИЦА САЙТА ИЗ ИСТОЧНИКА.

  Врастает в реальные маршруты «Основ» (/general/…) внутри оболочки сайта
  (Layout даёт шапку, меню, футер). Контент собирается из источника по карте
  страниц — сайт перестаёт быть рукописным и начинает расти из компонентного
  результата. Главную (/) не трогаем — она отдельная.

  Пока это ВЫБОР секций (текст байт в байт). Обёртка «На этой странице вы
  узнаете» и раскурсовка — следующими срезами.
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
  const pageDoc: Doc = { module: page.module, children: chosen };

  return <ResultView doc={pageDoc} />;
}
