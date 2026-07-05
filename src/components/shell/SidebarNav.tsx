import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { type SidebarItem, type Track, sidebars } from "@/data/nav";
import { useEditor } from "@/editor/EditorProvider";
import { cn } from "@/lib/utils";

// SidebarNav (00 — три уровня навигации) — локальная навигация внутри трека:
// заголовок = название трека, список пунктов, текущий выделен («вы здесь»).
// Компании — один блок с раскрываемыми группами («Правовые основы», «Наём по шагам»).
// НКО — две группы с подписями («Основы», «Программа НКО»). Только на страницах треков.

const leafLink =
  "block rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function LeafItem({
  label,
  path,
  active,
  nested,
  onNavigate,
}: {
  label: string;
  path: string;
  active: boolean;
  nested?: boolean;
  onNavigate?: () => void;
}) {
  const { navLabel } = useEditor();
  return (
    <Link
      to={path}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        leafLink,
        nested && "ml-3",
        active
          ? "border-l-2 border-brand bg-accent font-medium text-brand"
          : "text-foreground/75 hover:bg-accent hover:text-foreground"
      )}
    >
      {navLabel(path, label)}
    </Link>
  );
}

function GroupItem({
  item,
  pathname,
  onNavigate,
}: {
  item: SidebarItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const { navLabel } = useEditor();
  const withinGroup =
    pathname === item.path || pathname.startsWith(item.path + "/");
  const [open, setOpen] = React.useState(withinGroup);

  React.useEffect(() => {
    if (withinGroup) setOpen(true);
  }, [withinGroup]);

  const parentActive = pathname === item.path;

  return (
    <div>
      <div className="flex items-center">
        <Link
          to={item.path}
          onClick={onNavigate}
          aria-current={parentActive ? "page" : undefined}
          className={cn(
            leafLink,
            "flex-1",
            parentActive
              ? "border-l-2 border-brand bg-accent font-medium text-brand"
              : "font-medium text-foreground/85 hover:bg-accent hover:text-foreground"
          )}
        >
          {navLabel(item.path, item.label)}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Свернуть" : "Развернуть"}
          aria-expanded={open}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>
      {open && item.children ? (
        <div className="mt-1 space-y-1">
          {item.children.map((child) => (
            <LeafItem
              key={child.path}
              label={child.label}
              path={child.path}
              active={pathname === child.path}
              onNavigate={onNavigate}
              nested
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SidebarNav({
  track,
  onNavigate,
}: {
  track: Track;
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();
  const { navLabel } = useEditor();
  const spec = sidebars[track];
  // Заголовок трека = h1 его хаба (`/companies` и т.п.) — прорастает так же.
  const title = navLabel(`/${track}`, spec.title);

  return (
    <nav aria-label={`Разделы трека «${title}»`} className="space-y-4">
      <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      {spec.groups.map((group, gi) => (
        <div key={gi} className="space-y-1">
          {group.label ? (
            <p className="px-3 pb-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </p>
          ) : null}
          {group.items.map((item) =>
            item.children ? (
              <GroupItem
                key={item.path}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ) : (
              <LeafItem
                key={item.path}
                label={item.label}
                path={item.path}
                active={pathname === item.path}
                onNavigate={onNavigate}
              />
            )
          )}
        </div>
      ))}
    </nav>
  );
}
