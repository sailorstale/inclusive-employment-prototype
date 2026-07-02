import { promises as fs } from "node:fs";
import path from "node:path";

// Хранилище комментариев-пинов (Figma-стиль). Отдельный JSON-файл рядом с
// правками. Та же модель: общий, без авторизации, атомарная запись через очередь.

const DATA_DIR = process.env.DATA_DIR || path.resolve(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "comments.json");

let cache = null;
let writeChain = Promise.resolve();
let counter = 0;

async function ensure() {
  if (cache) return cache;
  let raw;
  try {
    raw = await fs.readFile(FILE, "utf8");
  } catch {
    cache = {}; // файла нет — норма
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
    console.error(`[comments] Битый ${FILE} → сохранён как ${bad}. Стартую с пустого.`);
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

export function create(data) {
  return enqueue((c) => {
    const now = new Date().toISOString();
    const id = `c_${Date.now().toString(36)}_${(counter++).toString(36)}`;
    const rec = {
      id,
      page: data.page ?? null,
      anchorText: data.anchorText ?? null,
      dx: Number(data.dx) || 0,
      dy: Number(data.dy) || 0,
      text: String(data.text || ""),
      author: data.author ?? null,
      resolved: false,
      createdAt: now,
      resolvedAt: null,
    };
    c[id] = rec;
    return rec;
  });
}

export function update(id, patch) {
  return enqueue((c) => {
    const rec = c[id];
    if (!rec) return null;
    if (typeof patch.text === "string") rec.text = patch.text;
    if (typeof patch.resolved === "boolean") {
      rec.resolved = patch.resolved;
      rec.resolvedAt = patch.resolved ? new Date().toISOString() : null;
    }
    return rec;
  });
}

export function remove(id) {
  return enqueue((c) => {
    delete c[id];
    return true;
  });
}
