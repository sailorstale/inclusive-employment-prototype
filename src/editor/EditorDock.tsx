import * as React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useComments } from "./CommentsProvider";

/*
  Плавающий док в левом нижнем углу страницы сайта.

  Осталась ОДНА кнопка — «Комментарии» (решение дизайнера). Раньше рядом жили
  «Редактор», «Изменения», «Инвентарь» и «Унификация»: набор разросся и стал
  спорить с самим сайтом — читатель видит панель инструментов раньше, чем
  контент. Страницы никуда не делись и открываются по адресу (/changes,
  /inventory, /unify), просто не мозолят глаза.

  Кнопка открывает панель со сводным списком (как в Figma); режим «поставить
  пин» — кнопкой + внутри панели.
*/

export function EditorDock() {
  const { adding, panelOpen, togglePanel, openCount } = useComments();

  return (
    <div
      data-comments-ui
      className="fixed bottom-5 left-5 z-40 flex items-center gap-0.5 rounded-full border bg-card/95 p-1 shadow-md backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <DockItem
        label="Комментарии"
        icon={<MessageCircle className="h-[18px] w-[18px]" />}
        active={panelOpen || adding}
        badge={openCount}
        onClick={togglePanel}
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
