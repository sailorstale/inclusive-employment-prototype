// Проверка разбора замечаний клиента: npm run check:review
//
// Две тихие ошибки, от которых нет другой защиты.
//
// ПЕРВАЯ — правило снятия блока цепляет лишнее. Каждое замечание «убираем»
// превращается в правило, которое ищет блок по началу фразы (dropScaffold.ts), а
// ищет оно по всему источнику — там больше пяти тысяч текстовых блоков. Попадись
// та же фраза ещё где-нибудь, блок исчезнет с чужой страницы, и заметить это
// можно только глазами, открыв ту страницу. Правило говорит, сколько блоков
// должно снять; сверяем с источником.
//
// ВТОРАЯ — опечатка в опознавателе замечания. Запись в журнале разбора
// (appliedComments.ts) привязана к замечанию строкой вроде
// «/general/how::0::msg8lxtgjwly», и её копируют руками. Опечатка ничего не
// ломает: правка внесена, а у клиента замечание так и висит «в работе», и он
// думает, что мы его не заметили. Сверяем опознаватели с живым списком
// замечаний на сервере.
//
// Сервер недоступен — вторая проверка пропускается с предупреждением, а не
// валит всё: работать без сети должно быть можно.
import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "../..");
const REVIEW_API =
  process.env.REVIEW_API ?? "https://inclusion-editor-production.up.railway.app";

/*
  Файлы проекта на TypeScript, а скрипт обычный. Собираем нужные модули тем же
  esbuild, который стоит под Vite: так проверка читает НАСТОЯЩИЕ правила, а не
  их пересказ регулярками по тексту файла. Пересказ разошёлся бы с правилами
  ровно тогда, когда они изменятся, — то есть в самый неподходящий момент.
*/
async function importTs(entry) {
  const out = path.join(
    await fs.mkdtemp(path.join(os.tmpdir(), "check-review-")),
    "bundle.mjs",
  );
  await build({
    entryPoints: [path.join(ROOT, entry)],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: out,
    logLevel: "silent",
    alias: { "@": path.join(ROOT, "src") },
    /*
      Модули писались под браузер и спрашивают у сборщика, где они запущены
      (import.meta.env). В узле такого нет, и без подстановки модуль падает на
      первой же строке. Отдаём то же, что отдал бы обычный прод-режим: правки по
      замечаниям при DEV бросают исключение на конфликте ключей, а здесь этот
      конфликт надо не уронить, а показать вместе с остальными находками.
    */
    define: {
      "import.meta.env": JSON.stringify({ BASE_URL: "/", DEV: false, PROD: true }),
    },
  });
  return import(pathToFileURL(out).href);
}

/** Весь текст блоков источника — по нему и ищут правила снятия. */
async function sourceTexts() {
  const dir = path.join(ROOT, "src/editor-source/content/source");
  const texts = [];
  for (const file of (await fs.readdir(dir)).filter((f) => f.endsWith(".ts"))) {
    const raw = await fs.readFile(path.join(dir, file), "utf8");
    for (const m of raw.matchAll(/"text":\s*"((?:[^"\\]|\\.)*)"/g))
      texts.push({ file, text: JSON.parse(`"${m[1]}"`) });
  }
  return texts;
}

const problems = [];
const note = (line) => problems.push(line);

// ── 1. Правила снятия блоков ────────────────────────────────────────────────
const { CUT_BY_CLIENT } = await importTs("src/editor-source/site/dropScaffold.ts");
const texts = await sourceTexts();
console.log(
  `Правил снятия: ${CUT_BY_CLIENT.length}. Текстовых блоков в источнике: ${texts.length}.`,
);

for (const rule of CUT_BY_CLIENT) {
  const hits = texts.filter((t) => rule.re.test(t.text));
  if (hits.length === rule.hits) continue;
  note(
    `Правило ${rule.re} должно снимать блоков: ${rule.hits}, а снимает: ${hits.length}.` +
      (hits.length
        ? `\n    Попадает в: ${hits
            .slice(0, 6)
            .map((h) => `${h.file} — «${h.text.slice(0, 50)}»`)
            .join("; ")}`
        : "\n    Не находит ничего: текст в источнике изменился или уже убран."),
  );
}

// ── 2. Правки по замечаниям, которые метят больше чем в один блок ───────────
/*
  Правка по замечанию адресуется ТЕКСТОМ блока целиком, и ищется этот текст по
  всему сайту, а не по одной странице. Если такая же строка есть где-то ещё,
  правка молча применится и там — на чужой странице, которую никто не смотрел.

  Опаснее всего короткие служебные строки: в модуле про соискателей «Например:»
  встречается четыре раза, «Обратите внимание:» — три. Проверка ловит именно их.

  Ячейки таблиц сюда не попадают: их текст лежит в строках таблицы, а не в поле
  «text», и собрать его тем же способом нельзя. Их проверяет сторож выгрузки.
*/
const { PAGES } = await importTs("src/editor-source/site/clientEdits/index.ts");
const byText = new Map();
for (const t of texts) byText.set(t.text, (byText.get(t.text) ?? 0) + 1);

/*
  ПРАВКИ ХОДЯТ ЦЕПОЧКОЙ, и проверка обязана это знать. Текст блока переписывается
  ПЕРВЫМ, а смена вида, снятие разметки и снятие ссылки работают уже по новому
  тексту (порядок вызовов в clientEdits/index.ts). Так, например, на «Шаге 1»
  абзац «Пример: разбор вакансии…» сначала теряет слово «Пример», а потом
  становится заголовком — и ключ у второй записи новый, которого в источнике нет
  и быть не может.

  Поэтому к текстам источника добавляем то, что правки сами создают. Иначе
  проверка ругалась бы на верную работу, а такую проверку быстро перестают
  читать.
*/
for (const page of PAGES)
  for (const next of Object.values(page.rewrite ?? {}))
    if (!byText.has(next.text)) byText.set(next.text, 1);

