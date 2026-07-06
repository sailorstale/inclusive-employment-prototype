import { PageHero } from "@/components/PageHero";
import { PageToc } from "@/components/PageToc";
import { ContentSection } from "@/components/ContentSection";
import { Paragraph, BulletList } from "@/components/Prose";
import { Card, CardGrid } from "@/components/Card";
import { SmartLink } from "@/components/SmartLink";
import { GlossaryTerm } from "@/components/GlossaryTerm";
import { RelatedLinks } from "@/components/RelatedLinks";
import { FeedbackForm } from "@/components/FeedbackForm";

// 05 — Правовые основы (хаб раздела трека «Для компаний»). Авторский текст дословно.
export function LegalHubPage() {
  return (
    <>
      <PageHero
        variant="section-hub"
        title="Правовые нюансы трудоустройства людей с инвалидностью: нормы, квоты и льготы"
        lead="От официального трудоустройства со всеми социальными гарантиями до гибких проектных форм занятости. Раздел снимает страх перед запутанным законодательством и раздаёт по пяти самодостаточным подстраницам."
      />

      <PageToc
        minItems={2}
        items={[
          { label: "Вступление", anchor: "#vstuplenie" },
          { label: "Разделы", anchor: "#razdely" },
        ]}
      />

      <ContentSection anchor="vstuplenie" title="Вступление">
        <Paragraph>
          В законах РФ используется термин «
          <SmartLink to="https://www.consultant.ru/document/cons_doc_LAW_8559/9aa5265357047462326bd90c6df7a780c911b6cc/">
            инвалид
          </SmartLink>
          », но в этом гиде мы говорим «человек с инвалидностью». Так мы делаем
          акцент на личности и профессиональных качествах, а не на ограничениях.
          О корректной терминологии — в следующем{" "}
          <SmartLink to="/companies/team">модуле</SmartLink>.
        </Paragraph>

        <Paragraph>
          Человек с инвалидностью имеет такие же возможности трудоустройства,
          как и другие <GlossaryTerm term="соискатель">соискатели</GlossaryTerm>
          . Он может:
        </Paragraph>

        <BulletList>
          <li>работать по трудовому договору,</li>
          <li>
            заключать{" "}
            <GlossaryTerm term="договор ГПХ">договор ГПХ</GlossaryTerm>,
          </li>
          <li>
            быть <GlossaryTerm term="самозанятость">самозанятым</GlossaryTerm>{" "}
            исполнителем.
          </li>
        </BulletList>

        <Paragraph>
          Многие работодатели опасаются сложностей с законодательством: боятся
          запутанных процедур, дополнительных обязательств и расходов. При этом
          правовые нормы не всегда понятны сразу.
        </Paragraph>

        <Paragraph>
          <strong>В этом модуле разберём</strong> правовые нюансы: от
          официального трудоустройства со всеми социальными гарантиями до гибких
          проектных форм занятости.
        </Paragraph>

        <Paragraph>В частности:</Paragraph>

        <BulletList>
          <li>
            что даёт{" "}
            <GlossaryTerm term="справка об инвалидности">
              справка об инвалидности
            </GlossaryTerm>
            ,
          </li>
          <li>
            что такое <GlossaryTerm term="ИПРА">ИПРА</GlossaryTerm> и как её
            соблюдать,
          </li>
          <li>какие льготы положены сотрудникам с инвалидностью,</li>
          <li>
            можно ли трудоустроить человека со статусом{" "}
            <GlossaryTerm term="недееспособность">
              недееспособности
            </GlossaryTerm>
            ,
          </li>
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

      <ContentSection anchor="razdely" title="Разделы">
        <CardGrid cols={2}>
          <Card
            link="internal"
            to="/companies/legal/contract"
            title="Договор и оформление"
            description="Как оформить сотрудника по трудовому договору. Справка об инвалидности, группы, ИПРА."
          />
          <Card
            link="internal"
            to="/companies/legal/benefits"
            title="Льготы"
            description="Какие льготы положены сотрудникам с инвалидностью и какие формы занятости доступны."
          />
          <Card
            link="internal"
            to="/companies/legal/quotas"
            title="Квоты"
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
      </ContentSection>

      <FeedbackForm defaultRole="company" />

      <RelatedLinks
        items={[
          {
            title: "Команда и коммуникация",
            to: "/companies/team",
            description:
              "Как корректно говорить о терминах и общаться с сотрудниками.",
          },
          {
            title: "С чего начать",
            to: "/companies/start",
            description:
              "Общий обзор для компании перед погружением в правовые детали.",
          },
          {
            title: "Наём по шагам",
            to: "/companies/hire",
            description:
              "Практический трек, для которого правовые основы служат опорой.",
          },
        ]}
      />
    </>
  );
}
