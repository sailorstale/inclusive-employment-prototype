import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { Card, CardGrid } from "@/components/Card";
import { Callout } from "@/components/Callout";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Paragraph, Footnote } from "@/components/Prose";
import { GlossaryTerm } from "@/components/GlossaryTerm";
import { SmartLink } from "@/components/SmartLink";
import { RelatedLinks } from "@/components/RelatedLinks";
import {
  Building2,
  Car,
  Package,
  ShoppingBag,
  Laptop,
  Store,
} from "lucide-react";

// 26 — Куда устроиться в Яндекс (справочник трека «Для соискателей»). Контент дословно.
export function JobseekersEmployersPage() {
  return (
    <>
      <PageHero
        variant="section-hub"
        title="Куда устроиться в Яндекс"
        lead="Шесть направлений Яндекса, где работают сотрудники с инвалидностью. Это не «список вакансий», а карта того, как у одного крупного работодателя устроены адаптации в разных сферах. Если вакансия открыта — отклик подаётся в стандартной форме на сайте Яндекса."
      />

      <ImagePlaceholder caption="Схема: карта направлений Яндекса и адаптации в каждом — офисы, такси, склад, доставка, удалёнка, дарксторы." />

      <ContentSection title="Шесть направлений">
        <Footnote>
          Это краткая выжимка направлений (по одной строке на карточку). Полный
          разбор каждого направления — кто работает, развёрнутый список
          адаптаций по каждой карточке и связанные материалы Яндекса — на
          странице{" "}
          <SmartLink to="/yandex-jobs">«Трудоустройство в Яндексе»</SmartLink>,
          секция «Шесть направлений». Здесь параллельную полную копию не держим.
        </Footnote>

        <CardGrid cols={3}>
          <Card
            link="none"
            icon={<Building2 />}
            title="Офисы"
            description="Дизайнеры, аналитики, кадры, разработчики. Пандусы, регулируемые столы, Брайль на кофепойнтах, кнопки вызова."
          />
          <Card
            link="none"
            icon={<Car />}
            title="Яндекс Go"
            description="Глухие и слабослышащие водители такси. Уведомления вибрацией, чат вместо звонков, РЖЯ-материалы."
          />
          <Card
            link="none"
            icon={<Package />}
            title="Маркет"
            description="Склад в Софьино — глухие и слабослышащие кладовщики и бригадиры. РЖЯ на собеседовании и обучении, световые дорожки, тревожные кнопки."
          />
          <Card
            link="none"
            icon={<ShoppingBag />}
            title="Еда"
            description="Глухие и слабослышащие курьеры. Чат с пользователем всю доставку, уведомление пассажира заранее."
          />
          <Card
            link="none"
            icon={<Laptop />}
            title="Крауд"
            description="Незрячие и слабовидящие операторы-рекрутеры и специалисты по разметке. Удалённо, со скринридером, с наставниками."
          />
          <Card
            link="none"
            icon={<Store />}
            title="Лавка"
            description="Исполнители со слуховой и ментальной инвалидностью на дарксторах. Световая система пожарной безопасности, РЖЯ-обучение, сопровождаемое трудоустройство с фондами."
          />
        </CardGrid>
      </ContentSection>

      <Callout
        variant="info"
        title="Пример. Яндекс — не единственный работодатель"
      >
        Яндекс — не единственный работодатель, который нанимает людей с
        инвалидностью. В{" "}
        <SmartLink to="/companies">разделе «Для компаний»</SmartLink> мы
        показываем, как такая работа устроена в принципе — там логика,
        применимая к любой компании. Здесь — конкретные шесть направлений у
        одного из работодателей.
      </Callout>

      <Callout variant="info" title="Как откликнуться">
        <Paragraph>
          Открытые вакансии Яндекса публикуются на{" "}
          <SmartLink to="https://yandex.ru/jobs">yandex.ru/jobs</SmartLink>. Для
          контакта по{" "}
          <GlossaryTerm term="Инклюзивное трудоустройство">
            инклюзивному трудоустройству
          </GlossaryTerm>{" "}
          —{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            <SmartLink to="mailto:jobs-inclusion@yandex-team.ru">
              jobs-inclusion@yandex-team.ru
            </SmartLink>
          </code>
          . Подробнее о компании — блок{" "}
          <SmartLink to="/">«Кто делает сайт»</SmartLink>.
        </Paragraph>
      </Callout>

      <RelatedLinks
        items={[
          {
            title: "Трудоустройство в Яндексе",
            to: "/yandex-jobs",
            description: "Как Яндекс устроил инклюзивный наём у себя.",
          },
          {
            title: "Истории коллег",
            to: "/jobseekers/stories",
            description: "Как работают сотрудники с инвалидностью.",
          },
          {
            title: "Инструменты для работы",
            to: "/jobseekers/tools",
            description: "Резюме, собеседование, документы — по этапам пути.",
          },
        ]}
      />
    </>
  );
}
