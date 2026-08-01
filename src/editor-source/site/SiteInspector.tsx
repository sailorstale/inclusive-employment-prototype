import * as React from "react";
import { sourceModulesMeta } from "@/editor-source/content/source.generated";
import { JsonView } from "@/editor-source/source/JsonView";
import type { Doc } from "@/editor-source/source/contentTree";
import type { OsnovyPage } from "./pageMap";
import { usePageBlocks } from "./useModuleDoc";
import { PageSourceView } from "./PageSourceView";

/*
  ИНСТРУМЕНТ СВЕРКИ САЙТА С ИСТОЧНИКОМ — всегда включён, не переключается.

  Справа — сам сайт (реальная страница в своей оболочке, iframe той же
  страницы). Слева — колонка с табами: Источник · JSON · Гугдок — с чем сверяем.
  Скролл связан. Всё по СТРАНИЦЕ (её секции), не по всему модулю.

  Страница сама разворачивается в этот инструмент на верхнем уровне; внутри
  iframe (window.top !== self) она рисуется голой — её и показываем справа.
*/
type RefView = "source" | "json" | "doc";
const TABS: { id: RefView; label: string }[] = [
  { id: "source", label: "Источник" },
  { id: "json", label: "JSON" },
  { id: "doc", label: "Гугдок" },
];

export function SiteInspector({ page, pageDoc }: { page: OsnovyPage; pageDoc: Doc }) {
  const [tab, setTab] = React.useState<RefView>("source");
  const blocks = usePageBlocks(page.module, page.sections);
  const leftRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const busy = React.useRef(false);

  const docId = sourceModulesMeta.find((m) => m.id === page.module)?.docId;
  const siteSrc = window.location.href.split("#")[0] + "#" + page.slug;

  // Связанный скролл: левая колонка ↔ окно сайта в iframe (тот же origin).
  React.useEffect(() => {
    const l = leftRef.current;
    const win = frameRef.current?.contentWindow;
    if (!l || !win) return;
    const onL = () => {
      if (busy.current) return;
      busy.current = true;
      const max = l.scrollHeight - l.clientHeight || 1;
      const de = win.document.documentElement;
      win.scrollTo(0, (l.scrollTop / max) * (de.scrollHeight - win.innerHeight));
      requestAnimationFrame(() => (busy.current = false));
    };
    const onR = () => {
      if (busy.current) return;
      busy.current = true;
      const de = win.document.documentElement;
      const max = de.scrollHeight - win.innerHeight || 1;
      l.scrollTop = (win.scrollY / max) * (l.scrollHeight - l.clientHeight);
      requestAnimationFrame(() => (busy.current = false));
    };
    l.addEventListener("scroll", onL, { passive: true });
    win.addEventListener("scroll", onR, { passive: true });
    return () => {
      l.removeEventListener("scroll", onL);
      win.removeEventListener("scroll", onR);
    };
  }, [tab, pageDoc]);

  return (
    <div className="fixed inset-0 z-30 grid grid-cols-[minmax(360px,40%)_1fr] divide-x bg-background">
      {/* ЛЕВО — колонка сверки с табами */}
      <section className="flex min-h-0 flex-col">
        <div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
          <span className="mr-1 text-xs font-semibold text-muted-foreground">
            {page.title}
          </span>
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
            <JsonView doc={pageDoc} />
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
            <PageSourceView blocks={blocks} />
          ) : (
            <div className="p-6 text-sm text-muted-foreground">Загрузка…</div>
          )}
        </div>
      </section>

      {/* ПРАВО — сам сайт (та же страница, в iframe рисуется голой) */}
      <section className="min-h-0">
        <iframe ref={frameRef} title="Сайт" src={siteSrc} className="h-full w-full border-0" />
      </section>
    </div>
  );
}
