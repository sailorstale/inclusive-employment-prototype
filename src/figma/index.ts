/*
  Слой компонентов дизайн-системы «Трудоустройство ДС».
  Каждый компонент здесь = компонент в Figma (файл k5eUmzpvQR96XrwBxUfGgS,
  секция «Шаблон»). Имена совпадают один в один — это осознанное правило:
  по шильдику в прототипе разработчик находит компонент в Figma и собирает
  его в конструкторе лендингов.

  Описание системы, правила вложенности и открытые вопросы — в КОМПОНЕНТЫ.md
  в корне проекта.

  Только десктоп. Мобильные варианты (Platform=Mobile) не реализованы.
*/

// --- Обвязка страницы ---
export { Hero } from "./Hero";
export type { HeroMenuItem } from "./Hero";
export { SidebarMenu, SidebarMenuItem } from "./SidebarMenu";
export type { SidebarMenuItemLevel } from "./SidebarMenu";
export { TableOfContents, TocItem } from "./TableOfContents";
export type { TocItemLevel } from "./TableOfContents";
export { Footer, FooterItem } from "./Footer";
export type { FooterItemTitle } from "./Footer";

// --- Контейнеры ---
export { SectionContainer } from "./SectionContainer";
export { CardContainer } from "./CardContainer";
export type { CardContainerOrientation } from "./CardContainer";
export { ListContainer } from "./ListContainer";
export { ListItem } from "./ListItem";
export type { ListItemSize, ListItemType } from "./ListItem";

// --- Текст ---
export { Text, TextButton } from "./Text";
export type { TextSize } from "./Text";
export { Heading } from "./Heading";
export type { HeadingLevel } from "./Heading";
export { PageSummary } from "./PageSummary";

// --- Блоки ---
export { GeneralCard } from "./GeneralCard";
export type { GeneralCardOrient, GeneralCardBg } from "./GeneralCard";
export { Quote } from "./Quote";
export type { QuoteSize } from "./Quote";
export { CompareCard } from "./CompareCard";
export type { CompareCardTone } from "./CompareCard";
export { Accordion } from "./Accordion";
export { Prompt } from "./Prompt";
export { Quiz } from "./Quiz";
export type { QuizOption } from "./Quiz";
export { QuizItems } from "./QuizItems";
export type { QuizItemState } from "./QuizItems";
export { QuizBadge } from "./QuizBadge";
export type { QuizBadgeType } from "./QuizBadge";

// --- Таблица (Table — наше дополнение, в Figma компонента-сборки нет) ---
export { Table, TableRow, TableCell, TableHeaderCell } from "./Table";
export type { TableAlignment, TableCellWeight, TableHeader } from "./Table";

// --- Хвост страницы ---
export { Feedback } from "./Feedback";
export type { FeedbackState } from "./Feedback";
export { ReadMore, ReadMoreItem } from "./ReadMore";

// --- Медиа ---
export { Image } from "./Image";
export { Video } from "./Video";

// --- Контролы форм ---
export { Button } from "./Button";
export type { ButtonType, ButtonSize, ButtonIcon } from "./Button";
export { Input } from "./Input";
export { Textarea } from "./Textarea";
export { Dropdown } from "./Dropdown";
export { Search } from "./Search";
export { Checkbox } from "./Checkbox";
export type { ControlSize } from "./Checkbox";
export { Radio } from "./Radio";
export type { ControlState } from "./controlField";

// --- Листья ---
export { SmallImage } from "./SmallImage";
export type { SmallImageName } from "./SmallImage";
export { Tooltip } from "./Tooltip";
export type { TooltipTriggerSize } from "./Tooltip";
export { ExternalLink } from "./ExternalLink";
