import * as React from "react";
import { moduleLoaders, type SourceBlock } from "@/editor-source/content/source.generated";
import { normalizeSourceBlocks } from "@/editor-source/source/normalizeBlocks";
import { placeDirectives, buildDoc, type Doc } from "@/editor-source/source/contentTree";
import { makeMdResolver } from "@/editor-source/source/blockResolve";
import { useEditor } from "@/editor-source/EditorProvider";
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

/** Собранный doc модуля (с директивами) — или null, пока грузится. */
export function useModuleDoc(moduleId: string): Doc | null {
  const { edits } = useEditor();
  const [blocks, setBlocks] = React.useState<SourceBlock[] | null>(null);
  const [directives, setDirectives] = React.useState<Directive[]>([]);

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
  const resolve = React.useMemo(() => makeMdResolver(edits, pathname), [edits, pathname]);
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
