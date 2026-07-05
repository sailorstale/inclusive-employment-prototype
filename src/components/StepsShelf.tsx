import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Editable } from "@/editor/Editable";

// StepsShelf (00b §2.4) — нумерованный воркфлоу как набор карточек-шагов.
// Обязательный вариант link: each-step-link (карточки ведут на страницы шагов)
// vs non-link (нумерованные правила/шаги в теле страницы — НЕ ссылки, §3).
// Текст шага (eyebrow/title/description) — редактируемый (как в Card): обёрнут
// в Editable as="inline", чтобы авторский текст оставался в редакторском слое.

export type Step = {
  /** Номер/метка шага (например, «1» или «Шаг 1»). */
  number?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  to?: string;
};

type StepsShelfProps = {
  steps: Step[];
  link?: "each-step-link" | "non-link";
  cols?: 2 | 3;
  className?: string;
};

function StepBody({ step }: { step: Step }) {
  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
          {step.number}
        </span>
        {step.eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Editable as="inline">{step.eyebrow}</Editable>
          </span>
        ) : null}
      </div>
      <h3 className="text-base font-semibold leading-snug text-foreground">
        <Editable as="inline">{step.title}</Editable>
      </h3>
      {step.description ? (
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          <Editable as="inline">{step.description}</Editable>
        </p>
      ) : null}
    </>
  );
}

export function StepsShelf({
  steps,
  link = "each-step-link",
  cols = 3,
  className,
}: StepsShelfProps) {
  const colClass = cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  const base = "rounded-lg border bg-card p-6 text-card-foreground";
  return (
    <div
      data-component="StepsShelf"
      className={cn("grid grid-cols-1 gap-4", colClass, className)}
    >
      {steps.map((step, i) =>
        link === "each-step-link" && step.to ? (
          <Link
            key={i}
            to={step.to}
            className={cn(
              base,
              "block transition-colors hover:border-ring hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            <StepBody step={step} />
          </Link>
        ) : (
          <div key={i} className={base}>
            <StepBody step={step} />
          </div>
        )
      )}
    </div>
  );
}
