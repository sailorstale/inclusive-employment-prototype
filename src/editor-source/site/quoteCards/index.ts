import type { SourceBlock } from "@/editor-source/content/source.generated";
import type { Directive } from "@/editor-source/directives";
import { blockRefId } from "@/editor-source/source/blockId";
import type { PageQuotes, QuoteSpec } from "./types";
import { ngoStartQuotes } from "./ngoStart";

/*
  ЦИТАТА ПО ЗАМЕЧАНИЮ КЛИЕНТА — блоки остаются на странице, но собираются в
  карточку цитаты вместо простых абзацев подряд.

  Это близнец importantCards: там из блоков собирается карточка, здесь — цитата.
  Механика одна и та же (синтетическая разметка поверх блоков), а разделены они
  потому, что цитата — не карточка с названием: у неё свой разбор строки
  авторства, свой логотип организации и своё фото автора (ветка Quote в
  contentTree). Названием карточки этого не задать.

  ПОЧЕМУ В КОДЕ, А НЕ В РАЗМЕТКЕ. Собрать блоки в цитату умеет обычная директива
  дизайнера, но директивы лежат в данных на сервере, и у боевого стенда они свои.
  Поправить их там значит поправить ровно один стенд. Решение по замечанию
  клиента должно уезжать вместе с кодом и работать везде одинаково — то же
  рассуждение записано в cutFromCard.ts и importantCards.

  ЗАПИСИ ЛЕЖАТ ПО ФАЙЛУ НА СТРАНИЦУ — соседние файлы этой папки. Здесь только
  механика. Своя страница — свой файл рядом, и строка в PAGES ниже.
*/

const PAGES: PageQuotes[] = [ngoStartQuotes];

/*
  Один блок в двух цитатах — так быть не должно: блок принадлежит одной цитате, и
  две записи на него значат, что страницы взялись за один кусок или запись
  скопировали у соседа. Молча выиграла бы последняя, поэтому конфликты собираются
  в список, а в режиме разработки сборка падает сразу.
*/
export type QuoteConflict = { block: string; pages: string[] };

const conflicts: QuoteConflict[] = [];
const owner = new Map<string, string>();
const QUOTES: QuoteSpec[] = [];

for (const page of PAGES)
  for (const quote of page.quotes) {
    const taken = quote.blocks.filter((id) => owner.has(id));
    if (taken.length) {
      for (const id of taken)
        conflicts.push({ block: id, pages: [owner.get(id) as string, page.page] });
      continue;
    }
    quote.blocks.forEach((id) => owner.set(id, page.page));
    QUOTES.push(quote);
  }

/** Блоки, заявленные сразу двумя страницами. Пусто — всё в порядке. */
export const quoteBlockConflicts: readonly QuoteConflict[] = conflicts;

if (import.meta.env.DEV && conflicts.length) {
  const lines = conflicts.map((c) => `${c.block} — ${c.pages.join(", ")}`);
  throw new Error(
    `Цитаты по замечаниям: один блок заявлен несколькими страницами.\n${lines.join("\n")}`,
  );
}

type BlockSection = { anchor?: string; blocks: SourceBlock[] };
type DirectiveAt = (si: number, bi: number) => Directive | undefined;

/*
  Директива, которой в данных нет. Раскладка не спрашивает, откуда директива
  пришла, — ей важны цель, модификаторы и комментарий, поэтому собираем ровно
  такую же запись, какую завёл бы дизайнер руками.

  Статус «applied» обязателен: раскладка молчит на директивах, которые ещё не
  перенесены (isActive в contentTree).

  Отказ от фото раскладка вычитывает из комментария — тем же способом, каким
  читает «убери кавычки». Отдельного поля у цитаты нет, а комментарий у неё уже
  рабочий.
*/
function directiveFor(
  spec: QuoteSpec,
  moduleId: string,
  src: SourceBlock[],
): Directive {
  return {
    id: `quote:${spec.blocks[0]}`,
    module: moduleId,
    blocks: spec.blocks.map((id, k) => ({
      id,
      kind: src[k]?.kind ?? "paragraph",
      snippet: "",
    })),
    target: "Quote",
    targetLabel: "Цитата",
    modifiers: { size: spec.size ?? "L", yandex: false },
    comment: spec.noPhoto ? "Прямая речь — в карточку цитаты, без фото." : "Прямая речь — в карточку цитаты.",
    status: "applied",
    createdAt: "2026-08-11T00:00:00.000Z",
  };
}

/*
  Та же адресация директив, но на названных местах — синтетическая цитата.

  Блоки не трогаем ВООБЩЕ: обычная директива адресуется непрерывной цепочкой
  блоков, и любая вставка или правка внутри цепочки рвёт совпадение, после чего
  разметка молча слетает со всего куска. Здесь меняется только ответ на вопрос
  «какая директива накрывает этот блок», а сами блоки остаются как были.

  Одна и та же директива на всю группу — это и есть склейка: раскладка собирает
  подряд идущие блоки в одну группу, пока у них совпадает id директивы.

  Место в цепочке ПОСЛЕДНЕЕ, рядом с карточками (см. useModuleDoc и siteExport):
  к этому моменту леса курса сняты, правки по замечаниям применены и адреса
  блоков окончательны. Поставить шаг раньше — цепочка не совпадёт, и цитата молча
  не соберётся.
*/
export function wrapQuotes(
  sections: BlockSection[],
  pathname: string,
  moduleId: string,
  at: DirectiveAt,
): DirectiveAt {
  const mine = new Map<string, Directive>();

  sections.forEach((sec, si) => {
    const ids = sec.blocks.map((b) => blockRefId(b, pathname, sec.anchor));
    for (const spec of QUOTES) {
      const start = ids.indexOf(spec.blocks[0]);
      if (start < 0) continue;
      // Цепочка обязана совпасть целиком: неполная цитата — это не то, о чём
      // просил клиент, и значит источник разошёлся со списком выше.
      const whole = spec.blocks.every((id, k) => ids[start + k] === id);
      if (!whole) continue;
      const dir = directiveFor(
        spec,
        moduleId,
        sec.blocks.slice(start, start + spec.blocks.length),
      );
      spec.blocks.forEach((_, k) => mine.set(`${si}:${start + k}`, dir));
    }
  });

  return (si, bi) => mine.get(`${si}:${bi}`) ?? at(si, bi);
}
