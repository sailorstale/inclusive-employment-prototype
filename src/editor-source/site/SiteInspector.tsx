import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { sourceModulesMeta, type SourceBlock } from "@/editor-source/content/source.generated";
import { JsonView } from "@/editor-source/source/JsonView";
import { ResultView } from "@/editor-source/source/ResultView";
import { PinLayer } from "@/editor-source/pins";
import { useScrollSync } from "@/editor-source/source/scrollSync";
import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";
import { EditorProvider } from "@/editor-source/EditorProvider";
import { CommentsProvider, useComments } from "@/editor-source/CommentsProvider";
import { EditorToast } from "@/editor-source/EditorNotices";
import { EditorDock } from "@/editor-source/EditorDock";
import { SourcePage } from "@/editor-source/source/SourcePage";
import { SamplePage } from "@/editor-source/source/SamplePage";
import { PageHeroBand } from "@/components/shell/PageHeroBand";
import { SidebarNav } from "@/components/shell/SidebarNav";
import { TocProvider, useToc } from "@/lib/toc";
import { cn } from "@/lib/utils";
import type { TocEntry } from "./pageStructure";
import type { OsnovyPage } from "./pageMap";
import { usePageBlocks } from "./useModuleDoc";
import { PageSourceView } from "./PageSourceView";
import { CommentFrames, type CommentFrame } from "./CommentFrames";
import { PageComments, type CommentGroup } from "./PageComments";
import { commentId, pathsOf } from "./commentIds";
import { buildOsnovyExport } from "./siteExport";
import { coverFor } from "./covers";
import { metaFor } from "./pageMeta";
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
/*
  ЧТО ОТКРЫТО — колонка сверки слева и панель комментариев справа.

  На ноутбуке с небольшим экраном три колонки рядом не помещаются: странице
  остаётся треть ширины, и ряды с таблицами переносятся не так, как увидит
  читатель. Поэтому обе боковые колонки убираются, и каждый оставляет себе ту,
  с которой работает: мы — источник, клиент — комментарии.

  Выбор помним в браузере, а не только в памяти вкладки: клиент открывает сайт
  заново каждый раз, и настраивать колонки при каждом заходе было бы утомительно.
*/
const SOURCE_OPEN_KEY = "site-inspector-source-open";
const COMMENTS_OPEN_KEY = "site-inspector-comments-open";

/** Флаг из хранилища. Записи нет — берём значение по умолчанию. */
function readFlag(key: string, fallback: boolean): boolean {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : raw === "1";
  } catch {
    // Приватный режим браузера запрещает хранилище — живём со значением по умолчанию.
    return fallback;
  }
}

function writeFlag(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // Не смогли запомнить — не беда, на этой вкладке выбор всё равно работает.
  }
}

const readSourceOpen = () => readFlag(SOURCE_OPEN_KEY, true);
const writeSourceOpen = (open: boolean) => writeFlag(SOURCE_OPEN_KEY, open);

/* Псевдо-«модуль» для эталонной страницы: id заведомо не совпадает ни с одним
   реальным модулем, поэтому годится как значение того же переключателя. */
