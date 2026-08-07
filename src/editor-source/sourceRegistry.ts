import type { Variant, AuditEntry } from "@/editor/types";
import { lazyIndex } from "@/editor/variantsLoad";
import { normalizeText } from "./ids";

// Реестр вариантов ИСТОЧНИКА истины (страницы /source, Поток H) — отдельный от
// реестра сайта (registry.ts). Источник и сайт частично совпадают по тексту;
// изоляция реестров не даёт вариантам «протекать» между ними. Editable выбирает
// реестр по пути (/source → этот).
//
// Разборы весят 2,3 мегабайта и нужны только в режиме редактора, поэтому
// подтягиваются отдельным куском по требованию (см. variantsLoad.ts).

const index = lazyIndex(async () => {
  const { sourceEditsGenerated } = await import("./content/edits/source.generated");
  const byText = new Map<string, AuditEntry>();
  for (const entry of sourceEditsGenerated)
    byText.set(normalizeText(entry.original), entry);
  return byText;
});

/** Наши варианты для блока источника с таким оригинальным текстом. */
export function getSourceVariantsFor(original: string): Variant[] | undefined {
  const byText = index.peek();
  if (!byText) {
    void index.load();
    return undefined;
  }
  return byText.get(normalizeText(original))?.variants;
}
