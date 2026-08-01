import { useLocation } from "react-router-dom";
import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";
import { pageBySlug } from "./pageMap";
import { useModuleDoc } from "./useModuleDoc";
import { stripDecourse } from "./decourse";
import { SiteInspector } from "./SiteInspector";

/*
  СТРАНИЦА САЙТА ИЗ ИСТОЧНИКА — сразу разворачивается в инструмент сверки.

  Врастает в реальные маршруты «Основ» (/general/…). Контент собирается из
  источника по карте страниц — сайт растёт из компонентного результата, а не
  пишется руками. Главную (/) не трогаем — она отдельная.

  Инструмент — ДВА окна: слева источник/JSON/гугдок, СПРАВА сама страница
  (титул + «На этой странице вы узнаете» + контент из источника, рисуется
  напрямую). Текст контента — байт в байт; раскурсовка помечена.
*/

/** Заголовок секции (H2) — для списка «вы узнаете». */
function sectionTitle(sec: SectionNode): string | null {
  const h = sec.children.find(
    (n): n is Extract<Node, { component: "Heading" }> =>
      (n as Node).component === "Heading",
  );
  // Метки раскурсовки убираем: в заголовке/«вы узнаете» — чистый текст.
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

  const pageDoc: Doc = { module: page.module, children: chosen };

  return <SiteInspector page={page} pageDoc={pageDoc} topics={topics} />;
}