const SAMPLE = "sample";

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
  body,
}: {
  page: OsnovyPage;
  pageDoc: Doc;
  tocItems: TocEntry[];
  /*
    Готовая разметка страницы вместо дерева узлов — для хабов треков, которые
    написаны руками (HubPage). Тогда правая колонка рисует её как есть, а
    оглавление берётся из того, что страница объявила через <PageToc>.
  */
  body?: React.ReactNode;
}) {
  const [mode, setMode] = React.useState<Mode>(lastMode);
  /*
    Тумблер разметки живёт здесь, а не внутри режима «Сайт»: кнопка должна быть
    в общем верхнем баре. В полоске над колонкой сверки её не находили — она
    там рядом с выгрузкой и читается как её продолжение.
  */
  const [commentsOpen, setCommentsOpen] = React.useState(() =>
    readFlag(COMMENTS_OPEN_KEY, true),
  );

  // Запоминаем выбранный режим, чтобы он пережил переход между страницами.
  React.useEffect(() => {
    lastMode = mode;
  }, [mode]);

  React.useEffect(() => {
    writeFlag(COMMENTS_OPEN_KEY, commentsOpen);
  }, [commentsOpen]);

  // Инструмент накрывает всю страницу — гасим прокрутку «фона» под ним.
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <TocProvider>
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
        {mode === "site" && (
          <button
            type="button"
            onClick={() => setCommentsOpen((v) => !v)}
            className={cn(
              "ml-auto rounded-md border px-3 py-1 text-sm font-medium transition-colors",
              commentsOpen
                ? "border-transparent bg-primary text-primary-foreground"
                : "bg-background text-foreground/80 hover:text-foreground",
            )}
          >
            Комментарии
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1">
        {mode === "site" ? (
          <SiteMode
            page={page}
            pageDoc={pageDoc}
            tocItems={tocItems}
            commentsOpen={commentsOpen}
            body={body}
          />
        ) : (
          <ModuleMode module={page.module} />
        )}
      </div>
      </div>
    </CommentsProvider>
    </TocProvider>
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

            {/* Эталон формата для разработчика — отделён от модулей чертой:
                это не часть курса, а тестовая страница (та же, что /source/sample). */}
            <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-border" />
            <button
              type="button"
              onClick={() => setModuleId(SAMPLE)}
              title="Образец: все компоненты и JSON к ним"
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
                moduleId === SAMPLE
                  ? "bg-[hsl(var(--brand)/0.12)] text-brand"
                  : "text-foreground/70 hover:bg-accent hover:text-accent-foreground",
              )}
            >
              Образец
            </button>
          </nav>
          <div className="min-h-0 flex-1">
            {moduleId === SAMPLE ? <SamplePage /> : <SourcePage moduleId={moduleId} />}
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
  commentsOpen,
  body,
}: {
  page: OsnovyPage;
  pageDoc: Doc;
  tocItems: TocEntry[];
  commentsOpen: boolean;
  body?: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<RefView>(lastTab);
  const [srcOpen, setSrcOpen] = React.useState(readSourceOpen);
  const [selected, setSelected] = React.useState<string | null>(null);
  /*
    Набор компонентов для разметки. Отдельно от `selected`: тот показывает
    ОДИН выбранный компонент (подсветка, комментарий, пин), а директива почти
    всегда охватывает несколько блоков подряд.
  */
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const [exporting, setExporting] = React.useState(false);
  const blocks = usePageBlocks(page.module, page.sections);

  // Единый JSON всего сайта — одно ТЗ разработчику на все страницы сразу.
  const exportAll = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      downloadJson("sayt.json", await buildOsnovyExport());
    } finally {
      setExporting(false);
    }
  };

  // Запоминаем открытый таб, чтобы он пережил переход между страницами.
  React.useEffect(() => {
    lastTab = tab;
  }, [tab]);
  // А свёрнута ли колонка сверки — переживает и закрытие браузера.
  React.useEffect(() => {
    writeSourceOpen(srcOpen);
  }, [srcOpen]);
  // Контейнеры прокрутки держим СОСТОЯНИЕМ (не ref): левая панель пересоздаётся
  // при смене таба, и синхрон должен переподключиться на новый узел сам.
  const [leftBox, setLeftBox] = React.useState<HTMLDivElement | null>(null);
  const [rightBox, setRightBox] = React.useState<HTMLDivElement | null>(null);
  // Пауза синхрона на время точной наводки на выбранный блок.
  const paused = React.useRef(false);

  const docId = sourceModulesMeta.find((m) => m.id === page.module)?.docId;
  const cover = coverFor(page.slug);

  /*
    Комментарии клиента и разработчика (отдельный поток «review»). id устроен как
    «slug::адреса::uid», где адреса — один или несколько путей через плюс: одно
    замечание нередко относится к нескольким блокам подряд.
  */
  const { comments, setComment, toggleResolved } = useComments();
  const [activeComment, setActiveComment] = React.useState<string | null>(null);
  // Контейнер контента — в нём слой рисует рамки комментариев.
  const [contentBox, setContentBox] = React.useState<HTMLDivElement | null>(null);
  const [author, setAuthor] = React.useState<string>(() => {
    try {
      return localStorage.getItem(REVIEW_AUTHOR_KEY) || "";
    } catch {
      return "";
    }
  });

  const pageComments = React.useMemo<CommentGroup[]>(
    () =>
      comments
        .filter((c) => c.page === page.slug && c.text)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .map((rec) => ({ id: rec.id, paths: pathsOf(rec.id), rec })),
    [comments, page.slug],
  );

  const commentFrames = React.useMemo<CommentFrame[]>(
    () =>
      pageComments.map((g) => ({
        id: g.id,
        paths: g.paths,
        applied: Boolean(g.rec.resolved),
        label: g.rec.author || "комментарий",
      })),
    [pageComments],
  );

  /*
    Оглавление правого рейла. У страниц из источника оно посчитано по секциям
    (tocItems). У хабов дерева нет — там пункты объявляет сама страница через
    <PageToc>, и они приезжают сюда контекстом.
  */
  const { items: declaredToc } = useToc();
  const rail = React.useMemo<TocEntry[]>(
    () =>
      body
        ? declaredToc.map((i) => ({ label: i.label, anchor: i.anchor, level: 2 }))
        : tocItems,
    [body, declaredToc, tocItems],
  );

  /*
    Текст и тип выбранного компонента. У страниц из источника берём их из
    дерева, у ручных хабов — прямо со страницы: там у каждого компонента есть
    метка data-component, а адрес ему раздаёт HandmadeBody.
  */
  const textAt = React.useCallback(
    (path: string | null): string => {
      if (!path) return "";
      if (!body) return nodeText(nodeAtPath(pageDoc, path));
      const el = rightBox?.querySelector(`[data-json-path="${CSS.escape(path)}"]`);
      return (el?.textContent ?? "").replace(/\s+/g, " ").trim();
    },
    [body, pageDoc, rightBox],
  );

  const typeAt = React.useCallback(
    (path: string): string | null => {
      if (!body) return (nodeAtPath(pageDoc, path) as Node | null)?.component ?? null;
      const el = rightBox?.querySelector<HTMLElement>(
        `[data-json-path="${CSS.escape(path)}"]`,
      );
      return el?.dataset.component ?? null;
    },
    [body, pageDoc, rightBox],
  );

  /*
    Клик по компоненту добавляет его в выделение, повторный клик снимает. Так же
    и на ручных хабах: раньше там выделение не копилось, потому что набор нужен
    был разметке, а разметке хабы не по зубам. Комментарию всё равно, из чего
    собран блок, — он держится за сам компонент.

    selected — последний выбранный. По нему колонка с источником прокручивается
    к нужному месту, и он же нужен пинам.
  */
  const onPick = React.useCallback((path: string) => {
    setSelected(path);
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  /** Один комментарий на всё выделение: адреса блоков едут в id через плюс. */
  const addComment = React.useCallback(
    (name: string, text: string) => {
      const paths = [...picked];
      if (!paths.length) return;
      if (!author) {
        try {
          localStorage.setItem(REVIEW_AUTHOR_KEY, name);
        } catch {
          /* нет хранилища — имя останется на эту сессию */
        }
        setAuthor(name);
      }
      setComment(
        {
          id: commentId(page.slug, paths, uid()),
          page: page.slug,
          author: name,
          blockType: typeAt(paths[0]),
          original: snippet(paths.map((p) => textAt(p)).join(" ⁄ ")),
        },
        text,
      );
      setPicked(new Set());
    },
    [picked, author, page.slug, setComment, typeAt, textAt],
  );

  /*
    ПЕРЕХОД К БЛОКАМ КОММЕНТАРИЯ из списка справа.

    Колонку двигаем сами, а не через scrollIntoView: он ищет ближайшего
    прокручиваемого предка и в этой раскладке промахивается. Целимся в ПЕРВОГО
    РЕБЁНКА обёртки: сама обёртка размечена как display: contents, собственной
    коробки у неё нет. Синхрон колонок на это время паузим — иначе он тут же
    вернёт страницу к позиции источника, и переход выглядел бы как «не сработало».
  */
  const goToComment = React.useCallback(
    (id: string) => {
      setActiveComment(id);
      const paths = pathsOf(id);
      if (!paths.length || !rightBox) return;
      setSelected(paths[0]);
      paused.current = true;
      window.setTimeout(() => (paused.current = false), 600);
      const el = rightBox.querySelector(`[data-json-path="${CSS.escape(paths[0])}"]`);
      const target = el?.firstElementChild ?? el;
      if (!target) return;
      const er = target.getBoundingClientRect();
      const pr = rightBox.getBoundingClientRect();
      rightBox.scrollTop += er.top - pr.top - pr.height / 2 + er.height / 2;
    },
    [rightBox],
  );


  const srcHighlight = React.useMemo(() => {
    if (!selected || !blocks) return null;
    return matchBlock(blocks, textAt(selected));
  }, [selected, blocks, textAt]);

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

  /*
    ШИРИНЫ КОЛОНОК. Свёрнутая колонка сверки не исчезает совсем, а остаётся
    узкой полосой: кнопка «развернуть» должна быть на виду, иначе вернуть
    источник будет нечем. Ширины считаем строкой и отдаём стилем — Tailwind
    собирает классы заранее и значение, вычисленное на ходу, не увидел бы.
  */
  const leftCol = srcOpen ? "minmax(0,40rem)" : "2.75rem";
  const gridCols = commentsOpen
    ? `${leftCol} minmax(0,1fr) 17rem`
    : `${leftCol} minmax(0,1fr)`;

  return (
    <div
      className="grid h-full min-h-0 divide-x"
      /* Колонка сверки сохраняет свою ширину: панель разметки прибавляется
         справа, а не отъедает у источника. */
      style={{ gridTemplateColumns: gridCols }}
    >
      {/* ЛЕВО — колонка сверки с табами. Свёрнута — узкая полоса с кнопкой. */}
      {!srcOpen ? (
        <section className="flex min-h-0 flex-col items-center gap-3 bg-muted/40 py-2">
          <button
            type="button"
            onClick={() => setSrcOpen(true)}
            title="Развернуть колонку сверки"
            aria-label="Развернуть колонку сверки"
            aria-expanded={false}
            className="rounded p-1.5 text-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
          >
            <PanelLeftOpen className="size-4" aria-hidden />
          </button>
          {/* Подпись боком — чтобы полоса не была безымянной кнопкой в пустоте. */}
          <span className="text-xs font-medium text-muted-foreground [writing-mode:vertical-rl]">
            {TABS.find((t) => t.id === tab)?.label ?? "Источник"}
          </span>
        </section>
      ) : (
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
          {/* Экспорт всего раздела одним файлом — для передачи разработчику. */}
          <button
            type="button"
            onClick={exportAll}
            disabled={exporting}
            className="ml-auto rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground disabled:opacity-60"
          >
            {exporting ? "Собираю…" : "Полный JSON"}
          </button>
          <button
            type="button"
            onClick={() => setSrcOpen(false)}
            title="Свернуть колонку сверки"
            aria-label="Свернуть колонку сверки"
            aria-expanded
            className="rounded p-1.5 text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
          >
            <PanelLeftClose className="size-4" aria-hidden />
          </button>
        </div>
        <div ref={setLeftBox} className="min-h-0 flex-1 overflow-y-auto">
          {tab === "json" && body ? (
            <p className="p-6 text-sm text-muted-foreground">
              Хаб трека собран руками — это навигация по разделу, а не материал
              источника. Дерева узлов у него нет, поэтому и JSON для него не
              строится. В соседней вкладке «Источник» — вступление модуля, из
              которого написан текст хаба.
            </p>
          ) : tab === "json" ? (
            <div className="px-5 py-4">
              <JsonView
                doc={pageDoc}
                selected={selected}
                onSelect={setSelected}
                listKey="article"
                heading={{
                  slug: page.slug,
                  meta: metaFor(page.slug, page.title).meta,
                  "meta-og": metaFor(page.slug, page.title).og,
                  h1: page.title,
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
      )}

      {/* ПРАВО — сам сайт, полная раскладка: баннер с фото (в нём шапка сайта и
          заголовок H1), под ним меню разделов слева + контент + оглавление «На
          этой странице» справа (рисуется напрямую, не в iframe — чтобы синхрон
          и клик работали). Контент наезжает на низ баннера, как в макете. */}
      <section className="min-h-0">
        <div ref={setRightBox} className="h-full overflow-y-auto">
          {/* Заголовок страницы и обложка — в баннере (не узлы дерева: в данных
              они едут полем header). Всё остальное — одним деревом через
              ResultView: «вы узнаете» + секции + форма мнения + «Читайте также». */}
          <PageHeroBand title={page.title} cover={cover} />

          <div className="relative z-10 -mt-20 rounded-t-[2rem] bg-background">
            <div className="mx-auto grid max-w-7xl grid-cols-[15rem_minmax(0,1fr)_13rem] gap-x-8 px-6 py-10">
              {/* Левое меню — навигация по разделам сайта */}
              <aside className="min-w-0">
                <div className="sticky top-8">
                  <SidebarNav />
                </div>
              </aside>

              {/* Контент страницы. relative — чтобы рамки комментариев легли
                  ровно поверх него и ехали вместе с прокруткой. */}
              <div className="relative min-w-0" ref={setContentBox}>
                {body ? (
                  <HandmadeBody picked={picked} onSelect={onPick}>
                    {body}
                  </HandmadeBody>
                ) : (
                  <ResultView doc={pageDoc} pick={{ selected, onSelect: onPick, picked }} />
                )}
                <CommentFrames
                  host={contentBox}
                  frames={commentFrames}
                  activeId={activeComment}
                  onPick={setActiveComment}
                />
              </div>

              {/* Правое меню — оглавление страницы */}
              <aside className="min-w-0">
                <div className="sticky top-8">
                  <SiteRail items={rail} pane={rightBox} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ТРЕТЬЯ КОЛОНКА — комментарии страницы. Раньше здесь жила разметка, но
          разметку ведём мы, а колонку каждый день видит клиент: ему нужно
          написать замечание, а не собрать компонент. Разметка осталась в режиме
          «Модули», где она и делается. */}
      {commentsOpen && (
        <section className="flex min-h-0 flex-col">
          <div className="flex shrink-0 items-center gap-2 border-b bg-muted/40 px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Комментарии{pageComments.length ? ` · ${pageComments.length}` : ""}
            </span>
          </div>
          <div className="min-h-0 flex-1">
            <PageComments
              groups={pageComments}
              picked={picked.size}
              pickedAbout={snippet([...picked].map((p) => textAt(p)).join(" ⁄ "))}
              author={author}
              activeId={activeComment}
              onAdd={addComment}
              onDelete={(id) => setComment({ id }, "")}
              onApplied={(id, applied) => toggleResolved(id, applied)}
              onGoTo={goToComment}
              onClearPick={() => setPicked(new Set())}
            />
          </div>
        </section>
      )}

      {/* Пины — закладки «сюда вернуться». */}
      <PinLayer
        page={page.slug}
        pane={rightBox}
        selected={selected}
        onSelect={setSelected}
        labelOf={(path) => textAt(path).slice(0, 120)}
        offset={44}
      />
    </div>
  );
}

/*
  РУЧНАЯ СТРАНИЦА В ИНСПЕКТОРЕ — хабы треков «Для компаний» и «Для НКО».

  Они написаны разметкой, а не собраны из источника: это навигация по треку.
  Дерева узлов, а значит и адресов вида «0.2.1», у них нет — поэтому адрес
  каждому компоненту раздаём по факту отрисовки. Опереться есть на что: каждый
  компонент дизайн-системы помечает себя атрибутом data-component (по нему же
  работает тумблер «Компоненты»). Порядковый номер в этом списке и есть адрес.
  Страницы статичные, порядок обхода от рендера к рендеру не меняется — значит
  комментарии и пины держатся за свои компоненты.

  Выделение ставим классами на сам элемент (у страниц из источника обёртка
  прозрачная, display: contents, и рамка рисуется на её ребёнке — здесь обёртки
  нет, поэтому отдельные правила .ds-pick-flat в globals.css).
*/
function HandmadeBody({
  children,
  picked,
  onSelect,
}: {
  children: React.ReactNode;
  picked: Set<string>;
  onSelect: (path: string) => void;
}) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  // Без списка зависимостей: адреса и подсветку переставляем на каждый показ —
  // страница могла перерисоваться (раскрылся аккордеон, сменилась вкладка).
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-component]").forEach((el, i) => {
      const path = `c${i}`;
      el.dataset.jsonPath = path;
      el.classList.add("ds-pick-flat");
      el.classList.toggle("is-picked", picked.has(path));
    });
  });

  return (
    <div
      ref={rootRef}
      className="space-y-12"
      onClick={(e) => {
        // Ближайший компонент от места клика — то есть самый вложенный.
        const el = (e.target as HTMLElement).closest<HTMLElement>("[data-component]");
        const path = el?.dataset.jsonPath;
        if (path) onSelect(path);
      }}
    >
      {children}
    </div>
  );
}

const REVIEW_AUTHOR_KEY = "inclusion-review-author";
const uid = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const snippet = (s?: string | null) =>
  s ? s.replace(/\s+/g, " ").trim().slice(0, 60) : "";

