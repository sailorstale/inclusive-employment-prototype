import { cn } from "@/lib/utils";
import {
  type GlossaryEntry,
  glossaryAnchorId,
} from "@/data/glossary";

// DefinitionList (00b §2.9) — алфавитный «термин — определение» с H4-группами
// по букве. Каждый термин имеет id-якорь — цель для GlossaryTerm.

/** Группирует записи по первой букве, сохраняя исходный порядок. */
function groupByLetter(entries: GlossaryEntry[]) {
  const groups: { letter: string; items: GlossaryEntry[] }[] = [];
  for (const entry of entries) {
    const letter = entry.term.charAt(0).toUpperCase();
    const last = groups[groups.length - 1];
    if (last && last.letter === letter) {
      last.items.push(entry);
    } else {
      groups.push({ letter, items: [entry] });
    }
  }
  return groups;
}

export function DefinitionList({
  entries,
  className,
}: {
  entries: GlossaryEntry[];
  className?: string;
}) {
  const groups = groupByLetter(entries);
  return (
    <dl className={cn("space-y-6", className)}>
      {groups.map((group) => (
        <div key={group.letter} className="space-y-3">
          <h4 className="text-base font-semibold text-muted-foreground">
            {group.letter}
          </h4>
          <div className="space-y-4 border-t pt-3">
            {group.items.map((entry) => {
              const id = glossaryAnchorId(entry);
              return (
                <div
                  key={entry.slug}
                  className="grid grid-cols-1 gap-1 md:grid-cols-[14rem_1fr] md:gap-6"
                >
                  <dt
                    id={id}
                    data-anchor={id}
                    className="scroll-mt-20 font-semibold text-foreground"
                  >
                    {entry.term}
                  </dt>
                  <dd className="leading-relaxed text-muted-foreground">
                    {entry.definition}
                  </dd>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </dl>
  );
}
