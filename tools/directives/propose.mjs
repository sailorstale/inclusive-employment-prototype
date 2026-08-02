import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import { loadModule, snippetOf, parseRange } from "./lib.mjs";

/*
  Заливка ПРЕДЛОЖЕНИЙ разметки: спека (какие блоки → во что) превращается в
  директивы со статусом «предложение». Дизайнер видит их в «Результате» и решает
  — принять или отклонить. Сам этот скрипт ничего не решает и ничего не удаляет.

    node tools/directives/propose.mjs specs/m5-3.json --dry   — только проверить
    node tools/directives/propose.mjs specs/m5-3.json         — залить

  Спека: { "module": "m5-3", "proposals": [ { "blocks": "15-18",
  "target": "Accordion", "modifiers": {}, "comment": "инструкция",
  "why": "объяснение" } ] }

  comment и why склеиваются в ОДИН комментарий директивы: сначала инструкция,
  под ней строка «Почему: …». Это и есть предложение — дизайнер правит его
  целиком. Всё от «Почему» и ниже раскладка не читает: иначе рассказ про
  заголовки сам становится заголовком.

  Блоки директивы обязаны идти ПОДРЯД: раскладка ищет непрерывный участок
  документа, совпадающий со списком её блоков (см. directiveAt в SourcePage).
  Дырка в номерах = директива не найдёт своё место и промолчит.
*/

const API = process.env.API || "http://localhost:8787/api/source/directives";
const [specPath, ...flags] = process.argv.slice(2);
const dry = flags.includes("--dry");

if (!specPath) {
  console.error("Укажите файл спеки: node tools/directives/propose.mjs specs/m5-3.json");
  process.exit(1);
}

const spec = JSON.parse(await fs.readFile(specPath, "utf8"));
const { flat } = await loadModule(spec.module);

/*
  РАЗМЕЩЕНИЕ, как в приложении: директива ищет НЕПРЕРЫВНЫЙ участок документа,
  совпадающий со списком её блоков. Сравнивать сами id нельзя — одинаковые
  строки («Обратная связь к варианту 1») дают одинаковые id, и три разных квиза
  выглядели бы как спор за одни блоки. Считаем занятыми ПОЗИЦИИ.
*/
const ids = flat.map((it) => it.id);
const taken = new Set();

/** Позиции, с которых список id ложится на документ подряд. */
const placesOf = (want) => {
  const out = [];
  for (let p = 0; p + want.length <= ids.length; p++)
    if (want.every((id, k) => ids[p + k] === id)) out.push(p);
  return out;
};
const occupy = (p, len) => {
  for (let k = 0; k < len; k++) taken.add(p + k);
};
const freePlace = (at, len) => at.find((p) => !Array.from({ length: len }, (_, k) => p + k).some((i) => taken.has(i)));

// Сначала на документ ложатся уже существующие директивы — поверх них не лезем.
const existing = await fetch(API)
  .then((r) => (r.ok ? r.json() : {}))
  .catch(() => ({}));
for (const d of Object.values(existing)) {
  if (d.module !== spec.module || d.review === "rejected" || !d.blocks.length) continue;
  const at = placesOf(d.blocks.map((b) => b.id));
  const p = freePlace(at, d.blocks.length);
  if (p !== undefined) occupy(p, d.blocks.length);
}

const problems = [];
const ready = [];

for (const [i, p] of spec.proposals.entries()) {
  const nums = parseRange(p.blocks);
  const where = `предложение ${i + 1} (${p.target ?? "без цели"}, блоки ${p.blocks})`;

  if (nums.some((n, k) => k > 0 && n !== nums[k - 1] + 1))
    problems.push(`${where}: блоки идут не подряд`);

  const items = nums.map((n) => flat[n]);
  if (items.some((it) => !it)) {
    problems.push(`${where}: есть номер за пределами модуля`);
    continue;
  }

  const at = placesOf(items.map((it) => it.id));
  if (!at.length) problems.push(`${where}: место не найдено (сбой адресов)`);
  const free = freePlace(at, items.length);
  if (at.length && free === undefined)
    problems.push(`${where}: все подходящие места уже заняты другой директивой`);
  else if (free !== undefined) {
    if (free !== nums[0])
      problems.push(
        `${where}: ляжет не на те блоки (${free} вместо ${nums[0]}) — возьмите соседний блок для однозначности`,
      );
    occupy(free, items.length);
  }

  ready.push({
    id: randomUUID(),
    module: spec.module,
    blocks: items.map((it) => ({
      id: it.id,
      kind: it.kind,
      snippet: snippetOf(it.block),
    })),
    target: p.target ?? null,
    targetLabel: p.targetLabel ?? null,
    modifiers: p.modifiers ?? {},
    comment: [p.comment, p.why && `Почему: ${p.why}`].filter(Boolean).join("\n"),
    origin: "claude",
    review: "proposed",
  });
}

for (const p of problems) console.error("⚠", p);
if (problems.length) {
  console.error(`\nОстановился: ${problems.length} проблем. Ничего не залито.`);
  process.exit(1);
}

console.log(`Готово к заливке: ${ready.length} предложений в ${spec.module}.`);
for (const d of ready)
  console.log(`  ${(d.targetLabel ?? d.target ?? "комментарий").padEnd(16)} ${d.blocks.length} бл. · ${d.comment.slice(0, 70)}`);

if (dry) {
  console.log("\n--dry: ничего не отправлено.");
  process.exit(0);
}

// Статус «применена» — чтобы предложение было видно в «Результате»: судить о
// раскладке можно только по ней. Решение дизайнера живёт в поле review.
for (const d of ready) {
  const put = await fetch(`${API}/${d.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d),
  });
  if (!put.ok) throw new Error(`PUT ${d.id}: ${put.status}`);
  const patch = await fetch(`${API}/${d.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "applied" }),
  });
  if (!patch.ok) throw new Error(`PATCH ${d.id}: ${patch.status}`);
}
console.log(`\nЗалито: ${ready.length}. Смотрите в «Разметке» модуля ${spec.module}.`);
