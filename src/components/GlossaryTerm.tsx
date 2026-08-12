import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { findGlossaryEntry } from "@/data/glossary";
import { cn } from "@/lib/utils";

// GlossaryTerm (00b §2.9, §4) — inline-термин с подсказкой-определением.
// Наведение/фокус → тултип. БЕЗ перехода в глоссарий по клику (достаточно
// тултипа). Падение назад: если термина нет в словаре — обычный текст.

// ВЫКЛЮЧАТЕЛЬ ПОДСКАЗОК ПО ГЛОССАРИЮ (решение дизайнера, 12.08.2026).
// false — термин рендерится обычным текстом, без пунктира и без пузыря.
// Разметка `<GlossaryTerm term="…">` на страницах при этом НЕ трогается:
// все ~295 мест остаются в коде, чтобы включение обратно стоило одну правку
// здесь. Не переносить проверку выше по дереву — падение назад должно быть
// в одном месте, иначе страницы начнут расходиться между собой.
const GLOSSARY_TOOLTIPS_ENABLED: boolean = false;

type GlossaryTermProps = {
  /** Ключ для поиска статьи (например, «ИПРА», «разумная адаптация»). */
  term: string;
  children?: React.ReactNode;
};

export function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const entry = findGlossaryEntry(term);
  const label = children ?? term;

  if (!GLOSSARY_TOOLTIPS_ENABLED || !entry) {
    return <>{label}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          className={cn(
            "cursor-help underline decoration-dotted decoration-from-font underline-offset-2",
            "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        >
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent>{entry.definition}</TooltipContent>
    </Tooltip>
  );
}
