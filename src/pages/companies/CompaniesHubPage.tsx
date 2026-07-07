import { PageHero } from "@/components/PageHero";
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

      <CardGrid cols={2}>
        <Card
          link="internal"
          to="/general/start"
          title="Реалии и мифы"
          description="Реалии, мифы, плюсы и риски. Для тех, кто ещё не решил."
        />
        <Card
          link="internal"
          to="/general/how"
          title="Как устроен наём"
          description="Кто участвует в инклюзивном найме, какими путями люди находят работу, где искать кандидатов и зачем нужна НКО. Общая картина процесса."
        />
        <Card
          link="internal"
          to="/general/legal"
          title="Правовые основы"
          description="Договор, ИПРА, льготы, квоты, формы занятости. По конкретному вопросу."
        />
        <Card
          link="internal"
          to="/companies/hire"
          title="Наём по шагам"
          description="Воркфлоу от выбора вакансии до сопровождения. По своему проекту найма."
        />
        <Card
          link="internal"
          to="/general/team"
          title="Команда и коммуникация"
          description="Как говорить с коллегой с инвалидностью. Карточки, ситуации, памятки."
        />
      </CardGrid>
    </>
  );
}
