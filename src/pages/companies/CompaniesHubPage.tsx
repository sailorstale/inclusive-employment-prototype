import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { Card, CardGrid } from "@/components/Card";

// 02 — Для компаний (хаб трека). Контент дословно.
export function CompaniesHubPage() {
  return (
    <>
      <PageHero
        variant="track-hub"
        title="Для компаний"
        lead="Для собственника · HR · линейного руководителя · юриста и бухгалтера. Выберите ситуацию."
      />

      <ContentSection>
        <CardGrid cols={2}>
          <Card
            link="internal"
            to="/companies/start"
            title="Стоит ли начинать"
            description="Реалии, мифы, плюсы и риски. Для тех, кто ещё не решил."
          />
          <Card
            link="internal"
            to="/companies/legal"
            title="Правила оформления"
            description="Договор, ИПРА, льготы, квоты, формы занятости. По конкретному вопросу."
          />
          <Card
            link="internal"
            to="/companies/hire"
            title="Найм по шагам"
            description="Воркфлоу от выбора вакансии до сопровождения. По своему проекту найма."
          />
          <Card
            link="internal"
            to="/companies/team"
            title="Команда и коммуникация"
            description="Как говорить с коллегой с инвалидностью. Карточки, ситуации, памятки."
          />
        </CardGrid>
      </ContentSection>
    </>
  );
}
