import * as React from "react";
import { useLocation } from "react-router-dom";
import { PageSummary, ListItem } from "@/figma";
import { PageToc } from "@/components/PageToc";
import type { TocItem } from "@/lib/toc";
import { ResultView } from "@/editor-source/source/ResultView";
import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";
import { pageBySlug } from "./pageMap";
import { useModuleDoc } from "./useModuleDoc";
import { stripDecourse } from "./decourse";
import { Inspector } from "./Inspector";

/*
  СТРАНИЦА САЙТА ИЗ ИСТОЧНИКА.

  Врастает в реальные маршруты «Основ» (/general/…) внутри оболочки сайта
  (Layout даёт шапку, меню, футер). Контент собирается из источника по карте
  страниц — сайт растёт из компонентного результата, а не пишется руками.
  Главную (/) не трогаем — она отдельная.

  Законченная страница = ТИТУЛ + «На этой странице вы узнаете» (обёртка,
  сгенерированная из заголовков секций) + контент из источника. Текст самого
  контента — байт в байт; раскурсовка следующим срезом.
*/

/** Заголовок секции (H2) — для списка «вы узнаете». */
function sectionTitle(sec: SectionNode): string | null {
  const h = sec.children.find(
    (n): n is Extract<Node, { component: "Heading" }> =>
      (n as Node).component === "Heading",
  );
  // Метки раскурсовки убираем: в заголовке/оглавлении/«вы узнаете» — чистый текст.
  return h ? stripDecourse(h.text) : null;
}

export function GeneratedPage() {
  const { pathname } = useLocation();
  const page = pageBySlug(pathname);
  const doc = useModuleDoc(page?.module ?? "");
  const [inspect, setInspect] = React.useState(false);

  if (!page)
    return <div className="mx-auto max-w-prose px-6 py-16 text-muted-foreground">Страница не из карты: {pathname}</div>;
  if (!doc) return <div className="mx-auto max-w-prose px-6 py-16 text-muted-foreground">Загрузка…</div>;

  const byAnchor = new Map(
    doc.children
      .filter((n): n is SectionNode => (n as SectionNode).component === "Section Container")
      .map((n) => [n.anchor ?? "", n]),
  );
  const chosen = page.sections.map((a) => byAnchor.get(a)).filter(Boolean) as SectionNode[];

  /*
    «На этой странице вы узнаете» — из заголовков секций. Итоги в список не
    берём: это не тема, а завершение. Сгенерированная обёртка (сорт C), контент
    источника не подмешиваем.
  */
  const topics = chosen
    .filter((s) => s.anchor !== "podvedem-itogi")
    .map(sectionTitle)
    .filter((t): t is string => Boolean(t));

  /* Оглавление «На этой странице» — все секции страницы (для правого рейла). */
  const tocItems: TocItem[] = chosen
    .map((s) => ({ label: sectionTitle(s) ?? "", anchor: s.anchor ?? "" }))
    .filter((t) => t.label && t.anchor);

  const pageDoc: Doc = { module: page.module, children: chosen };

  return (
    <div>
      {inspect && (
        <Inspector doc={pageDoc} module={page.module} onClose={() => setInspect(false)} />
      )}
      {/* Регистрирует оглавление в правый рейл (TocRail в Layout). */}
      <PageToc items={tocItems} minItems={2} />
      <div className="figma-scope mx-auto max-w-[var(--column-width)] px-6">
        <div className="flex items-start justify-between gap-4 pt-10">
          <h1 className="ds-h1 text-[color:var(--text-primary)]">{page.title}</h1>
          <button
            type="button"
            onClick={() => setInspect(true)}
            className="mt-2 shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Инспектор
          </button>
        </div>
        {topics.length > 0 && (
          <PageSummary>
            {topics.map((t, i) => (
              <ListItem key={i}>{t}</ListItem>
            ))}
          </PageSummary>
        )}
      </div>
      <ResultView doc={pageDoc} />
    </div>
  );
}
