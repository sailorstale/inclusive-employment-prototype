import { Building2, Handshake, Briefcase, Mail, Send } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Card, CardGrid } from "@/components/Card";
import { StatBlock } from "@/components/StatBlock";
import { PromoBanner } from "@/components/PromoBanner";
import { ContactSection } from "@/components/ContactSection";
import { Badge } from "@/components/ui/badge";

// 01 — Главная (распределяющий лендинг, маршрут «/»). Контент дословно.
export function HomePage() {
  return (
    <>
      <PageHero
        variant="landing"
        title="Инклюзивное трудоустройство"
        lead="Практическая информация для тех, кто нанимает, помогает с трудоустройством или ищет работу."
      >
        <StatBlock
          context="hero-hook"
          stats={[
            {
              value: <strong>~4,3 млн</strong>,
              label:
                "человек трудоспособного возраста с инвалидностью в России.",
            },
            {
              value: (
                <>
                  Работают около <strong>30%</strong>
                </>
              ),
              label: "",
            },
          ]}
        />
      </PageHero>

      {/* Три входа-трека — полка из трёх карточек (имя блока служебное, без видимого заголовка) */}
      <CardGrid cols={3}>
        <Card
          link="internal"
          to="/companies"
          icon={<Building2 />}
          title="Для компаний"
          description="Помогает решить, стоит ли начинать, разобраться в правилах оформления, провести наём и подготовить команду."
          footer="Реалии и мифы · Правила оформления · Наём по шагам · Команда и коммуникация"
        />
        <Card
          link="internal"
          to="/ngo"
          icon={<Handshake />}
          title="Для НКО"
          description="Помогает запустить программу трудоустройства, вести кандидатов и выстраивать работу с работодателями."
          footer="Запустить программу · Работать с соискателем · Выходить на работодателей · Сопровождать сотрудника · Развивать и масштабировать · Финансировать программу"
        />
        {/*
          Раздел «Для соискателей» ещё не написан, поэтому карточка говорит об
          этом прямо. Перечислять в подвале материалы, которых нет, нельзя:
          человек кликает по обещанию и попадает на заглушку.
        */}
        <Card
          link="internal"
          to="/jobseekers"
          icon={<Briefcase />}
          badge={<Badge tone="outline">Готовится</Badge>}
          title="Для соискателей"
          description="Раздел ещё готовится. Пока о поиске работы и поддержке со стороны НКО можно прочитать в разделе «Как устроен наём»."
          footer="Что появится в разделе и что почитать сейчас"
        />
      </CardGrid>

      <PromoBanner
        title="Трудоустройство в Яндексе"
        text="Как Яндекс устроил инклюзивный наём у себя: что адаптировали в офисах, такси, доставке, на складе и в дарксторах и какие технологии помогают искать и выполнять работу. Живой пример, который стоит за всеми материалами сайта."
        ctaLabel="Подробнее"
        to="/yandex-jobs"
      />

      <ContactSection
        title="Остались вопросы?"
        contacts={[
          {
            label: "Написать письмо",
            value: "inclusion@yandex-team.ru",
            email: "inclusion@yandex-team.ru",
            icon: <Mail />,
          },
          {
            label: "Форма обратной связи",
            value: "Оставить сообщение",
            to: "/feedback",
            icon: <Send />,
          },
        ]}
      />
    </>
  );
}
