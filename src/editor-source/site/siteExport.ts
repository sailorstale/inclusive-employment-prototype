import { moduleLoaders, type SourceBlock } from "@/editor-source/content/source.generated";
import { normalizeSourceBlocks } from "@/editor-source/source/normalizeBlocks";
import {
  placeDirectives,
  buildDoc,
  toExport,
} from "@/editor-source/source/contentTree";
import { makeMdResolver } from "@/editor-source/source/blockResolve";
import { loadEdits } from "@/editor-source/store";
import { loadLogoIndex, loadAvatarIndex } from "@/editor-source/source/orgLogo";
import { loadDirectives } from "@/editor-source/directives";
import { OSNOVY_PAGES, dropStepNumber } from "./pageMap";
import { dropScaffold } from "./dropScaffold";
import { decourse } from "./decourse";
import { pageChildren } from "./pageStructure";
import { pageParts } from "./pageOutline";
import { coverFor, type Cover } from "./covers";

/*
  ЕДИНЫЙ JSON ВСЕГО САЙТА — одно ТЗ разработчику на все страницы сразу:
  «Основы» и оба трека, «Для компаний» и «Для НКО».

  Каждая страница собирается тем же конвейером и деревом (pageChildren), что и
  сайт: «вы узнаете» + секции + форма мнения + «Читайте также». В выгрузке — slug
  и h1 (заголовок страницы) и её узлы. Никакого «module»: это сайт, а не курс —
  термин остаётся в редакторе.
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

export type PageExport = {
  slug: string;
  header: { h1: string; cover: Cover };
  children: unknown[];
};
export type OsnovyExport = { section: string; pages: PageExport[] };

/** Построить единый экспорт всех страниц сайта. */
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
    const sourceSections = toSections(normalizeSourceBlocks(mod.blocks));
    const pathname = `/source/${page.module}`;
    const base = makeMdResolver(edits, pathname);
    const resolve = (type: string, text: string, md: string, anchor?: string) =>
      decourse(dropStepNumber(type, base(type, text, md, anchor), anchor), page.module);
    // Тот же порядок, что на сайте: сначала разложить директивы по полному
    // источнику, потом убрать леса курса.
    const { sections, directiveAt } = dropScaffold(
      sourceSections,
      placeDirectives(sourceSections, pathname, page.module, directives),
    );
    const doc = buildDoc(page.module, sections, resolve, logoIndex, directiveAt, avatarIndex);

    // Разделы страницы и вступление — тем же кодом, что и на сайте (включая
    // перекройку по карте, см. pageOutline.ts), иначе выгрузка разъедется.
    const { chosen, intro } = pageParts(doc, page);

    // Та же структура, что рисует сайт: обвязка + секции, одним деревом.
    const children = toExport(pageChildren(chosen, page.slug, intro));
    pages.push({
      slug: page.slug,
      header: { h1: page.title, cover: coverFor(page.slug) },
      children,
    });
  }

  return { section: "Сайт", pages };
}
