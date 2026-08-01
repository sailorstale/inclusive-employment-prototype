import * as React from "react";
import { renderInline } from "@/editor-source/richText";
import type { SourceBlock } from "@/editor-source/content/source.generated";

/*
  Источник страницы — форматированной прозой, как в модульном инструменте
  (колонка «Текст»). Обычные HTML-элементы, а НЕ компоненты Prose: те внутри
  оборачивают текст в Editable, которому нужен провайдер редактора — на сайте
  его нет. Здесь источник только смотрят и сверяют, не правят.
*/
const headingClass = (level: 2 | 3 | 4) =>
  level === 2
    ? "scroll-mt-4 pt-2 text-xl font-semibold tracking-tight text-foreground"
    : level === 3
      ? "scroll-mt-4 text-lg font-semibold tracking-tight text-foreground"
      : "scroll-mt-4 text-base font-semibold text-foreground";

function Block({ block }: { block: SourceBlock }) {
  switch (block.kind) {
    case "heading": {
      const Tag = `h${block.level}` as "h2" | "h3" | "h4";
      // id по якорю — для посекционной синхронизации скролла с сайтом.
      return (
        <Tag id={block.anchor} className={headingClass(block.level)}>
          {renderInline(block.md)}
        </Tag>
      );
    }
    case "paragraph":
      return <p className="leading-relaxed text-foreground">{renderInline(block.md)}</p>;
    case "quote":
      return (
        <blockquote className="max-w-prose border-l-2 border-border pl-4 italic text-muted-foreground">
          {renderInline(block.md)}
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-2">
          <img
            src={block.src}
            alt={block.alt || ""}
            loading="lazy"
            className="h-auto max-w-full rounded-md border"
          />
        </figure>
      );
    case "list": {
      const cls = "space-y-1 pl-5 leading-relaxed text-foreground";
      const items = block.items.map((it, i) => <li key={i}>{renderInline(it.md)}</li>);
      return block.ordered ? (
        <ol className={`list-decimal ${cls}`}>{items}</ol>
      ) : (
        <ul className={`list-disc ${cls}`}>{items}</ul>
      );
    }
    case "table":
      return (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {block.header.some((c) => c) && (
              <thead>
                <tr>
                  {block.header.map((c, i) => (
                    <th
                      key={i}
                      className="border border-border bg-muted/50 px-3 py-2 text-left align-top font-semibold"
                    >
                      {renderInline(c)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows.map((r, ri) => (
                <tr key={ri}>
                  {r.map((c, ci) => (
                    <td key={ci} className="border border-border px-3 py-2 align-top leading-relaxed">
                      {renderInline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function PageSourceView({
  blocks,
  highlight,
}: {
  blocks: SourceBlock[];
  /** Индекс блока, который подсветить (клик по компоненту на сайте). */
  highlight?: number | null;
}) {
  return (
    <div className="space-y-3 px-6 py-5">
      {blocks.map((b, i) => (
        <div
          key={i}
          data-hl={i === highlight ? "1" : undefined}
          className={
            i === highlight
              ? "-mx-2 rounded-sm bg-[color:var(--pick-bg)] px-2"
              : undefined
          }
        >
          <Block block={b} />
        </div>
      ))}
    </div>
  );
}
