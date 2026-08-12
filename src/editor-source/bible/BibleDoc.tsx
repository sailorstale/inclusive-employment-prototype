import * as React from "react";
import { MessageSquare } from "lucide-react";
import { highlightJson } from "@/editor-source/source/JsonView";
import { cn } from "@/lib/utils";
import { bibleBlocks, type BibleBlock } from "./bible.generated";
import { renderBibleInline } from "./inline";

/*
  ПОКАЗ СПРАВОЧНИКА. Документ собран скриптом в блоки (bible.generated.ts), а
  здесь каждый блок рисуется и становится местом для замечания: клик выделяет
  блок, и в правой колонке открывается форма.

  Разметка блоков повторяет приём страницы источника (PageSourceView): обёртка с
  адресом в data-атрибуте, подсветка выбранного классом. Так же, как там,
  никакого редактора внутри нет — это просто текст.
*/

type Props = {
  /*
    Выделенные блоки — к ним открыта форма замечания. Набор, а не один адрес:
    замечание часто относится к нескольким кускам подряд, например к правилу и
    примеру под ним. Обычный клик выделяет один блок, клик с Shift, Cmd или Ctrl
    добавляет ещё.
  */
  picked: Set<string>;
  onPick: (id: string, add: boolean) => void;
  /** Адреса блоков, к которым уже есть замечания: помечаем цветом и значком. */
  commented: Set<string>;
  /** Блоки замечания, которое читают в панели: показываем их отдельной рамкой. */
  active: Set<string>;
  /** Адрес блока, к которому надо подвести страницу (клик в списке замечаний). */
  scrollTo: string | null;
};

const HEADING_CLASS: Record<number, string> = {
  2: "mt-12 text-2xl font-semibold tracking-tight",
  3: "mt-9 text-lg font-semibold",
  4: "mt-7 text-base font-semibold",
};

/** Имя компонента набираем моноширинным — тем же шрифтом, каким оно в данных. */
const isComponentName = (text: string) => /^[A-Z][A-Za-z]/.test(text);

function BlockBody({ block }: { block: BibleBlock }) {
  switch (block.kind) {
    case "heading":
      return React.createElement(
        `h${block.level}`,
        {
          id: block.anchor,
          className: cn(
            HEADING_CLASS[block.level],
            "scroll-mt-6 text-foreground",
            block.level === 3 && isComponentName(block.text) && "font-mono text-[1.05rem]",
          ),
        },
        renderBibleInline(block.md),
      );

    case "para":
      return (
        <p className="max-w-[68ch] leading-relaxed text-foreground/90">
          {renderBibleInline(block.md)}
        </p>
      );

    case "quote":
      return (
        <blockquote className="max-w-[68ch] rounded-r-md border-l-[3px] border-primary bg-muted/50 py-3 pl-4 pr-4 leading-relaxed">
          {renderBibleInline(block.md)}
        </blockquote>
      );

    case "list":
      return (
        <ul className="ml-5 max-w-[68ch] list-disc space-y-1.5 leading-relaxed text-foreground/90">
          {block.items.map((item, i) => (
            <li key={i}>{renderBibleInline(item)}</li>
          ))}
        </ul>
      );

    case "table":
      return (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/60">
                {block.header.map((cell, i) => (
                  <th
                    key={i}
                    className="whitespace-nowrap border-b px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {renderBibleInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-b last:border-b-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 align-top leading-snug">
                      {renderBibleInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "code":
      return (
        <pre className="overflow-x-auto rounded-md border bg-muted/40 px-4 py-3 text-[13px] leading-relaxed">
          <code className="font-mono">
            {block.lang === "json" ? highlightJson(block.body) : block.body}
          </code>
        </pre>
      );
  }
}

export function BibleDoc({ picked, onPick, commented, active, scrollTo }: Props) {
  const box = React.useRef<HTMLDivElement>(null);

  // Подвести документ к блоку, выбранному в списке замечаний.
  React.useEffect(() => {
    if (!scrollTo) return;
    const el = box.current?.querySelector(`[data-block="${CSS.escape(scrollTo)}"]`);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [scrollTo]);

  return (
    <div ref={box} className="mx-auto max-w-3xl px-8 py-8">
      {bibleBlocks.map((block) => {
        const isPicked = picked.has(block.id);
        const hasComment = commented.has(block.id);
        const isActive = active.has(block.id);
        return (
          <div
            key={block.id}
            data-block={block.id}
            role="button"
            tabIndex={0}
            aria-pressed={isPicked}
            /* Shift, Cmd и Ctrl добавляют блок к выделению — так же, как в
               инструменте сверки на страницах сайта. */
            onClick={(e) => onPick(block.id, e.shiftKey || e.metaKey || e.ctrlKey)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onPick(block.id, e.shiftKey || e.metaKey || e.ctrlKey);
              }
            }}
            className={cn(
              "relative -mx-3 cursor-pointer rounded-md px-3 py-1.5 transition-colors",
              "hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isPicked && "bg-accent/70 ring-1 ring-primary/40",
              // Место с замечанием видно и цветом, и полосой слева: одного фона
              // мало, когда рядом идут несколько подсвеченных блоков подряд.
              hasComment && "border-l-2 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20",
              // Замечание, открытое в панели: рамка ярче, чтобы среди соседних
              // жёлтых блоков было видно, о каких именно идёт речь.
              isActive && "ring-2 ring-amber-500",
            )}
          >
            <BlockBody block={block} />
            {hasComment ? (
              <MessageSquare
                className="absolute right-1 top-2 size-3.5 text-amber-600"
                aria-label="К этому месту есть замечание"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
