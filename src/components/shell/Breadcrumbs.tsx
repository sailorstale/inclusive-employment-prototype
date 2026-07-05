import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getBreadcrumbs } from "@/data/nav";
import { useEditor } from "@/editor/EditorProvider";

// Breadcrumbs (00b §2.1) — «Главная › предки по пути › текущая».
// Предки — ссылки, текущая — без ссылки. На всех страницах кроме #/.

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const { navLabel } = useEditor();
  const crumbs = getBreadcrumbs(pathname);
  if (!crumbs.length) return null;

  return (
    <nav aria-label="Хлебные крошки" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {crumbs.map((crumb, i) => (
          <li key={crumb.path} className="flex items-center gap-1.5">
            {crumb.current ? (
              <span className="font-medium text-foreground" aria-current="page">
                {navLabel(crumb.path, crumb.label)}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="rounded-sm transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {navLabel(crumb.path, crumb.label)}
              </Link>
            )}
            {i < crumbs.length - 1 ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
