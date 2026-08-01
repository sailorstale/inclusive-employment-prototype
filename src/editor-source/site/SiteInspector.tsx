import * as React from "react";
import { sourceModulesMeta, type SourceBlock } from "@/editor-source/content/source.generated";
import { JsonView } from "@/editor-source/source/JsonView";
import { ResultView } from "@/editor-source/source/ResultView";
import { useScrollSync } from "@/editor-source/source/scrollSync";
import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";
import { EditorProvider } from "@/editor-source/EditorProvider";
import { CommentsProvider, useComments } from "@/editor-source/CommentsProvider";
import { EditorToast } from "@/editor-source/EditorNotices";
import { EditorDock } from "@/editor-source/EditorDock";
import { SourcePage } from "@/editor-source/source/SourcePage";
import { AppHeader } from "@/components/shell/AppHeader";
import { SidebarNav } from "@/components/shell/SidebarNav";
import { cn } from "@/lib/utils";
import type { TocEntry } from "./pageStructure";
import type { OsnovyPage } from "./pageMap";
import { usePageBlocks } from "./useModuleDoc";
import { PageSourceView } from "./PageSourceView";
import { buildOsnovyExport } from "./siteExport";
import { coverFor } from "./covers";
import { downloadJson } from "@/editor-source/source/JsonView";

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

/*
  Выбор режима и таба живёт на уровне модуля, а не в state компонента: при
  переходе между страницами разных модулей страница на миг уходит в «Загрузка…»,
  инструмент перемонтируется — и без этого таб сбрасывался бы на «Источник».
  Так режим просмотра (например JSON) сохраняется при навигации.
*/
let lastMode: Mode = "site";
let lastTab: RefView = "source";

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
  tocItems,
}: {
  page: OsnovyPage;
  pageDoc: Doc;
  tocItems: TocEntry[];
}) {
  const [mode, setMode] = React.useState<Mode>(lastMode);
  const [exporting, setExporting] = React.useState(false);

  // Запоминаем выбранный режим, чтобы он пережил переход между страницами.
  React.useEffect(() => {
    lastMode = mode;
  }, [mode]);

  // Инструмент накрывает всю страницу — гасим прокрутку «фона» под ним.
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Единый JSON всего раздела «Основы» — одно ТЗ разработчику на все страницы.
  const exportAll = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      downloadJson("osnovy.json", await buildOsnovyExport());
    } finally {
      setExporting(false);
    }
  };

  return (
    <CommentsProvider scope="review">
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
        {/* Экспорт всего раздела одним файлом — для передачи разработчику. */}
        <button
          type="button"
          onClick={exportAll}
          disabled={exporting}
          className="ml-auto rounded-md border bg-background px-3 py-1 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground disabled:opacity-60"
        >
          {exporting ? "Собираю…" : "Скачать JSON раздела"}
        </button>
      </div>
      <div className="min-h-0 flex-1">
        {mode === "site" ? (
          <SiteMode page={page} pageDoc={pageDoc} tocItems={tocItems} />
        ) : (
          <ModuleMode module={page.module} />
        )}
      </div>
      </div>
    </CommentsProvider>
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
   source): правки контента модуля, три колонки. Сверху — разделение на модули
   табами (как в исходном инструменте); стартует с модуля текущей страницы,
   переключение локальное (не уводит из инструмента). */
function ModuleMode({ module }: { module: string }) {
  const [moduleId, setModuleId] = React.useState(module);
  return (
    <EditorProvider scope="source">
      <CommentsProvider scope="source">
        <div className="flex h-full min-h-0 flex-col">
          {/* Разделение на модули */}
          <nav
            aria-label="Модули"
            className="flex shrink-0 items-center gap-1 overflow-x-auto border-b bg-muted/40 px-3 py-1.5"
          >
            <span className="mr-1 shrink-0 text-xs text-muted-foreground">Модуль</span>
            {sourceModulesMeta.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setModuleId(m.id)}
                title={m.title ? `Модуль ${m.label}. ${m.title}` : `Модуль ${m.label}`}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
                  moduleId === m.id
                    ? "bg-[hsl(var(--brand)/0.12)] text-brand"
                    : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {m.label}
              </button>
            ))}
          </nav>
          <div className="min-h-0 flex-1">
            <SourcePage moduleId={moduleId} />
          </div>
        </div>
        {/* Плавающий док: карандаш включает режим правки (как на /source). */}
        <EditorDock sourceMode />
        <EditorToast />
      </CommentsProvider>
    </EditorProvider>
  );
}

