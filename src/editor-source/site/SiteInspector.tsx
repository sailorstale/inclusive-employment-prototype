import * as React from "react";
import { useParams, Link } from "react-router-dom";
import { X } from "lucide-react";
import { sourceModulesMeta } from "@/editor-source/content/source.generated";
import { JsonView } from "@/editor-source/source/JsonView";
import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";
import { pageBySlug } from "./pageMap";
import { useModuleDoc } from "./useModuleDoc";
import { stripDecourse } from "./decourse";

/*
  ИНСТРУМЕНТ СВЕРКИ САЙТА С ИСТОЧНИКОМ.

  Справа — сам сайт (реальная страница в своей оболочке, iframe). Слева —
  колонка с табами: Источник · JSON · Гугдок — то, с чем сверяем. Скролл связан:
  прокручиваешь одну сторону — едет вторая, и глазами ловишь расхождения.

  Не модалка, а отдельный инструмент (маршрут /source/inspect/*). Всё по
  СТРАНИЦЕ (её секции), не по всему модулю.
*/
type RefView = "source" | "json" | "doc";
const TABS: { id: RefView; label: string }[] = [
  { id: "source", label: "Источник" },
  { id: "json", label: "JSON" },
  { id: "doc", label: "Гугдок" },
];

/** Дословный текст страницы — панель «Источник». Метки раскурсовки убраны. */
function docToText(doc: Doc): string {
  const line = (n: Node): string => {
    switch (n.component) {
      case "Heading":
        return `\n${"#".repeat(Number(n.level[1]) || 2)} ${n.text}`;
      case "Text":
      case "Phrase":
        return n.text;
      case "List Item":
        return `• ${n.text}`;
      case "Quote":
        return n.paragraphs.map((p) => `» ${p}`).join("\n");
      case "note":
        return "";
      default:
        return "children" in n && Array.isArray(n.children)
          ? n.children.map(line).filter(Boolean).join("\n")
          : "";
    }
  };
  return stripDecourse(
    doc.children
      .map((n) =>
        (n as SectionNode).component === "Section Container"
          ? (n as SectionNode).children.map(line).filter(Boolean).join("\n")
          : line(n as Node),
      )
      .filter(Boolean)
      .join("\n"),
  );
}

export function SiteInspector() {
  const splat = useParams()["*"] ?? "";
  const slug = "/" + splat.replace(/^\/+/, "");
  const page = pageBySlug(slug);
  const doc = useModuleDoc(page?.module ?? "");
  const [tab, setTab] = React.useState<RefView>("source");

  const leftRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const busy = React.useRef(false);

  // Связанный скролл: левая колонка ↔ окно сайта в iframe (тот же origin).
  React.useEffect(() => {
    const l = leftRef.current;
    const win = frameRef.current?.contentWindow;
    if (!l || !win) return;
    const de = () => win.document.documentElement;
    const onL = () => {
      if (busy.current) return;
      busy.current = true;
      const max = l.scrollHeight - l.clientHeight || 1;
      win.scrollTo(0, (l.scrollTop / max) * (de().scrollHeight - win.innerHeight));
      requestAnimationFrame(() => (busy.current = false));
    };
    const onR = () => {
      if (busy.current) return;
      busy.current = true;
      const max = de().scrollHeight - win.innerHeight || 1;
      l.scrollTop = (win.scrollY / max) * (l.scrollHeight - l.clientHeight);
      requestAnimationFrame(() => (busy.current = false));
    };
    l.addEventListener("scroll", onL, { passive: true });
    win.addEventListener("scroll", onR, { passive: true });
    return () => {
      l.removeEventListener("scroll", onL);
      win.removeEventListener("scroll", onR);
    };
  }, [tab, doc]);

  if (!page)
    return <div className="p-8 text-muted-foreground">Нет такой страницы: {slug}</div>;

  // Вариант 1: сверяем ровно СТРАНИЦУ — фильтруем секции модуля под её карту.
  const pageDoc: Doc | null = doc
    ? {
        module: doc.module,
        children: (() => {
          const byAnchor = new Map(
            doc.children
              .filter((n): n is SectionNode => (n as SectionNode).component === "Section Container")
              .map((n) => [n.anchor ?? "", n]),
          );
          return page.sections
            .map((a) => byAnchor.get(a))
            .filter(Boolean) as SectionNode[];
        })(),
      }
    : null;

  const docId = sourceModulesMeta.find((m) => m.id === page.module)?.docId;
  const siteSrc = `${window.location.origin}${window.location.pathname}#${slug}`;

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center gap-3 border-b px-4 py-2">
        <span className="text-sm font-semibold">Сверка сайта с источником</span>
        <span className="text-xs text-muted-foreground">
          {page.title} ← {page.module}
        </span>
        <Link
          to={slug}
          className="ml-auto flex items-center gap-1 rounded px-2 py-1 text-sm text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" /> К странице
        </Link>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(360px,42%)_1fr] divide-x">
        {/* ЛЕВО — колонка сверки с табами */}
        <section className="flex min-h-0 flex-col">
          <div className="flex gap-1 border-b bg-muted/40 px-3 py-1.5">
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
            {!pageDoc ? (
              <div className="p-6 text-sm text-muted-foreground">Загрузка…</div>
            ) : tab === "json" ? (
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
            ) : (
              <pre className="whitespace-pre-wrap px-5 py-4 font-mono text-[13px] leading-relaxed text-foreground">
                {docToText(pageDoc)}
              </pre>
            )}
          </div>
        </section>

        {/* ПРАВО — сам сайт */}
        <section className="min-h-0">
          <iframe
            ref={frameRef}
            title="Сайт"
            src={siteSrc}
            className="h-full w-full border-0"
          />
        </section>
      </div>
    </div>
  );
}
