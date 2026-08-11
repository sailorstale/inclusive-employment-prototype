import type { SourceBlock } from "@/editor-source/content/source.generated";
import type { Directive } from "@/editor-source/directives";
import type { Insert, PageEdits, Retyped } from "./types";
import { contractEdits } from "./contract";
import { quotasEdits } from "./quotas";
import { howEdits } from "./how";
import { teamEdits } from "./team";
import { step1Edits } from "./step1";
import { step2Edits } from "./step2";
import { step3Edits } from "./step3";
import { ngoStartEdits } from "./ngoStart";
import { ngoAudienceEdits } from "./ngoAudience";

/*
  ПРАВКИ ПО ЗАМЕЧАНИЯМ КЛИЕНТА, КОТОРЫЕ НЕ УМЕЩАЮТСЯ В «УБРАТЬ БЛОК».

  ИСТОЧНИК НЕ ТРОГАЕМ НИКОГДА. Левая колонка инструмента сверки показывает
  модуль дословно, и весь смысл инструмента в том, что расхождение с гугл-доком
  видно глазами. Правка в `content/source/*.generated.ts` это расхождение
  прячет: клиент открывает сверку и видит, будто в доке уже так и написано.

  Есть и вторая причина, техническая. Адрес блока — это отпечаток его текста
  (blockRefId), а разметка привязана к отпечатку точным совпадением
  (placeDirectives). Правка одной буквы в источнике меняет отпечаток, разметка
  молча отваливается, и на странице вместо карточек появляется сырой блок.
  Проверено 10 августа 2026 на таблице со степенями: она развалилась обратно в
  таблицу, и чинить пришлось запись в данных — своими руками и на каждом стенде
  отдельно.

  Поэтому правим не источник, а то, что доходит до страницы. Это сосед
  dropScaffold (там блок вовсе не доезжает) и cutFromCard (там блок доезжает, но
  уже не внутри карточки). Здесь — оставшиеся случаи: заменить текст внутри
  ячейки таблицы, переписать текст блока, набрать жирным пункт списка,
  превратить абзац в заголовок и заголовок в абзац, вставить новый блок и
  поставить заголовок перед группой.

  Работает ТОЛЬКО на сайте и в выгрузке — там же, где dropScaffold. Инструмент
  «Редактура источника» этот слой не проходит.

  ЗАПИСИ ЛЕЖАТ ПО ФАЙЛУ НА СТРАНИЦУ — соседние файлы этой папки. Здесь только
  механика, которая их применяет, и сборка всех наборов в один. Так сделано
  11 августа 2026: пять сессий разбирали замечания по своим страницам
  одновременно, дописывали в одни и те же списки, и каждое слияние приходилось
  разбирать руками.
*/

const PAGES: PageEdits[] = [
  contractEdits,
  quotasEdits,
  howEdits,
  teamEdits,
  step1Edits,
  step2Edits,
  step3Edits,
  ngoStartEdits,
  ngoAudienceEdits,
];

/*
  ОДИН КЛЮЧ ЗАЯВЛЕН ДВАЖДЫ — так быть не должно. Ключ здесь всегда текст блока
  или пункта в источнике, а один и тот же текст принадлежит одной странице.
  Совпадение значит одно из двух: две страницы взялись за один блок, или кто-то
  скопировал запись у соседа и забыл поменять.

  Молча выиграл бы последний набор в списке, и правка соседней страницы просто
  перестала бы работать — без единого сообщения. Поэтому конфликты собираются в
  список, страница «Проверки» их показывает, а в режиме разработки сборка
  падает сразу.
*/
export type EditKeyConflict = {
  /** Какой список: «текст блока», «ячейка таблицы» и так далее. */
  kind: string;
  key: string;
  pages: string[];
};

const conflicts: EditKeyConflict[] = [];