/* Правое меню сайта — оглавление «На этой странице». Клик прокручивает правую
   панель к секции (обычный in-page скролл в контейнере, без внешнего роутинга). */
function SiteRail({
  items,
  pane,
}: {
  items: TocEntry[];
  pane: HTMLDivElement | null;
}) {
  // Группируем: каждая H2-секция и её H3-подзаголовки.
  const groups = React.useMemo(() => {
    const g: { h2: TocEntry; h3s: TocEntry[] }[] = [];
    for (const it of items) {
      if (it.level === 2) g.push({ h2: it, h3s: [] });
      else if (g.length) g[g.length - 1].h3s.push(it);
    }
    return g;
  }, [items]);

  // Scrollspy: активный пункт (H2 или H3, для подсветки) и активная СЕКЦИЯ (H2,
  // под которой раскрываем H3). Оба — последний заголовок, чьё начало прошло верх.
  const [active, setActive] = React.useState<string | null>(null);
  const [section, setSection] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!pane) return;
    const spy = () => {
      const top = pane.getBoundingClientRect().top;
      let cur: string | null = null;
      let sec: string | null = null;
      for (const it of items) {
        const el = pane.querySelector(`[id="${CSS.escape(it.anchor)}"]`);
        if (el && el.getBoundingClientRect().top - top <= 96) {
          cur = it.anchor;
          if (it.level === 2) sec = it.anchor;
        }
      }
      setActive(cur);
      setSection(sec);
    };
    spy();
    pane.addEventListener("scroll", spy, { passive: true });
    return () => pane.removeEventListener("scroll", spy);
  }, [pane, items]);

  if (groups.length < 2) return null;
  const go = (anchor: string) => {
    if (!pane) return;
    const el = pane.querySelector(`[id="${CSS.escape(anchor)}"]`);
    if (el)
      pane.scrollTop +=
        el.getBoundingClientRect().top - pane.getBoundingClientRect().top - 12;
  };
  const itemCls = (anchor: string, level: 2 | 3, inSection = false) =>
    cn(
      "-ml-px block border-l py-0.5 text-left leading-snug transition-colors",
      level === 3 ? "pl-6" : "pl-3",
      active === anchor
        ? "border-foreground font-medium text-foreground"
        : inSection
          ? "border-transparent text-foreground hover:border-foreground"
          : "border-transparent text-muted-foreground hover:border-foreground hover:text-foreground",
    );
  return (
    <nav aria-label="На этой странице" className="text-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        На этой странице
      </div>
      <ul className="space-y-1 border-l">
        {groups.map((g) => (
          <React.Fragment key={g.h2.anchor}>
            <li>
              <button
                type="button"
                onClick={() => go(g.h2.anchor)}
                className={itemCls(g.h2.anchor, 2, section === g.h2.anchor)}
              >
                {g.h2.label}
              </button>
            </li>
            {/* H3-подпункты — только у текущей секции (не все сразу). */}
            {section === g.h2.anchor &&
              g.h3s.map((h3) => (
                <li key={h3.anchor}>
                  <button
                    type="button"
                    onClick={() => go(h3.anchor)}
                    className={itemCls(h3.anchor, 3)}
                  >
                    {h3.label}
                  </button>
                </li>
              ))}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
}

/* Режим «Сайт» — инспектор: слева источник/JSON/гугдок, справа сама страница. */
function SiteMode({
  page,
  pageDoc,
  tocItems,
}: {
  page: OsnovyPage;
  pageDoc: Doc;
  tocItems: TocEntry[];
}) {
  const [tab, setTab] = React.useState<RefView>(lastTab);
  const [selected, setSelected] = React.useState<string | null>(null);
  const blocks = usePageBlocks(page.module, page.sections);

  // Запоминаем открытый таб, чтобы он пережил переход между страницами.
  React.useEffect(() => {
    lastTab = tab;
  }, [tab]);
  // Контейнеры прокрутки держим СОСТОЯНИЕМ (не ref): левая панель пересоздаётся
  // при смене таба, и синхрон должен переподключиться на новый узел сам.
  const [leftBox, setLeftBox] = React.useState<HTMLDivElement | null>(null);
  const [rightBox, setRightBox] = React.useState<HTMLDivElement | null>(null);
  // Пауза синхрона на время точной наводки на выбранный блок.
  const paused = React.useRef(false);

  const docId = sourceModulesMeta.find((m) => m.id === page.module)?.docId;
  const cover = coverFor(page.slug);

  // Комментарии клиента/разработчика (отдельный поток «review»). Множество путей
  // компонентов с открытым комментарием — для маркера на самих компонентах.
  const { comments } = useComments();
  const commented = React.useMemo(
    () =>
      new Set(
        comments
          .filter((c) => c.page === page.slug && c.text && !c.resolved)
          .map((c) => c.id.slice(c.id.indexOf("::") + 2)),
      ),
    [comments, page.slug],
  );

  const srcHighlight = React.useMemo(() => {
    if (!selected || !blocks) return null;
    return matchBlock(blocks, nodeText(nodeAtPath(pageDoc, selected)));
  }, [selected, blocks, pageDoc]);

  // Подвести левую панель к подсветке (узел JSON или блок источника). На время
  // наводки синхрон паузим — иначе он сбил бы точную прокрутку.
  React.useEffect(() => {
    const pane = leftBox;
    if (!pane) return;
    const el =
      tab === "json"
        ? selected && pane.querySelector(`[data-json-path="${selected}"]`)
        : srcHighlight != null && pane.querySelector('[data-hl="1"]');
    if (!el) return;
    paused.current = true;
    requestAnimationFrame(() => {
      const er = el.getBoundingClientRect();
      const pr = pane.getBoundingClientRect();
      pane.scrollTop += er.top - pr.top - pr.height / 2 + er.height / 2;
    });
    // Снятие паузы — обычным таймером, НЕ внутри rAF: если rAF отложен (вкладка
    // свёрнута), пауза иначе залипла бы навсегда и синхрон бы умер.
    const t = window.setTimeout(() => (paused.current = false), 200);
    return () => window.clearTimeout(t);
  }, [selected, srcHighlight, tab, leftBox]);

  /*
    Связанный скролл — посекционно (секция + доля прокрутки ВНУТРИ неё), тот же
    механизм, что в модульном редакторе: колонки едут непрерывно, а не скачут к
    заголовкам. Слева начала секций помечены data-sec, справа их находят по
    Section Container. Работает для всех табов (источник/JSON — свои data-sec).
  */
  useScrollSync(leftBox, rightBox, paused);

  return (
    <div className="grid h-full min-h-0 grid-cols-[minmax(0,40rem)_minmax(0,1fr)] divide-x">
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
        <div ref={setLeftBox} className="min-h-0 flex-1 overflow-y-auto">
          {tab === "json" ? (
            <div className="px-5 py-4">
              <JsonView
                doc={pageDoc}
                selected={selected}
                onSelect={setSelected}
                heading={{
                  slug: page.slug,
                  header: { h1: page.title, cover: coverFor(page.slug) },
                }}
              />
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

      {/* ПРАВО — сам сайт, полная раскладка: шапка + меню разделов слева +
          контент + оглавление «На этой странице» справа (рисуется напрямую, не
          в iframe — чтобы синхрон и клик работали). Меню и шапка липкие. */}
      <section className="min-h-0">
        <div ref={setRightBox} className="h-full overflow-y-auto">
          <AppHeader />
          <div className="mx-auto grid max-w-7xl grid-cols-[15rem_minmax(0,1fr)_13rem] gap-x-8 px-6 py-8">
            {/* Левое меню — навигация по разделам сайта */}
            <aside className="min-w-0">
              <div className="sticky top-20">
                <SidebarNav />
              </div>
            </aside>

            {/* Контент страницы. h1 — заголовок страницы (не узел дерева: в
                данных он едет полем h1). Всё остальное — одним деревом через
                ResultView: «вы узнаете» + секции + форма мнения + «Читайте
                также». */}
            <div className="min-w-0">
              <div className="figma-scope mx-auto max-w-[var(--column-width)] px-6 pt-8">
                {cover.src && (
                  <img
                    src={cover.src}
                    alt={cover.alt}
                    className="mb-6 h-auto w-full rounded-[var(--radius-l)] object-cover"
                  />
                )}
                <h1 className="ds-h1 text-[color:var(--text-primary)]">{page.title}</h1>
              </div>
              <ResultView
                doc={pageDoc}
                pick={{ selected, onSelect: setSelected, commented }}
              />
            </div>

            {/* Правое меню — оглавление страницы */}
            <aside className="min-w-0">
              <div className="sticky top-20">
                <SiteRail items={tocItems} pane={rightBox} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Комментарии клиента/разработчика: выбери компонент справа → напиши. */}
      <ReviewPanel
        slug={page.slug}
        selected={selected}
        onSelect={setSelected}
        pageDoc={pageDoc}
        pane={rightBox}
      />
    </div>
  );
}

/* Панель комментариев клиента/разработчика (поток «review»). Выбран компонент —
   редактор комментария к нему; иначе — список всех комментариев страницы для
   обработки (клик по пункту наводит на компонент). */
function ReviewPanel({
  slug,
  selected,
  onSelect,
  pageDoc,
  pane,
}: {
  slug: string;
  selected: string | null;
  onSelect: (path: string | null) => void;
  pageDoc: Doc;
  pane: HTMLDivElement | null;
}) {
  const { comments, commentOf, setComment } = useComments();
  const [draft, setDraft] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const commentId = selected ? `${slug}::${selected}` : null;
  const existing = commentId ? commentOf(commentId) : undefined;
  React.useEffect(() => {
    setDraft(existing?.text ?? "");
    if (selected) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentId]);

  const pageComments = comments.filter((c) => c.page === slug && c.text);
  const snippet = (s?: string | null) => (s ? s.replace(/\s+/g, " ").trim().slice(0, 60) : "");
  const scrollTo = (path: string) => {
    onSelect(path);
    if (!pane) return;
    const el = pane.querySelector(`[data-json-path="${CSS.escape(path)}"]`);
    if (el)
      pane.scrollTop +=
        el.getBoundingClientRect().top - pane.getBoundingClientRect().top - 80;
  };

  const save = () => {
    if (!commentId || !selected) return;
    setComment(
      {
        id: commentId,
        page: slug,
        blockType: (nodeAtPath(pageDoc, selected) as Node | null)?.component ?? null,
        original: snippet(nodeText(nodeAtPath(pageDoc, selected))),
      },
      draft,
    );
  };

  // Свёрнуто — только кнопка со счётчиком.
  if (!open && !selected) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-md hover:bg-accent"
      >
        Комментарии
        <span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
          {pageComments.length}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex max-h-[70vh] w-80 flex-col rounded-lg border bg-card shadow-xl">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-semibold">
          Комментарии{pageComments.length ? ` · ${pageComments.length}` : ""}
        </span>
        <button
          type="button"
          onClick={() => {
            onSelect(null);
            setOpen(false);
          }}
          className="rounded px-1.5 text-muted-foreground hover:text-foreground"
          aria-label="Закрыть"
        >
          ✕
        </button>
      </div>

      {selected ? (
        <div className="flex flex-col gap-2 p-3">
          <div className="rounded bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
            {snippet(nodeText(nodeAtPath(pageDoc, selected))) || "выбранный компонент"}
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Что не так с этим компонентом?"
            className="h-24 w-full resize-none rounded border bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={save}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
              disabled={draft.trim() === (existing?.text ?? "")}
            >
              Сохранить
            </button>
            {existing && (
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  setComment(
                    { id: commentId as string, page: slug },
                    "",
                  );
                }}
                className="rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Удалить
              </button>
            )}
          </div>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 overflow-y-auto p-2 text-sm">
          {pageComments.length === 0 ? (
            <li className="px-2 py-4 text-center text-muted-foreground">
              Пока нет комментариев. Выбери компонент справа и напиши.
            </li>
          ) : (
            pageComments.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(c.id.slice(c.id.indexOf("::") + 2))}
                  className="block w-full rounded px-2 py-1.5 text-left hover:bg-accent"
                >
                  <span className="block truncate text-foreground">{c.text}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {snippet(c.original)}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
