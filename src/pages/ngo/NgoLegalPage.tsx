import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { Card, CardGrid } from "@/components/Card";
import { Callout } from "@/components/Callout";
import { Paragraph, BulletList } from "@/components/Prose";
import { SmartLink } from "@/components/SmartLink";
import { GlossaryTerm } from "@/components/GlossaryTerm";
import { RelatedLinks } from "@/components/RelatedLinks";
import { FeedbackForm } from "@/components/FeedbackForm";

// 21 — НКО — Правовые основы. Тонкая страница-дубль общего слоя (Модуль 2).
// Тип leaf. Оглавления нет (короткая сводная, 3 секции). Текст дословно из Модуля 2.
export function NgoLegalPage() {
  return (
    <>
      <PageHero
        variant="leaf"
        title="Правовые нюансы трудоустройства людей с инвалидностью: нормы, квоты и льготы"
      >
        <Paragraph>
          В законах РФ используется термин «
          <SmartLink to="https://www.consultant.ru/document/cons_doc_LAW_8559/9aa5265357047462326bd90c6df7a780c911b6cc/">
            инвалид
          </SmartLink>
          », но в этом гиде мы говорим «человек с инвалидностью». Так мы делаем
          акцент на личности и профессиональных качествах, а не на ограничениях.
          О корректной терминологии — в следующем{" "}
          <SmartLink to="/ngo/team">модуле</SmartLink>.
        </Paragraph>
        <Paragraph>
          Человек с инвалидностью имеет такие же возможности трудоустройства,
          как и другие соискатели. Он может:
        </Paragraph>
        <BulletList>
          <li>работать по трудовому договору,</li>
          <li>заключать договор ГПХ,</li>
          <li>быть самозанятым исполнителем.</li>
        </BulletList>
        <Callout variant="briefing" title="Для специалиста НКО">
          Эти же нормы — рабочий инструмент сопровождения. Куратор опирается на
          них, готовя соискателя и аргументируя работодателю-партнёру, что
          оформление человека с инвалидностью почти не отличается от обычного
          найма.
        </Callout>
      </PageHero>

      <ContentSection anchor="summary" title="Что разобрано в правовом разделе">
        <Paragraph>
          <strong>В этом модуле разберём</strong> правовые нюансы: от
          официального трудоустройства со всеми социальными гарантиями до гибких
          проектных форм занятости.
        </Paragraph>
        <Paragraph>В частности:</Paragraph>
        <BulletList>
          <li>что даёт справка об инвалидности,</li>
          <li>
            что такое <GlossaryTerm term="ИПРА">ИПРА</GlossaryTerm> и как её
            соблюдать,
          </li>
          <li>какие льготы положены сотрудникам с инвалидностью,</li>
          <li>можно ли трудоустроить человека со статусом недееспособности,</li>
          <li>
            сохраняются ли пособия и льготы при оформлении по трудовому
            договору,
          </li>
          <li>можно ли уволить сотрудника с инвалидностью,</li>
          <li>
            что такое <GlossaryTerm term="квота">квоты</GlossaryTerm> и как их
            выполнить,
          </li>
          <li>
            на какие субсидии и меры господдержки могут рассчитывать
            работодатели,
          </li>
          <li>
            какие альтернативные формы трудоустройства доступны для людей с
            инвалидностью.
          </li>
        </BulletList>
      </ContentSection>

      <ContentSection anchor="full" title="Полный правовой раздел">
        <CardGrid cols={2}>
          <Card
            link="internal"
            to="/companies/legal/contract"
            title="Договор и оформление"
            description="Как оформить сотрудника по трудовому договору; справка об инвалидности, группы, ИПРА."
          />
          <Card
            link="internal"
            to="/companies/legal/benefits"
            title="Льготы и формы занятости"
            description="Какие льготы положены сотрудникам с инвалидностью и какие формы занятости доступны."
          />
          <Card
            link="internal"
            to="/companies/legal/quotas"
            title="Квоты и господдержка"
            description="Что такое квоты, как их выполнить, на какие субсидии и меры господдержки рассчитывать."
          />
          <Card
            link="internal"
            to="/companies/legal/status"
            title="Особые ситуации"
            description="Недееспособность, сохранение пособий при трудовом договоре, основания увольнения."
          />
          <Card
            link="internal"
            to="/companies/legal/faq"
            title="Вопросы и ответы"
            description="Итоговый тест и частые вопросы по правовым нюансам трудоустройства."
          />
        </CardGrid>
        <Callout variant="info">
          <SmartLink to="/companies/legal">
            Открыть полный правовой раздел
          </SmartLink>
        </Callout>
      </ContentSection>

      <FeedbackForm defaultRole="ngo" />

      <RelatedLinks
        items={[
          {
            title: "Выходить на работодателей",
            to: "/ngo/employers",
            description:
              "Где правовые нормы становятся аргументом в разговоре с работодателем-партнёром.",
          },
          {
            title: "Работать с соискателем",
            to: "/ngo/candidates",
            description:
              "Первичное интервью, профориентация, подбор вакансии, подготовка к собеседованию.",
          },
          {
            title: "Сопровождать сотрудника",
            to: "/ngo/support",
            description:
              "Сопровождение после трудоустройства, где правовые гарантии работают на практике.",
          },
        ]}
      />
    </>
  );
}
