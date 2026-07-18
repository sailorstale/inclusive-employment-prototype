import { Outlet, useLocation } from "react-router-dom";
import { getTrack } from "@/data/nav";
import { cn } from "@/lib/utils";
import { TocProvider, useToc } from "@/lib/toc";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { SidebarNav } from "./SidebarNav";
import { TocRail } from "./TocRail";
import { BackToTop } from "./BackToTop";
import { SkipLink } from "./SkipLink";
import { ComponentTagsToggle } from "./ComponentTagsToggle";
import { EditorInspector } from "@/editor/EditorInspector";
import { CommentsLayer } from "@/editor/CommentsLayer";
import { CommentsPanel } from "@/editor/CommentsPanel";
import { EditorDock } from "@/editor/EditorDock";
import {
  EditorToast,
  CommentsToast,
  StoreModeBanner,
} from "@/editor/EditorNotices";

// Общая оболочка (00 — Карта сайта и навигация): шапка везде; боковое меню трека
// (десктоп — рейл, узкий экран — раскрывашка); крошки кроме главной; оглавление
// «На этой странице» в правом рейле (xl) со scrollspy; кнопка «Наверх»; подвал.
// Доступность: skip-link «К содержимому» + <main id="main-content"> + лендмарки.

export function Layout() {
  return (
    <TocProvider>
      <div className="flex min-h-screen flex-col">
        <SkipLink />
        <AppHeader />
        <StoreModeBanner />
        <LayoutBody />
        <AppFooter />
        <EditorInspector />
        <CommentsLayer />
        <CommentsPanel />
        <EditorDock />
        <EditorToast />
        <CommentsToast />
        <ComponentTagsToggle />
      </div>
    </TocProvider>
  );
}

function LayoutBody() {
  const { pathname } = useLocation();
  const track = getTrack(pathname);
  const { items } = useToc();
  const hasToc = items.length > 0;
  // Витрина компонентов (/unify) — не трек, но показываем её в полном
  // трёхколоночном каркасе сайта (левое меню + контент + оглавление).
  const framed = track !== null || pathname === "/unify";

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 scroll-mt-20 focus:outline-none"
    >
      {framed ? (
        <div
          className={cn(
            "mx-auto grid max-w-7xl grid-cols-1 gap-x-10 gap-y-6 px-6 py-8",
            "lg:grid-cols-[16rem_minmax(0,1fr)]",
            hasToc && "xl:grid-cols-[16rem_minmax(0,1fr)_14rem]",
          )}
        >
          {/* Боковое меню трека — десктоп: липкий рейл */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-4">
              <SidebarNav />
            </div>
          </aside>

          {/* Контентная колонка */}
          <div className="min-w-0">
            <div className="space-y-12">
              <Outlet />
            </div>
          </div>

          {/* Оглавление «На этой странице» — десктоп (xl): липкий рейл со scrollspy */}
          {hasToc ? (
            <aside className="hidden xl:block">
              <TocRail />
            </aside>
          ) : null}
        </div>
      ) : (
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="space-y-12">
            <Outlet />
          </div>
        </div>
      )}

      {framed ? <BackToTop /> : null}
    </main>
  );
}
