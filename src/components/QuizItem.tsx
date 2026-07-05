import * as React from "react";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// QuizItem — интерактивный тест/тренажёр. Единый сценарий для всех квизов:
// человек выбирает вариант(ы), затем жмёт «Проверить» — только после этого
// показываются вердикты и разбор. Верный вариант кодируется в данных (verdict).
//
// Кардинальность выбора определяется автоматически (или пропом multiple):
//  • один верный вариант → выбор одного (радио);
//  • несколько верных → выбор нескольких (чекбоксы) + счёт «верно N из M».
//
// Разбор — на выбор: общий на весь вопрос (проп explanation) и/или отдельный
// под каждый вариант (поле note у варианта) — «почему этот вариант верен/неверен».

export type QuizVerdict = "correct" | "wrong" | "partial";
export type QuizOption = {
  text: React.ReactNode;
  verdict: QuizVerdict;
  /** Пояснение к конкретному варианту — показывается под ним после проверки. */
  note?: React.ReactNode;
};

type QuizItemProps = {
  /** Вопрос/условие — всегда видно, не прячется под клик. */
  question: React.ReactNode;
  /** Доп. контекст (кейс, функции, вводная) — всегда видно. */
  context?: React.ReactNode;
  options: QuizOption[];
  /** Общий разбор на весь вопрос — раскрывается после проверки. Необязателен, если разбор задан по вариантам. */
  explanation?: React.ReactNode;
  /** Подпись блока общего разбора (напр. «Обратная связь»). */
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

  const [selected, setSelected] = React.useState<Set<number>>(() => new Set());
  const [submitted, setSubmitted] = React.useState(false);
  const revealed = submitted;

  function choose(i: number) {
    if (submitted) return;
    setSelected((prev) => {
      // Один верный → как радио: остаётся только один выбор.
      if (!multi) return new Set([i]);
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const gotRight = options.filter(
    (o, i) => o.verdict === "correct" && selected.has(i)
  ).length;

  return (
    <div className={cn("space-y-3 rounded-lg border bg-card p-4", className)}>
      {context ? <div className="space-y-2 text-sm">{context}</div> : null}
      <p className="font-medium text-foreground">{question}</p>
      {!revealed ? (
        <p className="text-[0.8125rem] text-muted-foreground">
          {multi
            ? "Выберите все подходящие варианты, затем нажмите «Проверить»."
            : "Выберите вариант, затем нажмите «Проверить»."}
        </p>
      ) : null}

      <div
        className="space-y-2"
        role={multi ? "group" : "radiogroup"}
      >
        {options.map((o, i) => {
          const cfg = VERDICT[o.verdict];
          const Icon = cfg.icon;
          const isChosen = selected.has(i);
          return (
            <React.Fragment key={i}>
              <button
                type="button"
                onClick={() => choose(i)}
                disabled={submitted}
                role={multi ? "checkbox" : "radio"}
                aria-checked={isChosen}
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
                  ) : isChosen ? (
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
              {revealed && o.note ? (
                <p className="px-3 pb-1 text-[0.8125rem] text-muted-foreground">
                  <span className={cn("font-medium", cfg.color)}>
                    {cfg.tag}.{" "}
                  </span>
                  {o.note}
                </p>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      {revealed ? (
        explanation ? (
          <div className="space-y-1 rounded-md bg-muted/50 p-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {revealLabel}
              {multi ? ` · верно ${gotRight} из ${correctCount}` : null}
            </p>
            <div className="space-y-2 text-foreground">{explanation}</div>
          </div>
        ) : multi ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Верно {gotRight} из {correctCount}
          </p>
        ) : null
      ) : (
        <Button
          type="button"
          variant="brand"
          size="sm"
          disabled={selected.size === 0}
          onClick={() => setSubmitted(true)}
        >
          Проверить
        </Button>
      )}
    </div>
  );
}
