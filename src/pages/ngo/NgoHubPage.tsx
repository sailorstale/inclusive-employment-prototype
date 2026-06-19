import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { Card, CardGrid } from "@/components/Card";
import { Callout } from "@/components/Callout";
import { SmartLink } from "@/components/SmartLink";
import { GlossaryTerm } from "@/components/GlossaryTerm";

// 16 — Для НКО (хаб трека «Для НКО»). Контент дословно.
export function NgoHubPage() {
  return (
    <>
      <PageHero
        variant="track-hub"
        title="Для НКО"
        lead="Для специалистов НКО, помогающих людям с инвалидностью найти работу. Шесть задач — от запуска направления до финансирования программы. Заходите с той, где вы сейчас."
      />

      {/* Сетка из 6 карточек-задач — каждая ведёт на свой раздел трека */}
      <ContentSection title="Шесть задач трека">
        <CardGrid cols={3}>
          <Card
            link="internal"
            to="/ngo/start"
            title="Запустить программу"
            description="Решить, нужна ли программа вообще; собрать команду; проанализировать свою аудиторию; привлечь внешнюю."
          />
          <Card
            link="internal"
            to="/ngo/candidates"
            title="Работать с соискателем"
            description="Первичное интервью, профориентация, подбор вакансии, подготовка к собеседованию."
          />
          <Card
            link="internal"
            to="/ngo/employers"
            title="Выходить на работодателей"
            description="Найти подходящих, провести первый контакт, презентовать кандидата, ответить на возражения."
          />
          <Card
            link="internal"
            to="/ngo/support"
            title="Сопровождать сотрудника"
            description="Выход на работу, первые недели, кризис-менеджмент, профилактика выгорания."
          />
          <Card
            link="internal"
            to="/ngo/scale"
            title="Развивать и масштабировать"
            description="Дорожная карта, новая география, новая форма инвалидности, передача опыта."
          />
          <Card
            link="internal"
            to="/ngo/funding"
            title="Финансировать программу"
            description="Из чего складывается бюджет, как писать заявку на грант, какие есть грантодатели."
          />
        </CardGrid>
      </ContentSection>

      <Callout variant="info" title="НКО сопровождает, а не трудоустраивает.">
        НКО — не кадровое агентство и не благотворительность. Реальная воронка
        программы — 10–20%, и это нормально. Главная задача — не «трудоустроить
        любой ценой», а выстроить отношения между соискателем и работодателем,
        которые продолжатся без вас. Это и есть{" "}
        <GlossaryTerm term="Сопровождаемое трудоустройство">
          сопровождаемое трудоустройство
        </GlossaryTerm>{" "}
        — НКО сопровождает, а не трудоустраивает. Подробнее — в «
        <SmartLink to="/ngo/start">Запустить программу</SmartLink>».
      </Callout>

      <Callout variant="info" title="Что пригодится из других треков.">
        Материал из «<SmartLink to="/companies/start">Стоит ли начинать</SmartLink>»
        и «<SmartLink to="/companies/team">Команды и коммуникации</SmartLink>» в
        разделе «Для компаний» — рабочий инструмент в разговоре с
        работодателем-партнёром. Соискателю можно отправлять ссылки в{" "}
        <SmartLink to="/jobseekers">раздел «Для соискателей»</SmartLink>.
      </Callout>
    </>
  );
}
