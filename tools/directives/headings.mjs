import { loadModule } from "./lib.mjs";

/*
  Карта заголовков модуля: номер блока, уровень из источника и отступ по уровню.
  Рядом помечено, занят ли блок директивой — на занятый новую не завести, там
  правится существующая. Нужна для аудита иерархии: по ней видно, где ребёнок
  стоит вровень с родителем и где перепрыгнут уровень.

    node tools/directives/headings.mjs m5-1
*/

const API = "http://localhost:8787/api/source/directives";
const all = await fetch(API).then((r) => (r.ok ? r.json() : {})).catch(() => ({}));

const moduleId = process.argv[2];
const { flat } = await loadModule(moduleId);

const mine = Object.values(all).filter(
  (d) => d.module === moduleId && d.blocks.length && d.review !== "rejected",
);
const ids = flat.map((it) => it.id);
const covered = new Map();
const busy = new Set();
for (const d of mine) {
  const want = d.blocks.map((b) => b.id);
  for (let s = 0; s + want.length <= ids.length; s++) {
    if (!want.every((id, k) => ids[s + k] === id)) continue;
    if (Array.from({ length: want.length }, (_, k) => s + k).some((i) => busy.has(i))) continue;
    for (let k = 0; k < want.length; k++) {
      busy.add(s + k);
      covered.set(s + k, `${d.target ?? "-"}${d.modifiers?.level ? "/" + d.modifiers.level : ""}`);
    }
    break;
  }
}

let anchor = null;
for (const it of flat) {
  if (it.anchor !== anchor) {
    anchor = it.anchor;
    console.log(`\n--- секция ${it.si} · ${anchor}`);
  }
  if (it.kind !== "heading") continue;
  const lv = it.block.level;
  const mark = covered.has(it.n) ? `  ⟵ ${covered.get(it.n)}` : "";
  console.log(`${String(it.n).padStart(4)}  h${lv}  ${"  ".repeat(lv)}${it.text.slice(0, 95)}${mark}`);
}
