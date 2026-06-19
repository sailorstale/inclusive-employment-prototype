import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { TableOfContents } from "@/components/TableOfContents";
import { Card, CardGrid } from "@/components/Card";
import { DataTable } from "@/components/DataTable";
import { Callout } from "@/components/Callout";
import { Badge } from "@/components/ui/badge";
import { RelatedLinks } from "@/components/RelatedLinks";
import { Paragraph, Lead } from "@/components/Prose";
import { SmartLink } from "@/components/SmartLink";
import { GlossaryTerm } from "@/components/GlossaryTerm";
import {
  Users,
  HeartHandshake,
  Building2,
  Briefcase,
  Trophy,
  Handshake,
  Hourglass,
  UserMinus,
  RefreshCw,
  CloudRain,
  Gauge,
} from "lucide-react";

// 03 — Стоит ли начинать (бизнес-кейс трека «Для компаний»). Контент дословно.
export function CompaniesStartPage() {
  return (
    <>
      <PageHero
        variant="leaf"
        eyebrow="Бизнес-кейс · 15–20 мин"
        title="Стоит ли начинать"
        lead="Для руководителя, собственника или младшего HR, который ещё не решил, нужен ли его компании инклюзивный найм. Без процедур. Бизнес-кейс, риски, главные мифы — и мостик к действию."
      />

      <TableOfContents
        items={[
          { label: "Что такое инклюзивный найм", anchor: "#cs-what" },
          { label: "Плюсы для бизнеса", anchor: "#cs-benefits" },
          { label: "Риски и как их снизить", anchor: "#cs-risks" },
          { label: "Главные мифы — короткая проверка", anchor: "#cs-myths" },
          { label: "Чем отличается от обычного найма", anchor: "#cs-different" },
          { label: "Что делать дальше", anchor: "#cs-next" },
        ]}
      />

      <ContentSection anchor="cs-what" title="Что такое инклюзивный найм">
        <Paragraph>
          Это найм, в котором ценят профессиональные качества человека и
          учитывают, что инвалидность может требовать определённых условий труда.
          Не «помощь нуждающимся», не «закрыть квоту любой ценой» — обычная
          работа с поправкой на среду.
        </Paragraph>
        <Paragraph>
          В основе —{" "}
          <GlossaryTerm term="социальный подход к инвалидности">
            социальный подход к инвалидности
          </GlossaryTerm>
          : «нет ограниченных возможностей у человека — есть ограничивающая
          среда». Уберите барьер — человек работает наравне.
        </Paragraph>

        <Callout variant="briefing" title="Реалии в цифрах.">
          В России около 4,3 млн человек трудоспособного возраста с
          инвалидностью. Работают около 30%. Это не «маленькая ниша», а
          значительная часть рынка труда, недоступная работодателю чаще не из-за
          квалификации, а из-за непривычных шагов в найме.
        </Callout>
      </ContentSection>

      <ContentSection anchor="cs-benefits" title="Плюсы для бизнеса">
        <ContentSection level="h3" title="Люди и удержание">
          <CardGrid cols={2}>
            <Card
              link="none"
              icon={<Users />}
              title="Расширение пула."
              description="Особенно ценно для позиций, где обычная воронка пересохла: операторы, разметчики данных, IT-стажёры, склад, такси."
            />
            <Card
              link="none"
              icon={<HeartHandshake />}
              title="Лояльность и низкая текучесть."
              description="Сотрудники, для которых компания создала условия, реже уходят. Текучка ниже среднего — частый отзыв практиков инклюзивного найма."
            />
          </CardGrid>
        </ContentSection>

        <ContentSection level="h3" title="Деньги и обязательства">
          <CardGrid cols={2}>
            <Card
              link="none"
              icon={<Building2 />}
              title="Поддержка государства."
              description={
                <>
                  Компенсация за оснащение рабочего места по региональной
                  программе, до 6 МРОТ компенсации ЗП, налоговые льготы. Подробно
                  — в{" "}
                  <SmartLink to="/companies/legal/quotas">
                    «Квоты и господдержка»
                  </SmartLink>
                  .
                </>
              }
            />
            <Card
              link="none"
              icon={<Briefcase />}
              title="Квота с пользой."
              description={
                <>
                  Если у вас 100+ сотрудников,{" "}
                  <GlossaryTerm term="квота">квота</GlossaryTerm> уже есть. Лучше
                  закрыть её настоящим сотрудником, чем штрафами.
                </>
              }
            />
          </CardGrid>
        </ContentSection>

        <ContentSection level="h3" title="Репутация и команда">
          <CardGrid cols={2}>
            <Card
              link="none"
              icon={<Trophy />}
              title="Имидж и HR-бренд."
              description="Для B2C — сигнал клиентам, для B2B — преимущество в тендерах с ESG-критериями."
            />
            <Card
              link="none"
              icon={<Handshake />}
              title="Разнообразие команды."
              description="Разный опыт — разные решения. Особенно заметно в продуктовых командах и поддержке."
            />
          </CardGrid>
        </ContentSection>
      </ContentSection>

      <ContentSection
        anchor="cs-risks"
        title="Риски и как их снизить"
        lead="Честно: риски есть. Большинство — из-за непривычности процесса, не из-за самих сотрудников. Каждый снижается заранее."
      >
        <DataTable
          caption="Риски инклюзивного найма и способы их снизить"
          headers={["Категория", "Описание и способ снижения"]}
          rows={[
            [
              "Юридический",
              <>
                Неправильное оформление, нарушение льгот, штрафы за квоту.{" "}
                <strong>Снижение:</strong> сверить документы по{" "}
                <SmartLink to="/companies/legal">
                  Правилам оформления
                </SmartLink>
                , привлечь юриста для первого договора.
              </>,
            ],
            [
              "Финансовый",
              <>
                Оснащение, обучение команды. <strong>Снижение:</strong>{" "}
                господдержка покрывает значительную часть;{" "}
                <GlossaryTerm term="разумная адаптация">
                  разумная адаптация
                </GlossaryTerm>{" "}
                обычно дешевле, чем кажется.
              </>,
            ],
            [
              "Организационный",
              <>
                Сбои в первые недели: непривычные процессы, нужен наставник.{" "}
                <strong>Снижение:</strong>{" "}
                <SmartLink to="/companies/hire">Найм по шагам</SmartLink> —
                пошаговый воркфлоу, включая сопровождение.
              </>,
            ],
            [
              "Коммуникационный",
              <>
                Коллеги боятся «сказать не то». <strong>Снижение:</strong>{" "}
                <SmartLink to="/companies/team">
                  Команда и коммуникация
                </SmartLink>{" "}
                — обучение команды и материалы для брифинга.
              </>,
            ],
            [
              "Кадровый",
              <>
                Сложно найти подходящего кандидата самостоятельно.{" "}
                <strong>Снижение:</strong> работа с{" "}
                <SmartLink to="/ngo">НКО-партнёрами</SmartLink> — они подбирают и
                сопровождают.
              </>,
            ],
            [
              "Репутационный",
              <>
                Если уволить сотрудника без подготовки команды — негативный отзыв
                быстро распространится. <strong>Снижение:</strong> начинать с
                одного пилотного найма, не «массово ради квоты».
              </>,
            ],
          ]}
        />
      </ContentSection>

      <ContentSection
        anchor="cs-myths"
        title="Главные мифы — короткая проверка"
        lead="Девять утверждений, которые часто слышат HR и руководители. Вердикт виден сразу — без раскрытия."
      >
        <ContentSection level="h3" title="Где это миф">
          <div className="space-y-4">
            <Card
              link="none"
              badge={<Badge tone="bad">Миф</Badge>}
              title="«Сотрудники с инвалидностью берут больше отпусков по болезни.»"
              description="По данным исследований, разница с другими сотрудниками — 1–2 дня в год. Часть категорий (например, незрячие специалисты на удалёнке) болеют меньше среднего, потому что среда выстроена под них."
            />
            <Card
              link="none"
              badge={<Badge tone="bad">Миф</Badge>}
              title="«Всем людям с инвалидностью нужны спец-условия.»"
              description={
                <>
                  Условия зависят от формы инвалидности и от конкретной работы.
                  Многим достаточно стандартного рабочего места и адекватного
                  отношения. Подробности — в{" "}
                  <SmartLink to="/companies/legal/contract">
                    «Договор и оформление»
                  </SmartLink>
                  .
                </>
              }
            />
            <Card
              link="none"
              badge={<Badge tone="bad">Миф</Badge>}
              title="«Сотрудника с инвалидностью невозможно или сложно уволить.»"
              description={
                <>
                  Все стандартные основания для расторжения трудового договора
                  применимы. Есть нюансы по медпоказаниям и срочному ТД — см.{" "}
                  <SmartLink to="/companies/legal/status">
                    «Особые ситуации»
                  </SmartLink>
                  .
                </>
              }
            />
            <Card
              link="none"
              badge={<Badge tone="bad">Миф</Badge>}
              title="«Сотрудники с инвалидностью справляются хуже, поэтому платить можно меньше.»"
              description="Закон прямо запрещает дискриминацию в оплате. На практике производительность определяется условиями труда и подбором, а не самим фактом инвалидности."
            />
            <Card
              link="none"
              badge={<Badge tone="bad">Миф</Badge>}
              title="«Сотрудники компаний негативно относятся к коллегам с инвалидностью.»"
              description={
                <>
                  Чаще — осторожность из-за незнания, не негатив. После короткой
                  подготовки (см.{" "}
                  <SmartLink to="/companies/team">
                    «Команду и коммуникацию»
                  </SmartLink>
                  ) команда быстро адаптируется.
                </>
              }
            />
            <Card
              link="none"
              badge={<Badge tone="bad">Миф</Badge>}
              title="«Сотруднику с инвалидностью сложно адаптироваться в команде.»"
              description={
                <>
                  Если команда готова и руководитель прошёл базовое обучение —
                  адаптация занимает столько же, сколько у любого другого
                  сотрудника. Без подготовки — да, сложнее. См.{" "}
                  <SmartLink to="/companies/team">
                    «Команду и коммуникацию»
                  </SmartLink>
                  .
                </>
              }
            />
          </div>
        </ContentSection>

        <ContentSection level="h3" title="Где правда — с нюансами">
          <div className="space-y-4">
            <Card
              link="none"
              badge={<Badge tone="warn">Правда, с оговоркой</Badge>}
              title="«Сотрудники с инвалидностью могут работать сверхурочно.»"
              description="Могут — с письменного согласия и при отсутствии противопоказаний в ИПРА. Не «никогда»."
            />
            <Card
              link="none"
              badge={<Badge tone="warn">Частично правда</Badge>}
              title="«Рабочий день сотрудника с инвалидностью всегда короче.»"
              description="Сокращённая неделя до 35 часов положена сотрудникам I и II групп. III группа — стандартная неделя."
            />
            <Card
              link="none"
              badge={<Badge tone="ok">Правда</Badge>}
              title="«С людьми с инвалидностью стоит обращаться на равных.»"
              description={
                <>
                  Не как с «особенными», но и не игнорируя реальные потребности в
                  адаптации среды. Правила общения — в{" "}
                  <SmartLink to="/companies/team">
                    «Команде и коммуникации»
                  </SmartLink>
                  .
                </>
              }
            />
          </div>
        </ContentSection>
      </ContentSection>

      <ContentSection
        anchor="cs-different"
        title="Чем инклюзивный найм отличается от обычного"
        lead="Главное отличие — не в самом найме, а в ожиданиях. Чего не стоит ждать:"
      >
        <ContentSection level="h3" title="Сроки и удержание">
          <CardGrid cols={3}>
            <Card
              link="none"
              icon={<Hourglass />}
              title="Быстрых результатов."
              description="Подбор первого сотрудника может занять 1–3 месяца. Это нормально."
            />
            <Card
              link="none"
              icon={<UserMinus />}
              title="Нулевой текучести в первые месяцы."
              description="Первые недели — самые уязвимые; без сопровождения часть людей уходит."
            />
            <Card
              link="none"
              icon={<RefreshCw />}
              title="«Вечной лояльности»."
              description="Сотрудники с инвалидностью — обычные люди. Уходят к лучшим условиям так же, как и все."
            />
          </CardGrid>
        </ContentSection>

        <ContentSection level="h3" title="Эмоции и масштаб">
          <CardGrid cols={2}>
            <Card
              link="none"
              icon={<CloudRain />}
              title="Постоянного позитива."
              description="Это работа, а не благотворительность. Бывают конфликты, ошибки, разочарования. Это часть процесса."
            />
            <Card
              link="none"
              icon={<Gauge />}
              title="Мгновенного масштабирования."
              description="Один-два пилотных найма, потом расширение. «Сразу десять» — путь к провалу."
            />
          </CardGrid>
        </ContentSection>
      </ContentSection>

      <ContentSection anchor="cs-next" title="Что делать дальше">
        <Lead>
          Если решили двигаться — выберите подходящую следующую задачу:
        </Lead>

        <ContentSection level="h3" title="Начать работу">
          <CardGrid cols={2}>
            <Card
              link="internal"
              to="/companies/hire"
              eyebrow="→ Действовать"
              title="Провести найм по шагам"
              description="Воркфлоу от выбора вакансии до сопровождения."
            />
            <Card
              link="internal"
              to="/companies/legal"
              eyebrow="→ Разобраться"
              title="Правила оформления"
              description="Договор, ИПРА, льготы, квоты — справочник."
            />
          </CardGrid>
        </ContentSection>

        <ContentSection level="h3" title="Подготовка и партнёры">
          <CardGrid cols={2}>
            <Card
              link="internal"
              to="/companies/team"
              eyebrow="→ Подготовить команду"
              title="Команда и коммуникация"
              description="Как говорить с коллегой с инвалидностью."
            />
            <Card
              link="internal"
              to="/ngo"
              eyebrow="→ Найти партнёра"
              title="Работать с НКО"
              description="НКО подбирают и сопровождают кандидатов."
            />
          </CardGrid>
        </ContentSection>
      </ContentSection>

      <RelatedLinks
        items={[
          {
            title: "Квоты и господдержка",
            to: "/companies/legal/quotas",
            description: "Что требует закон и какая есть поддержка.",
          },
          {
            title: "Шаг 1. Выбор вакансии",
            to: "/companies/hire/step-1",
            description: "С каких позиций проще начать подбор.",
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
