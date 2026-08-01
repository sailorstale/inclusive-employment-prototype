import * as React from "react";
import { moduleLoaders, type SourceBlock } from "@/editor-source/content/source.generated";
import { normalizeSourceBlocks } from "@/editor-source/source/normalizeBlocks";
import { placeDirectives, buildDoc, type Doc } from "@/editor-source/source/contentTree";
import { makeMdResolver } from "@/editor-source/source/blockResolve";
import { decourse } from "./decourse";
import { loadEdits } from "@/editor-source/store";
import { useLogoIndex, useAvatarIndex } from "@/editor-source/source/orgLogo";
import { loadDirectives, type Directive } from "@/editor-source/directives";

/*
  Doc модуля — та же сборка, что в SourcePage, но переиспользуемая: нужна для
  превью страниц сайта (страница = подмножество секций модуля). Блоки чиним
  нормализацией, директивы кладём на документ, текст резолвим по pathname
  модуля (а не по адресу превью — иначе правки не нашлись бы).
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
  Сырые блоки страницы (только её секции) — для панели «Источник» инструмента
  сверки. Без директив и без раскурсовки: это наш дословный источник, каким он
  пришёл. Нормализацию заголовков-ставших-списком применяем (это починка парсинга,
  а не правка контента).
*/
export function usePageBlocks(module: string, sectionAnchors: string[]): SourceBlock[] | null {
  const [blocks, setBlocks] = React.useState<SourceBlock[] | null>(null);
  const key = sectionAnchors.join("|");
  React.useEffect(() => {
    let alive = true;
    setBlocks(null);
    moduleLoaders[module]?.().then((m) => {
      if (!alive) return;
      const wanted = new Set(sectionAnchors);
      const out: SourceBlock[] = [];
      for (const s of toSections(normalizeSourceBlocks(m.blocks)))
        if (s.anchor && wanted.has(s.anchor)) out.push(...s.blocks);
      setBlocks(out);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, key]);
  return blocks;
}

/** Собранный doc модуля (с директивами) — или null, пока грузится. */
export function useModuleDoc(moduleId: string): Doc | null {
  // Правки грузим напрямую (не через контекст редактора): так хук работает и в
  // инструменте, и на самом сайте, где EditorProvider нет. Scope «source» —
  // те же правки «нашей редакции», что и в модулях.
  const [edits, setEdits] = React.useState<Record<string, { text: string; status: string }>>({});
  const [blocks, setBlocks] = React.useState<SourceBlock[] | null>(null);
  const [directives, setDirectives] = React.useState<Directive[]>([]);

  React.useEffect(() => {
    let alive = true;
    loadEdits("source").then((m) => {
      if (alive) setEdits(m);
    });
    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    let alive = true;
    setBlocks(null);
    moduleLoaders[moduleId]?.().then((m) => {
      if (alive) setBlocks(normalizeSourceBlocks(m.blocks));
    });
    return () => {
      alive = false;
    };
  }, [moduleId]);

  React.useEffect(() => {
    let alive = true;
    loadDirectives().then((d) => {
      if (alive) setDirectives(d);
    });
    return () => {
      alive = false;
    };
  }, []);

  const pathname = `/source/${moduleId}`;
  // Раскурсовка (сорт D) поверх правок: текст сайта де-курсуется, каждая замена
  // помечается. Инструмент-источник этот резолвер не использует — он остаётся сырым.
  const resolve = React.useMemo(() => {
    const base = makeMdResolver(edits, pathname);
    return (type: string, text: string, md: string, anchor?: string) =>
      decourse(base(type, text, md, anchor));
  }, [edits, pathname]);
  const sections = React.useMemo(() => (blocks ? toSections(blocks) : []), [blocks]);
  const directiveAt = React.useMemo(
    () => placeDirectives(sections, pathname, moduleId, directives),
    [sections, pathname, moduleId, directives],
  );
  const logoIndex = useLogoIndex();
  const avatarIndex = useAvatarIndex();

  return React.useMemo(
    () => (blocks ? buildDoc(moduleId, sections, resolve, logoIndex, directiveAt, avatarIndex) : null),
    [blocks, moduleId, sections, resolve, logoIndex, directiveAt, avatarIndex],
  );
}
