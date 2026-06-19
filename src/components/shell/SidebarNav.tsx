import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { type SidebarItem, type Track, sidebars } from "@/data/nav";
import { cn } from "@/lib/utils";

// SidebarNav (00b §2.1) — вторичная навигация внутри трека: заголовок = название
// трека, список пунктов, активный подсвечен. У «Компаний» — две раскрываемые
// группы («Правила оформления», «Найм по шагам»). Только на страницах треков.

const leafLink =
  "block rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function LeafItem({
  label,
  path,
  active,
  nested,
}: {
  label: string;
  path: string;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      to={path}
      aria-current={active ? "page" : undefined}
      className={cn(
        leafLink,
        nested && "ml-3",
        active
          ? "border-l-2 border-brand bg-accent font-medium text-brand"
          : "text-foreground/75 hover:bg-accent hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

function GroupItem({
  item,
  pathname,
}: {
  item: SidebarItem;
  pathname: string;
}) {
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
          aria-current={parentActive ? "page" : undefined}
          className={cn(
            leafLink,
            "flex-1",
            parentActive
              ? "border-l-2 border-brand bg-accent font-medium text-brand"
              : "font-medium text-foreground/85 hover:bg-accent hover:text-foreground"
          )}
        >
          {item.label}
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
              nested
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function SidebarNav({ track }: { track: Track }) {
  const { pathname } = useLocation();
  const spec = sidebars[track];

  return (
    <nav aria-label={spec.title} className="space-y-1">
      <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {spec.title}
      </p>
      {spec.items.map((item) =>
        item.children ? (
          <GroupItem key={item.path} item={item} pathname={pathname} />
        ) : (
          <LeafItem
            key={item.path}
            label={item.label}
            path={item.path}
            active={pathname === item.path}
          />
        )
      )}
    </nav>
  );
}
