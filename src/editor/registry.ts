import type { AuditEntry, Variant } from "./types";
import { normalizeText } from "./ids";
import { lazyIndex } from "./variantsLoad";

// «Склад правок»: наши разборы оригинальных текстов. Сопоставляются с блоком
// по нормализованному тексту оригинала, поэтому подсветка наших вариантов
// появляется на любом блоке, чей текст совпадает с разобранным — без ручной
// привязки id. auditGenerated — массовый аудит флотом; m6AuditGenerated —
// аудит новых текстов Модуля 6; decourseGenerated — предложения «убрать курс»;
// benefitsEdits — ручные демо-разборы «Льгот»; deepGenerated — ГЛУБОКАЯ
// перегенерация (пилот: Льготы+Команда): один вариант закрывает все измерения
// разом, включая вплавленную курсовость. Идёт ПОСЛЕДНИМ — для пилотных блоков
// заменяет старые конкурирующие правки (audit/decourse), т.к. Map берёт
// последнюю запись по тексту.
//
// Сами разборы весят больше мегабайта и нужны только в режиме редактора,
// поэтому подтягиваются отдельным куском по требованию (см. variantsLoad.ts).

const index = lazyIndex(async () => {
  const [audit, m6, decourse, benefits, deep] = await Promise.all([
    import("./content/edits/audit.generated"),
    import("./content/edits/m6.audit.generated"),
    import("./content/edits/decourse.generated"),
    import("./content/edits/benefits"),
    import("./content/edits/deep.generated"),
  ]);
  const ALL: AuditEntry[] = [
    ...audit.auditGenerated,
    ...m6.m6AuditGenerated,
    ...decourse.decourseGenerated,
    ...benefits.benefitsEdits,
    ...deep.deepGenerated,
  ];
  const byText = new Map<string, AuditEntry>();
  for (const entry of ALL) byText.set(normalizeText(entry.original), entry);
  return byText;
});

/*
  Наши варианты для блока с таким оригинальным текстом (если разбирали).
  Данных ещё нет — молча возвращаем undefined и запускаем загрузку: вызов идёт
  из отрисовки, ждать здесь нельзя. Когда кусок приедет, подписчики
  перерисуются (useVariants).
*/
export function getVariantsFor(original: string): Variant[] | undefined {
  const byText = index.peek();
  if (!byText) {
    void index.load();
    return undefined;
  }
  return byText.get(normalizeText(original))?.variants;
}
