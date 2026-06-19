import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { StepsShelf } from "@/components/StepsShelf";
import { DataTable } from "@/components/DataTable";
import { CollapsibleBlock } from "@/components/CollapsibleBlock";
import { Paragraph, LinkList } from "@/components/Prose";
import { Blockquote } from "@/components/Blockquote";
import { Callout } from "@/components/Callout";
import { SmartLink } from "@/components/SmartLink";
import { GlossaryTerm } from "@/components/GlossaryTerm";

// 10 — Найм по шагам (хаб раздела трека «Для компаний»). Контент дословно.
export function HireHubPage() {
  return (
    <>
      <PageHero
        variant="section-hub"
        title="Найм по шагам"
        lead="Пошаговый воркфлоу инклюзивного найма: от выбора вакансии до сопровождения вышедшего сотрудника. Можно зайти с любого шага — это не курс с прохождением."
      />

      {/* Главное распутье — полка из шести шагов */}
      <ContentSection title="Шесть шагов найма">
        <StepsShelf
          link="each-step-link"
          steps={[
            {
              number: 1,
              eyebrow: "Шаг 1",
              title: "Выбор вакансии для инклюзивного найма",
              description:
                "Определить, какая роль подойдёт, на какие задачи разбирается, под кого подбираем. Чек-лист сравнения, пример «Сборщик заказов» по 4 формам инвалидности.",
              to: "/companies/hire/step-1",
            },
            {
              number: 2,
              eyebrow: "Шаг 2",
              title: "Аудит готовности компании",
              description:
                "Проверить, что среда, процессы и команда готовы к выходу: какие барьеры снять до выхода сотрудника.",
              to: "/companies/hire/step-2",
            },
            {
              number: 3,
              eyebrow: "Шаг 3",
              title: "Создание инклюзивной среды",
              description:
                "Адаптировать физическое пространство, цифровые сервисы, материалы; подготовить руководителя и команду. Главный «инструментальный» шаг.",
              to: "/companies/hire/step-3",
            },
            {
              number: 4,
              eyebrow: "Шаг 4",
              title: "Поиск, собеседование, оформление",
              description:
                "Каналы поиска кандидатов, доступное собеседование и оформление без ошибок.",
              to: "/companies/hire/step-4",
            },
            {
              number: 5,
              eyebrow: "Шаг 5",
              title: "Онбординг без гиперопеки",
              description:
                "Как помочь освоиться: роли в адаптации, настройка процессов, сложные ситуации.",
              to: "/companies/hire/step-5",
            },
            {
              number: 6,
              eyebrow: "Шаг 6",
              title: "Затраты компании",
              description:
                "Во что обходится найм — деньги и время — и как оптимизировать расходы.",
              to: "/companies/hire/step-6",
            },
          ]}
        />
      </ContentSection>

      {/* Второй слой — справочный/пояснительный под главной навигацией */}
      <ContentSection title="Кто за что отвечает: HR, НКО, руководитель">
        <Paragraph>
          По ходу всех шагов задачи распределены между HR, НКО-партнёром и
          руководителем команды.
        </Paragraph>
        <CollapsibleBlock title="Распределение задач: HR · НКО · Руководитель">
          <DataTable
            headers={["Задача", "HR", "НКО", "Руководитель"]}
            rows={[
              ["Поиск кандидатов", "Ведёт", "Поставляет", "—"],
              [
                "Собеседование",
                "Организует",
                "Сопровождает кандидата",
                "Оценивает по существу",
              ],
              [
                "Адаптация рабочего места",
                "Заказывает",
                "Консультирует",
                "Принимает",
              ],
              ["Введение в должность", "Координирует", "—", "Ведёт"],
              [
                "Долгосрочное развитие",
                "—",
                "Поддерживает по запросу",
                "Ведёт",
              ],
            ]}
          />
        </CollapsibleBlock>
      </ContentSection>

      {/* §3.4: Prose + Blockquote + Callout info — не схлопывать в один Alert */}
      <ContentSection title="Сопровождаемое трудоустройство">
        <Paragraph>
          Когда вы работаете с НКО — кандидат приходит «не один».{" "}
          <GlossaryTerm term="Куратор">Куратор</GlossaryTerm> помогает на этапе
          подбора, выхода и в первые 1–6 месяцев работы; дальше — поддерживающий
          режим. <strong>Это не опека навечно</strong> — задача куратора как раз
          в том, чтобы сотрудник и команда могли работать без посредника.{" "}
          <SmartLink to="/glossary">Подробнее в глоссарии</SmartLink>.
        </Paragraph>

        <Blockquote
          attribution="Кейс Яндекс Лавки"
          moreTo="/yandex-jobs"
        >
          «В Лавке запустили сопровождаемое трудоустройство совместно с
          фондами-партнёрами».
        </Blockquote>

        <Callout variant="info" title="Если вы работаете с НКО:">
          перейдите в <SmartLink to="/ngo">раздел НКО</SmartLink> — там полная
          картина того, как партнёр видит процесс и что вы можете запросить.
        </Callout>
      </ContentSection>

      <ContentSection title="Связанные разделы">
        <LinkList
          items={[
            {
              to: "/companies/team",
              label: "Команда и коммуникация",
              description:
                "туториал, который дополняет Шаг 3 в части подготовки руководителя и команды.",
            },
            {
              to: "/companies/legal",
              label: "Правила оформления",
              description:
                "справочник по юр-вопросам, который понадобится на Шаге 4 (оформление) и в течение всего найма.",
            },
            {
              to: "/ngo",
              label: "Раздел НКО",
              description:
                "взгляд партнёра-куратора на тот же процесс. Если работаете с НКО — это полезно прочитать параллельно.",
            },
            {
              to: "/companies/start",
              label: "Стоит ли начинать",
              description:
                "если возникли сомнения по дороге, объяснение «зачем» лежит здесь.",
            },
          ]}
        />
      </ContentSection>

      <ContentSection title="Кейсы, премии, каналы">
        <Paragraph>
          На старте помогает насмотренность: смотреть, что уже делает рынок,
          изучать кейсы и оставаться в контексте. Несколько внешних ориентиров и
          каналов, где собираются работодатели, НКО и эксперты.
        </Paragraph>

        <CollapsibleBlock title="Внешние ориентиры: кейс ритейла и премия HR-бренда">
          <LinkList
            ordered
            items={[
              {
                to: "https://5inclusion.ru/",
                label:
                  "«Пятёрочка»: руководство по инклюзивным практикам в ритейле",
                description:
                  "отраслевой ориентир, если вы работаете в торговле.",
              },
              {
                to: "https://hrbrand.ru/",
                label:
                  "Премия HeadHunter «HR-бренд», номинация «Равные возможности»",
                description:
                  "место, где ваш кейс может вдохновить других работодателей.",
              },
            ]}
          />
        </CollapsibleBlock>

        <CollapsibleBlock title="Телеграм-каналы сообщества (мероприятия, конференции, кейсы)">
          <Paragraph>
            Телеграм-каналы сообщества — про мероприятия, конференции, истории
            успеха и кейсы:
          </Paragraph>
          <div className="mt-3">
            <LinkList
              items={[
                {
                  to: "https://t.me/yandex_inclusion",
                  label: "Инклюзия в Яндексе",
                },
                {
                  to: "https://t.me/inclusion_everland",
                  label: "Everland",
                },
                { to: "https://t.me/vseplchts", label: "Всё получится" },
                {
                  to: "https://t.me/openforall_asi",
                  label: "АСИ «Открыто для всех»",
                },
                { to: "https://t.me/mintrudrf", label: "Минтруд России" },
                {
                  to: "",
                  label: "Совет бизнеса по вопросам инвалидности",
                  noLink: true,
                },
              ]}
            />
          </div>
        </CollapsibleBlock>
      </ContentSection>
    </>
  );
}
