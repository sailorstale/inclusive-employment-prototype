import { Feedback, ListItem, PageSummary, Text } from "@/figma";
import { PageToc } from "@/components/PageToc";
import "@/figma/tokens.css";

import {
  AccordionSection,
  ButtonsSection,
  CardsSection,
  CompareSection,
  ListsSection,
  PromptSection,
  QuizSection,
  SmallImageSection,
  TableSection,
  TypographySection,
  QuotesSection,
} from "./sections";

/*
  Витрина компонентов ВНУТРИ обвязки сайта (маршрут /unify).

  В отличие от standalone-версии (/figma, KitchenSinkPage) здесь нет своей
  шапки/сайдбара/футера — их даёт общий Layout сайта (шапка, левое меню
  разделов, правое оглавление, футер и док редактора в левом нижнем углу).
  Эта страница — только средняя колонка: сами компоненты.

  PageToc отдаёт заголовки разделов в правый рейл «На этой странице» (якоря
  #typography и т.д. уже проставлены в разделах).
*/

const TOC = [
  { anchor: "typography", label: "Типографика" },
  { anchor: "lists", label: "Списки" },
  { anchor: "buttons", label: "Кнопки" },
  { anchor: "cards", label: "Карточки" },
  { anchor: "quotes", label: "Цитаты" },
  { anchor: "compare", label: "Сравнение «за / против»" },
  { anchor: "table", label: "Таблица" },
  { anchor: "accordion", label: "Аккордеон" },
  { anchor: "prompt", label: "Врезка с заготовкой" },
  { anchor: "quiz", label: "Квиз" },
  { anchor: "small-image", label: "Иллюстрации" },
];

export function ComponentsPage() {
  return (
    <>
      <PageToc items={TOC} />

      {/* figma-scope включает токены и типографику дизайн-системы только
          внутри средней колонки; обвязка сайта вокруг остаётся в своём стиле. */}
      <div className="figma-scope">
        <Text size="XL">
          Средняя колонка — компоненты дизайн-системы «Трудоустройство ДС».
          Вокруг — обычная обвязка сайта: шапка, меню разделов слева, оглавление
          справа и док редактора в левом нижнем углу.
        </Text>

        <PageSummary image="Скрепка">
          <ListItem size="L" type="Dot">
            Как устроена иерархия: секция → конверт → блок → стек → пункт
          </ListItem>
          <ListItem size="L" type="Dot">
            Почему Card Container обязателен для всего, что не проза
          </ListItem>
          <ListItem size="L" type="Dot">
            Как выглядят все компоненты системы и их варианты
          </ListItem>
          <ListItem size="L" type="Dot">
            Чего в системе пока нет
          </ListItem>
        </PageSummary>

        <TypographySection />
        <ListsSection />
        <ButtonsSection />
        <CardsSection />
        <QuotesSection />
        <CompareSection />
        <TableSection />
        <AccordionSection />
        <PromptSection />
        <QuizSection />
        <SmallImageSection />

        <Feedback />
      </div>
    </>
  );
}
