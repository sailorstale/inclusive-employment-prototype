import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { PersonaCard } from "@/components/PersonaCard";
import { CardGrid } from "@/components/Card";
import { Callout } from "@/components/Callout";
import { Footnote } from "@/components/Prose";
import { SmartLink } from "@/components/SmartLink";
import { RelatedLinks } from "@/components/RelatedLinks";

// 27 — Истории коллег (справочник / витрина историй, трек «Для соискателей»).
// Контент дословно. Карточки рассказов = PersonaCard (00b §2.3).
export function StoriesPage() {
  return (
    <>
      <PageHero
        variant="leaf"
        eyebrow="Справочник"
        title="Истории коллег"
        lead="Реальные сотрудники Яндекса с инвалидностью в реальных профессиях. Это не «истории преодоления» — обычные рассказы людей о том, как они нашли работу и что делают каждый день."
      />

      <Callout variant="info" title="Этичность">
        Заголовки рассказов мы переписываем так, чтобы человек был на первом
        месте, а инвалидность — фактическим обстоятельством. Никаких «удивительных
        историй», никаких «несмотря на».
      </Callout>

      <ContentSection title="Видеорассказы">
        <CardGrid cols={3}>
          <PersonaCard
            name="Гульфия"
            role="Бригадир, склад Яндекс Маркета · слабослышащая"
            description="Видеорассказ о работе на складе в Софьино."
          >
            <Footnote>
              <strong>Формат:</strong> видео · inclusion.yandex.ru
            </Footnote>
          </PersonaCard>
          <PersonaCard
            name="Артём"
            role="Исполнитель, Лавка · ментальные особенности"
            description="Видеорассказ о работе в дарксторе."
          >
            <Footnote>
              <strong>Формат:</strong> видео · inclusion.yandex.ru
            </Footnote>
          </PersonaCard>
          <PersonaCard
            name="Анатолий Попко"
            role="«Иной взгляд на профессию»"
            description="Видеоинтервью о работе и инструментах."
          >
            <Footnote>
              <strong>Формат:</strong> видео · inclusion.yandex.ru
            </Footnote>
          </PersonaCard>
        </CardGrid>
      </ContentSection>

      <ContentSection title="Статьи и посты">
        <CardGrid cols={3}>
          <PersonaCard
            name="Михаил"
            role="Водитель такси, Чита · без слуха"
            description="Рассказ путешественника и таксиста."
          >
            <Footnote>
              <strong>Формат:</strong> статья · inclusion.yandex.ru
            </Footnote>
          </PersonaCard>
          <PersonaCard
            name="Филипп"
            role="Курьер, Яндекс Еда · глухой"
            description="Как устроена работа курьером без звонков."
          >
            <Footnote>
              <strong>Формат:</strong> статья · inclusion.yandex.ru
            </Footnote>
          </PersonaCard>
          <PersonaCard
            name="Семейная пара"
            role="Водители такси, Иркутск · глухие"
            description="Как муж и жена работают в одной службе."
          >
            <Footnote>
              <strong>Формат:</strong> статья · inclusion.yandex.ru
            </Footnote>
          </PersonaCard>
          <PersonaCard
            name="Таня"
            role="IT-стажёр Яндекса"
            description="Как конкурс «Путь к карьере» помог попасть на стажировку."
          >
            <Footnote>
              <strong>Формат:</strong> пост · inclusion.yandex.ru
            </Footnote>
          </PersonaCard>
          <PersonaCard
            name="Незрячие тестировщики"
            role="Тестирование в офисах Яндекса"
            description="Подборка о работе незрячих и слабовидящих сотрудников."
          >
            <Footnote>
              <strong>Формат:</strong> статья · inclusion.yandex.ru
            </Footnote>
          </PersonaCard>
        </CardGrid>
      </ContentSection>

      <Callout variant="info" title="Полный архив">
        Все ~15 историй с фильтрами по сервису, формату и форме инвалидности — на{" "}
        <SmartLink to="https://inclusion.yandex.ru/job">
          inclusion.yandex.ru/job
        </SmartLink>{" "}
        (внешняя ссылка, открывается в новой вкладке), раздел «Познакомьтесь с
        нашими коллегами». Здесь — короткий срез; этот раздел дополняется.
      </Callout>

      <Callout variant="info" title="Если знаете кого-то">
        Если у вас есть история сотрудника, которая могла бы войти сюда, —
        напишите на{" "}
        <SmartLink to="mailto:inclusion@yandex-team.ru">
          inclusion@yandex-team.ru
        </SmartLink>
        .
      </Callout>

      <RelatedLinks
        items={[
          {
            title: "Куда устроиться в Яндекс",
            to: "/jobseekers/employers",
            description: "Шесть направлений с реальными адаптациями.",
          },
          {
            title: "Гид по удалённым профессиям",
            to: "/jobseekers/guide",
            description:
              "Пошаговый курс Яндекса: как начать работать из дома.",
          },
          {
            title: "Полезные материалы",
            to: "/jobseekers/resources",
            description: "Гайды, подкасты и инструкции по теме.",
          },
        ]}
      />
    </>
  );
}
