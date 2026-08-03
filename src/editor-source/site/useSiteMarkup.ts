import * as React from "react";
import { moduleLoaders, type SourceBlock } from "@/editor-source/content/source.generated";
import { normalizeSourceBlocks } from "@/editor-source/source/normalizeBlocks";
import { blockRefId, toSections } from "@/editor-source/source/blockId";
import { blockSnippet, iconTextOf } from "@/editor-source/source/blockResolve";
import { makeMdResolver } from "@/editor-source/source/blockResolve";
import { iconForText } from "@/editor-source/source/iconForText";
import { loadEdits } from "@/editor-source/store";
import {
  loadDirectives,
  saveDirective,
  deleteDirective,
  setDirectiveStatus,
  patchDirective,
  newId,
  type Directive,
  type DirectiveBlock,
  type DirectivePatch,
} from "@/editor-source/directives";
import type { DirectiveDraft } from "@/editor-source/source/DirectiveCard";

/*
  РАЗМЕТКА ИЗ ПРОСТРАНСТВА САЙТА.

  Панель «Разметка» в режиме «Сайт» — та же, что в «Модулях», и работает с теми
  же директивами. Разница только в том, ЧТО выделяют: там блоки источника, здесь
  компоненты страницы. Адреса блоков компонент несёт в себе (поле at), так что
  на вход панели приходит привычный набор «секция:блок».

  Хук держит всё, что панели нужно: секции модуля, его директивы и действия над
  ними. Сохранение идёт на сервер напрямую — редактор текста (EditorProvider) в
  режиме «Сайт» не поднят, и полагаться на него нельзя.
*/
type Section = { anchor?: string; blocks: SourceBlock[] };

export type SiteMarkup = {
  sections: Section[];
  directives: Directive[];
  err: string | null;
  saveDraft: (draft: DirectiveDraft, selected: Set<string>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setStatus: (id: string, status: Directive["status"]) => Promise<void>;
  patch: (id: string, patch: DirectivePatch, what: string) => Promise<void>;
  update: (id: string, draft: DirectiveDraft) => Promise<void>;
};

export function useSiteMarkup(moduleId: string): SiteMarkup {
  const [blocks, setBlocks] = React.useState<SourceBlock[] | null>(null);
  const [directives, setDirectives] = React.useState<Directive[]>([]);
  const [edits, setEdits] = React.useState<Record<string, { text: string; status: string }>>({});
  const [err, setErr] = React.useState<string | null>(null);

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
    loadDirectives().then((d) => alive && setDirectives(d));
    loadEdits("source").then((m) => alive && setEdits(m));
    return () => {
      alive = false;
    };
  }, []);

  const pathname = `/source/${moduleId}`;
  const sections = React.useMemo(() => (blocks ? toSections(blocks) : []), [blocks]);
  const resolve = React.useMemo(() => makeMdResolver(edits, pathname), [edits, pathname]);

  /* Выделенные адреса → ссылки на блоки, как их хранит директива. */
  const refsOf = React.useCallback(
    (selected: Set<string>, withIcon: boolean): DirectiveBlock[] => {
      const out: DirectiveBlock[] = [];
      sections.forEach((sec, si) =>
        sec.blocks.forEach((b, bi) => {
          if (!selected.has(`${si}:${bi}`)) return;
          const block: DirectiveBlock = {
            id: blockRefId(b, pathname, sec.anchor),
            kind: b.kind,
            snippet: blockSnippet(b, resolve, sec.anchor),
          };
          if (withIcon)
            block.icon = iconForText(iconTextOf(b, sec.anchor, resolve)).name;
          out.push(block);
        }),
      );
      return out;
    },
    [sections, pathname, resolve],
  );

  const saveDraft = React.useCallback(
    async (draft: DirectiveDraft, selected: Set<string>) => {
      const withIcon =
        draft.target === "GeneralCard" && Boolean(draft.modifiers.icon);
      const refs = refsOf(selected, withIcon);
      if (!refs.length) return;
      try {
        const saved = await saveDirective({
          id: newId(),
          module: moduleId,
          blocks: refs,
          target: draft.target,
          targetLabel: draft.targetLabel,
          modifiers: draft.modifiers,
          comment: draft.comment,
        });
        setDirectives((prev) => [...prev.filter((x) => x.id !== saved.id), saved]);
        setErr(null);
      } catch {
        setErr("Не удалось сохранить директиву — сервер недоступен.");
      }
    },
    [moduleId, refsOf],
  );

  const remove = React.useCallback(async (id: string) => {
    try {
      await deleteDirective(id);
      setDirectives((prev) => prev.filter((x) => x.id !== id));
      setErr(null);
    } catch {
      setErr("Не удалось удалить директиву — сервер недоступен.");
    }
  }, []);

  const setStatus = React.useCallback(
    async (id: string, status: Directive["status"]) => {
      try {
        const saved = await setDirectiveStatus(id, status);
        if (saved) setDirectives((prev) => prev.map((x) => (x.id === id ? saved : x)));
        setErr(null);
      } catch {
        setErr("Не удалось сменить статус директивы — сервер недоступен.");
      }
    },
    [],
  );

  const patch = React.useCallback(
    async (id: string, p: DirectivePatch, what: string) => {
      try {
        const saved = await patchDirective(id, p);
        if (saved) setDirectives((prev) => prev.map((x) => (x.id === id ? saved : x)));
        setErr(null);
      } catch {
        setErr(`Не удалось ${what} — сервер недоступен.`);
      }
    },
    [],
  );

  /*
    Правка цели и модификаторов. Блоки директивы остаются свои — их сюда не
    передают, поэтому иконки пересчитываем по уже сохранённым ссылкам: при
    смене цели старые иконки были бы от прошлой разметки.
  */
  const update = React.useCallback(
    async (id: string, draft: DirectiveDraft) => {
      const prev = directives.find((d) => d.id === id);
      if (!prev) return;
      const withIcon =
        draft.target === "GeneralCard" && Boolean(draft.modifiers.icon);
      const byId = new Map<string, { b: SourceBlock; anchor?: string }>();
      sections.forEach((sec) =>
        sec.blocks.forEach((b) =>
          byId.set(blockRefId(b, pathname, sec.anchor), { b, anchor: sec.anchor }),
        ),
      );
      const refs: DirectiveBlock[] = prev.blocks.map((ref) => {
        const found = byId.get(ref.id);
        if (!found) return { ...ref, icon: undefined };
        return {
          ...ref,
          icon: withIcon
            ? iconForText(iconTextOf(found.b, found.anchor, resolve)).name
            : undefined,
        };
      });
      try {
        const saved = await saveDirective({
          id,
          module: prev.module,
          blocks: refs,
          target: draft.target,
          targetLabel: draft.targetLabel,
          modifiers: draft.modifiers,
          comment: draft.comment,
        });
        setDirectives((list) => list.map((x) => (x.id === id ? saved : x)));
        setErr(null);
      } catch {
        setErr("Не удалось сохранить правку директивы — сервер недоступен.");
      }
    },
    [directives, sections, pathname, resolve],
  );

  return { sections, directives, err, saveDraft, remove, setStatus, patch, update };
}
