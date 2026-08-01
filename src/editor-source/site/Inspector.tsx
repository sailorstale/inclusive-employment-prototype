import * as React from "react";
import { X } from "lucide-react";
import { sourceModulesMeta } from "@/editor-source/content/source.generated";
import { ResultView } from "@/editor-source/source/ResultView";
import { JsonView } from "@/editor-source/source/JsonView";
import type { Doc, Node, SectionNode } from "@/editor-source/source/contentTree";
import { stripDecourse } from "./decourse";

/*
  ИНСПЕКТОР ИСКАЖЕНИЙ — прямо на странице сайта.

  Две панели, в каждой переключатель: Источник · Результат · JSON · Гугдок.
  Скролл панелей связан (пропорционально) — ставишь рядом источник и результат
  (или JSON, или гугдок) и прокручиваешь вместе, чтобы поймать расхождение.
  Всё — по СТРАНИЦЕ (её секции), а не по всему модулю.
*/
type View = "source" | "result" | "json" | "doc";
const VIEWS: { id: View; label: string }[] = [
  { id: "source", label: "Источник" },
  { id: "result", label: "Результат" },
  { id: "json", label: "JSON" },
  { id: "doc", label: "Гугдок" },
];

/** Дословный текст страницы — для панели «Источник». Метки раскурсовки убраны. */
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

function Pane({ view, doc, docId }: { view: View; doc: Doc; docId?: string }) {
  if (view === "result")
    return (
      <div className="figma-scope">
        <ResultView doc={doc} />
      </div>
    );
  if (view === "json") return <JsonView doc={doc} />;
  if (view === "doc")
    return docId ? (
      <iframe
        title="Гугдок"
        src={`https://docs.google.com/document/d/${docId}/preview`}
        className="h-full w-full border-0"
      />
    ) : (
      <div className="p-6 text-sm text-muted-foreground">У модуля нет docId.</div>
    );
  return (
    <pre className="whitespace-pre-wrap px-5 py-4 font-mono text-[13px] leading-relaxed text-foreground">
      {docToText(doc)}
    </pre>
  );
}

function Switcher({ value, onChange }: { value: View; onChange: (v: View) => void }) {
  return (
    <div className="flex gap-1">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          type="button"
          onClick={() => onChange(v.id)}
          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
            value === v.id
              ? "bg-primary text-primary-foreground"
              : "text-foreground/70 hover:bg-accent"
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

export function Inspector({
  doc,
  module: moduleId,
  onClose,
}: {
  doc: Doc;
  module: string;
  onClose: () => void;
}) {
  const [left, setLeft] = React.useState<View>("source");
  const [right, setRight] = React.useState<View>("json");
  const docId = sourceModulesMeta.find((m) => m.id === moduleId)?.docId;

  // Пропорциональный синхроскролл. Гугдок (iframe) не синхроним — чужой скролл.
  const lRef = React.useRef<HTMLDivElement>(null);
  const rRef = React.useRef<HTMLDivElement>(null);
  const busy = React.useRef(false);
  React.useEffect(() => {
    const a = lRef.current;
    const b = rRef.current;
    if (!a || !b) return;
    const sync = (from: HTMLElement, to: HTMLElement) => () => {
      if (busy.current) return;
      busy.current = true;
      const max = from.scrollHeight - from.clientHeight || 1;
      to.scrollTop = (from.scrollTop / max) * (to.scrollHeight - to.clientHeight);
      requestAnimationFrame(() => (busy.current = false));
    };
    const onA = sync(a, b);
    const onB = sync(b, a);
    a.addEventListener("scroll", onA, { passive: true });
    b.addEventListener("scroll", onB, { passive: true });
    return () => {
      a.removeEventListener("scroll", onA);
      b.removeEventListener("scroll", onB);
    };
  }, [left, right]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <header className="flex items-center gap-3 border-b px-4 py-2">
        <span className="text-sm font-semibold">Инспектор искажений</span>
        <span className="text-xs text-muted-foreground">страница ← {moduleId}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto flex items-center gap-1 rounded px-2 py-1 text-sm text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" /> Закрыть
        </button>
      </header>
      <div className="grid min-h-0 flex-1 grid-cols-2 divide-x">
        <section className="flex min-h-0 flex-col">
          <div className="border-b bg-muted/40 px-3 py-1.5">
            <Switcher value={left} onChange={setLeft} />
          </div>
          <div ref={lRef} className="min-h-0 flex-1 overflow-y-auto">
            <Pane view={left} doc={doc} docId={docId} />
          </div>
        </section>
        <section className="flex min-h-0 flex-col">
          <div className="border-b bg-muted/40 px-3 py-1.5">
            <Switcher value={right} onChange={setRight} />
          </div>
          <div ref={rRef} className="min-h-0 flex-1 overflow-y-auto">
            <Pane view={right} doc={doc} docId={docId} />
          </div>
        </section>
      </div>
    </div>
  );
}
