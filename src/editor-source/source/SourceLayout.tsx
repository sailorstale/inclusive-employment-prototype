import { Outlet } from "react-router-dom";
import { SkipLink } from "@/components/shell/SkipLink";
import { EditorProvider } from "@/editor-source/EditorProvider";
import { CommentsProvider } from "@/editor-source/CommentsProvider";
import { EditorDock } from "@/editor-source/EditorDock";
import { EditorToast, StoreModeBanner } from "@/editor-source/EditorNotices";
import { SourceTopBar } from "./SourceTopBar";

// Оболочка инструмента «Редактура источника» (/source, Поток H). Отдельный
// ПРОДУКТ: своя шапка + две колонки (реальный Google-док слева, наш
// редактируемый источник справа). Собственные провайдеры со scope="source" —
// правки и комментарии инструмента хранятся ОТДЕЛЬНО от сайта (свои файлы на
// сервере), не смешиваются и не теряются. Корневые провайдеры (сайт) остаются
// выше по дереву, но здесь их перекрывают источниковые.
export function SourceLayout() {
  return (
    <EditorProvider scope="source">
      <CommentsProvider scope="source">
        <SourceShell />
      </CommentsProvider>
    </EditorProvider>
  );
}

function SourceShell() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SkipLink />
      <SourceTopBar />
      <StoreModeBanner />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-0 flex-1 overflow-hidden focus:outline-none"
      >
        <Outlet />
      </main>
      {/* EditorInspector — не плавающий, а третья колонка внутри SourcePage (docked) */}
      <EditorDock />
      <EditorToast />
    </div>
  );
}
