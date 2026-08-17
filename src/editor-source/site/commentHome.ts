import { buildSiteTrees, type PageTree } from "./siteExport";
import type { Node, SectionNode } from "@/editor-source/source/contentTree";

/*
  НА КАКОЙ СТРАНИЦЕ СЕЙЧАС ЖИВЁТ БЛОК ЗАМЕЧАНИЯ.

  Замечание помнит страницу, на которой его оставили. Но страницы перекраивают:
  «Правовые основы» разрезали на «Льготы сотрудников», «Форматы занятости» и
  «Полезные документы», а «Вопросы и ответы» убрали совсем. Абзацы разъехались
  по соседям, и замечание про них на своей странице не находится никогда — блока
  там больше нет. Хуже того, у исчезнувшей страницы замечаний не видно вообще:
  показывать их некому.

  Поэтому ищем блок по ВСЕМУ САЙТУ и показываем замечание там, где его текст
  лежит сегодня. Данные при этом не трогаем: в записи по-прежнему та страница,
  где замечание оставили, и человек видит эту пометку на карточке.

  Индекс считается один раз за сессию: собрать деревья всех страниц недёшево.
*/

const MARKS = /[\u{E000}-\u{F8FF}]/gu;
const norm = (s: string) =>
  s.replace(MARKS, "").replace(/\s+/g, " ").toLowerCase().trim();

/** Весь текст узла — тот же обход, что у привязки на странице. */
function nodeText(n: unknown): string {
  const o = n as Record<string, unknown>;
  if (!o) return "";
  const parts: string[] = [];
  for (const k of ["text", "title", "question", "author", "role"])
    if (typeof o[k] === "string") parts.push(o[k] as string);
  if (Array.isArray(o.items))
    parts.push((o.items as { text?: string }[]).map((i) => i.text ?? "").join(" "));
  if (Array.isArray(o.children)) parts.push((o.children as unknown[]).map(nodeText).join(" "));
  return parts.join(" ");
}

function collectTexts(nodes: (SectionNode | Node)[]): string[] {
  const out: string[] = [];
  const walk = (list: unknown[]) => {
    for (const n of list) {
      const t = norm(nodeText(n));
      if (t) out.push(t);
      const kids = (n as { children?: unknown[] }).children;
      if (Array.isArray(kids)) walk(kids);
    }
  };
  walk(nodes);
  return out;
}

export type PageRef = { slug: string; title: string };

let indexPromise: Promise<{ page: PageRef; texts: string[] }[]> | null = null;

/** Тексты всех блоков всех страниц. Считается один раз за сессию. */
function siteIndex() {
  indexPromise ??= buildSiteTrees().then((trees: PageTree[]) =>
    trees.map((t) => ({
      page: { slug: t.slug, title: t.title },
      texts: collectTexts(t.nodes),
    })),
  );
  return indexPromise;
}

const MIN_SNIPPET = 12;

/** Есть ли на странице блок с таким текстом. */
function hasText(texts: string[], snap: string): boolean {
  const head = snap.slice(0, 40);
  return texts.some(
    (t) =>
      t.startsWith(snap) ||
      (t.length >= MIN_SNIPPET && snap.startsWith(t)) ||
      (head.length >= 20 && t.includes(head)),
  );
}

export type HomeQuery = { id: string; snapshot?: string | null; page?: string | null };

/**
 * Страница, где сейчас лежит блок каждого замечания.
 *
 * Своя страница в приоритете: если текст всё ещё там, замечание никуда не
 * переезжает. Иначе берём первую страницу, где текст нашёлся. Кого нет в
 * ответе — тот не нашёлся нигде.
 */
export async function findHomes(
  items: HomeQuery[],
): Promise<Record<string, PageRef>> {
  const index = await siteIndex();
  const bySlug = new Map(index.map((p) => [p.page.slug, p]));
  const out: Record<string, PageRef> = {};

  for (const item of items) {
    const snap = norm(item.snapshot || "");
    if (snap.length < MIN_SNIPPET) continue;

    // Сначала своя страница: перекладывать замечание без нужды не хочется.
    const own = item.page ? bySlug.get(item.page) : undefined;
    if (own && hasText(own.texts, snap)) {
      out[item.id] = own.page;
      continue;
    }
    const found = index.find((p) => hasText(p.texts, snap));
    if (found) out[item.id] = found.page;
  }
  return out;
}
