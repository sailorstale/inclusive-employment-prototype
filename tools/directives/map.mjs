import { loadModule, listModules } from "./lib.mjs";

/*
  Карта модуля: пронумерованный список блоков так, как их видит инструмент.
  Нужна, чтобы предлагать разметку по номерам блоков, а не по хэшам.

    node tools/directives/map.mjs m5-3            — весь модуль
    node tools/directives/map.mjs m5-3 40 90      — срез блоков 40…90
*/

const [moduleId, from, to] = process.argv.slice(2);

if (!moduleId) {
  const mods = await listModules();
  console.log("Модули:", mods.map((m) => m.id).join(", "));
  process.exit(0);
}

const { flat } = await loadModule(moduleId);
const a = from ? Number(from) : 0;
const b = to ? Number(to) : flat.length;

let anchor = null;
for (const it of flat.slice(a, b)) {
  if (it.anchor !== anchor) {
    anchor = it.anchor;
    console.log(`\n=== секция ${it.si} · ${anchor ?? "(без якоря)"} ===`);
  }
  console.log(`${String(it.n).padStart(4)} ${it.kind.padEnd(9)} ${it.text}`);
}
console.log(`\nВсего блоков: ${flat.length}`);
