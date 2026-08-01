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
  const [selected, setSelected] = React.useState<string | null>(null);
  const blocks = usePageBlocks(page.module, page.sections);
  const leftRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLIFrameElement>(null);

  const docId = sourceModulesMeta.find((m) => m.id === page.module)?.docId;
  const siteSrc = window.location.href.split("#")[0] + "#" + page.slug;

  // Клик по компоненту на сайте (iframe) → подсветить его код в JSON.
  React.useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.__inspect === "pick") {
        setSelected(e.data.path);
        setTab("json");
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Подвести JSON к выбранному узлу.
  React.useEffect(() => {
    if (tab === "json" && selected)
      requestAnimationFrame(() => {
        leftRef.current
          ?.querySelector(`[data-json-path="${selected}"]`)
          ?.scrollIntoView({ block: "center" });
      });
  }, [selected, tab]);

  /*
    Связанный скролл. Для «Источника» — ПОСЕКЦИОННО (у заголовков слева и секций
    справа один якорь), это точнее пропорции. Для JSON — пропорционально. Мягкая
    блокировка на 150 мс гасит эхо: программный скролл одной стороны не дёргает
    вторую в ответ.
  */
  React.useEffect(() => {
    const l = leftRef.current;
    const win = frameRef.current?.contentWindow;
    if (!l || !win) return;
    let until = 0;
    const held = () => Date.now() < until;
    const hold = () => (until = Date.now() + 150);

    const topId = (els: Element[], top: number): string | null => {
      let best: Element | null = null;
      let bestD = -Infinity;
      for (const el of els) {
        const d = el.getBoundingClientRect().top - top;
        if (d <= 8 && d > bestD) {
          bestD = d;
          best = el;
        }
      }
      return (best ?? els[0])?.id || null;
    };

    const onL = () => {
      if (held()) return;
      hold();
      if (tab === "source") {
        const id = topId([...l.querySelectorAll("h2[id]")], l.getBoundingClientRect().top);
        const el = id && win.document.getElementById(id);
        if (el) win.scrollTo(0, win.scrollY + el.getBoundingClientRect().top - 8);
      } else {
        const max = l.scrollHeight - l.clientHeight || 1;
        win.scrollTo(0, (l.scrollTop / max) * (win.document.documentElement.scrollHeight - win.innerHeight));
      }
    };
    const onR = () => {
      if (held()) return;
      hold();
      if (tab === "source") {
        const id = topId([...win.document.querySelectorAll("section[id]")], 0);
        const el = id && l.querySelector(`h2[id="${id}"]`);
        if (el) l.scrollTop += el.getBoundingClientRect().top - l.getBoundingClientRect().top - 8;
      } else {
        const max = win.document.documentElement.scrollHeight - win.innerHeight || 1;
        l.scrollTop = (win.scrollY / max) * (l.scrollHeight - l.clientHeight);
      }
    };
    l.addEventListener("scroll", onL, { passive: true });
    win.addEventListener("scroll", onR, { passive: true });
    return () => {
      l.removeEventListener("scroll", onL);
      win.removeEventListener("scroll", onR);
    };
  }, [tab, pageDoc, blocks]);

  return (
    <div className="fixed inset-0 z-50 grid grid-cols-[minmax(0,48rem)_1fr] divide-x bg-background">
      {/* ЛЕВО — колонка сверки с табами (ширина как у колонки сайта) */}
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
