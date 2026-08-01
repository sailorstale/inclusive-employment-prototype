import * as React from "react";
import { PageSummary, ListItem } from "@/figma";
import { sourceModulesMeta, type SourceBlock } from "@/editor-source/content/source.generated";
import { JsonView } from "@/editor-source/source/JsonView";
import { ResultView } from "@/editor-source/source/ResultView";
import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";
import { EditorProvider } from "@/editor-source/EditorProvider";
import { CommentsProvider } from "@/editor-source/CommentsProvider";
import { EditorToast } from "@/editor-source/EditorNotices";
import { EditorDock } from "@/editor-source/EditorDock";
import { SourcePage } from "@/editor-source/source/SourcePage";
import type { OsnovyPage } from "./pageMap";
import { usePageBlocks } from "./useModuleDoc";
import { PageSourceView } from "./PageSourceView";

/*
  ИНСТРУМЕНТ — ДВА РЕЖИМА, тумблер сверху.

  «Модули» — старый редактор источника (три колонки: правки контента в модуле).
  «Сайт» — новый инспектор: справа сама страница (рисуется НАПРЯМУЮ, не в iframe:
  тогда синхрон скролла работает как в модульном редакторе — две колонки-div),
  слева табы Источник · JSON · Гугдок. Клик по компоненту справа подсвечивает
  его блок слева в открытом табе; скролл связан посекционно.

  Оба режима держат одни и те же правки (scope «source») — редактируешь в
  «Модулях», видишь на сайте.
*/
type Mode = "site" | "module";
type RefView = "source" | "json" | "doc";
const TABS: { id: RefView; label: string }[] = [
  { id: "source", label: "Источник" },
  { id: "json", label: "JSON" },
  { id: "doc", label: "Гугдок" },
];

/* Узел дерева по пути «0.2.1» (как в ResultView/JsonView). */
function nodeAtPath(doc: Doc, path: string): Node | SectionNode | null {
  const parts = path.split(".").map(Number);
  let cur: unknown = doc.children[parts[0]];
  for (let i = 1; i < parts.length; i++)
    cur = (cur as { children?: unknown[] })?.children?.[parts[i]];
  return (cur as Node) ?? null;
}

/* Весь текст узла — для сопоставления с блоком источника. */
function nodeText(n: unknown): string {
  const o = n as Record<string, unknown>;
  if (!o) return "";
  const parts: string[] = [];
  for (const k of ["text", "title", "question", "author", "role"])
    if (typeof o[k] === "string") parts.push(o[k] as string);
  if (Array.isArray(o.paragraphs)) parts.push((o.paragraphs as string[]).join(" "));
  if (Array.isArray(o.items))
    parts.push((o.items as { text?: string }[]).map((i) => i.text ?? "").join(" "));
  if (Array.isArray(o.children)) parts.push((o.children as unknown[]).map(nodeText).join(" "));
  return parts.join(" ");
}

const norm = (s: string) =>
  s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_#>`•-]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const blockText = (b: SourceBlock): string =>
  b.kind === "list"
    ? b.items.map((i) => i.md).join(" ")
    : b.kind === "table"
      ? [...b.header, ...b.rows.flat()].join(" ")
      : b.kind === "image"
        ? b.alt || ""
        : b.md;

function matchBlock(blocks: SourceBlock[], comp: string): number | null {
  const c = norm(comp);
  if (c.length < 4) return null;
  let best = -1;
  let bestLen = 0;
  blocks.forEach((b, i) => {
    const t = norm(blockText(b));
    if (t.length < 4) return;
    const overlap =
      c.startsWith(t.slice(0, 30)) || t.startsWith(c.slice(0, 30)) || t.includes(c.slice(0, 40))
        ? Math.min(t.length, c.length)
        : 0;
    if (overlap > bestLen) {
      bestLen = overlap;
      best = i;
    }
  });
  return best >= 0 ? best : null;
}

export function SiteInspector({
  page,
  pageDoc,
  topics,
}: {
  page: OsnovyPage;
  pageDoc: Doc;
  topics: string[];
}) {
  const [mode, setMode] = React.useState<Mode>("site");

  // Инструмент накрывает всю страницу — гасим прокрутку «фона» под ним.
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Тумблер режимов — общий верхний бар. */}
      <div className="flex shrink-0 items-center gap-1 border-b bg-muted/40 px-3 py-1.5">
        <div className="flex items-center gap-0.5 rounded-md border bg-background p-0.5">
          <ModeBtn active={mode === "module"} onClick={() => setMode("module")}>
            Модули
          </ModeBtn>
          <ModeBtn active={mode === "site"} onClick={() => setMode("site")}>
            Сайт
          </ModeBtn>
        </div>
        <span className="ml-2 truncate text-xs text-muted-foreground">
          {mode === "site" ? page.title : "Редактура источника"}
        </span>
      </div>
      <div className="min-h-0 flex-1">
        {mode === "site" ? (
          <SiteMode page={page} pageDoc={pageDoc} topics={topics} />
        ) : (
          <ModuleMode module={page.module} />
        )}
      </div>
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/* Режим «Модули» — старый редактор источника со своими провайдерами (scope
   source): правки контента модуля, три колонки. moduleId — прямым пропом. */
function ModuleMode({ module }: { module: string }) {
  return (
    <EditorProvider scope="source">
      <CommentsProvider scope="source">
        <div className="h-full min-h-0">
          <SourcePage moduleId={module} />
        </div>
        {/* Плавающий док: карандаш включает режим правки (как на /source). */}
        <EditorDock sourceMode />
        <EditorToast />
      </CommentsProvider>
    </EditorProvider>
  );
}

