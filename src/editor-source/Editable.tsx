import * as React from "react";
import { useLocation } from "react-router-dom";
import { Pencil, Sparkles, Check, AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROSE_CLASSES, type ProseKind } from "@/components/proseClasses";
import { getVariantsFor } from "@/editor/registry";
import { getSourceVariantsFor } from "./sourceRegistry";
import { MessageSquare, Trash2 } from "lucide-react";
import { autoId, normalizeText, routeId } from "./ids";
import { renderInline } from "./richText";
import { useAnchor } from "@/editor/AnchorContext";
import { useEditor } from "./EditorProvider";
import { useComments } from "./CommentsProvider";

// Редактируемый текстовый блок. Адрес (id) считается из страницы + типа + текста,
// поэтому ЛЮБОЙ блок, прошедший через этот компонент, правится без ручной
// разметки. Поддерживаются абзацы/лиды, заголовки (h1–h4) и пункты списков (li).
// Наши готовые варианты подсвечиваются, если текст блока совпал с разобранным.

type HeadingKind = "h1" | "h2" | "h3" | "h4";
// "inline" — текст внутри чужого элемента (заголовок карточки, число, подпись):
// рендерится как span, своих классов не навязывает, правит только простой текст.
export type EditableAs = ProseKind | HeadingKind | "li" | "inline";

const isHeading = (as: EditableAs): as is HeadingKind =>
  as === "h1" || as === "h2" || as === "h3" || as === "h4";

