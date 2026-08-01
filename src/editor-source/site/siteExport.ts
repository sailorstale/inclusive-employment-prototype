import { moduleLoaders, type SourceBlock } from "@/editor-source/content/source.generated";
import { normalizeSourceBlocks } from "@/editor-source/source/normalizeBlocks";
import {
  placeDirectives,
  buildDoc,
  docToExport,
  type Node,
  type SectionNode,
} from "@/editor-source/source/contentTree";
import { makeMdResolver } from "@/editor-source/source/blockResolve";
import { loadEdits } from "@/editor-source/store";
import { loadLogoIndex, loadAvatarIndex } from "@/editor-source/source/orgLogo";
import { loadDirectives } from "@/editor-source/directives";
import { OSNOVY_PAGES } from "./pageMap";
import { relatedFor } from "./relatedPages";
import { decourse, stripDecourse } from "./decourse";

/*
  ЕДИНЫЙ JSON ВСЕГО РАЗДЕЛА «ОСНОВЫ» — одно ТЗ разработчику на все страницы.

  Собирает КАЖДУЮ страницу тем же конвейером, что и сайт (источник → правки →
  раскурсовка → директивы → компоненты), и добавляет обвязку страницы теми же
  узлами, что рисует оболочка: «вы узнаете» (Page Summary), форма мнения
  (Feedback), «Читайте также» (Read More). На выходе — полная структура каждой
  страницы, как она выглядит на сайте.
*/
type Section = { anchor?: string; blocks: SourceBlock[] };

function toSections(blocks: SourceBlock[]): Section[] {
  const out: Section[] = [];
  let cur: Section = { blocks: [] };
  for (const b of blocks) {
    if (b.kind === "heading" && b.level === 2) {
      if (cur.blocks.length) out.push(cur);
      cur = { anchor: b.anchor, blocks: [b] };
    } else cur.blocks.push(b);
  }
  if (cur.blocks.length) out.push(cur);
  return out;
}

/** Заголовок секции (H2) без меток раскурсовки — для списка «вы узнаете». */
function sectionTitle(sec: SectionNode): string | null {
  const h = sec.children.find(
    (n): n is Extract<Node, { component: "Heading" }> =>
      (n as Node).component === "Heading",
  );
  return h ? stripDecourse(h.text) : null;
}

export type PageExport = {
  slug: string;
  title: string;
  module: string;
  children: unknown[];
};
export type OsnovyExport = {
  section: string;
  source: string;
  pages: PageExport[];
};

/** Построить единый экспорт раздела «Основы» (все страницы M1–M4). */
export async function buildOsnovyExport(): Promise<OsnovyExport> {
  const [edits, directives, logoIndex, avatarIndex] = await Promise.all([
    loadEdits("source"),
    loadDirectives(),
    loadLogoIndex(),
    loadAvatarIndex(),
  ]);

  const pages: PageExport[] = [];
  for (const page of OSNOVY_PAGES) {
    const mod = await moduleLoaders[page.module]();
    const sections = toSections(normalizeSourceBlocks(mod.blocks));
    const pathname = `/source/${page.module}`;
    const base = makeMdResolver(edits, pathname);
    const resolve = (type: string, text: string, md: string, anchor?: string) =>
      decourse(base(type, text, md, anchor));
    const directiveAt = placeDirectives(sections, pathname, page.module, directives);
    const doc = buildDoc(page.module, sections, resolve, logoIndex, directiveAt, avatarIndex);

    // Секции страницы по якорям (тот же выбор, что и на сайте).
    const byAnchor = new Map(
      doc.children
        .filter((n): n is SectionNode => (n as SectionNode).component === "Section Container")
        .map((n) => [n.anchor ?? "", n]),
    );
    const chosen = page.sections
      .map((a) => byAnchor.get(a))
      .filter((s): s is SectionNode => Boolean(s));

    // Обвязка: «вы узнаете» из заголовков (кроме итогов), форма, «Читайте также».
    const topics = chosen
      .filter((s) => s.anchor !== "podvedem-itogi")
      .map(sectionTitle)
      .filter((t): t is string => Boolean(t));

    const summary: Node = {
      component: "Page Summary",
      children: topics.map(
        (t): Node => ({ component: "List Item", size: "L", type: "Dot", text: t }),
      ),
    };
    const feedback: Node = { component: "Feedback" };
    const readMore: Node = {
      component: "Read More",
      title: "Читайте также",
      children: relatedFor(page.slug).map(
        (r): Node => ({
          component: "Read More Item",
          title: r.title,
          description: r.description,
          href: r.href,
        }),
      ),
    };

    const children: (SectionNode | Node)[] = [summary, ...chosen, feedback, readMore];
    const exported = docToExport({ module: page.module, children });
    pages.push({
      slug: page.slug,
      title: page.title,
      module: page.module,
      children: exported.children,
    });
  }

  return { section: "Основы", source: "M1–M4", pages };
}
