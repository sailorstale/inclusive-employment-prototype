import * as React from "react";
import { moduleLoaders, type SourceBlock } from "@/editor-source/content/source.generated";
import { normalizeSourceBlocks } from "@/editor-source/source/normalizeBlocks";
import { placeDirectives, buildDoc, type Doc } from "@/editor-source/source/contentTree";
import { makeMdResolver } from "@/editor-source/source/blockResolve";
import { decourse } from "./decourse";
import { canonize } from "./canon";
import { dropStepNumber } from "./pageMap";
import { dropScaffold } from "./dropScaffold";
import { applyClientEdits } from "./clientEdits";
import { wrapImportantCards } from "./importantCards";
import { dropCardTitles } from "./cardTitle";
import { cutFromCards } from "./cutFromCard";
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
    // Директивы укорачиваем сразу на входе: дальше по конвейеру их адреса уже
    // считаются, и подрезать было бы поздно (см. cutFromCard).
    loadDirectives().then((d) => {
      if (alive) setDirectives(cutFromCards(d));
    });
    return () => {
      alive = false;
    };
  }, []);

  const pathname = `/source/${moduleId}`;
  // Раскурсовка (сорт D) поверх правок: текст сайта де-курсуется, каждая замена
  // помечается. Инструмент-источник этот резолвер не использует — он остаётся сырым.
  // Единые названия повторяющихся блоков (canon) — только для заголовков.
  const resolve = React.useMemo(() => {
    const base = makeMdResolver(edits, pathname);
    return (type: string, text: string, md: string, anchor?: string) => {
      const out = decourse(dropStepNumber(type, base(type, text, md, anchor), anchor), moduleId);
      return type.startsWith("h") ? canonize(out) : out;
    };
  }, [edits, pathname, moduleId]);
  const sourceSections = React.useMemo(() => (blocks ? toSections(blocks) : []), [blocks]);
  // Директивы кладём на ПОЛНЫЙ источник, и только потом убираем леса курса:
  // порядок важен, иначе директивы теряют свои блоки (см. dropScaffold).
  // Правки по замечаниям клиента идут последними — они опираются на текст
  // соседнего блока, а он к этому моменту уже окончательный (см. clientEdits).
  const { sections, directiveAt } = React.useMemo(() => {
    const cleaned = dropScaffold(
      sourceSections,
      placeDirectives(sourceSections, pathname, moduleId, directives),
    );
    const edited = applyClientEdits(cleaned.sections, cleaned.directiveAt);
    // Карточки «Важно» — последними: они не трогают блоки, только говорят
    // раскладке, какие из них собрать вместе (см. importantCards). Снятие
    // названия идёт следом за ними: тогда оно достаёт и до карточек, собранных
    // здесь же, а не только до пометок дизайнера (см. cardTitle).
    return {
      sections: edited.sections,
      directiveAt: dropCardTitles(
        edited.sections,
        pathname,
        wrapImportantCards(
          edited.sections,
          pathname,
          moduleId,
          edited.directiveAt,
        ),
      ),
    };
  }, [sourceSections, pathname, moduleId, directives]);
  const logoIndex = useLogoIndex();
  const avatarIndex = useAvatarIndex();

  return React.useMemo(
    () => (blocks ? buildDoc(moduleId, sections, resolve, logoIndex, directiveAt, avatarIndex) : null),
    [blocks, moduleId, sections, resolve, logoIndex, directiveAt, avatarIndex],
  );
}
