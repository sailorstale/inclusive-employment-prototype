import { promises as fs } from "node:fs";
import { loadModule, snippetOf, parseRange } from "./lib.mjs";
import { loadTree } from "./tree.mjs";

/*
  ПРОГОН ДО ПРИМЕНЕНИЯ. Собирает настоящее дерево раскладки (contentTree) с
  предложенными директивами и печатает результат деревом. Так видно, что
  директива реально соберётся, ДО того как дизайнер её увидит, — метод, который
  в журнале проходов окупался каждый раз.

    node tools/directives/preview.mjs specs/m5-3.json          — только предложения
    node tools/directives/preview.mjs specs/m5-3.json --all    — весь модуль
*/

const [specPath, ...flags] = process.argv.slice(2);
const all = flags.includes("--all");
const spec = JSON.parse(await fs.readFile(specPath, "utf8"));
const { flat, sections } = await loadModule(spec.module);
const { buildDoc } = await loadTree();

/** Спека → директивы (без сохранения): те же поля, что уедут на сервер. */
const directives = spec.proposals.map((p, i) => {
  const items = parseRange(p.blocks).map((n) => flat[n]);
  return {
    id: `preview-${i}`,
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
    status: "applied",
    review: "proposed",
    origin: "claude",
    createdAt: new Date(0).toISOString(),
  };
});

/*
  Размещение как в приложении: непрерывный участок id + занятые позиции.
  Без учёта занятости две директивы на одинаковые блоки («Что делать» дважды
  в модуле) ложились на одно и то же место, и превью врало.
*/
const pathname = `/source/${spec.module}`;
const idsAll = flat.map((it) => it.id);
const busy = new Set();
const byKey = new Map();
for (const d of directives) {
  const want = d.blocks.map((b) => b.id);
  for (let s2 = 0; s2 + want.length <= idsAll.length; s2++) {
    if (!want.every((id, k) => idsAll[s2 + k] === id)) continue;
    if (Array.from({ length: want.length }, (_, k) => s2 + k).some((i) => busy.has(i))) continue;
    for (let k = 0; k < want.length; k++) {
      busy.add(s2 + k);
      byKey.set(`${flat[s2 + k].si}:${flat[s2 + k].bi}`, d);
    }
    break;
  }
}

const doc = buildDoc(
  spec.module,
  sections,
  (_type, _text, md) => md,
  [], // каталог логотипов не нужен: смотрим структуру, а не картинки
  (si, bi) => byKey.get(`${si}:${bi}`),
);

const mineAnchors = new Set(
  directives.flatMap((d) =>
    d.blocks.map((b) => flat.find((f) => f.id === b.id)?.anchor),
  ),
);

const show = (node, depth) => {
  const pad = "  ".repeat(depth);
  const text = node.text ?? node.title ?? node.question ?? "";
  const extra = [node.level, node.marker, node.icon, node.type, node.size].filter(Boolean).join("/");
  console.log(
    `${pad}${node.component}${extra ? " ["+extra+"]" : ""}${text ? " · " + String(text).replace(/\s+/g, " ").slice(0, 100) : ""}`,
  );
  for (const c of node.children ?? []) show(c, depth + 1);
  for (const c of node.items ?? []) {
    show({ component: c.correct ? "Quiz Item ✔ ВЕРНЫЙ" : "Quiz Item", ...c }, depth + 1);
    // Разбор ИМЕННО этого варианта — иначе его в прогоне не видно.
    if (c.feedback)
      console.log(pad + "    разбор варианта · " + c.feedback.replace(/\s+/g, " ").slice(0, 80));
  }
  if (node.explanation) console.log(pad + "  разбор · " + node.explanation.replace(/\s+/g," ").slice(0, 90));
};

for (const sec of doc.children) {
  if (!all && sec.anchor && !mineAnchors.has(sec.anchor)) continue;
  console.log(`\n=== ${sec.anchor ?? "(корень)"} ===`);
  show(sec, 0);
}
