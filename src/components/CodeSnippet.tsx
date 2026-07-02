import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

// CodeSnippet (00b §2.8) — копируемый сниппет (НЕ авторский контент):
// ИИ-промпты, юр-формулировки в договор, шаблоны письма/звонка/отклика.

type CodeSnippetProps = {
  /** Текст-метка тега (например, «ИИ-помощник», «Дисклеймер»). */
  tag?: React.ReactNode;
  /** Текст для копирования. */
  text: string;
  /** Опц. шапка над сниппетом (например, дисклеймер). */
  header?: React.ReactNode;
  className?: string;
};

export function CodeSnippet({ tag, text, header, className }: CodeSnippetProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* буфер обмена недоступен — тихо игнорируем в прототипе */
    }
  };

  return (
    <div
      data-component="CodeSnippet"
      className={cn(
        "max-w-prose overflow-hidden rounded-lg border bg-muted/40",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b bg-muted/60 px-4 py-2">
        {tag ? <Badge tone="outline">{tag}</Badge> : <span />}
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Скопировано
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Копировать
            </>
          )}
        </button>
      </div>
      {header ? (
        <div className="border-b px-4 py-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
          {header}
        </div>
      ) : null}
      <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-3 font-mono text-sm leading-relaxed text-foreground">
        {text}
      </pre>
    </div>
  );
}
