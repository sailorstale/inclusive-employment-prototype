import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Boxes,
  Combine,
  ListChecks,
  MessageCircle,
  PencilLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditor } from "./EditorProvider";
import { useComments } from "./CommentsProvider";

// Компактный плавающий док редакторских инструментов в левом нижнем углу:
// Редактор · Комментарии · Изменения. Вынесен из шапки, чтобы не мешать чтению
// и не влиять на ощущение сайта. Кнопка «Комментарии» открывает панель со
// сводным списком (как в Figma); режим «поставить пин» — кнопкой + в панели.

export function EditorDock() {
  const { editorMode, toggleEditorMode, editedCount, edits } = useEditor();
  const { adding, panelOpen, togglePanel, openCount } = useComments();
  const { pathname } = useLocation();

  const pending = Object.values(edits).filter(
    (e) => e.status === "new" || e.status === "rollback",
  ).length;

  return (
    <div
      data-comments-ui
      className="fixed bottom-5 left-5 z-40 flex items-center gap-0.5 rounded-full border bg-card/95 p-1 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <DockItem
        label="Редактор"
        icon={<PencilLine className="h-[18px] w-[18px]" />}
        active={editorMode}
        badge={editedCount}
        onClick={toggleEditorMode}
      />
      <DockItem
        label="Комментарии"
        icon={<MessageCircle className="h-[18px] w-[18px]" />}
        active={panelOpen || adding}
        badge={openCount}
        onClick={togglePanel}
      />
      <DockItem
        label="Изменения"
        icon={<ListChecks className="h-[18px] w-[18px]" />}
        active={pathname === "/changes"}
        badge={pending}
        to="/changes"
      />
      <DockItem
        label="Инвентарь контента"
        icon={<Boxes className="h-[18px] w-[18px]" />}
        active={pathname === "/inventory"}
        badge={0}
        to="/inventory"
      />
      <DockItem
        label="Унификация"
        icon={<Combine className="h-[18px] w-[18px]" />}
        active={pathname === "/unify"}
        badge={0}
        to="/unify"
      />
    </div>
  );
}

function DockItem({
  label,
  icon,
  active,
  badge,
  onClick,
  to,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  badge: number;
  onClick?: () => void;
  to?: string;
}) {
  const cls = cn(
    "relative flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    active
      ? "bg-[hsl(var(--brand)/0.15)] text-brand"
      : "text-muted-foreground hover:bg-accent hover:text-foreground",
  );
  const content = (
    <>
      {icon}
      {badge > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[16px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-medium leading-4 text-brand-foreground">
          {badge}
        </span>
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} title={label} aria-label={label} className={cls}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cls}
    >
      {content}
    </button>
  );
}
