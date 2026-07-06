import * as React from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { scrollToId, anchorId } from "@/lib/scroll";
import { useToc, type TocItem, type TocSubItem } from "@/lib/toc";
import { useEditor } from "@/editor/EditorProvider";

// PageToc (00 — оглавление «На этой странице») — страница объявляет свои секции.
// Пункты = заголовкам секций ДОСЛОВНО. Десктоп: переносятся в липкий рейл со
// scrollspy (TocRail в Layout). Узкий экран: рисуются здесь, в теле под заголовком.
// Показывать только от ~3 секций (на 1–2 секции PageToc на странице не ставят).
// Маршрутизация хеш-адресами → переход к секции делаем программным скроллом,
// а не href="#id" (иначе HashRouter примет это за смену маршрута).

/** Общий рендерер ссылок оглавления (используется и в рейле, и в теле, и в мобильном меню). */
export function TocLinks({
  items,
  activeId,
  onSelect,
  className,
  subItems,
  activeSubId,
}: {
  items: TocItem[];
  activeId?: string | null;
  /** Если задан — заменяет переход по умолчанию (например: закрыть меню, затем прокрутить). */
  onSelect?: (id: string) => void;
  className?: string;
  /** Подзаголовки (h3) АКТИВНОЙ секции — рисуются вложенным списком под ней (десктоп-рейл). */
  subItems?: TocSubItem[];
  activeSubId?: string | null;
}) {
  const { headingTextOf } = useEditor();
  const { pathname } = useLocation();
  return (
    <ul className={cn("space-y-1.5", className)}>
      {items.map((item) => {
        const id = anchorId(item.anchor);
        const active = activeId === id;
        const subs =
          active && subItems && subItems.length > 0 ? subItems : null;
        return (
          <li key={id}>
            <button
              type="button"
              onClick={() => (onSelect ? onSelect(id) : scrollToId(id))}
              aria-current={active ? "location" : undefined}
              className={cn(
                "rounded-sm text-left text-sm underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active
                  ? "font-medium text-brand underline"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {headingTextOf(pathname, item.label, item.anchor)}
            </button>
            {subs ? (
              <ul className="ml-1 mt-1.5 space-y-1 border-l border-border pl-3">
                {subs.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() =>
                        onSelect ? onSelect(s.id) : scrollToId(s.id)
                      }
                      aria-current={
                        activeSubId === s.id ? "location" : undefined
                      }
                      className={cn(
                        "rounded-sm text-left text-[0.8125rem] leading-snug underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        activeSubId === s.id
                          ? "font-medium text-brand"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function PageToc({
  items,
  minItems = 3,
}: {
  items: TocItem[];
  /** Минимум пунктов для показа оглавления. По умолчанию 3 (1–2 секции не
   *  показываем). Хабы с короткой структурой могут понизить до 2. */
  minItems?: number;
}) {
  const { setItems } = useToc();
  const show = items.length >= minItems;
  const key = items.map((i) => i.anchor + "|" + i.label).join("§");

  // useLayoutEffect — рейл получает пункты до отрисовки, без скачка ширины колонок.
  React.useLayoutEffect(() => {
    if (show) setItems(items);
    else setItems([]);
    return () => setItems([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, show]);

  if (!show) return null;

  // До xl: в теле, НЕ липкое (на широком экране это место занимает рейл TocRail).
  return (
    <nav
      aria-label="На этой странице"
      data-component="PageToc"
      className="rounded-lg border bg-muted/30 p-5 xl:hidden"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        На этой странице
      </p>
      <TocLinks items={items} />
    </nav>
  );
}
