import { Outlet, useLocation } from "react-router-dom";
import { getTrack } from "@/data/nav";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { SidebarNav } from "./SidebarNav";
import { Breadcrumbs } from "./Breadcrumbs";

// Общая оболочка (00 — Карта сайта): шапка на всех страницах; боковое меню
// только на страницах треков; крошки на всех кроме главной; подвал везде.

export function Layout() {
  const { pathname } = useLocation();
  const track = getTrack(pathname);
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />

      <main className="flex-1">
        {track ? (
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <SidebarNav track={track} />
              </div>
            </aside>
            <div className="min-w-0">
              <Breadcrumbs />
              <div className="space-y-12">
                <Outlet />
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl px-6 py-8">
            {!isHome && <Breadcrumbs />}
            <div className="space-y-12">
              <Outlet />
            </div>
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
