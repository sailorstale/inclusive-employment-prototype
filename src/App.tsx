import { Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Layout } from "./components/shell/Layout";
import { ScrollToTop } from "./components/shell/ScrollToTop";
import { NotFound } from "./pages/NotFound";
import { ChangesPage } from "./editor/ChangesPage";
import { InventoryPage } from "./editor/InventoryPage";
import { CatalogPage } from "./editor/CatalogPage";
import { KitchenSinkPage } from "./pages/figma/KitchenSinkPage";
import { ComponentsPage } from "./pages/figma/ComponentsPage";
// Инструмент «Редактура источника» — перенесён из ветки-песочницы островом
// (собственная копия движка правок в editor-source/, сайтовый редактор не задет).
import { SourceLayout } from "./editor-source/source/SourceLayout";
import { SourcePage } from "./editor-source/source/SourcePage";

// Сквозные / лендинг (следующий заход — оставлены как есть)
import { HomePage } from "./pages/HomePage";
import { GlossaryPage } from "./pages/GlossaryPage";
import { YandexJobsPage } from "./pages/YandexJobsPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { A11yPage } from "./pages/A11yPage";

// Общая база М1–М4 (раздел «Общая информация») + трек «Для компаний» (М5).
// Страницы общей базы физически лежат в pages/companies/ (исторически), но
// монтируются под /general/* и служат обоим ролевым трекам.
import { CompaniesHubPage } from "./pages/companies/CompaniesHubPage";
import { CompaniesStartPage } from "./pages/companies/CompaniesStartPage";
import { CompaniesHowPage } from "./pages/companies/CompaniesHowPage";
import { LegalHubPage } from "./pages/companies/LegalHubPage";
import { ContractPage } from "./pages/companies/ContractPage";
import { BenefitsPage } from "./pages/companies/BenefitsPage";
import { QuotasPage } from "./pages/companies/QuotasPage";
import { StatusPage } from "./pages/companies/StatusPage";
import { FaqPage } from "./pages/companies/FaqPage";
import { HireHubPage } from "./pages/companies/HireHubPage";
import { Step1Page } from "./pages/companies/Step1Page";
import { Step2Page } from "./pages/companies/Step2Page";
import { Step3Page } from "./pages/companies/Step3Page";
import { Step4Page } from "./pages/companies/Step4Page";
import { Step5Page } from "./pages/companies/Step5Page";
import { Step6Page } from "./pages/companies/Step6Page";
import { TeamPage } from "./pages/companies/TeamPage";

// Трек «Для НКО» — Программа НКО (М6). Общая база М1–М4 — в разделе
// «Общая информация» (/general/*), НКО-дубли удалены.
import { NgoHubPage } from "./pages/ngo/NgoHubPage";
import { NgoStartPage } from "./pages/ngo/NgoStartPage";
import { NgoCandidatesPage } from "./pages/ngo/NgoCandidatesPage";
import { NgoEmployersPage } from "./pages/ngo/NgoEmployersPage";
import { NgoSupportPage } from "./pages/ngo/NgoSupportPage";
import { NgoScalePage } from "./pages/ngo/NgoScalePage";
import { NgoFundingPage } from "./pages/ngo/NgoFundingPage";

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
          <Route path="/source/:moduleId" element={<SourcePage />} />
        </Route>


        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />

          {/* Общая информация — общая база М1–М4 (один комплект страниц) */}
          <Route
            path="/general"
            element={<Navigate to="/general/start" replace />}
          />
          <Route path="/general/start" element={<CompaniesStartPage />} />
          <Route path="/general/how" element={<CompaniesHowPage />} />
          <Route path="/general/legal" element={<LegalHubPage />} />
          <Route path="/general/legal/contract" element={<ContractPage />} />
          <Route path="/general/legal/benefits" element={<BenefitsPage />} />
          <Route path="/general/legal/quotas" element={<QuotasPage />} />
          <Route path="/general/legal/status" element={<StatusPage />} />
          <Route path="/general/legal/faq" element={<FaqPage />} />
          <Route path="/general/team" element={<TeamPage />} />

          {/* Для компаний (М5 — Наём по шагам) */}
          <Route path="/companies" element={<CompaniesHubPage />} />
          <Route path="/companies/hire" element={<HireHubPage />} />
          <Route path="/companies/hire/step-1" element={<Step1Page />} />
          <Route path="/companies/hire/step-2" element={<Step2Page />} />
          <Route path="/companies/hire/step-3" element={<Step3Page />} />
          <Route path="/companies/hire/step-4" element={<Step4Page />} />
          <Route path="/companies/hire/step-5" element={<Step5Page />} />
          <Route path="/companies/hire/step-6" element={<Step6Page />} />

          {/* Для НКО (М6 — Программа НКО) */}
          <Route path="/ngo" element={<NgoHubPage />} />
          <Route path="/ngo/start" element={<NgoStartPage />} />
          <Route path="/ngo/candidates" element={<NgoCandidatesPage />} />
          <Route path="/ngo/employers" element={<NgoEmployersPage />} />
          <Route path="/ngo/support" element={<NgoSupportPage />} />
          <Route path="/ngo/scale" element={<NgoScalePage />} />
          <Route path="/ngo/funding" element={<NgoFundingPage />} />

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