function mergeRecords<T>(
  kind: string,
  pick: (p: PageEdits) => Record<string, T> | undefined,
): Record<string, T> {
  const out: Record<string, T> = {};
  const owner: Record<string, string> = {};
  for (const page of PAGES) {
    const rec = pick(page);
    if (!rec) continue;
    for (const [key, value] of Object.entries(rec)) {
      if (key in out) {
        const seen = conflicts.find((c) => c.kind === kind && c.key === key);
        if (seen) seen.pages.push(page.page);
        else conflicts.push({ kind, key, pages: [owner[key], page.page] });
        continue;
      }
      out[key] = value;
      owner[key] = page.page;
    }
  }
  return out;
}

const CELL_TEXT = mergeRecords<string>("ячейка таблицы", (p) => p.cells);
const CELL_ROWS = mergeRecords<string[]>("строка таблицы", (p) => p.cellRows);
const REWRITE = mergeRecords<{ md: string; text: string }>(
  "текст блока",
  (p) => p.rewrite,
);
const RETYPE = mergeRecords<Retyped>("абзац стал заголовком", (p) => p.retype);
const LIST_ITEM_MD = mergeRecords<string>("пункт списка", (p) => p.listItemMd);
const NO_MARKUP = new Set<string>(PAGES.flatMap((p) => p.noMarkup ?? []));
const UNTYPE = new Set<string>(PAGES.flatMap((p) => p.untype ?? []));
const INSERTS: Insert[] = PAGES.flatMap((p) => p.inserts ?? []);

/*
  Записи на строку таблицы, где ячеек не столько, сколько в источнике. Проверяем
  здесь же, до общего сообщения об ошибке: лишняя или недостающая ячейка сдвинет
  колонки во всей таблице, а заметить это можно только глазами.
*/
for (const page of PAGES)
  for (const [key, cells] of Object.entries(page.cellRows ?? {})) {
    const was = key.split(" | ").length;
    if (cells.length === was) continue;
    conflicts.push({
      kind: `строка таблицы: ячеек ${cells.length} вместо ${was}`,
      key,
      pages: [page.page],
    });
  }

/** Ключи, заявленные сразу двумя страницами. Пусто — всё в порядке. */
export const editKeyConflicts: readonly EditKeyConflict[] = conflicts;

if (import.meta.env.DEV && conflicts.length) {
  const lines = conflicts.map(
    (c) => `${c.kind} «${c.key}» — ${c.pages.join(", ")}`,
  );
  throw new Error(
    `Правки по замечаниям: один и тот же ключ заявлен несколькими страницами.\n${lines.join("\n")}`,
  );
}

/*
  Ячейки таблицы, переписанные по замечаниям. Не таблица — блок как был.

  Сначала правила на всю строку, потом на отдельную ячейку. Порядок важен: ключ
  строки считается по ИСХОДНЫМ ячейкам, и замена одной ячейки не должна уводить
  из-под правила всю строку.

  Строка другой длины не применяется. Лишняя или недостающая ячейка сдвинула бы
  колонки во всей таблице, и заметить это можно было бы только глазами, поэтому
  такая запись уходит в список конфликтов — он виден на странице «Проверки».
*/
function fixCells(b: SourceBlock): SourceBlock {
  if (b.kind !== "table") return b;
  let touched = false;
  const rows = b.rows.map((row) => {
    const whole = CELL_ROWS[row.map((c) => c.trim()).join(" | ")];
    const base = whole && whole.length === row.length ? ((touched = true), whole) : row;
    return base.map((cell) => {
      const next = CELL_TEXT[cell.trim()];
      if (next === undefined) return cell;
      touched = true;
      return next;
    });
  });
  return touched ? { ...b, rows } : b;
}


type BlockSection = { anchor?: string; blocks: SourceBlock[] };
type DirectiveAt = (si: number, bi: number) => Directive | undefined;

const textOf = (b: SourceBlock): string =>
  typeof (b as { text?: string }).text === "string"
    ? (b as { text: string }).text
    : "";

