import fs from "node:fs";
import path from "node:path";
import url from "node:url";

/*
  ПЕРЕПРИВЯЗКА КОММЕНТАРИЕВ после перекройки страниц.

  Адрес комментария — это место блока в дереве страницы. Страницы перекроили:
  разделы стали вложенными, «Правовые основы» разрезали на три страницы,
  «Вопросы и ответы» убрали. Все адреса съехали, и замечания клиента стали
  показывать на чужие блоки.

  Таблица перевода (map.json) собрана сверкой ДВУХ версий сайта: той, в которой
  клиент писал замечания (коммит 01c3c8e от 6 августа 2026), и нынешней. Каждая
  строка подтверждена совпадением текста блока, а не догадкой.

  Скрипт переписывает адрес в id записи. Сам id устроен как
  «страница::адреса::метка», поэтому «переписать» означает создать запись с новым
  id и удалить старую: текст, автор, дата и пометки переезжают без изменений.

    node tools/comments-remap/remap.mjs --dry     # показать, ничего не меняя
    node tools/comments-remap/remap.mjs           # переписать

  Адрес сервера — переменной API (по умолчанию боевой).
*/

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const MAP = JSON.parse(fs.readFileSync(path.join(__dirname, "map.json"), "utf8"));
const API =
  process.env.API || "https://inclusion-editor-production.up.railway.app/api/review/comments";
const dry = process.argv.includes("--dry");

/** Новый адрес одного блока: [страница, адрес] или null, если блок исчез. */
function translate(page, oldPath) {
  const table = MAP[page];
  if (!table) return undefined; // страницы нет в таблице — не трогаем
  const hit = table[oldPath];
  return hit === undefined ? undefined : hit;
}

const list = await fetch(API).then((r) => r.json());
const all = Array.isArray(list) ? list : Object.values(list);

const plan = [];
for (const rec of all) {
  const [page, addr, tail] = rec.id.split("::");
  if (!addr) continue;
  const parts = addr.split("+");
  const moved = parts.map((p) => translate(page, p));

  // Ни один адрес не переводится — запись не наша забота.
  if (moved.every((m) => m === undefined)) continue;

  // Блок(и) убрали со страницы — оставляем запись как есть, пусть висит с пометкой.
  const alive = moved.filter((m) => m && m !== null);
  if (!alive.length) {
    plan.push({ rec, skip: "блок убран со страницы" });
    continue;
  }

  /*
    У группы блоки могут разъехаться по разным страницам. Такого в данных нет,
    но если появится — берём страницу первого и оставляем только её блоки:
    один комментарий не может висеть на двух страницах сразу.
  */
  const newPage = alive[0][0];
  const newPaths = alive.filter((m) => m[0] === newPage).map((m) => m[1]);
  const newId = `${newPage}::${newPaths.join("+")}::${tail}`;
  if (newId === rec.id) continue;
  plan.push({ rec, newId, newPage });
}

const toWrite = plan.filter((p) => p.newId);
const toSkip = plan.filter((p) => p.skip);

console.log(`Всего записей: ${all.length}`);
console.log(`Переписать: ${toWrite.length}`);
console.log(`Оставить как есть (блок убран): ${toSkip.length}`);
for (const p of toWrite.slice(0, 200))
  console.log(`  ${p.rec.id}\n    → ${p.newId}   «${(p.rec.text || "").slice(0, 40)}»`);

if (dry) {
  console.log("\n--dry: ничего не изменено.");
  process.exit(0);
}

let ok = 0;
for (const { rec, newId, newPage } of toWrite) {
  const body = { ...rec, id: newId, page: newPage };
  const put = await fetch(`${API}/${encodeURIComponent(newId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!put.ok) throw new Error(`PUT ${newId}: ${put.status}`);
  /*
    Служебные поля сервер выставляет сам при создании, поэтому «применён» и
    «не применять» дописываем следом — иначе решения потерялись бы.
  */
  if (rec.resolved || rec.skipped) {
    await fetch(`${API}/${encodeURIComponent(newId)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved: !!rec.resolved, skipped: !!rec.skipped }),
    });
  }
  const del = await fetch(`${API}/${encodeURIComponent(rec.id)}`, { method: "DELETE" });
  if (!del.ok) throw new Error(`DELETE ${rec.id}: ${del.status}`);
  ok++;
}
console.log(`\nГотово. Переписано записей: ${ok}.`);
