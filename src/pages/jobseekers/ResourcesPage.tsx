import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { PageToc } from "@/components/PageToc";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Card, CardGrid } from "@/components/Card";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/Callout";
import { RelatedLinks } from "@/components/RelatedLinks";
import { Paragraph } from "@/components/Prose";
import { SmartLink } from "@/components/SmartLink";

// 28 — Полезные материалы (справочник/хаб внешних ссылок трека «Для соискателей»). Контент дословно.
export function ResourcesPage() {
  return (
    <>
      <PageHero
        variant="leaf"
        title="Полезные материалы"
        lead="Гайды, подкасты, инструкции — то, что не вошло в основные разделы, но может пригодиться. По конкретному запросу."
      />

      <ImagePlaceholder
        ratio="16/9"
        caption="Полка материалов: гайды, подкасты и инструкции по доступности."
      />

      <PageToc
        items={[
          { label: "Гиды", anchor: "#res-guides" },
          { label: "Подкасты и интервью", anchor: "#res-podcasts" },
          { label: "Материалы по доступности", anchor: "#res-a11y" },
        ]}
      />

      <ContentSection>
        <Paragraph>
          Все материалы ниже — на едином архиве{" "}
          <SmartLink to="https://inclusion.yandex.ru/">
            inclusion.yandex.ru
          </SmartLink>
          ; здесь они разложены по темам: гиды, подкасты и интервью,
          доступность.
        </Paragraph>
      </ContentSection>

      <ContentSection anchor="res-guides" title="Гиды">
        <CardGrid cols={2}>
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">Гайд</Badge>}
            title="Как начать работать из дома: гид по удалённой работе"
          />
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">PDF</Badge>}
            title="Как общаться со слабослышащими коллегами (PDF)"
          />
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">PDF</Badge>}
            title="Как общаться с коллегами с особенностями развития (PDF)"
          />
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">Гайд</Badge>}
            title="Как устроен инклюзивный наём в Яндексе"
          />
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">Гайд</Badge>}
            title="«Поиск работы вместе с НКО» — программа фонда «Помощь рядом»"
          />
        </CardGrid>
      </ContentSection>

      <ContentSection anchor="res-podcasts" title="Подкасты и интервью">
        <CardGrid cols={2}>
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">Подкаст</Badge>}
            title="Подкаст «Доступность плюс» — большой разговор про опыт инклюзивного найма"
          />
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">Подкаст</Badge>}
            title="Интервью с руководителем направления (Гульнара Горишняя)"
          />
        </CardGrid>
      </ContentSection>

      <ContentSection anchor="res-a11y" title="Материалы по доступности">
        <CardGrid cols={2}>
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">Гайд</Badge>}
            title="Инструкции для незрячих пользователей"
          />
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">Гайд</Badge>}
            title="«Доступность в один клик»"
          />
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">Гайд</Badge>}
            title="Исследование настроек доступности"
          />
          <Card
            link="external"
            to="https://inclusion.yandex.ru/"
            badge={<Badge tone="neutral">Видео</Badge>}
            title="Мультфильм про технологии доступности"
          />
        </CardGrid>
      </ContentSection>

      <Callout variant="info" title="Где это всё лежит">
        Основной архив — на{" "}
        <SmartLink to="https://inclusion.yandex.ru/">
          inclusion.yandex.ru
        </SmartLink>
        . В этом разделе — только то, что прямо полезно соискателю. Часть
        материалов адресована шире — командам компаний и НКО — для них есть
        отдельные разделы.
      </Callout>

      <Callout variant="info" title="Если не нашли нужного">
        Напишите на{" "}
        <SmartLink to="mailto:inclusion@yandex-team.ru">
          inclusion@yandex-team.ru
        </SmartLink>{" "}
        или предложите тему через{" "}
        <SmartLink to="/feedback">форму обратной связи</SmartLink>.
      </Callout>

      <RelatedLinks
        items={[
          {
            title: "Инструменты для работы",
            to: "/jobseekers/tools",
            description: "Резюме, собеседование, документы — по этапам пути.",
          },
          {
            title: "Гид по удалённым профессиям",
            to: "/jobseekers/guide",
            description:
              "Пошаговый курс Яндекса: как начать работать из дома.",
          },
          {
            title: "Трудоустройство в Яндексе",
            to: "/yandex-jobs",
            description: "Как Яндекс устроил инклюзивный наём у себя.",
          },
        ]}
      />
    </>
  );
}
