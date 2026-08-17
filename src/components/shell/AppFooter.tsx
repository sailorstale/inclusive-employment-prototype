import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
import { FOOTER_COLUMNS as columns } from "@/data/nav";

// AppFooter (00 — Карта сайта) — три колонки ссылок по трекам + нижняя строка
// (копирайт + мета-ссылки). Сами колонки живут в карте навигации рядом с
// остальным меню (см. FOOTER_COLUMNS в data/nav.ts): подвал — такая же
// навигация, как шапка и боковое меню.

const footerLink =
  "text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

export function AppFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {col.title}
              </h2>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">© Яндекс, 2026</p>
          <div className="flex items-center gap-6">
            <Link to="/a11y" className={footerLink}>
              Доступность
            </Link>
            <Link to="/feedback" className={footerLink}>
              Обратная связь
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