function reactText(node: React.ReactNode): string {
  if (node == null || node === false || node === true) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(reactText).join("");
  if (React.isValidElement(node)) {
    return reactText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

const hasMarkupChildren = (node: React.ReactNode): boolean =>
  React.Children.toArray(node).some((c) => React.isValidElement(c));

const fmtShort = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" })
    : "";
const fmtFull = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString("ru-RU") : "";

/** Визуальный элемент блока (без редакторской оболочки). */
function Visual({
  as,
  className,
  mark,
  children,
}: {
  as: EditableAs;
  className?: string;
  mark?: boolean;
  children: React.ReactNode;
}) {
  const markCls = mark ? "-ml-3 border-l-2 border-[hsl(var(--ok)/0.35)] pl-3" : "";
  if (isHeading(as)) {
    const Tag = as;
    return <Tag className={cn(className, markCls)}>{children}</Tag>;
  }
  if (as === "li" || as === "inline") {
    return <span className={cn(markCls)}>{children}</span>;
  }
  return <p className={cn(PROSE_CLASSES[as], className, markCls)}>{children}</p>;
}

export function Editable({
  as = "paragraph",
  children,
  className,
}: {
  as?: EditableAs;
  children: React.ReactNode;
  className?: string;
}) {
  const { editorMode, edits, active, openBlock, markSeen } = useEditor();
  const { commentOf } = useComments();
  const { pathname } = useLocation();
  const anchor = useAnchor();

  const originalText = React.useMemo(() => reactText(children), [children]);
  // h1 — один на страницу и адресуется по маршруту (`route:<path>`), чтобы правка
  // заголовка прорастала в навигацию (крошки/меню знают путь, но не текст h1).
  // Остальные блоки — по хэшу текста.
  const id = React.useMemo(
    () => (as === "h1" ? routeId(pathname) : autoId(pathname, as, originalText, anchor)),
    [as, pathname, originalText, anchor]
  );

  // Регистрируем отрисованный блок — дашборд так находит осиротевшие правки.
  React.useEffect(() => {
    markSeen(id, pathname);
  }, [id, pathname, markSeen]);

  // inline-режим правит только простой текст. Если внутри разметка/элементы —
  // пропускаем как есть, чтобы ничего не сломать (ссылки, иконки и т.п.).
  if (as === "inline" && typeof children !== "string") {
    return <>{children}</>;
  }

  const hasMarkup = hasMarkupChildren(children);

  const annotation = commentOf(id);
  const hasComment = Boolean(annotation?.text);
  const isDeleted = Boolean(annotation?.deleted);

  const record = edits[id];
  // Разборы (наши варианты) показываем на ЛЮБОМ блоке, чей текст совпал —
  // не только на прозе: следы курса живут и в заголовках, плашках, пунктах.
  // Источник (/source) и сайт держат РАЗНЫЕ реестры — тексты частично совпадают,
  // варианты не должны «протекать» между ними.
  const variants = pathname.startsWith("/source")
    ? getSourceVariantsFor(originalText)
    : getVariantsFor(originalText);
  // Показываем правку, если она есть, непустая и по ней не запрошен откат;
  // иначе — оригинал.
  const showEdit = Boolean(
    record && record.text.trim() && record.status !== "rollback"
  );
  const displayText: React.ReactNode = showEdit
    ? renderInline(record!.text)
    : children;
  const stale = Boolean(
    record?.original &&
      normalizeText(record.original) !== normalizeText(originalText)
  );

  // Обычный режим: текст; изменённый блок — с тонкой пометкой слева (кроме li).
  // Помеченный на удаление блок остаётся, но полупрозрачный (виден всегда).
  if (!editorMode) {
    const mark = showEdit && as !== "li" && as !== "inline";
    const visual = (
      <Visual
        as={as}
        className={cn(className, isDeleted && "opacity-40")}
        mark={mark}
      >
        {displayText}
      </Visual>
    );
    if (mark || isDeleted) {
      return (
        <div
          title={
            isDeleted
              ? "Блок помечен на удаление"
              : `Изменено ${fmtFull(record!.editedAt)}`
          }
        >
          {visual}
        </div>
      );
    }
    return visual;
  }

  const isActive = active?.id === id;

  let badge: { icon: React.ReactNode; label: string; cls: string };
  if (stale) {
    badge = {
      icon: <AlertTriangle className="h-3 w-3" />,
      label: "правка устарела",
      cls: "border-[hsl(var(--warn)/0.4)] bg-[hsl(var(--warn)/0.12)] text-[hsl(var(--warn))]",
    };
  } else if (record?.status === "rollback") {
    badge = {
      icon: <RotateCcw className="h-3 w-3" />,
      label: "откат запрошен",
      cls: "border-[hsl(var(--warn)/0.4)] bg-[hsl(var(--warn)/0.12)] text-[hsl(var(--warn))]",
    };
  } else if (record?.kind === "custom") {
    badge = {
      icon: <Pencil className="h-3 w-3" />,
      label: `изменено · ${fmtShort(record.editedAt)}`,
      cls: "border-[hsl(var(--ok)/0.35)] bg-[hsl(var(--ok)/0.12)] text-[hsl(var(--ok))]",
    };
  } else if (record?.kind === "variant") {
    badge = {
      icon: <Check className="h-3 w-3" />,
      label: `вариант ${record.variantKey === "a" ? "А" : "Б"} · ${fmtShort(record.editedAt)}`,
      cls: "border-[hsl(var(--ok)/0.35)] bg-[hsl(var(--ok)/0.12)] text-[hsl(var(--ok))]",
    };
  } else if (variants) {
    badge = {
      icon: <Sparkles className="h-3 w-3" />,
      label: "предложения",
      cls: "border-[hsl(var(--brand)/0.3)] bg-[hsl(var(--brand)/0.1)] text-brand",
    };
  } else {
    badge = {
      icon: <Pencil className="h-3 w-3" />,
      label: "редактировать",
      cls: "border-border bg-muted text-muted-foreground opacity-0 group-hover:opacity-100",
    };
  }

  const ctx = {
    id,
    original: originalText,
    page: pathname,
    anchor,
    blockType: as,
    hasMarkup,
  };

  const shellCls =
    as === "inline"
      ? "group relative -mx-1 inline-block cursor-pointer rounded px-1 align-baseline"
      : as === "li"
        ? "group relative -ml-2 cursor-pointer rounded-md py-0.5 pl-2 pr-3"
        : "group relative -mx-3 cursor-pointer rounded-md px-3 py-1";

  // inline сидит внутри чужих элементов (h3, div) — оболочка должна быть span.
  const Wrapper = as === "inline" ? "span" : "div";

  return (
    <Wrapper
      role="button"
      tabIndex={0}
      aria-label="Открыть редактор этого блока"
      onClick={(e) => {
        // В режиме редактора клик = правка: не даём ссылке перейти, а
        // disclosure/раскрывашке — переключиться.
        e.preventDefault();
        e.stopPropagation();
        openBlock(ctx);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openBlock(ctx);
        }
      }}
      className={cn(
        shellCls,
        "transition-colors ring-1 ring-transparent hover:bg-[hsl(var(--brand)/0.05)] hover:ring-[hsl(var(--brand)/0.25)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "bg-[hsl(var(--brand)/0.07)] ring-[hsl(var(--brand)/0.45)]",
        isDeleted && "opacity-60"
      )}
    >
      <span className="pointer-events-none absolute -top-2 right-2 z-10 flex items-center gap-1">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition-opacity",
            badge.cls
          )}
        >
          {badge.icon}
          {badge.label}
        </span>
        {hasComment ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--warn)/0.4)] bg-[hsl(var(--warn)/0.15)] px-2 py-0.5 text-[11px] font-medium text-[hsl(var(--warn))]">
            <MessageSquare className="h-3 w-3" />
            комментарий
          </span>
        ) : null}
        {isDeleted ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--bad)/0.4)] bg-[hsl(var(--bad)/0.12)] px-2 py-0.5 text-[11px] font-medium text-[hsl(var(--bad))]">
            <Trash2 className="h-3 w-3" />
            удалён
          </span>
        ) : null}
      </span>
      <Visual as={as} className={className}>
        {displayText}
      </Visual>
    </Wrapper>
  );
}
