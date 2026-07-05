import * as React from "react";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// QuizItem — интерактивный тест/тренажёр: условие видно всегда, варианты
// кликабельны, после выбора — вердикт по каждому (верно/неверно/частично) +
// разбор. Заменяет ручную сборку из Disclosure + BulletList + глифов ☐/◯ +
// «Ответ:/ОС:». Верный вариант кодируется в данных (verdict), а не в прозе.

export type QuizVerdict = "correct" | "wrong" | "partial";
export type QuizOption = { text: React.ReactNode; verdict: QuizVerdict };

type QuizItemProps = {
  /** Вопрос/условие — всегда видно, не прячется под клик. */
  question: React.ReactNode;
  /** Доп. контекст (кейс, функции, вводная) — всегда видно. */
  context?: React.ReactNode;
  options: QuizOption[];
  /** Разбор — раскрывается после ответа. */
  explanation: React.ReactNode;
  /** Подпись блока разбора (напр. «Обратная связь»). */
  revealLabel?: string;
  className?: string;
};

const VERDICT: Record<
  QuizVerdict,
  { icon: React.ElementType; box: string; color: string; tag: string }
> = {
  correct: {
    icon: Check,
    box: "border-[hsl(var(--ok)/0.6)] bg-[hsl(var(--ok)/0.08)]",
    color: "text-[hsl(var(--ok))]",
    tag: "Верно",
  },
  partial: {
    icon: Minus,
    box: "border-[hsl(var(--warn)/0.6)] bg-[hsl(var(--warn)/0.08)]",
    color: "text-[hsl(var(--warn))]",
    tag: "Частично",
  },
  wrong: {
    icon: X,
    box: "border-[hsl(var(--bad)/0.6)] bg-[hsl(var(--bad)/0.08)]",
    color: "text-[hsl(var(--bad))]",
    tag: "Неверно",
  },
};

export function QuizItem({
  question,
  context,
  options,
  explanation,
  revealLabel = "Разбор",
  className,
}: QuizItemProps) {
  // null — не отвечено; -1 — раскрыто без выбора; >=0 — индекс выбранного.
  const [picked, setPicked] = React.useState<number | null>(null);
  const revealed = picked !== null;

  return (
    <div className={cn("space-y-3 rounded-lg border bg-card p-4", className)}>
      {context ? <div className="space-y-2 text-sm">{context}</div> : null}
      <p className="font-medium text-foreground">{question}</p>

      <div className="space-y-2">
        {options.map((o, i) => {
          const cfg = VERDICT[o.verdict];
          const Icon = cfg.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setPicked(i)}
              aria-pressed={picked === i}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                revealed
                  ? cfg.box
                  : "border-border hover:bg-accent hover:border-[hsl(var(--brand)/0.4)]",
                revealed &&
                  picked === i &&
                  "ring-2 ring-[hsl(var(--brand)/0.35)] ring-offset-1 ring-offset-background"
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                  revealed ? cfg.color : "border-muted-foreground"
                )}
              >
                {revealed ? <Icon className={cn("h-3 w-3", cfg.color)} /> : null}
              </span>
              <span className="min-w-0 text-foreground">{o.text}</span>
              {revealed ? (
                <span
                  className={cn("ml-auto text-xs font-medium", cfg.color)}
                >
                  {cfg.tag}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {revealed ? (
        <div className="space-y-1 rounded-md bg-muted/50 p-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {revealLabel}
          </p>
          <div className="space-y-2 text-foreground">{explanation}</div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPicked(-1)}
          className="text-sm font-medium text-brand hover:underline"
        >
          Показать разбор
        </button>
      )}
    </div>
  );
}
