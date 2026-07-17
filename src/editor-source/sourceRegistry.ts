import type { Variant, AuditEntry } from "@/editor/types";
import { sourceEditsGenerated } from "./content/edits/source.generated";
import { normalizeText } from "./ids";

// Реестр вариантов ИСТОЧНИКА истины (страницы /source, Поток H) — отдельный от
// реестра сайта (registry.ts). Источник и сайт частично совпадают по тексту;
// изоляция реестров не даёт вариантам «протекать» между ними. Editable выбирает
// реестр по пути (/source → этот).
const byText = new Map<string, AuditEntry>();
for (const entry of sourceEditsGenerated) {
  byText.set(normalizeText(entry.original), entry);
}

/** Наши варианты для блока источника с таким оригинальным текстом. */
export function getSourceVariantsFor(original: string): Variant[] | undefined {
  return byText.get(normalizeText(original))?.variants;
}
