import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  type SidebarItem,
  type SidebarSpec,
  type Track,
  sidebars,
  getTrack,
} from "@/data/nav";
import { useEditor } from "@/editor/EditorProvider";
import { cn } from "@/lib/utils";

// SidebarNav (00 — полная навигация сайта в левом меню). Показывает ВСЕ разделы
// сразу как сворачиваемые группы. Логика раскрытия: «Общая информация» открыта
// всегда; раздел, в котором читатель сейчас, — тоже открыт; остальные свёрнуты
// (можно раскрыть/свернуть кликом по заголовку). Внутри разделов вложенные
// группы (Правовые основы, Наём по шагам) раскрываются на своей ветке.

const SECTION_ORDER: Track[] = ["general", "companies", "ngo", "jobseekers"];

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
          : "text-foreground/75 hover:bg-accent hover:text-foreground",
      )}
    >
      {navLabel(path, label)}
    </Link>
  );
}

/** Пункт второго уровня с раскрываемыми детьми (Правовые основы, Наём по шагам).
 *  Раскрыт, когда читатель на этой ветке; можно свернуть/развернуть кликом. */
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
              : "font-medium text-foreground/85 hover:bg-accent hover:text-foreground",
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

/** Раздел верхнего уровня (Общая информация / Для компаний / …). «Общая» открыта
 *  всегда; текущий раздел раскрывается сам; остальные — кликом. */
function SectionGroup({
  spec,
  pathname,
  alwaysOpen,
  currentSection,
  onNavigate,
}: {
  spec: SidebarSpec;
  pathname: string;
  alwaysOpen: boolean;
  currentSection: boolean;
  onNavigate?: () => void;
}) {
  const { navLabel } = useEditor();
  const [open, setOpen] = React.useState(alwaysOpen || currentSection);

  // На каждом переходе состояние пересчитывается: раскрыт текущий раздел,
  // остальные свёрнуты (Общая — всегда, отдельно). Ручной клик работает, пока
  // читатель на странице; следующая навигация сбрасывает к «текущий + Общая».
  React.useEffect(() => {
    setOpen(currentSection);
  }, [pathname, currentSection]);

  const isOpen = alwaysOpen || open;
  const hubPath = `/${spec.track}`;
  const title = navLabel(hubPath, spec.title);
  const hubActive = pathname === hubPath;

  return (
    <div>
      <div className="flex items-center">
        <Link
          to={hubPath}
          onClick={onNavigate}
          aria-current={hubActive ? "page" : undefined}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            hubActive
              ? "border-l-2 border-brand bg-accent text-brand"
              : "text-foreground hover:bg-accent",
          )}
        >
          {title}
        </Link>
        {alwaysOpen ? null : (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={isOpen ? "Свернуть" : "Развернуть"}
            aria-expanded={isOpen}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </button>
        )}
      </div>
      {isOpen ? (
        <div className="mt-1 space-y-1 border-l border-border/70 pl-2">
          {spec.groups.map((group, gi) => (
            <div key={gi} className="space-y-1">
              {group.label ? (
                <p className="px-3 pb-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                ),
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Полное левое меню: все разделы сайта сразу, с авто-раскрытием текущего. */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const current = getTrack(pathname);

  // Показываем ВСЕ разделы сайта одним статичным деревом: «Общая информация»
  // раскрыта всегда и стоит сверху; трек, в котором читатель сейчас, — тоже
  // раскрыт; остальные треки свёрнуты в строку (раскрываются кликом). Так
  // читатель видит карту целиком, а переключаться между ролями можно и здесь, и
  // через верхнее меню. Меню не зависит от «памяти» — одинаково на всех
  // страницах, что важно для ручной сборки в конструкторе.
  return (
    <nav aria-label="Навигация по сайту" className="space-y-2.5">
      {SECTION_ORDER.map((track) => (
        <SectionGroup
          key={track}
          spec={sidebars[track]}
          pathname={pathname}
          alwaysOpen={track === "general"}
          currentSection={current === track}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