const keysOf = (page) => [
  ...Object.keys(page.rewrite ?? {}).map((k) => ["текст блока", k]),
  ...Object.keys(page.retype ?? {}).map((k) => ["абзац стал заголовком", k]),
  ...Object.keys(page.listItemMd ?? {}).map((k) => ["пункт списка", k]),
  ...(page.untype ?? []).map((k) => ["заголовок стал текстом", k]),
  ...(page.noMarkup ?? []).map((k) => ["снятая разметка", k]),
  ...(page.unlink ?? []).map((k) => ["снятая ссылка", k]),
];

for (const page of PAGES) {
  const allowed = new Set(page.sameTextOk ?? []);
  for (const [kind, key] of keysOf(page)) {
    const n = byText.get(key) ?? 0;
    if (n === 1 || (n > 1 && allowed.has(key))) continue;
    note(
      n === 0
        ? `Правка «${kind}» страницы ${page.page} не находит в источнике ничего:\n    «${key.slice(0, 70)}»\n    Текст изменился — правка больше не работает.`
        : `Правка «${kind}» страницы ${page.page} попадает в ${n} блоков сразу:\n    «${key.slice(0, 70)}»\n    Она применится и на соседних страницах. Возьмите строку длиннее или другой способ, а если так и задумано — впишите ключ в sameTextOk.`,
    );
  }
  /*
    Разрешение, которое пережило свою причину. Текст перестал повторяться, а
    пометка осталась — и следующий такой же ключ пройдёт молча.
  */
  for (const key of allowed)
    if ((byText.get(key) ?? 0) < 2)
      note(
        `У страницы ${page.page} в sameTextOk лежит ключ, который больше не повторяется:\n    «${key.slice(0, 70)}»\n    Уберите его — иначе разрешение будет прикрывать чужую ошибку.`,
      );
}

// ── 3. Опознаватели в журнале разбора ───────────────────────────────────────
const applied = await importTs("src/editor-source/site/appliedComments.ts");
/*
  Список записей журнала наружу не отдан — модуль показывает только поиск по
  опознавателю. Собираем опознаватели тем же поиском: спрашиваем про каждое
  замечание клиента, есть ли на него запись, и заодно ловим обратное — запись,
  под которую замечания уже нет.
*/
const logIds = [...new Set(readLogIds(await fs.readFile(
  path.join(ROOT, "src/editor-source/site/appliedComments.ts"),
  "utf8",
)))];
console.log(`Записей в журнале разбора: ${logIds.length}.`);

/** Опознаватели из журнала. Ключи структуры, а не разбор текста «на глаз». */
function readLogIds(src) {
  const log = src.slice(src.indexOf("const LOG"));
  return [...log.matchAll(/^ {4}id:\s*"([^"]+)"/gm)].map((m) => m[1]);
}

// Сверяем прочитанное с самим модулем: расходятся — значит читаем неправильно.
const unreadable = logIds.filter((id) => !applied.appliedFor(id));
if (unreadable.length)
  note(
    `Проверка не смогла прочитать журнал: ${unreadable.length} записей не нашлись ` +
      `через appliedFor. Изменилась разметка файла — поправьте readLogIds.`,
  );

let live = null;
try {
  const r = await fetch(`${REVIEW_API}/api/review/comments`);
  if (!r.ok) throw new Error(`ответ ${r.status}`);
  live = await r.json();
} catch (e) {
  console.warn(
    `\n[!] Замечания клиента недоступны (${e.message}) — сверку опознавателей пропускаю.`,
  );
}

if (live) {
  const known = new Set(live.map((c) => c.id));
  const orphans = logIds.filter((id) => !known.has(id));
  if (orphans.length)
    note(
      `Записей журнала без замечания клиента: ${orphans.length}. Скорее всего ` +
        `опечатка в опознавателе — метка «сделано» у клиента не загорится.\n    ` +
        orphans.slice(0, 8).join("\n    "),
    );

  /*
    Второй раунд: две записи на одно замечание нужны, когда клиент ответил, и у
    второй должно стоять поле answers. Без него панель считает, что мы ответили
    на ноль реплик, и замечание навсегда останется «новым раундом».
  */
  const seen = new Map();
  for (const id of readLogIds(
    await fs.readFile(path.join(ROOT, "src/editor-source/site/appliedComments.ts"), "utf8"),
  ))
    seen.set(id, (seen.get(id) ?? 0) + 1);
  for (const [id, n] of seen) {
    if (n < 2) continue;
    const last = applied.appliedFor(id);
    if (typeof last?.answers !== "number")
      note(
        `На замечание ${id} заведено записей: ${n}, но у последней нет поля ` +
          `answers. Замечание останется помеченным «новый раунд».`,
      );
  }

  console.log(
    `Замечаний клиента на сервере: ${live.length}. ` +
      `Из них разобрано: ${live.filter((c) => applied.appliedFor(c.id)).length}.`,
  );
}

// ── Итог ────────────────────────────────────────────────────────────────────
if (problems.length) {
  console.error(`\nНашлось проблем: ${problems.length}\n`);
  for (const p of problems) console.error(`  • ${p}\n`);
  process.exit(1);
}
console.log("\nВсё сходится.");
