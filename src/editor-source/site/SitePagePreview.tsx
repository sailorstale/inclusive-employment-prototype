import * as React from "react";
import { useParams } from "react-router-dom";
import { ResultView } from "@/editor-source/source/ResultView";
import type { Doc, SectionNode } from "@/editor-source/source/contentTree";
import { pageBySlug } from "./pageMap";
import { useModuleDoc } from "./useModuleDoc";

/*
  ПРЕВЬЮ СТРАНИЦЫ САЙТА из источника — срез 1.

  Страница = подмножество секций модуля (см. pageMap). Пока только ВЫБОР секций
  в сайтовом виде (ResultView), без единой правки текста: убеждаемся, что секции
  ложатся верно и ничего не теряется. Раскурсовку, обёртку «На этой странице вы
  узнаете» и инспектор навесим следующими срезами.

  Отдельный маршрут /source/preview/* — реальные страницы сайта не трогаем.
*/
export function SitePagePreview() {
  const splat = useParams()["*"] ?? "";
  const slug = "/" + splat.replace(/^\/+/, "");
  const page = pageBySlug(slug);
  const doc = useModuleDoc(page?.module ?? "");

  if (!page)
    return <div className="mx-auto max-w-prose p-8 text-muted-foreground">Нет такой страницы: {slug}</div>;
  if (!doc) return <div className="mx-auto max-w-prose p-8 text-muted-foreground">Загрузка…</div>;

  // Секции модуля по якорю, в порядке страницы. Чего нет — пропускаем (заметим).
  const byAnchor = new Map(
    doc.children
      .filter((n): n is SectionNode => (n as SectionNode).component === "Section Container")
      .map((n) => [n.anchor ?? "", n]),
  );
  const chosen = page.sections.map((a) => byAnchor.get(a)).filter(Boolean) as SectionNode[];
  const missing = page.sections.filter((a) => !byAnchor.has(a));
  const pageDoc: Doc = { module: page.module, children: chosen };

  return (
    <div className="min-h-screen">
      <header className="border-b bg-muted/40 px-6 py-3 text-sm">
        <span className="rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
          превью · срез 1
        </span>{" "}
        <b>{page.title}</b> <span className="text-muted-foreground">← {page.module}</span>{" "}
        <span className="text-muted-foreground">
          · секций {chosen.length}
          {missing.length ? ` · не найдено: ${missing.join(", ")}` : ""}
        </span>
      </header>
      <ResultView doc={pageDoc} />
    </div>
  );
}
