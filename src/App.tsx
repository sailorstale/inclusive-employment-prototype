import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Layout } from "./components/shell/Layout";
import { ScrollToTop } from "./components/shell/ScrollToTop";
import { NotFound } from "./pages/NotFound";
import { ChangesPage } from "./editor/ChangesPage";

// Сквозные / лендинг (следующий заход — оставлены как есть)
import { HomePage } from "./pages/HomePage";
import { GlossaryPage } from "./pages/GlossaryPage";
import { YandexJobsPage } from "./pages/YandexJobsPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { A11yPage } from "./pages/A11yPage";

// Трек «Для компаний» (М1–М5)
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

// Трек «Для НКО» — Основы (дубль М1–М4) + Программа НКО (М6)
import { NgoHubPage } from "./pages/ngo/NgoHubPage";
import { NgoRealityPage } from "./pages/ngo/NgoRealityPage";
import { NgoHowPage } from "./pages/ngo/NgoHowPage";
import { NgoLegalPage } from "./pages/ngo/NgoLegalPage";
import { NgoEthicsPage } from "./pages/ngo/NgoEthicsPage";
import { NgoStartPage } from "./pages/ngo/NgoStartPage";
import { NgoCandidatesPage } from "./pages/ngo/NgoCandidatesPage";
import { NgoEmployersPage } from "./pages/ngo/NgoEmployersPage";
import { NgoSupportPage } from "./pages/ngo/NgoSupportPage";
import { NgoScalePage } from "./pages/ngo/NgoScalePage";
import { NgoFundingPage } from "./pages/ngo/NgoFundingPage";

// Трек «Для соискателей» (следующий заход — оставлен как есть)
import { JobseekersHubPage } from "./pages/jobseekers/JobseekersHubPage";
import { GuidePage } from "./pages/jobseekers/GuidePage";
import { ToolsPage } from "./pages/jobseekers/ToolsPage";
import { JobseekersEmployersPage } from "./pages/jobseekers/JobseekersEmployersPage";
import { StoriesPage } from "./pages/jobseekers/StoriesPage";
import { ResourcesPage } from "./pages/jobseekers/ResourcesPage";

export default function App() {
  return (
    <TooltipProvider delayDuration={150}>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />

          {/* Для компаний */}
          <Route path="/companies" element={<CompaniesHubPage />} />
          <Route path="/companies/start" element={<CompaniesStartPage />} />
          <Route path="/companies/how" element={<CompaniesHowPage />} />
          <Route path="/companies/legal" element={<LegalHubPage />} />
          <Route path="/companies/legal/contract" element={<ContractPage />} />
          <Route path="/companies/legal/benefits" element={<BenefitsPage />} />
          <Route path="/companies/legal/quotas" element={<QuotasPage />} />
          <Route path="/companies/legal/status" element={<StatusPage />} />
          <Route path="/companies/legal/faq" element={<FaqPage />} />
          <Route path="/companies/hire" element={<HireHubPage />} />
          <Route path="/companies/hire/step-1" element={<Step1Page />} />
          <Route path="/companies/hire/step-2" element={<Step2Page />} />
          <Route path="/companies/hire/step-3" element={<Step3Page />} />
          <Route path="/companies/hire/step-4" element={<Step4Page />} />
          <Route path="/companies/hire/step-5" element={<Step5Page />} />
          <Route path="/companies/hire/step-6" element={<Step6Page />} />
          <Route path="/companies/team" element={<TeamPage />} />

          {/* Для НКО */}
          <Route path="/ngo" element={<NgoHubPage />} />
          <Route path="/ngo/reality" element={<NgoRealityPage />} />
          <Route path="/ngo/how" element={<NgoHowPage />} />
          <Route path="/ngo/legal" element={<NgoLegalPage />} />
          <Route path="/ngo/ethics" element={<NgoEthicsPage />} />
          <Route path="/ngo/start" element={<NgoStartPage />} />
          <Route path="/ngo/candidates" element={<NgoCandidatesPage />} />
          <Route path="/ngo/employers" element={<NgoEmployersPage />} />
          <Route path="/ngo/support" element={<NgoSupportPage />} />
          <Route path="/ngo/scale" element={<NgoScalePage />} />
          <Route path="/ngo/funding" element={<NgoFundingPage />} />

          {/* Для соискателей */}
          <Route path="/jobseekers" element={<JobseekersHubPage />} />
          <Route path="/jobseekers/guide" element={<GuidePage />} />
          <Route path="/jobseekers/tools" element={<ToolsPage />} />
          <Route
            path="/jobseekers/employers"
            element={<JobseekersEmployersPage />}
          />
          <Route path="/jobseekers/stories" element={<StoriesPage />} />
          <Route path="/jobseekers/resources" element={<ResourcesPage />} />

          {/* Сквозные */}
          <Route path="/changes" element={<ChangesPage />} />
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
