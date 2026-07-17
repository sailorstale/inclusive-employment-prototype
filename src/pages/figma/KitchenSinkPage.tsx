import {
  Feedback,
  Footer,
  Hero,
  ListItem,
  PageSummary,
  ReadMore,
  ReadMoreItem,
  SidebarMenu,
  SidebarMenuItem,
  TableOfContents,
  Text,
  TocItem,
} from "@/figma";
import { ComponentTagsToggle } from "@/components/shell/ComponentTagsToggle";
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
  Витрина компонентов дизайн-системы «Трудоустройство ДС».

  Задача страницы — не контент, а проверка: все компоненты из Figma собраны,
  названы как в Figma и складываются друг в друга по правилам системы.
  Тексты здесь — рыба.

  Как читать: кнопка «Компоненты» внизу включает шильдики — у каждого блока
  появляется его имя из Figma. Это и есть ТЗ для разработчика: видно, из чего
  собрана страница и в каком порядке.

  Страница живёт вне общего Layout сайта: у неё своя обвязка (Hero, сайдбар,
  оглавление, футер) из этой же дизайн-системы.
*/

const MENU = [
  { label: "Общая информация", href: "#" },
  { label: "Для компаний", href: "#", active: true },
  { label: "Для НКО", href: "#" },
  { label: "Для соискателей", href: "#" },
];

const TOC = [
  { href: "#typography", label: "Типографика" },
  { href: "#lists", label: "Списки" },
  { href: "#buttons", label: "Кнопки" },
  { href: "#cards", label: "Карточки" },
  { href: "#quotes", label: "Цитаты" },
  { href: "#compare", label: "Сравнение «за / против»" },
  { href: "#table", label: "Таблица" },
  { href: "#accordion", label: "Аккордеон" },
  { href: "#prompt", label: "Врезка с заготовкой" },
  { href: "#quiz", label: "Квиз" },
  { href: "#small-image", label: "Иллюстрации" },
];

const SIDEBAR = [
  { label: "Общая информация", level: 0 as const },
  { label: "Что такое инклюзивное трудоустройство", level: 1 as const },
  { label: "Мифы и барьеры", level: 1 as const },
  { label: "Для компаний", level: 0 as const, active: true },
  { label: "С чего начать", level: 1 as const },
  { label: "Наём по шагам", level: 1 as const },
  { label: "Правовые основы", level: 1 as const },
  { label: "Для НКО", level: 0 as const },
  { label: "Для соискателей", level: 0 as const },
];

export function KitchenSinkPage() {
  return (
    /*
      Полотно жёстко 1440 — это десктопный макет из Figma, и все его части
      (Hero, три колонки 336+768+336, Read More, Footer) рассчитаны ровно на
      эту ширину. Без фиксации в окне уже 1440 колонки вылезают, а Hero и
      футер сжимаются — и блоки перестают совпадать по краям.
      Мобильную версию не делаем: она есть в Figma и выводится из десктопной.
    */
    <div className="figma-scope mx-auto min-h-screen w-[var(--page-width)]">
      <Hero title="Витрина компонентов" menuItems={MENU} />

      {/*
        Наезд контента на Hero на 80 px: в живом шаблоне контент-фрейм
        начинается на y=264 при высоте Hero 344. Правило это или случайность —
        открытый вопрос дизайнеру (п. 4 в КОМПОНЕНТЫ.md). Пока повторяем Figma.
      */}
      <div className="relative z-10 mx-auto -mt-20 flex w-full max-w-[var(--page-width)] items-start gap-0">
        <div className="w-[var(--sidebar-width)] shrink-0 pt-[var(--space-2xl)]">
          <SidebarMenu label="Разделы сайта">
            {SIDEBAR.map((item) => (
              <SidebarMenuItem
                key={item.label}
                level={item.level}
                active={item.active}
                href="#"
              >
                {item.label}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* Колонка контента 768 */}
        <main className="w-[var(--column-width)] shrink-0">
          <Text size="XL">
            Лид страницы — Text · XL. Он и Page Summary ниже лежат вне Section
            Container: в живом шаблоне это единственные блоки колонки без
            секции-обёртки.
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
        </main>

        <div className="w-[var(--toc-width)] shrink-0 pt-[var(--space-2xl)]">
          <TableOfContents>
            {TOC.map((item) => (
              <TocItem key={item.href} href={item.href} level="H2">
                {item.label}
              </TocItem>
            ))}
          </TableOfContents>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[var(--page-width)]">
        <ReadMore>
          <ReadMoreItem
            title="Описание системы"
            description="Зачем нужен каждый компонент, правила вложенности и открытые вопросы"
            href="#"
          />
          <ReadMoreItem
            title="Макет в Figma"
            description="Источник правды: секция «Шаблон» в файле «Трудоустройство ДС»"
            href="https://www.figma.com/design/k5eUmzpvQR96XrwBxUfGgS/"
          />
          <ReadMoreItem
            title="Чего в системе нет"
            description="Картинки в тексте, видео, нумерованный список, ссылка, крошки"
            href="#"
          />
        </ReadMore>

        <Footer />
      </div>

      <ComponentTagsToggle />
    </div>
  );
}
