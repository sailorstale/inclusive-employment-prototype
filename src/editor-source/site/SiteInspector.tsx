import * as React from "react";
import { sourceModulesMeta, type SourceBlock } from "@/editor-source/content/source.generated";
import { JsonView } from "@/editor-source/source/JsonView";
import { ResultView } from "@/editor-source/source/ResultView";
import { useScrollSync } from "@/editor-source/source/scrollSync";
import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";
import { EditorProvider } from "@/editor-source/EditorProvider";
import { CommentsProvider } from "@/editor-source/CommentsProvider";
import { EditorToast } from "@/editor-source/EditorNotices";
import { EditorDock } from "@/editor-source/EditorDock";
import { SourcePage } from "@/editor-source/source/SourcePage";
import { AppHeader } from "@/components/shell/AppHeader";
import { SidebarNav } from "@/components/shell/SidebarNav";
import type { TocItem } from "@/lib/toc";
import type { OsnovyPage } from "./pageMap";
import { usePageBlocks } from "./useModuleDoc";
import { PageSourceView } from "./PageSourceView";
import { buildOsnovyExport } from "./siteExport";
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
  tocItems: TocItem[];
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

/* Правое меню сайта — оглавление «На этой странице». Клик прокручивает правую
   панель к секции (обычный in-page скролл в контейнере, без внешнего роутинга). */
function SiteRail({
  items,
  pane,
}: {
  items: TocItem[];
  pane: HTMLDivElement | null;
}) {
  if (items.length < 2) return null;
  const go = (anchor: string) => {
    if (!pane) return;
    const el = pane.querySelector(`section[id="${CSS.escape(anchor)}"]`);
    if (el)
      pane.scrollTop +=
        el.getBoundingClientRect().top - pane.getBoundingClientRect().top - 12;
  };
  return (
    <nav aria-label="На этой странице" className="text-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        На этой странице
      </div>
      <ul className="space-y-1 border-l">
        {items.map((t) => (
          <li key={t.anchor}>
            <button
              type="button"
              onClick={() => go(t.anchor)}
              className="-ml-px block border-l border-transparent py-0.5 pl-3 text-left leading-snug text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              {t.label}
            </button>
          </li>
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
  tocItems: TocItem[];
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
                heading={{ slug: page.slug, h1: page.title }}
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
                <h1 className="ds-h1 text-[color:var(--text-primary)]">{page.title}</h1>
              </div>
              <ResultView doc={pageDoc} pick={{ selected, onSelect: setSelected }} />
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
    </div>
  );
}
