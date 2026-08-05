import { Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Layout } from "./components/shell/Layout";
import { ScrollToTop } from "./components/shell/ScrollToTop";
import { NotFound } from "./pages/NotFound";
import { ChangesPage } from "./editor/ChangesPage";
import { InventoryPage } from "./editor/InventoryPage";
import { BlocksPage } from "./editor-source/site/BlocksPage";
import { CatalogPage } from "./editor/CatalogPage";
import { KitchenSinkPage } from "./pages/figma/KitchenSinkPage";
import { ComponentsPage } from "./pages/figma/ComponentsPage";
// Инструмент «Редактура источника» — перенесён из ветки-песочницы островом
// (собственная копия движка правок в editor-source/, сайтовый редактор не задет).
import { SourceLayout } from "./editor-source/source/SourceLayout";
import { SourcePage } from "./editor-source/source/SourcePage";
import { SamplePage } from "./editor-source/source/SamplePage";
import { SitePagePreview } from "./editor-source/site/SitePagePreview";

// Сквозные / лендинг (следующий заход — оставлены как есть)
import { HomePage } from "./pages/HomePage";
import { GlossaryPage } from "./pages/GlossaryPage";
import { YandexJobsPage } from "./pages/YandexJobsPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { A11yPage } from "./pages/A11yPage";

// Все страницы «Основ» и обоих треков врастают из источника: одна и та же
// GeneratedPage разбирает адрес по карте страниц (pageMap). Написанных руками
// страниц-хабов у треков больше нет — адрес раздела ведёт на его первую
// страницу (решение дизайнера 5 августа 2026).
import { GeneratedPage } from "./editor-source/site/GeneratedPage";

// Трек «Для соискателей» — заглушка (раздел не проработан, без подразделов).
import { JobseekersStubPage } from "./pages/jobseekers/JobseekersStubPage";

