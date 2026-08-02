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
  "target": "Compare", "modifiers": {}, "comment": "…" } ] }

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

// Что уже занято директивами дизайнера — поверх чужой разметки не предлагаем.
const existing = await fetch(API)
  .then((r) => (r.ok ? r.json() : {}))
  .catch(() => ({}));
const takenIds = new Set();
for (const d of Object.values(existing)) {
  if (d.module !== spec.module || d.review === "rejected") continue;
  for (const b of d.blocks) takenIds.add(b.id);
}

const problems = [];
const ready = [];
const usedHere = new Set();

for (const [i, p] of spec.proposals.entries()) {
  const nums = parseRange(p.blocks);
  const where = `предложение ${i + 1} (${p.target ?? "без цели"}, блоки ${p.blocks})`;

  const gap = nums.some((n, k) => k > 0 && n !== nums[k - 1] + 1);
  if (gap) problems.push(`${where}: блоки идут не подряд`);

  const items = nums.map((n) => flat[n]);
  if (items.some((it) => !it)) {
    problems.push(`${where}: есть номер за пределами модуля`);
    continue;
  }

  const clash = items.filter((it) => takenIds.has(it.id));
  if (clash.length)
    problems.push(
      `${where}: блок уже размечен существующей директивой — «${clash[0].text.slice(0, 60)}…»`,
    );

  const twice = items.filter((it) => usedHere.has(it.id));
  if (twice.length) problems.push(`${where}: блок уже занят другим предложением`);
  items.forEach((it) => usedHere.add(it.id));

  // Место в документе должно определяться однозначно: если такая же
  // последовательность id встречается дважды, директива может лечь не туда.
  const ids = items.map((it) => it.id);
  let places = 0;
  for (let s = 0; s + ids.length <= flat.length; s++) {
    if (ids.every((id, k) => flat[s + k].id === id)) places++;
  }
  if (places === 0) problems.push(`${where}: место не найдено (сбой адресов)`);
  if (places > 1)
    problems.push(`${where}: ${places} одинаковых мест в модуле — возьмите соседний блок для однозначности`);

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
    comment: p.comment ?? "",
    note: p.why ?? "",
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
