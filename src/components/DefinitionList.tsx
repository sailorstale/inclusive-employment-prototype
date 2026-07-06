import { cn } from "@/lib/utils";
import { Editable } from "@/editor/Editable";
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
    <div data-component="DefinitionList" className={cn("space-y-6", className)}>
      {groups.map((group, gi) => (
        // Буква может повторяться (глоссарий не отсортирован — сохраняем
        // исходный порядок), поэтому в ключ добавляем индекс группы.
        <div key={`${group.letter}-${gi}`} className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">
            {group.letter}
          </h3>
          <dl className="space-y-4 border-t pt-3">
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
                    <Editable as="inline">{entry.term}</Editable>
                  </dt>
                  <dd className="leading-relaxed text-muted-foreground">
                    <Editable as="inline">{entry.definition}</Editable>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      ))}
    </div>
  );
}
