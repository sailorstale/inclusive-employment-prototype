import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { TableOfContents } from "@/components/TableOfContents";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { StatBlock } from "@/components/StatBlock";
import { Blockquote } from "@/components/Blockquote";
import { Card, CardGrid } from "@/components/Card";
import { CollapsibleBlock } from "@/components/CollapsibleBlock";
import { Callout } from "@/components/Callout";
import { ContactSection } from "@/components/ContactSection";
import { RelatedLinks } from "@/components/RelatedLinks";
import { Paragraph, BulletList, LinkList } from "@/components/Prose";
import { SmartLink } from "@/components/SmartLink";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Send,
  Sparkles,
  PenLine,
  MessageSquare,
  Camera,
  MapPin,
  Car,
  Globe,
} from "lucide-react";

// 29 — Трудоустройство в Яндексе (сквозная страница). Контент дословно.
export function YandexJobsPage() {
  return (
    <>
      <PageHero
        variant="leaf"
        eyebrow="Справочник"
        title="Трудоустройство в Яндексе"
        lead="Как Яндекс устроил инклюзивный наём у себя: в каких сервисах работают сотрудники с инвалидностью · что для этого адаптировали · какие технологии помогают искать и выполнять работу. Это не методичка, а живой пример — практика компании, вокруг которой выстроен остальной материал сайта."
      />

      <ImagePlaceholder caption="Практика инклюзивного найма в Яндексе: сервисы и адаптации по направлениям — офисы, доставка, склад, удалёнка." />

      <TableOfContents
        items={[
          { label: "Яндекс в цифрах", anchor: "#yj-about" },
          { label: "Шесть направлений", anchor: "#yj-directions" },
          { label: "Технологии-помощники", anchor: "#yj-tech" },
          { label: "Гайды и истории", anchor: "#yj-materials" },
          { label: "Контакты", anchor: "#yj-contacts" },
        ]}
      />

      <ContentSection anchor="yj-about" title="Яндекс в цифрах">
        <Blockquote attribution="Гульнара Горишняя, руководитель направления по инклюзивному трудоустройству в Яндексе">
          В Яндексе мы развиваем системный подход к инклюзивному найму: создаём
          рабочую среду и процессы, в которой каждый сотрудник или партнёр может
          успешно и эффективно работать вне зависимости от того, есть ли у него
          особенности здоровья.
        </Blockquote>

        <StatBlock
          stats={[
            {
              value: ">1000",
              label: "сотрудников с инвалидностью в штате компании",
            },
            {
              value: ">5000",
              label:
                "человек с инвалидностью сотрудничают с сервисами Яндекса как партнёры",
            },
          ]}
        />

        <Paragraph>
          <strong>2024</strong> — победа в номинации «Равные возможности» премии
          HR-бренд.
        </Paragraph>
      </ContentSection>

      <ContentSection
        anchor="yj-directions"
        title="Шесть направлений"
        lead="В каждом сервисе — свой набор адаптаций под конкретные задачи и формы инвалидности. Суть каждого направления видна сразу."
      >
        <ContentSection
          level="h3"
          title="Подгруппа A. «Работа на площадке» (офис · склад · даркстор)"
        >
          <CardGrid cols={3}>
            <Card
              badge={<Badge tone="brand">Офисы</Badge>}
              title="Кто работает: сотрудники на самых разных позициях — от дизайнеров и аналитиков до кадровиков и разработчиков."
              footer="Связанный материал: «Незрячие и слабовидящие тестировщики Яндекса — о трудоустройстве в компанию.»"
            >
              <BulletList>
                <li>
                  Пандусы, доступные переговорки, регулируемые по высоте столы.
                </li>
                <li>
                  Специальные туалетные комнаты для людей на инвалидных
                  колясках.
                </li>
                <li>
                  Подписи шрифтом Брайля и кнопки вызова помощи на кофепойнтах
                  для незрячих сотрудников.
                </li>
              </BulletList>
            </Card>

            <Card
              badge={<Badge tone="brand">Маркет</Badge>}
              title="Кто работает: склад в Софьино, глухие и слабослышащие кладовщики и бригадиры."
              footer="Связанный материал: «Гайд по коммуникации с неслышащими коллегами.»"
            >
              <BulletList>
                <li>
                  Собеседование и обучение — с переводом на РЖЯ, обучающие
                  ролики с субтитрами.
                </li>
                <li>
                  Гайд по коммуникации с неслышащими коллегами для команды.
                </li>
                <li>
                  Выбран безопасный участок склада без спецтехники, со световыми
                  дорожками и тревожными кнопками.
                </li>
                <li>
                  Жилеты с визуальной маркировкой для глухих сотрудников.
                </li>
              </BulletList>
            </Card>

            <Card
              badge={<Badge tone="brand">Лавка</Badge>}
              title="Кто работает: исполнители со слуховой и ментальной инвалидностью в дарксторах."
              footer="Связанный материал: «Гайд по коммуникации с людьми с ментальными особенностями.»"
            >
              <BulletList>
                <li>Выкладка, выдача, пересчёт и сборка заказов.</li>
                <li>
                  Световая система пожарной безопасности для глухих и
                  слабослышащих.
                </li>
                <li>
                  Гайд по коммуникации с людьми с особенностями развития;
                  обучение переведено на РЖЯ и адаптировано под ментальные
                  особенности.
                </li>
                <li>
                  Запущено сопровождаемое трудоустройство совместно с
                  фондами-партнёрами.
                </li>
              </BulletList>
            </Card>
          </CardGrid>
        </ContentSection>

        <ContentSection
          level="h3"
          title="Подгруппа B. «На линии» (за рулём · доставка · удалёнка)"
        >
          <CardGrid cols={3}>
            <Card
              badge={<Badge tone="brand">Яндекс Go</Badge>}
              title="Кто работает: глухие и слабослышащие водители-партнёры."
            >
              <BulletList>
                <li>
                  В Яндекс Про новый заказ показывается вибрацией и миганием
                  экрана вместо звука.
                </li>
                <li>
                  Пассажир заранее получает уведомление о водителе с
                  особенностями слуха и инструкцию по общению.
                </li>
                <li>
                  Звонки отключены — только чат, доступный всю поездку.
                </li>
                <li>
                  Обучающие статьи и сайт найма переведены на русский жестовый
                  язык (РЖЯ).
                </li>
                <li>
                  Чехлы на подголовники и карточки с фразами для общения
                  пассажира с водителем.
                </li>
              </BulletList>
            </Card>

            <Card
              badge={<Badge tone="brand">Еда</Badge>}
              title="Кто работает: глухие и слабослышащие курьеры в десятках городов."
              footer="Связанный материал: «„Без разговоров“. Особенности работы глухим курьером.»"
            >
              <BulletList>
                <li>
                  Чат между курьером и пользователем доступен всю доставку.
                </li>
                <li>
                  Пользователь заранее получает уведомление: «К вам приедет
                  глухой курьер».
                </li>
                <li>
                  Поддержка и пользователи не звонят — общение только в чате.
                </li>
              </BulletList>
            </Card>

            <Card
              badge={<Badge tone="brand">Крауд</Badge>}
              title="Кто работает: незрячие и слабовидящие специалисты на удалёнке."
              footer="Связанный материал: «История одной уникальной вакансии для незрячих людей.»"
            >
              <BulletList>
                <li>
                  Работают операторами-рекрутерами и специалистами по разметке
                  данных.
                </li>
                <li>
                  Интерфейсы и шаблоны заданий совместимы со скринридерами.
                </li>
                <li>
                  Внутренние сервисы доработаны по обратной связи незрячих
                  пользователей.
                </li>
                <li>
                  Наставничество — с участием опытных незрячих сотрудников.
                </li>
              </BulletList>
            </Card>
          </CardGrid>
        </ContentSection>

        <Callout variant="info" title="Примечание">
          «Связанные материалы» в карточках этой секции — это просто строки
          текста (названия материалов Яндекса), они НЕ являются кликабельными
          ссылками. Кликабельные ссылки на материалы Яндекса собраны ниже, в
          секции «Гайды и истории».
        </Callout>
      </ContentSection>

      <ContentSection
        anchor="yj-tech"
        title="Технологии-помощники"
        lead="От адаптаций рабочих мест — к инструментам в руках самого человека: сервисы Яндекса помогают на разных этапах пути, от отклика на вакансию до работы в команде."
      >
        <Paragraph>
          Те же сервисы Яндекса разложены по пяти этапам пути — отклик на
          вакансию · подготовка к собеседованию · оформление документов · дорога
          до офиса · задачи и коммуникация в команде. На каждом этапе —
          карточки-инструменты (иконка-метка по смыслу + название + что делает):
        </Paragraph>

        <CardGrid cols={4}>
          <Card icon={<Sparkles />} title="Алиса AI" />
          <Card icon={<PenLine />} title="Редактор с Алисой AI" />
          <Card icon={<MessageSquare />} title="Яндекс Разговор" />
          <Card icon={<Camera />} title="Умная камера" />
          <Card icon={<MapPin />} title="Яндекс Карты" />
          <Card icon={<Car />} title="Яндекс Go" />
          <Card icon={<Globe />} title="Яндекс Браузер" />
        </CardGrid>

        <Paragraph>
          → Полный разбор «что нужно сделать на этапе → чем пользоваться», с
          описанием каждого инструмента, — на канонической странице{" "}
          <SmartLink to="/jobseekers/tools">«Инструменты для работы»</SmartLink>.
          Этот же набор по этапам ведётся там и не дублируется здесь.
        </Paragraph>
      </ContentSection>

      <ContentSection
        anchor="yj-materials"
        title="Гайды и истории"
        lead="Подробности по каждому направлению — в собственных материалах Яндекса: гайды по коммуникации и личные истории сотрудников."
      >
        <ContentSection level="h3" title="Гайды">
          <Paragraph>
            Показаны два примера; остальные гайды — во втором слое и на
            канонической странице{" "}
            <SmartLink to="/jobseekers/resources">
              «Полезные материалы»
            </SmartLink>
            , где собран полный каталог гайдов, PDF и подкастов.
          </Paragraph>
          <LinkList
            items={[
              {
                to: "https://inclusion.yandex.ru/job",
                label:
                  "[тип: Гайд] Как начать работать из дома: гид по удалённой работе",
              },
              {
                to: "https://inclusion.yandex.ru/job",
                label:
                  "[тип: PDF] Как общаться со слабослышащими коллегами (PDF)",
              },
            ]}
          />
          <div className="mt-4">
            <CollapsibleBlock title="Ещё гайды и подкаст Яндекса (3) — те же материалы продублированы в каталоге «Полезные материалы» (28)">
              <LinkList
                items={[
                  {
                    to: "https://inclusion.yandex.ru/job",
                    label:
                      "[тип: PDF] Как общаться с коллегами с особенностями развития (PDF)",
                  },
                  {
                    to: "https://inclusion.yandex.ru/job",
                    label: "[тип: Гайд] Как устроен инклюзивный наём в Яндексе",
                  },
                  {
                    to: "https://inclusion.yandex.ru/job",
                    label:
                      "[тип: Подкаст] Подкаст «Доступность плюс»: разговор про опыт инклюзивного найма",
                  },
                ]}
              />
            </CollapsibleBlock>
          </div>
        </ContentSection>

        <ContentSection level="h3" title="Истории сотрудников">
          <Paragraph>
            Показаны два примера; полная витрина историй и видеорассказов — на
            канонической странице{" "}
            <SmartLink to="/jobseekers/stories">«Истории коллег»</SmartLink>.
          </Paragraph>
          <LinkList
            items={[
              {
                to: "https://inclusion.yandex.ru/job",
                label:
                  "[тип: История] «Без разговоров»: как работает глухой курьер в Москве",
              },
              {
                to: "https://inclusion.yandex.ru/job",
                label:
                  "[тип: Видео] Гульфия — слабослышащий бригадир в Маркете (видео)",
              },
            ]}
          />
          <div className="mt-4">
            <CollapsibleBlock title="Ещё истории и видео сотрудников (4) — полная витрина на странице «Истории коллег» (27)">
              <LinkList
                items={[
                  {
                    to: "https://inclusion.yandex.ru/job",
                    label:
                      "[тип: История] Как работают незрячие и слабовидящие сотрудники в Яндексе",
                  },
                  {
                    to: "https://inclusion.yandex.ru/job",
                    label: "[тип: Видео] Артём — исполнитель в Лавке (видео)",
                  },
                  {
                    to: "https://inclusion.yandex.ru/job",
                    label:
                      "[тип: История] Как незрячему сотруднику Яндекса помогает ИИ",
                  },
                  {
                    to: "https://inclusion.yandex.ru/job",
                    label:
                      "[тип: История] Как устроены IT-стажировки для студентов с инвалидностью",
                  },
                ]}
              />
            </CollapsibleBlock>
          </div>
        </ContentSection>

        <Paragraph>
          Полный банк историй и видео — на странице{" "}
          <SmartLink to="https://inclusion.yandex.ru/job">
            inclusion.yandex.ru/job
          </SmartLink>
          .
        </Paragraph>
      </ContentSection>

      <ContentSection anchor="yj-contacts" title="Контакты">
        <ContactSection
          contacts={[
            {
              label: "Вакансии",
              value: "jobs-inclusion@yandex-team.ru",
              email: "jobs-inclusion@yandex-team.ru",
              icon: <Mail />,
            },
            {
              label: "Общие вопросы",
              value: "inclusion@yandex-team.ru",
              email: "inclusion@yandex-team.ru",
              icon: <Mail />,
            },
            {
              label: "Telegram и обратная связь",
              value:
                "Telegram-канал «Инклюзия в Яндексе» и форма обратной связи — на сайте.",
              icon: <Send />,
            },
          ]}
        />
      </ContentSection>

      <Callout variant="briefing" title="Откуда это">
        Раздел собран по публичной странице{" "}
        <SmartLink to="https://inclusion.yandex.ru/job">
          inclusion.yandex.ru/job
        </SmartLink>
        . Там же — актуальные вакансии и полный банк материалов.
      </Callout>

      <RelatedLinks
        items={[
          {
            title: "Куда устроиться в Яндекс",
            to: "/jobseekers/employers",
            description: "Шесть направлений с реальными адаптациями.",
          },
          {
            title: "Истории коллег",
            to: "/jobseekers/stories",
            description: "Как работают сотрудники с инвалидностью.",
          },
          {
            title: "Гид по удалённым профессиям",
            to: "/jobseekers/guide",
            description:
              "Пошаговый курс Яндекса: как начать работать из дома.",
          },
        ]}
      />
    </>
  );
}
