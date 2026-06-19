import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { TableOfContents } from "@/components/TableOfContents";
import { Card, CardGrid } from "@/components/Card";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { RelatedLinks } from "@/components/RelatedLinks";
import { Paragraph, Footnote } from "@/components/Prose";
import { SmartLink } from "@/components/SmartLink";
import {
  Sparkles,
  Feather,
  MessageSquare,
  Camera,
  MapPin,
  Car,
  Globe,
} from "lucide-react";

// 25 — Инструменты для работы (справочник трека «Для соискателей»). Контент дословно.
export function ToolsPage() {
  return (
    <>
      <PageHero
        variant="section-hub"
        eyebrow="По этапам пути"
        title="Инструменты для трудоустройства и работы"
        lead="Что соискателю нужно сделать на каждом этапе и какие инструменты могут пригодиться. В основном — продукты Яндекса; в будущем добавятся и не-яндексовские (шаблоны резюме, чек-листы НКО, скринридеры)."
      />

      <ImagePlaceholder
        ratio="16/9"
        caption="Набор инструментов удалёнщика: иконки сервисов по этапам пути — отклик, собеседование, документы, дорога, работа в команде."
      />

      <TableOfContents
        items={[
          { label: "Откликнуться на вакансию", anchor: "#tools-apply" },
          { label: "Подготовиться к собеседованию", anchor: "#tools-interview" },
          { label: "Разобраться в документах", anchor: "#tools-documents" },
          { label: "Доехать до работы", anchor: "#tools-commute" },
          { label: "Работать в команде", anchor: "#tools-teamwork" },
        ]}
      />

      <ContentSection anchor="tools-apply" title="Откликнуться на вакансию">
        <Paragraph>
          <strong>Что нужно сделать:</strong> составить резюме так, чтобы оно
          подходило конкретной вакансии. Упростить сложные формулировки.
          Проверить текст на ошибки.
        </Paragraph>
        <ContentSection level="h3" title="Чем пользоваться">
          <CardGrid cols={2}>
            <Card
              link="none"
              icon={<Sparkles />}
              title="Алиса AI"
              description="Собрать резюме под конкретную вакансию, переформулировать опыт под язык работодателя."
            />
            <Card
              link="none"
              icon={<Feather />}
              title="Редактор с Алисой"
              description="Проверить текст на ошибки, упростить «канцелярские» формулировки."
            />
          </CardGrid>
          <Footnote>
            Алиса не «напишет за вас» — она помогает структурировать то, что у вас
            уже есть.
          </Footnote>
        </ContentSection>
      </ContentSection>

      <ContentSection
        anchor="tools-interview"
        title="Подготовиться к собеседованию"
      >
        <Paragraph>
          <strong>Что нужно сделать:</strong> подумать над типовыми вопросами и
          репликами. Если есть проблемы со слухом / речью — найти комфортный
          канал коммуникации.
        </Paragraph>
        <ContentSection level="h3" title="Чем пользоваться">
          <CardGrid cols={2}>
            <Card
              link="none"
              icon={<MessageSquare />}
              title="Яндекс Разговор"
              description="Переводит речь в текст и обратно. Полезен глухим и слабослышащим в общении со слышащими; работает и в обратную сторону."
            />
            <Card
              link="none"
              icon={<Sparkles />}
              title="Алиса AI"
              description="Потренироваться отвечать на типовые вопросы. Не для зазубривания, а чтобы услышать самого себя."
            />
          </CardGrid>
        </ContentSection>
      </ContentSection>

      <ContentSection
        anchor="tools-documents"
        title="Разобраться в документах"
      >
        <Paragraph>
          <strong>Что нужно сделать:</strong> прочитать договор, понять
          незнакомые формулировки, распознать текст с бумажного носителя.
        </Paragraph>
        <ContentSection level="h3" title="Чем пользоваться">
          <CardGrid cols={2}>
            <Card
              link="none"
              icon={<Camera />}
              title="Умная камера"
              description="(приложение Яндекс) — распознаёт печатный текст и объекты. Удобно для бумажных договоров, инструкций."
            />
            <Card
              link="none"
              icon={<Feather />}
              title="Редактор с Алисой"
              description="Переписать сложный текст договора простым языком, объяснить юр-формулировки."
            />
          </CardGrid>
          <Footnote>
            Если разбираетесь с трудовым договором — параллельно посмотрите{" "}
            <SmartLink to="/companies/legal/contract">
              «Договор и оформление»
            </SmartLink>{" "}
            в разделе «Для компаний»; там — что должно быть в правильном ТД.
          </Footnote>
        </ContentSection>
      </ContentSection>

      <ContentSection anchor="tools-commute" title="Доехать до работы">
        <Paragraph>
          <strong>Что нужно сделать:</strong> построить маршрут с учётом ваших
          ограничений. Вызвать такси с нужными опциями.
        </Paragraph>
        <ContentSection level="h3" title="Чем пользоваться">
          <CardGrid cols={2}>
            <Card
              link="none"
              icon={<MapPin />}
              title="Яндекс Карты"
              description="Фильтр «Избегать лестниц» построит безбарьерный маршрут."
            />
            <Card
              link="none"
              icon={<Car />}
              title="Яндекс Go"
              description="Такси с опциями: «Буду с инвалидным креслом», «Не говорю, но слышу»."
            />
          </CardGrid>
        </ContentSection>
      </ContentSection>

      <ContentSection anchor="tools-teamwork" title="Работать в команде">
        <Paragraph>
          <strong>Что нужно сделать:</strong> писать письма и сообщения, понимать
          видеоконтент, разбираться во внутренних инструкциях.
        </Paragraph>
        <ContentSection level="h3" title="Чем пользоваться">
          <CardGrid cols={3}>
            <Card
              link="none"
              icon={<Feather />}
              title="Редактор с Алисой"
              description="Стиль писем, сокращение лишнего, чёткие формулировки."
            />
            <Card
              link="none"
              icon={<Globe />}
              title="Яндекс Браузер"
              description="Субтитры к видео на любом сайте, генерируются в реальном времени."
            />
            <Card
              link="none"
              icon={<Sparkles />}
              title="Алиса AI"
              description="Как наставник в сложных инструкциях. Пересказ длинного документа или видео коротко."
            />
          </CardGrid>
        </ContentSection>
      </ContentSection>

      <RelatedLinks
        items={[
          {
            title: "Гид по удалённым профессиям",
            to: "/jobseekers/guide",
            description: "Пошаговый курс Яндекса: как начать работать из дома.",
          },
          {
            title: "Куда устроиться в Яндекс",
            to: "/jobseekers/employers",
            description: "Шесть направлений с реальными адаптациями.",
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
