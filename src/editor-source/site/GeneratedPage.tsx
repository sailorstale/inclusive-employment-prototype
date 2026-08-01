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
import { SiteInspector } from "./SiteInspector";

// Наверху страница разворачивается в инструмент сверки; ВНУТРИ iframe (window.top
// !== self) рисуется голой — её показывает правая панель инструмента.
const embedded = typeof window !== "undefined" && window.self !== window.top;

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

  // На верхнем уровне страница СРАЗУ разворачивается в инструмент сверки (без
  // кнопки): слева источник/JSON/гугдок, справа сама страница. Внутри iframe
  // (embedded) рисуем её ГОЛОЙ — её и показывает правая панель инструмента.
  if (!embedded) return <SiteInspector page={page} pageDoc={pageDoc} />;

  return <EmbeddedPage page={page} pageDoc={pageDoc} topics={topics} tocItems={tocItems} />;
}

/*
  Голая страница внутри iframe инструмента. Компоненты кликабельны (pick): по
  клику подсвечиваем сам компонент и сообщаем путь родителю (postMessage) —
  инструмент подсветит этот код в JSON. Путь тот же, что у JSON: оба на pageDoc.
*/
function EmbeddedPage({
  page,
  pageDoc,
  topics,
  tocItems,
}: {
  page: ReturnType<typeof pageBySlug> & object;
  pageDoc: Doc;
  topics: string[];
  tocItems: TocItem[];
}) {
  const [picked, setPicked] = React.useState<string | null>(null);
  React.useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.__inspect === "select") setPicked(e.data.path ?? null);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  return (
    <div>
      <PageToc items={tocItems} minItems={2} />
      <div className="figma-scope mx-auto max-w-[var(--column-width)] px-6">
        <h1 className="ds-h1 pt-10 text-[color:var(--text-primary)]">{page.title}</h1>
        {topics.length > 0 && (
          <PageSummary>
            {topics.map((t, i) => (
              <ListItem key={i}>{t}</ListItem>
            ))}
          </PageSummary>
        )}
      </div>
      <ResultView
        doc={pageDoc}
        pick={{
          selected: picked,
          onSelect: (p) => {
            setPicked(p);
            window.parent.postMessage({ __inspect: "pick", path: p }, window.location.origin);
          },
        }}
      />
    </div>
  );
}
