import { Outlet, useLocation } from "react-router-dom";
import { getTrack, routeTitles } from "@/data/nav";
import { cn } from "@/lib/utils";
import { TocProvider, useToc } from "@/lib/toc";
import { PageHeroProvider, usePageHeroSlot } from "@/lib/pageHero";
import { AppHeader } from "./AppHeader";
import { PageHeroBand } from "./PageHeroBand";
import { AppFooter } from "./AppFooter";
import { SidebarNav } from "./SidebarNav";
import { TocRail } from "./TocRail";
import { BackToTop } from "./BackToTop";
import { SkipLink } from "./SkipLink";
import { ComponentTagsToggle } from "./ComponentTagsToggle";
import { BlocksRail } from "@/editor-source/site/BlocksRail";
import { EditorInspector } from "@/editor/EditorInspector";
import { EditorToast, StoreModeBanner } from "@/editor/EditorNotices";

// Общая оболочка (00 — Карта сайта и навигация): баннер с фото вверху (в нём
// шапка сайта и заголовок H1 страницы), под ним контент, который наезжает на
// низ баннера; боковое меню трека слева; оглавление «На этой странице» в правом
// рейле (xl) со scrollspy; кнопка «Наверх»; подвал.
// Доступность: skip-link «К содержимому» + <main id="main-content"> + лендмарки.

// Служебные страницы редакторского слоя — не сайт: у них своя шапка-полоса
// без баннера и свой заголовок в теле страницы.
const TOOL_ROUTES = ["/changes", "/inventory", "/catalog", "/blocks"];

export function Layout() {
  return (
    <PageHeroProvider>
      <TocProvider>
        <div className="flex min-h-screen flex-col">
          <SkipLink />
          <StoreModeBanner />
          <LayoutBody />
          <AppFooter />
          <EditorInspector />
          <EditorToast />
          <ComponentTagsToggle />
          {/* Карта блоков сбоку: живёт в обвязке, поэтому переживает переход
              со страницы на страницу и не закрывается при переходе. */}
          <BlocksRail />
        </div>
      </TocProvider>
    </PageHeroProvider>
  );
}

function LayoutBody() {
  const { pathname } = useLocation();
  const track = getTrack(pathname);
  const { items } = useToc();
  const { data: hero } = usePageHeroSlot();
  const hasToc = items.length > 0;
  // Витрина компонентов (/unify) — не трек, но показываем её в полном
  // трёхколоночном каркасе сайта (левое меню + контент + оглавление).
  const framed = track !== null || pathname === "/unify";
  const isTool = TOOL_ROUTES.includes(pathname);

  // Заголовок баннера: его объявляет страница через <PageHero>. Если страница
  // своего заголовка не дала — берём подпись маршрута из карты навигации.
  const title = hero?.title ?? routeTitles[pathname];

  return (
    <>
      {isTool ? <AppHeader /> : null}

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 scroll-mt-20 focus:outline-none"
      >
        {isTool ? null : (
          <PageHeroBand
            title={title}
            eyebrow={hero?.eyebrow}
            cover={hero?.cover}
            size={hero?.size}
            editable={Boolean(hero?.title)}
          />
        )}

        {/* Контент наезжает на низ баннера на 80 px — как в макете. */}
        <div
          className={cn(
            "relative z-10 bg-background",
            isTool ? "" : "-mt-20 rounded-t-[2rem]",
          )}
        >
          {framed ? (
            <div
              className={cn(
                "mx-auto grid max-w-7xl grid-cols-1 gap-x-10 gap-y-6 px-6 py-10",
                "lg:grid-cols-[16rem_minmax(0,1fr)]",
                hasToc && "xl:grid-cols-[16rem_minmax(0,1fr)_14rem]",
              )}
            >
              {/* Боковое меню трека — десктоп: липкий рейл */}
              <aside className="hidden lg:block">
                <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pb-4">
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
            <div className="mx-auto max-w-5xl px-6 py-10">
              <div className="space-y-12">
                <Outlet />
              </div>
            </div>
          )}
        </div>

        {framed ? <BackToTop /> : null}
      </main>
    </>
  );
}
