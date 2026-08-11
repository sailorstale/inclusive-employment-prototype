/*
  Перенос ГОТОВОЙ разметки с одного стенда на другой — по разделам источника.

    node tools/directives/push.mjs analiz-auditorii-nko --to prod --dry
    node tools/directives/push.mjs analiz-auditorii-nko --to prod

  Зачем. Директивы раскладки живут в данных сервера, а у каждого стенда данные
  свои: дев-сервер пишет их на localhost:8787, боевой стенд — на свой том. Код
  публикацией уезжает, данные — нет, поэтому размеченная у нас страница у
  клиента остаётся без разметки. Этот скрипт закрывает разрыв по одной странице.

  Что делает. Берёт директивы, ВСЕ блоки которых лежат в указанных разделах
  источника (раздел — средняя часть id блока), и кладёт их на целевой стенд по
  их же id. Директиву, чьи блоки разбросаны по разным разделам, не трогает и
  называет вслух: перенести её частью нельзя.

  Чего НЕ делает. Ничего не удаляет и не переписывает: id, который на цели уже
  есть, пропускается (это защита от затирания чужой работы — на боевом стенде
  есть записи, которых нет у нас, и удаление там необратимо). Обновить
  существующую запись можно только явным --force.

  Ключи: --to prod | <url> · --from <url> · --dry (только показать) · --force.
*/

const PROD = "https://inclusion-editor-production.up.railway.app";

// Разбор ключей вручную: у --to и --from есть значение, у --dry и --force нет.
// Всё остальное — разделы источника.
const WITH_VALUE = ["--to", "--from"];
const args = process.argv.slice(2);
const opts = {};
const slugs = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (WITH_VALUE.includes(a)) opts[a] = args[++i];
  else if (a.startsWith("--")) opts[a] = true;
  else slugs.push(a);
}

const to = opts["--to"];
const from = opts["--from"] || "http://localhost:8787";
const dry = opts["--dry"] === true;
const force = opts["--force"] === true;

if (!slugs.length || !to) {
  console.error("Укажите разделы и цель: node tools/directives/push.mjs <slug...> --to prod [--dry]");
  process.exit(1);
}

const target = to === "prod" ? PROD : to;
const url = (base) => `${base}/api/source/directives`;

const load = async (base) => {
  const r = await fetch(url(base));
  if (!r.ok) throw new Error(`${base}: сервер ответил ${r.status}`);
  const data = await r.json();
  return Array.isArray(data) ? data : Object.values(data);
};

const sectionOf = (blockId) => blockId.split("::")[1];

const source = await load(from);
const already = new Set((await load(target)).map((d) => d.id));

const want = [];
for (const d of source) {
  const sections = [...new Set(d.blocks.map((b) => sectionOf(b.id)))];
  const inside = sections.filter((s) => slugs.includes(s));
  if (!inside.length) continue;
  if (inside.length !== sections.length) {
    console.log(`⚠ пропущена: блоки в разных разделах (${sections.join(", ")}) — ${d.id}`);
    continue;
  }
  want.push(d);
}

console.log(`Откуда: ${from}\nКуда:   ${target}\nРазделы: ${slugs.join(", ")}\nНашлось директив: ${want.length}\n`);

let put = 0;
let skipped = 0;
for (const d of want) {
  const exists = already.has(d.id);
  const label = `${(d.target || "снятие").padEnd(12)} ${(d.blocks[0].snippet || "").slice(0, 45).replace(/\n/g, " ")}`;
  if (exists && !force) {
    console.log(`= уже есть  ${label}`);
    skipped++;
    continue;
  }
  if (dry) {
    console.log(`${exists ? "~ перезапись" : "+ добавится"} ${label}`);
    put++;
    continue;
  }
  const body = {
    module: d.module,
    blocks: d.blocks,
    target: d.target,
    targetLabel: d.targetLabel,
    modifiers: d.modifiers,
    comment: d.comment,
    origin: d.origin,
    review: d.review,
    off: d.off,
  };
  const r = await fetch(`${url(target)}/${encodeURIComponent(d.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    console.error(`✗ не записалась (${r.status}) ${label}`);
    process.exit(1);
  }
  /*
    СТАТУС ПЕРЕНОСИМ ОТДЕЛЬНО — ИНАЧЕ ЗАПИСЬ ЛЯЖЕТ И НЕ ЗАРАБОТАЕТ.

    Запись разметки применяется к странице только со статусом applied или
    verified (isActive в contentTree). Статус приходит не через PUT — сервер
    ставит новой записи «new» и разметку игнорирует. На странице от этого ничего
    не меняется, а по данным кажется, что перенос прошёл.
  */
  if (d.status === "applied" || d.status === "verified") {
    const p = await fetch(`${url(target)}/${encodeURIComponent(d.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: d.status }),
    });
    if (!p.ok) {
      console.error(`✗ статус не проставился (${p.status}) ${label}`);
      process.exit(1);
    }
  }
  console.log(`✓ ${exists ? "обновлена" : "добавлена"} ${label}`);
  put++;
}

console.log(`\nИтого: ${dry ? "к записи" : "записано"} ${put}, пропущено (уже есть) ${skipped}.`);
