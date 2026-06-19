import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { Paragraph } from "@/components/Prose";
import { SmartLink } from "@/components/SmartLink";
import { RelatedLinks } from "@/components/RelatedLinks";

// 32 — Доступность (сквозная страница, маршрут /a11y). Декларация доступности. Контент дословно.
export function A11yPage() {
  return (
    <>
      <PageHero
        variant="leaf"
        title="Декларация доступности"
        lead="Сайт стремится к соответствию WCAG 2.1 уровень AA."
      />

      <ContentSection>
        <Paragraph>
          Основа уже заложена: по сайту можно перемещаться с клавиатуры, текущий
          элемент всегда виден, тёмный текст хорошо читается на светлом фоне
          (контраст ≥ 4.5:1), при переходе на новую страницу фокус переносится в
          начало, есть быстрый переход сразу к содержимому, а если в системе
          включён режим уменьшения движения — анимации отключаются.
        </Paragraph>
        <Paragraph>
          Полную проверку и официальное заявление о соответствии мы ещё готовим
          — поэтому пока говорим именно о стремлении к уровню AA, а не о
          достигнутом результате.
        </Paragraph>
        <Paragraph>
          Если вы столкнулись с проблемой доступности, напишите на{" "}
          <SmartLink to="mailto:inclusion@yandex-team.ru">
            inclusion@yandex-team.ru
          </SmartLink>
          .
        </Paragraph>
      </ContentSection>

      <RelatedLinks
        items={[
          {
            title: "Глоссарий",
            to: "/glossary",
            description: "Простые определения терминов и аббревиатур.",
          },
          {
            title: "Обратная связь",
            to: "/feedback",
            description: "Как связаться с командой и задать вопрос.",
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