export default function App() {
  return (
    <TooltipProvider delayDuration={150}>
      <ScrollToTop />
      <Routes>
        {/*
          Витрина компонентов дизайн-системы из Figma. Вне общего Layout:
          у неё своя обвязка (Hero, сайдбар, оглавление, футер) из той же
          системы. Описание — КОМПОНЕНТЫ.md в корне проекта.
        */}
        {/*
          Витрина компонентов, standalone — своя обвязка (Hero, сайдбар, футер),
          вне общего Layout. /unify — та же витрина, но ВНУТРИ обвязки сайта
          (см. ниже, в группе Layout): там только средняя колонка.
        */}
        <Route path="/figma" element={<KitchenSinkPage />} />

        {/*
          Инструмент «Редактура источника» — три колонки (Google-док клиента,
          спарсенный источник, инспектор правок). Вне общего Layout: своя
          обвязка (SourceLayout с провайдерами правок в скоупе source).
        */}
        <Route element={<SourceLayout />}>
          <Route path="/source" element={<SourcePage />} />
          {/* Статический маршрут ДО параметрического: иначе «sample»
              прочитался бы как id модуля и страница не нашлась бы. */}
          <Route path="/source/sample" element={<SamplePage />} />
          {/* Превью страницы сайта из источника (срез 1). До :moduleId, иначе
              «preview» прочиталось бы как id модуля. */}
          <Route path="/source/preview/*" element={<SitePagePreview />} />
          <Route path="/source/:moduleId" element={<SourcePage />} />
        </Route>


        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />

          {/* Общая информация — общая база М1–М4 (один комплект страниц) */}
          <Route
            path="/general"
            element={<Navigate to="/general/about" replace />}
          />
          {/* «Основы» целиком врастают из источника (перенос М1–4): одна
              GeneratedPage разбирает адрес по карте страниц (pageMap). Главную
              (/) не трогаем — она отдельная. */}
          <Route path="/general/about" element={<GeneratedPage />} />
          <Route path="/general/start" element={<GeneratedPage />} />
          <Route path="/general/how" element={<GeneratedPage />} />
          <Route path="/general/legal" element={<GeneratedPage />} />
          <Route path="/general/legal/contract" element={<GeneratedPage />} />
          <Route path="/general/legal/benefits" element={<GeneratedPage />} />
          <Route path="/general/legal/quotas" element={<GeneratedPage />} />
          <Route path="/general/legal/status" element={<GeneratedPage />} />
          <Route path="/general/legal/faq" element={<GeneratedPage />} />
          <Route path="/general/team" element={<GeneratedPage />} />

          {/* Для компаний (М5 — Наём по шагам). Своей страницы у раздела нет:
              адрес ведёт сразу на первый шаг — так же, как «Основы» ведут на
              «О проекте». Отдельная страница-хаб была лишним экраном между меню
              и материалом: кроме вступления, на ней лежали только карточки-
              ссылки на шаги, а их работу делает меню слева. Вступление трека
              переехало лидом на первый шаг (см. intro в pageMap). Решение
              дизайнера 5 августа 2026.
              Страницы шагов врастают из источника: GeneratedPage по карте. */}
          <Route
            path="/companies"
            element={<Navigate to="/companies/hire/step-1" replace />}
          />
          <Route
            path="/companies/hire"
            element={<Navigate to="/companies/hire/step-1" replace />}
          />
          <Route path="/companies/hire/step-1" element={<GeneratedPage />} />
          <Route path="/companies/hire/step-2" element={<GeneratedPage />} />
          <Route path="/companies/hire/step-3" element={<GeneratedPage />} />
          <Route path="/companies/hire/step-4" element={<GeneratedPage />} />
          <Route path="/companies/hire/step-5" element={<GeneratedPage />} />
          <Route path="/companies/hire/step-6" element={<GeneratedPage />} />

          {/* Для НКО (М6 — Программа НКО). Своей страницы у раздела тоже нет:
              адрес ведёт на «Запустить программу», вступление трека стоит там
              лидом. Модули 6.1–6.3 разрезаны на страницы по своим главам: одним
              полотном они не читались. */}
          <Route
            path="/ngo"
            element={<Navigate to="/ngo/start" replace />}
          />
          <Route path="/ngo/start" element={<GeneratedPage />} />
          <Route path="/ngo/audience" element={<GeneratedPage />} />
          <Route path="/ngo/candidates" element={<GeneratedPage />} />
          <Route path="/ngo/candidates/guidance" element={<GeneratedPage />} />
          <Route path="/ngo/candidates/psychology" element={<GeneratedPage />} />
          <Route path="/ngo/candidates/vacancies" element={<GeneratedPage />} />
          <Route path="/ngo/employers" element={<GeneratedPage />} />
          <Route path="/ngo/employers/talks" element={<GeneratedPage />} />
          <Route path="/ngo/support" element={<GeneratedPage />} />
          <Route path="/ngo/scale" element={<GeneratedPage />} />
          <Route path="/ngo/funding" element={<GeneratedPage />} />

          {/* Для соискателей — заглушка. Подразделов нет; старые адреса
              /jobseekers/* ведут на заглушку, чтобы не было битых ссылок. */}
          <Route path="/jobseekers" element={<JobseekersStubPage />} />
          <Route
            path="/jobseekers/*"
            element={<Navigate to="/jobseekers" replace />}
          />

          {/* Сквозные */}
          <Route path="/changes" element={<ChangesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          {/* Карта блоков: карточки, квизы, цитаты, заготовки, видео, картинки */}
          <Route path="/blocks" element={<BlocksPage />} />
          {/* Витрина компонентов внутри обвязки сайта (только средняя колонка) */}
          <Route path="/unify" element={<ComponentsPage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/yandex-jobs" element={<YandexJobsPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/a11y" element={<A11yPage />} />

          {/* 404 — любой неизвестный путь */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
}
