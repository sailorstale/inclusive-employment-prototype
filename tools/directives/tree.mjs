import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { build } from 'esbuild';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Сборка настоящего contentTree для запуска вне браузера — общая для preview и notes.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const SRC = path.join(ROOT, 'src');

export async function loadTree() {
  const entry = `
    export { buildDoc } from "@/editor-source/source/contentTree";
  `;
  const out = path.join(
    await fs.mkdtemp(path.join(os.tmpdir(), "directives-tree-")),
    "tree.mjs",
  );
  await build({
    stdin: { contents: entry, resolveDir: ROOT, loader: "ts" },
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: out,
    logLevel: "silent",
    alias: { "@": SRC },
    // Стили и картинки дереву не нужны — оно про данные.
    loader: { ".css": "empty", ".svg": "empty" },
  });
  return import(pathToFileURL(out).href);
}
