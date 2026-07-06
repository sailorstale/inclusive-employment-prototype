import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { PageToc } from "@/components/PageToc";
import { Card, CardGrid } from "@/components/Card";
import { StepsShelf } from "@/components/StepsShelf";
import { Callout } from "@/components/Callout";
import { CtaButton } from "@/components/PromoBanner";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { RelatedLinks } from "@/components/RelatedLinks";
import { Paragraph } from "@/components/Prose";
import { SmartLink } from "@/components/SmartLink";
import {
  Users,
  HeartHandshake,
  Briefcase,
  Compass,
  MonitorSmartphone,
  MapPin,
  ListChecks,
} from "lucide-react";

// 24 — Гид по удалённым профессиям (витрина к внешнему курсу Яндекса,
// трек «Для соискателей»). Контент дословно.
export function GuidePage() {
  return (
    <>
      <PageHero
        variant="leaf"
        title="Гид по удалённым профессиям"
        lead="«Как начать работать из дома» — пошаговый курс Яндекса с нуля. Что такое удалёнка, какие профессии бывают, какие программы нужны и где искать работу. Для всех, кто хочет начать работать удалённо."
      />

      <ImagePlaceholder caption="Иллюстрация: человек за домашним рабочим местом — обложка гида по удалённой работе." />

      <PageToc
        items={[
          { label: "Кому это будет полезно", anchor: "#guide-who" },
          { label: "Из чего состоит курс", anchor: "#guide-what" },
          { label: "Что вы получите", anchor: "#guide-help" },
        ]}
      />

      <ContentSection anchor="guide-who" title="Кому это будет полезно">
        <CardGrid cols={3}>
          <Card
            link="none"
            icon={<Users />}
            description="Всем, кто хочет работать удалённо, но не знает, с чего начать."
          />
          <Card
            link="none"
            icon={<HeartHandshake />}
            description="Людям с инвалидностью и особенностями здоровья, которые ищут подходящие график и условия работы."
          />
          <Card
            link="none"
            icon={<Briefcase />}
            description="Людям старшего возраста, желающим найти новые возможности для работы и подработки."
          />
        </CardGrid>
      </ContentSection>

      <ContentSection
        anchor="guide-what"
        title="Из чего состоит курс"
        lead="Четыре модуля, которые проходят по порядку — от азов удалёнки до пошагового плана выхода на работу."
      >
        <StepsShelf
          link="non-link"
          cols={2}
          steps={[
            {
              number: "1",
              eyebrow: "Модуль 1",
              title: "Всё об удалённой работе",
              description: "Что такое удалённая работа и кому она подходит.",
            },
            {
              number: "2",
              eyebrow: "Модуль 2",
              title: "База удалённого специалиста",
              description:
                "Цифровая грамотность, инструменты для работы и как организовать себя.",
            },
            {
              number: "3",
              eyebrow: "Модуль 3",
              title: "Какие удалённые профессии бывают",
              description:
                "Каталог профессий с описаниями, зарплатами и тем, как в них начать.",
            },
            {
              number: "4",
              eyebrow: "Модуль 4",
              title: "Как начать работать. Первые шаги",
              description:
                "Этапы трудоустройства, документы и налоги, защита от мошенников, пошаговый план.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection
        anchor="guide-help"
        title="Что вы получите"
        lead="Удалённая работа реальна, даже если у вас нет специального образования или опыта."
      >
        <Callout variant="highlight">
          Разберётесь, что такое удалённая работа и подходит ли она вам.
        </Callout>

        <CardGrid cols={2}>
          <Card
            link="none"
            icon={<Compass />}
            description="Узнаете, какие профессии можно освоить без опыта."
          />
          <Card
            link="none"
            icon={<MonitorSmartphone />}
            description="Поймёте, какие программы и сервисы нужны для удалённой работы."
          />
          <Card
            link="none"
            icon={<MapPin />}
            description="Поймёте, как и где искать онлайн-вакансии."
          />
          <Card
            link="none"
            icon={<ListChecks />}
            description="Получите чёткий пошаговый план действий для старта."
          />
        </CardGrid>

        <div className="mt-2">
          <CtaButton
            label="Начать курс"
            to="https://inclusion.yandex.ru/employmentguide"
          />
        </div>

        <Paragraph>
          Гид — самостоятельный интерактивный курс Яндекса: карточки, чек-листы и
          задания. Мы не переписываем и не дублируем его, а открываем оригинал в
          новой вкладке на{" "}
          <SmartLink to="https://inclusion.yandex.ru/employmentguide">
            inclusion.yandex.ru/employmentguide
          </SmartLink>
          .
        </Paragraph>
      </ContentSection>

      <Callout variant="info" title="Если сейчас не до полного курса">
        Загляните в{" "}
        <SmartLink to="/jobseekers/tools">«Инструменты для работы»</SmartLink> —
        отдельные инструменты под конкретные задачи: написать резюме,
        подготовиться к собеседованию, разобрать договор.
      </Callout>

      <RelatedLinks
        items={[
          {
            title: "Инструменты для работы",
            to: "/jobseekers/tools",
            description: "Резюме, собеседование, документы — по этапам пути.",
          },
          {
            title: "Куда устроиться в Яндекс",
            to: "/jobseekers/employers",
            description: "Шесть направлений с реальными адаптациями.",
          },
          {
            title: "Истории коллег",
            to: "/jobseekers/stories",
            description: "Как работают сотрудники с инвалидностью.",
          },
        ]}
      />
    </>
  );
}
