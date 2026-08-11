import type { SourceBlock } from "@/editor-source/content/source.generated";
import type { Directive } from "@/editor-source/directives";
import { blockRefId } from "@/editor-source/source/blockId";
import type { CardSpec, PageCards } from "./types";
import { teamCards } from "./team";
import { step1Cards } from "./step1";
import { step2Cards } from "./step2";
import { step3Cards } from "./step3";
import { ngoStartCards } from "./ngoStart";
import { ngoAudienceCards } from "./ngoAudience";

/*
  КАРТОЧКА ПО ЗАМЕЧАНИЮ КЛИЕНТА — блоки остаются на странице, но собираются в
  одну карточку вместо простого списка под заголовком.

  Это четвёртый сосед в ряду dropScaffold (блок не доезжает до страницы),
  cutFromCard (доезжает, но вне карточки) и clientEdits (доезжает изменённым).
  Здесь блоки не меняются вовсе — меняется только то, чем их считает раскладка.

  ПОЧЕМУ В КОДЕ, А НЕ В РАЗМЕТКЕ. Собрать блоки в карточку умеет обычная
  директива раскладки, но директивы лежат в данных на сервере, и у боевого
  стенда они свои. Поправить их там значит поправить ровно один стенд. Решение
  по замечанию клиента должно уезжать вместе с кодом и работать везде
  одинаково — то же рассуждение записано в cutFromCard.ts.

  НАЗВАНИЕ КАРТОЧКИ — не украшение, а рабочее поле. Раскладка красит жёлтым
  карточку, названную «Важно», и ставит ей иллюстрацию «Важная информация»;
  «Пример» даёт свою иллюстрацию на обычном фоне (см. bgFor и cardArt).
  Название длиннее четырёх слов или начинающееся с предлога раскладка отбросит.

  ЗАПИСИ ЛЕЖАТ ПО ФАЙЛУ НА СТРАНИЦУ — соседние файлы этой папки. Здесь только
  механика. Так сделано 11 августа 2026: четыре сессии из пяти просили карточки
  на своих страницах и дописывали в один список.
*/

const PAGES: PageCards[] = [
  teamCards,
  step1Cards,
  step2Cards,
  step3Cards,
  ngoStartCards,
  ngoAudienceCards,
];

/*
  Один блок в двух карточках — так быть не должно: блок принадлежит одной
  карточке, и две записи на него значат, что страницы взялись за один кусок или
  запись скопировали у соседа. Молча выиграла бы последняя, поэтому конфликты
  собираются в список, а в режиме разработки сборка падает сразу.
*/
export type CardConflict = { block: string; pages: string[] };

const conflicts: CardConflict[] = [];
const owner = new Map<string, string>();
const CARDS: CardSpec[] = [];

for (const page of PAGES)
  for (const card of page.cards) {
    const taken = card.blocks.filter((id) => owner.has(id));
    if (taken.length) {
      for (const id of taken)
        conflicts.push({ block: id, pages: [owner.get(id) as string, page.page] });
      continue;
    }
    card.blocks.forEach((id) => owner.set(id, page.page));
    CARDS.push(card);
  }

/** Блоки, заявленные сразу двумя страницами. Пусто — всё в порядке. */
export const cardBlockConflicts: readonly CardConflict[] = conflicts;

if (import.meta.env.DEV && conflicts.length) {
  const lines = conflicts.map((c) => `${c.block} — ${c.pages.join(", ")}`);
  throw new Error(
    `Карточки по замечаниям: один блок заявлен несколькими страницами.\n${lines.join("\n")}`,
  );
}

type BlockSection = { anchor?: string; blocks: SourceBlock[] };
type DirectiveAt = (si: number, bi: number) => Directive | undefined;

/*
  Директива, которой в данных нет. Раскладка не спрашивает, откуда директива
  пришла, — ей важны цель, модификаторы и комментарий, поэтому собираем ровно
  такую же запись, какую завёл бы дизайнер руками.

  Статус «applied» обязателен: раскладка молчит на директивах, которые ещё не
  перенесены (isActive в contentTree). Заголовок карточки раскладка вычитывает
  из комментария — отсюда фраза «Добавь заголовок Важно», а не поле.

  Вид блока берём настоящий, у самого блока источника. Раскладка его отсюда не
  читает (она смотрит на блок напрямую), но запись, которая врёт о себе, рано
  или поздно собьёт с толку панель разметки или проверку.
*/
function directiveFor(
  spec: CardSpec,
  moduleId: string,
  src: SourceBlock[],
): Directive {
  const target = spec.target ?? "GeneralCard";
  const quote = target === "Quote";
  return {
    id: `important:${spec.blocks[0]}`,
    module: moduleId,
    blocks: spec.blocks.map((id, k) => ({
      id,
      kind: src[k]?.kind ?? "paragraph",
      snippet: "",
    })),
    target,
    /*
      Название цели и модификаторы записываем такими же, какие стоят у пометок
      дизайнера в данных: «Цитата» и размер L у цитат, «General Card» с
      вертикальной раскладкой у карточек. Раскладка читает отсюда только цель и
      модификаторы, но запись, которая врёт о себе, собьёт с толку панель
      разметки и проверку выгрузки.
    */
    targetLabel: quote ? "Цитата" : "General Card",
    modifiers: quote
      ? { size: "L", yandex: false }
      : { orient: "Vertical", icon: false, step: false },
    /*
      Комментарий здесь — рабочее поле, а не пояснение: раскладка вычитывает из
      него и заголовок карточки, и число карточек, и отказ от фото. Поэтому
      собираем его теми же словами, какими просьбу написал бы дизайнер.

      У цитаты названия нет: подпись собирается из имени и должности.
    */
    comment: [
      spec.title ? `Добавь заголовок ${spec.title}` : "",
      spec.split ? `Сделать ${spec.split} карточек` : "",
      spec.noPhoto ? "Без фото" : "",
    ]
      .filter(Boolean)
      .join(". "),
    status: "applied",
    createdAt: "2026-08-10T00:00:00.000Z",
  };
}

/*
  Та же адресация директив, но на названных местах — синтетическая карточка.

  Блоки не трогаем ВООБЩЕ: обычная директива адресуется непрерывной цепочкой
  блоков, и любая вставка или правка внутри цепочки рвёт совпадение, после чего
  разметка молча слетает со всего куска. Здесь меняется только ответ на вопрос
  «какая директива накрывает этот блок», а сами блоки остаются как были.

  Одна и та же директива на всю группу — это и есть склейка: раскладка собирает
  подряд идущие блоки в одну группу, пока у них совпадает id директивы.

  Место в цепочке ПОСЛЕДНЕЕ (см. useModuleDoc и siteExport): к этому моменту
  леса курса сняты и номера блоков окончательны, а значит и адреса, которые мы
  отдаём. Поставить шаг раньше — цепочка не совпадёт, и карточки молча не
  соберутся.
*/
export function wrapImportantCards(
  sections: BlockSection[],
  pathname: string,
  moduleId: string,
  at: DirectiveAt,
): DirectiveAt {
  const mine = new Map<string, Directive>();

  sections.forEach((sec, si) => {
    const ids = sec.blocks.map((b) => blockRefId(b, pathname, sec.anchor));
    for (const spec of CARDS) {
      const start = ids.indexOf(spec.blocks[0]);
      if (start < 0) continue;
      // Цепочка обязана совпасть целиком: неполная карточка — это не то, о чём
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
