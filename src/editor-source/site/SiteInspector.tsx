import * as React from "react";
import { sourceModulesMeta, type SourceBlock } from "@/editor-source/content/source.generated";
import { JsonView } from "@/editor-source/source/JsonView";
import { ResultView } from "@/editor-source/source/ResultView";
import { useScrollSync } from "@/editor-source/source/scrollSync";
import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";
import { EditorProvider } from "@/editor-source/EditorProvider";
import { CommentsProvider, useComments } from "@/editor-source/CommentsProvider";
import type { Comment } from "@/editor-source/comments";
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
  // id = slug::path::uid — путь компонента это средний сегмент.
  const commented = React.useMemo(
    () =>
      new Set(
        comments
          .filter((c) => c.page === page.slug && c.text)
          .map((c) => c.id.split("::")[1]),
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

      {/* Комментарии клиента/разработчика: ховер по компоненту → кнопка → тред. */}
      <SiteComments slug={page.slug} pane={rightBox} pageDoc={pageDoc} />
    </div>
  );
}

const REVIEW_AUTHOR_KEY = "inclusion-review-author";
const uid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const snippet = (s?: string | null) =>
  s ? s.replace(/\s+/g, " ").trim().slice(0, 60) : "";

/* Комментарии клиента/разработчика в режиме «Сайт» (поток «review»). Наведение
   на компонент справа → кнопка «Комментировать» рядом → окно-тред. В треде
   несколько комментов от разных людей; при первом автор представляется. */
function SiteComments({
  slug,
  pane,
  pageDoc,
}: {
  slug: string;
  pane: HTMLDivElement | null;
  pageDoc: Doc;
}) {
  const { comments, setComment } = useComments();
  const [hover, setHover] = React.useState<{
    path: string;
    top: number;
    right: number;
  } | null>(null);
  const [openPath, setOpenPath] = React.useState<string | null>(null);
  const [author, setAuthor] = React.useState<string>(() => {
    try {
      return localStorage.getItem(REVIEW_AUTHOR_KEY) || "";
    } catch {
      return "";
    }
  });

  // Наведение на компонент справа → координаты для кнопки. Уход гасим с
  // задержкой, чтобы успеть перевести курсор на саму кнопку (она вне панели).
  const clearRef = React.useRef(0);
  React.useEffect(() => {
    if (!pane) return;
    const onMove = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest?.(
        "[data-json-path]",
      ) as HTMLElement | null;
      if (!el) return;
      window.clearTimeout(clearRef.current);
      const box = (el.firstElementChild as HTMLElement) || el;
      const r = box.getBoundingClientRect();
      const path = el.getAttribute("data-json-path") as string;
      setHover((prev) =>
        prev && prev.path === path && Math.abs(prev.top - r.top) < 1
          ? prev
          : { path, top: r.top, right: r.right },
      );
    };
    const onLeave = () => {
      clearRef.current = window.setTimeout(() => setHover(null), 250);
    };
    pane.addEventListener("mousemove", onMove, { passive: true });
    pane.addEventListener("mouseleave", onLeave);
    return () => {
      pane.removeEventListener("mousemove", onMove);
      pane.removeEventListener("mouseleave", onLeave);
    };
  }, [pane]);

  const threadOf = (path: string) =>
    comments
      .filter((c) => c.id.startsWith(`${slug}::${path}::`) && c.text)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const add = (path: string, name: string, text: string) =>
    setComment(
      {
        id: `${slug}::${path}::${uid()}`,
        page: slug,
        author: name,
        blockType: (nodeAtPath(pageDoc, path) as Node | null)?.component ?? null,
        original: snippet(nodeText(nodeAtPath(pageDoc, path))),
      },
      text,
    );

  return (
    <>
      {hover && openPath !== hover.path && (
        <button
          type="button"
          style={{
            position: "fixed",
            top: hover.top,
            left: hover.right + 8,
            zIndex: 60,
          }}
          onMouseEnter={() => window.clearTimeout(clearRef.current)}
          onClick={() => setOpenPath(hover.path)}
          className="flex items-center gap-1 rounded-full border bg-card px-2.5 py-1 text-xs font-medium shadow-md hover:bg-accent"
        >
          Комментировать
          {threadOf(hover.path).length > 0 && (
            <span className="rounded-full bg-primary px-1.5 text-[10px] leading-4 text-primary-foreground">
              {threadOf(hover.path).length}
            </span>
          )}
        </button>
      )}

      {openPath && (
        <ThreadWindow
          about={snippet(nodeText(nodeAtPath(pageDoc, openPath)))}
          thread={threadOf(openPath)}
          author={author}
          onSubmit={(name, text) => {
            if (!author) {
              try {
                localStorage.setItem(REVIEW_AUTHOR_KEY, name);
              } catch {
                /* нет localStorage — имя останется на сессию */
              }
              setAuthor(name);
            }
            add(openPath, name, text);
          }}
          onDelete={(id) => setComment({ id }, "")}
          onClose={() => setOpenPath(null)}
        />
      )}
    </>
  );
}

/* Окно-тред одного компонента: список комментов (автор + текст) и форма ввода.
   Пока имя автора не задано — сначала поле «представьтесь». */
function ThreadWindow({
  about,
  thread,
  author,
  onSubmit,
  onDelete,
  onClose,
}: {
  about: string;
  thread: Comment[];
  author: string;
  onSubmit: (name: string, text: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = React.useState(author);
  const [text, setText] = React.useState("");
  const who = (author || name).trim();
  const submit = () => {
    if (!who || !text.trim()) return;
    onSubmit(who, text.trim());
    setText("");
  };
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex max-h-[80vh] w-80 flex-col rounded-lg border bg-card shadow-xl">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-semibold">Комментарии</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-1.5 text-muted-foreground hover:text-foreground"
          aria-label="Закрыть"
        >
          ✕
        </button>
      </div>
      <div className="border-b bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">
        {about || "компонент"}
      </div>

      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 text-sm">
        {thread.length === 0 ? (
          <li className="py-2 text-center text-muted-foreground">
            Пока пусто — напишите первым.
          </li>
        ) : (
          thread.map((c) => (
            <li key={c.id} className="rounded border bg-background p-2">
              <div className="mb-0.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  {c.author || "Без имени"}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                  aria-label="Удалить комментарий"
                >
                  ✕
                </button>
              </div>
              <div className="whitespace-pre-wrap text-foreground">{c.text}</div>
            </li>
          ))
        )}
      </ul>

      <div className="flex flex-col gap-2 border-t p-3">
        {!author && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Представьтесь: ваше имя"
            className="w-full rounded border bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
          }}
          placeholder="Комментарий к компоненту"
          className="h-20 w-full resize-none rounded border bg-background px-2 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim() || !who}
          className="self-start rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
