import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { findGlossaryEntry, glossaryAnchorId } from "@/data/glossary";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

// GlossaryTerm (00b §2.9, §4) — inline-связка термина с глоссарием.
// Наведение/фокус → тултип с определением; клик → переход на #/glossary к якорю.
// Падение назад: если термина нет в словаре — обычный текст без подчёркивания.

type GlossaryTermProps = {
  /** Ключ для поиска статьи (например, «ИПРА», «разумная адаптация»). */
  term: string;
  children?: React.ReactNode;
};

export function GlossaryTerm({ term, children }: GlossaryTermProps) {
  const entry = findGlossaryEntry(term);
  const navigate = useNavigate();
  const location = useLocation();
  const label = children ?? term;

  if (!entry) {
    return <>{label}</>;
  }

  const id = glossaryAnchorId(entry);

  const go = () => {
    if (location.pathname === "/glossary") {
      scrollToId(id);
    } else {
      navigate("/glossary", { state: { anchor: id } });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="link"
          tabIndex={0}
          onClick={go}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              go();
            }
          }}
          className={cn(
            "cursor-help underline decoration-dotted decoration-from-font underline-offset-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          )}
        >
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent>{entry.definition}</TooltipContent>
    </Tooltip>
  );
}
