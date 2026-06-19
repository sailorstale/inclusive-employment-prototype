import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { Card, CardGrid } from "@/components/Card";

// 23 — Для соискателей (хаб трека). Контент дословно.
// Хаб-навигация: герой-блок + пять карточек-входов, больше ничего (по спеке).
export function JobseekersHubPage() {
  return (
    <>
      <PageHero
        variant="track-hub"
        title="Для соискателей"
        lead="Для тех, кто ищет работу — людей с инвалидностью · людей старшего возраста · всех, кто впервые пробует удалёнку. Пять разных по природе разделов — выберите тот, что вам сейчас нужен."
      />

      <ContentSection>
        <CardGrid cols={2}>
          <Card
            link="internal"
            to="/jobseekers/guide"
            title="Гид по удалённым профессиям"
            description="4 модуля Яндекса: что такое удалёнка, цифровая грамотность, какие профессии бывают, как защититься от мошенников и оформить документы."
          />
          <Card
            link="internal"
            to="/jobseekers/tools"
            title="Инструменты для работы"
            description="По этапам пути: написать резюме, пройти собеседование, разобраться в документах, доехать до работы, работать в команде."
          />
          <Card
            link="internal"
            to="/jobseekers/employers"
            title="Куда устроиться в Яндекс"
            description="Шесть направлений Яндекса с конкретными адаптациями: офисы, такси, доставка, склад, удалёнка, дарксторы."
          />
          <Card
            link="internal"
            to="/jobseekers/stories"
            title="Истории коллег"
            description="Реальные сотрудники Яндекса с инвалидностью в реальных профессиях. Не «истории преодоления» — просто рассказ о работе."
          />
          <Card
            link="internal"
            to="/jobseekers/resources"
            title="Полезные материалы"
            description="Гайды по удалёнке, подкаст «Доступность плюс», инструкции для незрячих, материалы по доступности."
          />
        </CardGrid>
      </ContentSection>
    </>
  );
}