/* Режим «Сайт» — инспектор: слева источник/JSON/гугдок, справа сама страница. */
function SiteMode({
  page,
  pageDoc,
  topics,
}: {
  page: OsnovyPage;
  pageDoc: Doc;
  topics: string[];
}) {
  const [tab, setTab] = React.useState<RefView>("source");
  const [selected, setSelected] = React.useState<string | null>(null);
  const blocks = usePageBlocks(page.module, page.sections);
  const leftRef = React.useRef<HTMLDivElement>(null);
  const rightRef = React.useRef<HTMLDivElement>(null);

  const docId = sourceModulesMeta.find((m) => m.id === page.module)?.docId;

  const srcHighlight = React.useMemo(() => {
    if (!selected || !blocks) return null;
    return matchBlock(blocks, nodeText(nodeAtPath(pageDoc, selected)));
  }, [selected, blocks, pageDoc]);

  // Подвести левую панель к подсветке (узел JSON или блок источника).
  React.useEffect(() => {
    const pane = leftRef.current;
    if (!pane) return;
    const el =
      tab === "json"
        ? selected && pane.querySelector(`[data-json-path="${selected}"]`)
        : srcHighlight != null && pane.querySelector('[data-hl="1"]');
    if (!el) return;
    requestAnimationFrame(() => {
      const er = el.getBoundingClientRect();
      const pr = pane.getBoundingClientRect();
      pane.scrollTop += er.top - pr.top - pr.height / 2 + er.height / 2;
    });
  }, [selected, srcHighlight, tab]);

  /*
    Связанный скролл двух колонок. Для «Источника» — посекционно (у заголовков
    слева и секций справа общий якорь), как в редакторе. Для JSON/гугдока —
    пропорционально. Мягкая блокировка 120 мс гасит эхо.
  */
  React.useEffect(() => {
    const l = leftRef.current;
    const r = rightRef.current;
    if (!l || !r) return;
    let until = 0;
    const held = () => Date.now() < until;
    const hold = () => (until = Date.now() + 120);

    const topId = (box: HTMLElement, sel: string): string | null => {
      const bTop = box.getBoundingClientRect().top;
      let best: Element | null = null;
      let bestD = -Infinity;
      box.querySelectorAll(sel).forEach((el) => {
        const d = el.getBoundingClientRect().top - bTop;
        if (d <= 8 && d > bestD) {
          bestD = d;
          best = el;
        }
      });
      return (best as Element | null)?.id || null;
    };
    const scrollToId = (box: HTMLElement, id: string) => {
      const el = box.querySelector(`[id="${CSS.escape(id)}"]`);
      if (el) box.scrollTop += el.getBoundingClientRect().top - box.getBoundingClientRect().top - 8;
    };
    const prop = (from: HTMLElement, to: HTMLElement) => {
      const max = from.scrollHeight - from.clientHeight || 1;
      to.scrollTop = (from.scrollTop / max) * (to.scrollHeight - to.clientHeight);
    };

    const onL = () => {
      if (held()) return;
      hold();
      if (tab === "source") {
        const id = topId(l, "h2[id]");
        if (id) scrollToId(r, id);
      } else prop(l, r);
    };
    const onR = () => {
      if (held()) return;
      hold();
      if (tab === "source") {
        const id = topId(r, "section[id]");
        if (id) scrollToId(l, id);
      } else prop(r, l);
    };
    l.addEventListener("scroll", onL, { passive: true });
    r.addEventListener("scroll", onR, { passive: true });
    return () => {
      l.removeEventListener("scroll", onL);
      r.removeEventListener("scroll", onR);
    };
  }, [tab, pageDoc, blocks]);

  return (
    <div className="grid h-full min-h-0 grid-cols-[minmax(0,48rem)_1fr] divide-x">
      {/* ЛЕВО — колонка сверки с табами */}
      <section className="flex min-h-0 flex-col">
        <div className="flex items-center gap-1 border-b bg-muted/40 px-3 py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-accent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div ref={leftRef} className="min-h-0 flex-1 overflow-y-auto">
          {tab === "json" ? (
            <div className="px-5 py-4">
              <JsonView doc={pageDoc} selected={selected} onSelect={setSelected} />
            </div>
          ) : tab === "doc" ? (
            docId ? (
              <iframe
                title="Гугдок"
                src={`https://docs.google.com/document/d/${docId}/preview`}
                className="h-full w-full border-0"
              />
            ) : (
              <div className="p-6 text-sm text-muted-foreground">У модуля нет docId.</div>
            )
          ) : blocks ? (
            <PageSourceView blocks={blocks} highlight={srcHighlight} />
          ) : (
            <div className="p-6 text-sm text-muted-foreground">Загрузка…</div>
          )}
        </div>
      </section>

      {/* ПРАВО — сам сайт (рисуется напрямую) */}
      <section className="min-h-0">
        <div ref={rightRef} className="h-full overflow-y-auto">
          <div className="figma-scope mx-auto max-w-[var(--column-width)] px-6">
            <h1 className="ds-h1 pt-8 text-[color:var(--text-primary)]">{page.title}</h1>
            {topics.length > 0 && (
              <PageSummary>
                {topics.map((t, i) => (
                  <ListItem key={i}>{t}</ListItem>
                ))}
              </PageSummary>
            )}
          </div>
          <ResultView doc={pageDoc} pick={{ selected, onSelect: setSelected }} />
        </div>
      </section>
    </div>
  );
}
