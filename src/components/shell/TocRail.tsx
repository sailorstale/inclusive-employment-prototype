import {
  usePassedSpy,
  useScrollSpy,
  useSubSections,
  useToc,
} from "@/lib/toc";
import { TocLinks } from "../PageToc";

// TocRail (00 — оглавление «На этой странице», десктоп) — липкий рейл справа со
// scrollspy: подсвечивает секцию, в которой читатель сейчас находится. Пункты
// приходят из контекста (их объявляет PageToc на странице). На узком экране
// рейла нет — там оглавление рисует сам PageToc в теле.

export function TocRail() {
  const { items } = useToc();
  const activeId = useScrollSpy(items.map((i) => i.anchor));
  // Двухуровневость: у активной секции авто-раскрываются её h3-подзаголовки
  // (читаются из DOM — страницы ничего не размечают). Ушёл из секции — свернулись.
  const subItems = useSubSections(activeId);
  const activeSubId = usePassedSpy(subItems.map((s) => s.id));

  if (!items.length) return null;

  return (
    <nav
      aria-label="На этой странице"
      className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        На этой странице
      </p>
      <TocLinks
        items={items}
        activeId={activeId}
        subItems={subItems}
        activeSubId={activeSubId}
      />
    </nav>
  );
}
