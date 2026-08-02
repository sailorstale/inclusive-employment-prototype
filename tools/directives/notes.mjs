import { loadModule, listModules } from "./lib.mjs";
import { loadTree } from "./tree.mjs";

/*
  Сводка заметок раскладки по всем модулям: «комментарий не разобран», «не попало
  в раскладку», расхождения по числу. Быстрая проверка, что новое правило ничего
  не сломало в уже размеченных модулях.

    node tools/directives/notes.mjs
*/

const API = process.env.API || "http://localhost:8787/api/source/directives";
const all = await fetch(API)
  .then((r) => (r.ok ? r.json() : {}))
  .catch(() => ({}));
const { buildDoc } = await loadTree();

const collect = (nodes, out = []) => {
  for (const n of nodes ?? []) {
    if (n.component === "note") out.push(n.text);
    collect(n.children, out);
  }
  return out;
};

for (const meta of await listModules()) {
  const { flat, sections } = await loadModule(meta.id);
  const mine = Object.values(all).filter(
    (d) => d.module === meta.id && d.blocks.length && d.review !== "rejected",
  );
  const ids = flat.map((it) => it.id);
  const byKey = new Map();
  for (const d of mine) {
    const want = d.blocks.map((b) => b.id);
    for (let s = 0; s + want.length <= ids.length; s++) {
      if (want.every((id, k) => ids[s + k] === id)) {
        for (let k = 0; k < want.length; k++)
          byKey.set(`${flat[s + k].si}:${flat[s + k].bi}`, d);
        break;
      }
    }
  }
  const doc = buildDoc(meta.id, sections, (_t, _x, md) => md, [], (si, bi) =>
    byKey.get(`${si}:${bi}`),
  );
  const notes = collect(doc.children);
  console.log(`${meta.id.padEnd(6)} директив ${String(mine.length).padStart(3)} · заметок ${notes.length}`);
  for (const t of notes) console.log(`        ⚠ ${t.slice(0, 110)}`);
}
