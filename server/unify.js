import { promises as fs } from "node:fs";
import path from "node:path";

// Решения по унификации: какой подход выбран для типа контента. Один JSON-файл
// на томе (как правки/комментарии). Запись атомарная + очередь.

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "unify.json");

let cache = null;
let writeChain = Promise.resolve();

async function ensure() {
  if (cache) return cache;
  let raw;
  try {
    raw = await fs.readFile(FILE, "utf8");
  } catch {
    cache = {};
    return cache;
  }
  try {
    cache = JSON.parse(raw);
  } catch {
    const bad = `${FILE}.corrupt.${Date.now()}`;
    try {
      await fs.rename(FILE, bad);
    } catch {
      /* ignore */
    }
    console.error(`[unify] Битый ${FILE} → ${bad}. Стартую с пустого.`);
    cache = {};
  }
  return cache;
}

async function flush() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(cache, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

function enqueue(mutator) {
  writeChain = writeChain.then(async () => {
    await ensure();
    const result = mutator(cache);
    await flush();
    return result;
  });
  return writeChain;
}

export async function getAll() {
  const c = await ensure();
  return Object.values(c);
}

export function setDecision(type, approach) {
  return enqueue((c) => {
    const rec = {
      type,
      approach: approach ?? null,
      decidedAt: new Date().toISOString(),
    };
    c[type] = rec;
    return rec;
  });
}

export function clearDecision(type) {
  return enqueue((c) => {
    delete c[type];
    return true;
  });
}
