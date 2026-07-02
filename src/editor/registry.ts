import type { AuditEntry, Variant } from "./types";
import { benefitsEdits } from "./content/edits/benefits";
import { auditGenerated } from "./content/edits/audit.generated";
import { m6AuditGenerated } from "./content/edits/m6.audit.generated";
import { decourseGenerated } from "./content/edits/decourse.generated";
import { normalizeText } from "./ids";

// «Склад правок»: наши разборы оригинальных текстов. Сопоставляются с блоком
// по нормализованному тексту оригинала, поэтому подсветка наших вариантов
// появляется на любом блоке, чей текст совпадает с разобранным — без ручной
// привязки id. auditGenerated — массовый аудит флотом; m6AuditGenerated —
// аудит новых текстов Модуля 6; decourseGenerated — предложения «убрать курс»;
// benefitsEdits идут последними, чтобы ручные демо-разборы «Льгот» имели приоритет.

const ALL: AuditEntry[] = [
  ...auditGenerated,
  ...m6AuditGenerated,
  ...decourseGenerated,
  ...benefitsEdits,
];

const byText = new Map<string, AuditEntry>();
for (const entry of ALL) {
  byText.set(normalizeText(entry.original), entry);
}

/** Наши варианты для блока с таким оригинальным текстом (если разбирали). */
export function getVariantsFor(original: string): Variant[] | undefined {
  return byText.get(normalizeText(original))?.variants;
}
