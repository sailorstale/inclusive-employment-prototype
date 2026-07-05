import * as React from "react";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// QuizItem — интерактивный тест/тренажёр: условие видно всегда, варианты
// кликабельны, после ответа — вердикт по каждому (верно/неверно/частично) +
// разбор. Верный вариант кодируется в данных (verdict), а не в прозе.
//
// Два режима:
//  • один верный вариант → клик = мгновенный ответ (как радио-кнопка);
//  • несколько верных → выбор нескольких вариантов + кнопка «Проверить»,
//    разбор и вердикты вылезают только после проверки, со счётом «верно N из M».
// Режим определяется автоматически по числу verdict:"correct" (или пропом multiple).

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
  /** Явно задать множественный выбор; по умолчанию — авто (≥2 верных вариантов). */
  multiple?: boolean;
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
  multiple,
  className,
}: QuizItemProps) {
  const correctCount = options.filter((o) => o.verdict === "correct").length;
  const multi = multiple ?? correctCount > 1;

  // Одиночный режим: null — не отвечено; -1 — раскрыто без выбора; >=0 — индекс.
  const [picked, setPicked] = React.useState<number | null>(null);
  // Множественный режим: набор отмеченных вариантов + флаг проверки.
  const [checked, setChecked] = React.useState<Set<number>>(() => new Set());
  const [submitted, setSubmitted] = React.useState(false);

  const revealed = multi ? submitted : picked !== null;

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  // Сколько верных вариантов пользователь отметил (для счёта «N из M»).
  const gotRight = options.filter(
    (o, i) => o.verdict === "correct" && checked.has(i)
  ).length;

  return (
    <div className={cn("space-y-3 rounded-lg border bg-card p-4", className)}>
      {context ? <div className="space-y-2 text-sm">{context}</div> : null}
      <p className="font-medium text-foreground">{question}</p>
      {multi && !revealed ? (
        <p className="text-xs text-muted-foreground">
          Выберите все подходящие варианты, затем нажмите «Проверить».
        </p>
      ) : null}

      <div className="space-y-2">
        {options.map((o, i) => {
          const cfg = VERDICT[o.verdict];
          const Icon = cfg.icon;
          const isChosen = multi ? checked.has(i) : picked === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => (multi ? toggle(i) : setPicked(i))}
              disabled={multi && submitted}
              role={multi ? "checkbox" : undefined}
              aria-checked={multi ? isChosen : undefined}
              aria-pressed={!multi ? picked === i : undefined}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                revealed
                  ? cfg.box
                  : cn(
                      "border-border hover:bg-accent hover:border-[hsl(var(--brand)/0.4)]",
                      isChosen &&
                        "border-[hsl(var(--brand)/0.6)] bg-[hsl(var(--brand)/0.06)]"
                    ),
                revealed &&
                  isChosen &&
                  "ring-2 ring-[hsl(var(--brand)/0.35)] ring-offset-1 ring-offset-background"
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center border",
                  multi ? "rounded-[4px]" : "rounded-full",
                  revealed
                    ? cfg.color
                    : isChosen
                      ? "border-[hsl(var(--brand))] text-[hsl(var(--brand))]"
                      : "border-muted-foreground"
                )}
              >
                {revealed ? (
                  <Icon className={cn("h-3 w-3", cfg.color)} />
                ) : multi && isChosen ? (
                  <Check className="h-3 w-3" />
                ) : null}
              </span>
              <span className="min-w-0 text-foreground">{o.text}</span>
              {revealed ? (
                <span className={cn("ml-auto text-xs font-medium", cfg.color)}>
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
            {multi ? ` · верно ${gotRight} из ${correctCount}` : null}
          </p>
          <div className="space-y-2 text-foreground">{explanation}</div>
        </div>
      ) : multi ? (
        <Button
          type="button"
          variant="brand"
          size="sm"
          disabled={checked.size === 0}
          onClick={() => setSubmitted(true)}
        >
          Проверить
        </Button>
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
