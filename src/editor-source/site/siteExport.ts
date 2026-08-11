import { moduleLoaders, type SourceBlock } from "@/editor-source/content/source.generated";
import { normalizeSourceBlocks } from "@/editor-source/source/normalizeBlocks";
import {
  placeDirectives,
  buildDoc,
  toExport,
  type Node,
  type SectionNode,
} from "@/editor-source/source/contentTree";
import { makeMdResolver } from "@/editor-source/source/blockResolve";
import { loadEdits } from "@/editor-source/store";
import { loadLogoIndex, loadAvatarIndex } from "@/editor-source/source/orgLogo";
import { loadDirectives } from "@/editor-source/directives";
import { OSNOVY_PAGES, dropStepNumber } from "./pageMap";
import { dropScaffold } from "./dropScaffold";
import { cutFromCards } from "./cutFromCard";
import { applyClientEdits } from "./clientEdits";
import { wrapImportantCards } from "./importantCards";
import { dropCardTitles } from "./cardTitle";
import { decourse } from "./decourse";
import { canonize } from "./canon";
import { pageChildren } from "./pageStructure";
import { pageParts } from "./pageOutline";
import {
  metaFor,
  slugsWithoutDescription,
  type PageMeta,
  type PageMetaOg,
} from "./pageMeta";
import { buildSiteMenu, navLabelFor, type SiteMenu } from "./siteMenu";

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

/*
  СТРАНИЦА В ВЫГРУЗКЕ — структура по предложению разработчика.

  meta и meta-og — то, что о странице узнают браузер, поисковик и мессенджер
  (см. pageMeta.ts). Обложки страницы среди них нет: это видимая картинка в
  шапке, а не мета. h1 стоит рядом отдельным полем по той же причине.
  Содержимое —
  article: раньше поле звалось children, но у узлов внутри тоже есть children,
  и на верхнем уровне это читалось как «дети чего?».
*/
export type PageExport = {
  slug: string;
  /*
    nav — подпись страницы в боковом меню. Стоит рядом с h1 и намеренно от него
    отличается: в меню пункт читается под заголовком своей группы и повторять её
    слова незачем («Поиск» под «Работодателями» вместо «Поиска работодателей»).
    Поле есть у КАЖДОЙ страницы, даже когда совпадает с h1: поле, которого то
    нет, то есть, заставляет каждый раз проверять, не забыли ли мы его.
  */
  nav: string;
  meta: PageMeta;
  "meta-og": PageMetaOg;
  h1: string;
  article: unknown[];
};
/*
  Меню идёт ОТДЕЛЬНЫМ блоком, а не только подписями внутри страниц: заголовки
  групп («Соискатели», «Работодатели») страницами не являются, и в списке
  страниц им места нет. Устройство блока — в siteMenu.ts.
*/
export type OsnovyExport = {
  section: string;
  menu: SiteMenu;
  pages: PageExport[];
};

/*
  ДЕРЕВО СТРАНИЦЫ ДО ВЫГРУЗКИ — те же узлы, что рисует сайт, но ещё со всеми
  служебными полями: якорями секций и адресами блоков источника. Выгрузка их
  срезает (разработчику они не нужны), а карта блоков без якорей не смогла бы
  дать ссылку на нужное место страницы.

  Отсюда растут обе вещи сразу: и JSON разработчику, и карта блоков. Считать
  страницы двумя разными способами нельзя — они бы разъехались.
*/
export type PageTree = { slug: string; title: string; nodes: (SectionNode | Node)[] };

export async function buildSiteTrees(): Promise<PageTree[]> {
  const [edits, markup, logoIndex, avatarIndex] = await Promise.all([
    loadEdits("source"),
    loadDirectives(),
    loadLogoIndex(),
    loadAvatarIndex(),
  ]);
  /*
    Разметку укорачиваем сразу на входе — тем же вызовом, что и сайт (см.
    useModuleDoc и cutFromCard). Считать страницу двумя разными способами нельзя:
    без подрезки выгрузка и карта блоков собирают её по неподрезанной разметке, и
    блок, вынесенный из карточки по замечанию клиента, уезжает разработчику
    по-прежнему внутри неё.
  */
  const directives = cutFromCards(markup);

  const out: PageTree[] = [];
  for (const page of OSNOVY_PAGES) {
    const mod = await moduleLoaders[page.module]();
    const sourceSections = toSections(normalizeSourceBlocks(mod.blocks));
    const pathname = `/source/${page.module}`;
    const base = makeMdResolver(edits, pathname);
    const resolve = (type: string, text: string, md: string, anchor?: string) => {
      const out = decourse(dropStepNumber(type, base(type, text, md, anchor), anchor), page.module);
      // Единые названия повторяющихся блоков — как на сайте (см. canon.ts).
      return type.startsWith("h") ? canonize(out) : out;
    };
    // Тот же порядок, что на сайте: сначала разложить директивы по полному
    // источнику, потом убрать леса курса, потом внести правки по замечаниям.
    const cleaned = dropScaffold(
      sourceSections,
      placeDirectives(sourceSections, pathname, page.module, directives),
    );
    const { sections, directiveAt } = applyClientEdits(
      cleaned.sections,
      cleaned.directiveAt,
    );
    /*
      Карточки по замечаниям — последними, ровно как на сайте. До 11 августа
      2026 этого шага здесь не было, и выгрузка расходилась со страницей: на
      «Этике и коммуникации» читатель видел шесть карточек «Важно», а
      разработчик получал те же блоки простым списком. Заодно карточки
      появляются в карте блоков — она собирается этим же кодом.
    */
    const withCards = dropCardTitles(
      sections,
      pathname,
      wrapImportantCards(sections, pathname, page.module, directiveAt),
    );
    const doc = buildDoc(page.module, sections, resolve, logoIndex, withCards, avatarIndex);

    // Разделы страницы и вступление — тем же кодом, что и на сайте (включая
    // перекройку по карте, см. pageOutline.ts), иначе выгрузка разъедется.
    const { chosen, intro } = pageParts(doc, page);

    // Та же структура, что рисует сайт: обвязка + секции, одним деревом.
    out.push({
      slug: page.slug,
      title: page.title,
      nodes: pageChildren(chosen, page.slug, intro),
    });
  }

  return out;
}

/** Построить единый экспорт всех страниц сайта. */
export async function buildOsnovyExport(): Promise<OsnovyExport> {
  const trees = await buildSiteTrees();
  /*
    Страница без описания уезжает к разработчику с пустой подписью в поиске, и
    заметить это по глазам невозможно: в выгрузке просто стоит "". Так уже
    случилось с «Полезными документами» — страницу добавили, описание забыли.
    Поэтому пропуск говорит о себе сам.
  */
  const noDescription = slugsWithoutDescription(trees.map((t) => t.slug));
  if (noDescription.length)
    console.error("[мета] страницы без описания:", noDescription.join(", "));
  const pages = trees.map((t): PageExport => {
    const seo = metaFor(t.slug, t.title);
    return {
      slug: t.slug,
      nav: navLabelFor(t.slug),
      meta: seo.meta,
      "meta-og": seo.og,
      h1: t.title,
      article: toExport(t.nodes),
    };
  });
  return { section: "Сайт", menu: buildSiteMenu(), pages };
}