/*
  Блоки с переписанным текстом. Списки, таблицы и картинки поля text не имеют,
  и до них правило не достаёт — там свои механизмы (ячейки таблицы выше).

  Уровень заголовка, якорь и вид блока остаются прежними: меняется только то,
  что читатель видит. Адресацию директив это не сдвигает — разметку кладут на
  полный источник ДО этого слоя (см. useModuleDoc), и к моменту правки каждая
  директива уже нашла свои блоки.
*/
function rewriteText(b: SourceBlock): SourceBlock {
  if (b.kind !== "heading" && b.kind !== "paragraph" && b.kind !== "quote")
    return b;
  const next = REWRITE[b.text];
  return next ? { ...b, md: next.md, text: next.text } : b;
}

/*
  Абзац, ставший заголовком. Вид блока меняется целиком, поэтому собираем новый
  блок, а не дополняем прежний: у абзаца нет ни уровня, ни якоря, и оставь мы
  лишние поля — заголовок унёс бы их с собой в раскладку.
*/
function retype(b: SourceBlock): SourceBlock {
  if (b.kind !== "paragraph") return b;
  const next = RETYPE[b.text];
  if (!next) return b;
  return {
    kind: "heading",
    level: next.level,
    md: next.md,
    text: next.text,
    anchor: next.anchor,
  };
}

/*
  Заголовок, ставший обычным абзацем, — зеркало retype. Уровень и якорь
  отбрасываем намеренно: якорь и есть то, по чему заголовок попадает в
  оглавление справа, и оставь мы его — строка ушла бы из текста, но осталась в
  меню.
*/
function untype(b: SourceBlock): SourceBlock {
  if (b.kind !== "heading" || !UNTYPE.has(b.text)) return b;
  return { kind: "paragraph", md: b.md, text: b.text };
}

/** Пункты списка, набранные жирным по замечанию. Не список — блок как был. */
function boldListItems(b: SourceBlock): SourceBlock {
  if (b.kind !== "list") return b;
  let touched = false;
  const items = b.items.map((it) => {
    const md = LIST_ITEM_MD[it.text];
    if (md === undefined) return it;
    touched = true;
    return { ...it, md };
  });
  return touched ? { ...b, items } : b;
}

/*
  Вставленный блок разметки не имеет и иметь не может: разметка адресуется
  блоками источника, а этого блока в источнике нет. Поэтому вместе с блоками
  пересобираем и адресацию: для нового блока директивы нет, для старого она та
  же, что была до вставки.

  Ставить блок ВНУТРЬ цепочки, которую занимает директива, нельзя — цепочка
  перестанет быть непрерывной и разметка слетит со всего куска. Наши вставки
  стоят на границе: абзац про справки МСЭ — последним в разделе, заголовок
  «Примеры» — перед первой из карточек-примеров.
*/
export function applyClientEdits(
  sections: BlockSection[],
  at: DirectiveAt,
): { sections: BlockSection[]; directiveAt: DirectiveAt } {
  /*
    Для каждого нового номера блока — его прежний номер. null значит «разметки у
    блока нет»: у вставленного её не было никогда, а у блока из NO_MARKUP мы её
    снимаем. Адрес самого блока при этом не меняется.
  */
  const origin: (number | null)[][] = [];

  const next = sections.map((sec, si) => {
    const blocks: SourceBlock[] = [];
    const from: (number | null)[] = [];
    sec.blocks.forEach((b, bi) => {
      const text = textOf(b);
      for (const ins of INSERTS)
        if (ins.before?.test(text))
          for (const nb of ins.blocks) {
            blocks.push(nb);
            from.push(null);
          }
      blocks.push(untype(retype(rewriteText(boldListItems(fixCells(b))))));
      from.push(NO_MARKUP.has(text) ? null : bi);
      for (const ins of INSERTS)
        if (ins.after?.test(text))
          for (const nb of ins.blocks) {
            blocks.push(nb);
            from.push(null);
          }
    });
    origin[si] = from;
    return { ...sec, blocks };
  });

  return {
    sections: next,
    directiveAt: (si, bi) => {
      const was = origin[si]?.[bi];
      return was === null || was === undefined ? undefined : at(si, was);
    },
  };
}
