import { loadModule } from "./lib.mjs";
import { loadTree } from "./tree.mjs";

/*
  ПРОГОН ДО ПРИМЕНЕНИЯ для директив, которые уже лежат на сервере со статусом
  «новая». Считает раскладку так, как будто их применили, и печатает секции, где
  они стоят. Метод прохода 15: сначала посмотреть результат, потом менять статус.

    node tools/directives/simulate.mjs m6-1
*/

const API = process.env.API || "http://localhost:8787/api/source/directives";
const moduleId = process.argv[2];
if (!moduleId) {
  console.error("Укажите модуль: node tools/directives/simulate.mjs m6-1");
  process.exit(1);
}

const all = await fetch(API).then((r) => r.json());
const { flat, sections } = await loadModule(moduleId);
const { buildDoc } = await loadTree();

// «Новую» директиву на время прогона считаем применённой — остальные как есть.
const wasNew = new Set(
  Object.values(all)
    .filter((d) => d.status === "new")
    .map((d) => d.id),
);
const mine = Object.values(all)
  .filter((d) => d.module === moduleId && d.blocks.length && d.review !== "rejected")
  .map((d) => (d.status === "new" ? { ...d, status: "applied" } : d));

const ids = flat.map((it) => it.id);
const byKey = new Map();
const fresh = new Set();
for (const d of mine) {
  const want = d.blocks.map((b) => b.id);
  let placed = false;
  for (let s = 0; s + want.length <= ids.length; s++) {
    if (want.every((id, k) => ids[s + k] === id)) {
      for (let k = 0; k < want.length; k++) byKey.set(`${flat[s + k].si}:${flat[s + k].bi}`, d);
      if (wasNew.has(d.id)) fresh.add(flat[s].si);
      placed = true;
      break;
    }
  }
  if (!placed) console.log(`⚠ не нашла место: ${d.targetLabel ?? "без цели"} · ${d.blocks[0].snippet.slice(0, 60)}`);
}

const doc = buildDoc(moduleId, sections, (_t, _x, md) => md, [], (si, bi) =>
  byKey.get(`${si}:${bi}`),
);

const show = (node, depth) => {
  const pad = "  ".repeat(depth);
  const text = node.text ?? node.title ?? node.question ?? "";
  const extra = [node.level, node.size, node.marker].filter(Boolean).join("/");
  console.log(
    `${pad}${node.component}${extra ? " [" + extra + "]" : ""}${
      text ? " · " + String(text).replace(/\s+/g, " ").slice(0, 90) : ""
    }`,
  );
  for (const c of node.children ?? []) show(c, depth + 1);
};

doc.children.forEach((sec, i) => {
  if (!fresh.has(i)) return;
  console.log(`\n=== секция ${i} · ${sec.anchor ?? "(без якоря)"} ===`);
  show(sec, 0);
});
