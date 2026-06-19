import { PageHero } from "@/components/PageHero";
import { ContactSection } from "@/components/ContactSection";
import { Callout } from "@/components/Callout";
import { RelatedLinks } from "@/components/RelatedLinks";

// 31 — Обратная связь (сквозная служебная страница-контакт). Контент дословно.
export function FeedbackPage() {
  return (
    <>
      <PageHero
        variant="leaf"
        title="Обратная связь"
        lead="Остались вопросы или есть пожелания — напишите нам."
      />

      <ContactSection
        contacts={[
          {
            label: "Электронная почта",
            value: "inclusion@yandex-team.ru",
            email: "inclusion@yandex-team.ru",
          },
        ]}
      />

      <Callout variant="wip" title="Этот раздел дополняется.">
        Форму обратной связи добавим позже — пока напишите нам на почту выше.
      </Callout>

      <RelatedLinks
        items={[
          {
            title: "Доступность",
            to: "/a11y",
            description:
              "Каким принципам доступности следует сайт и куда сообщить о проблеме.",
          },
          {
            title: "Глоссарий",
            to: "/glossary",
            description: "Простые определения терминов и аббревиатур.",
          },
          {
            title: "Стоит ли начинать",
            to: "/companies/start",
            description: "Зачем компании инклюзивный наём и с чего начать.",
          },
        ]}
      />
    </>
  );
}
