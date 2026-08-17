/*
  ПЕРЕВОД ЗАМЕЧАНИЙ НА НОВЫЕ АДРЕСА СТРАНИЦ.

  17 августа 2026 из адресов убрали лишний уровень, оставшийся от курса:
  /general/legal/quotas стал /general/quotas, /companies/hire/step-1 —
  /companies/step-1 и так далее. Уровень ничего не значил: правовые страницы и
  шаги найма стоят в общем ряду меню, а «Соискатели» и «Работодатели» — это
  заголовки групп, а не разделы сайта.

  ЧТО МЕНЯЕТСЯ У ЗАПИСИ. Только поле page — та страница, на которой панель
  показывает замечание. Опознаватель (id) НЕ ТРОГАЕМ, хотя старый адрес виден и
  в нём: по id замечание связано с журналом разбора (appliedComments.ts, 473
  записи), и смена id погасила бы у клиента метки «сделано» на всех этих
  страницах. Внутри приложения адрес из id нигде не читается — страницу берут из
  поля page (см. SiteInspector, pageComments), поэтому старый адрес в id
  безвреден: это историческая метка, как дата.

  ТЕКСТ, АВТОР, ОТВЕТЫ И ПОМЕТКИ НЕ ТРОГАЕМ — это данные клиента.

    node tools/comments-repage/repage.mjs --dry   # показать, ничего не меняя
    node tools/comments-repage/repage.mjs         # перевести

  Адрес сервера — переменной API (по умолчанию боевой).
*/
const API =
  process.env.API || "https://inclusion-editor-production.up.railway.app/api/review/comments";
const dry = process.argv.includes("--dry");

/** Старый адрес → новый. Возвращает undefined, если адрес не менялся. */
function movedPage(page) {
  if (!page) return undefined;
  const rules = [
    [/^\/general\/legal\/(contract|benefits|formats|quotas|documents)$/, "/general/$1"],
    [/^\/companies\/hire\/(step-[1-6])$/, "/companies/$1"],
    [/^\/ngo\/candidates\/(guidance|psychology|vacancies|resume|interview)$/, "/ngo/$1"],
    [/^\/ngo\/employers\/talks$/, "/ngo/talks"],
  ];
  for (const [re, to] of rules) if (re.test(page)) return page.replace(re, to);
  return undefined;
}

const list = await fetch(API).then((r) => r.json());
const all = Array.isArray(list) ? list : Object.values(list);

const plan = [];
for (const rec of all) {
  const next = movedPage(rec.page);
  if (next) plan.push({ rec, next });
}

console.log(`Всего замечаний: ${all.length}`);
console.log(`Перевести на новый адрес: ${plan.length}`);
const byPage = {};
for (const p of plan) byPage[`${p.rec.page} → ${p.next}`] = (byPage[`${p.rec.page} → ${p.next}`] || 0) + 1;
for (const [move, n] of Object.entries(byPage).sort((a, b) => b[1] - a[1]))
  console.log(`  ${String(n).padStart(3)}  ${move}`);

if (dry) {
  console.log("\n--dry: ничего не изменено.");
  process.exit(0);
}

let ok = 0;
const failed = [];
for (const { rec, next } of plan) {
  const body = { ...rec, page: next };
  const put = await fetch(`${API}/${encodeURIComponent(rec.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (put.ok) ok++;
  else failed.push(`${rec.id}: ${put.status}`);
}

console.log(`\nПереведено: ${ok} из ${plan.length}`);
if (failed.length) {
  console.error("Не записалось:");
  for (const f of failed) console.error("  " + f);
  process.exit(1);
}
