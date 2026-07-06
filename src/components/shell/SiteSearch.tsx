import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { searchPages } from "@/lib/search";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// Поиск в шапке. По брифу: «не оставлять немую кнопку» — реализован простой
// клиентский поиск по заголовкам страниц (не заглушка). Фильтр — из @/lib/search
// (общий с мобильным меню).

export function SiteSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const results = searchPages(query);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const goTo = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Поиск по сайту"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? <X /> : <Search />}
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={close} aria-hidden />
          <div className="absolute right-0 top-11 z-50 w-80 rounded-lg border bg-popover p-2 shadow-md">
            <input
              ref={inputRef}
              type="text"
              aria-label="Поиск по страницам"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") close();
                if (e.key === "Enter" && results[0]) goTo(results[0].path);
              }}
              placeholder="Поиск по страницам…"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {query.trim() && (
              <ul className="mt-2 max-h-72 overflow-y-auto">
                {results.length ? (
                  results.map((r) => (
                    <li key={r.path}>
                      <button
                        type="button"
                        onClick={() => goTo(r.path)}
                        className={cn(
                          "block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        )}
                      >
                        {r.title}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-muted-foreground">
                    Ничего не найдено
                  </li>
                )}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
