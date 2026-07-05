// Инвентарь контента: типы и подписи для служебной страницы /inventory.
// Данные (блоки со всех страниц) — в content/inventory.generated.ts (собран флотом).

export type SemanticType =
  | "пример"
  | "совет"
  | "предупреждение"
  | "кейс"
  | "цитата"
  | "определение"
  | "задание"
  | "миф-факт"
  | "промпт-шаблон"
  | "шаги"
  | "сравнение"
  | "факт-цифра"
  | "faq"
  | "прочее";

/** Один инвентаризированный блок контента. */
export type InventoryBlock = {
  /** Маршрут страницы, напр. /companies/legal/status. */
  route: string;
  /** React-компонент, которым блок оформлен сейчас (Callout/Card/Blockquote/…). */
  component: string;
  /** Вариант (для Callout — info/highlight/…); иначе null. */
  variant: string | null;
  semanticType: SemanticType;
  /** Фрагмент видимого текста (~120 симв). */
  snippet: string;
  /** Якорь ближайшего ContentSection (для перехода в контекст). */
  sectionAnchor: string | null;
  sectionTitle: string | null;
};

/** Человекочитаемые подписи смысловых типов (порядок = порядок вывода). */
export const TYPE_LABELS: { key: SemanticType; label: string }[] = [
  { key: "пример", label: "Пример" },
  { key: "совет", label: "Совет / рекомендация" },
  { key: "предупреждение", label: "Предупреждение / риск" },
  { key: "кейс", label: "Кейс-история" },
  { key: "цитата", label: "Цитата" },
  { key: "определение", label: "Определение / термин" },
  { key: "задание", label: "Практическое задание" },
  { key: "миф-факт", label: "Миф / факт" },
  { key: "промпт-шаблон", label: "ИИ-промпт / шаблон" },
  { key: "шаги", label: "Пошаговый список" },
  { key: "сравнение", label: "Сравнение" },
  { key: "факт-цифра", label: "Факт-цифра" },
  { key: "faq", label: "Вопрос-ответ" },
  { key: "прочее", label: "Прочее" },
];

export const typeLabel = (t: string): string =>
  TYPE_LABELS.find((x) => x.key === t)?.label ?? t;

/** Трек по маршруту — для фильтра. */
export function trackOf(route: string): "Компании" | "НКО" | "Другое" {
  if (route.startsWith("/companies")) return "Компании";
  if (route.startsWith("/ngo")) return "НКО";
  return "Другое";
}

/** Короткая подпись формата: компонент + вариант. */
export function formatLabel(b: InventoryBlock): string {
  return b.variant ? `${b.component} · ${b.variant}` : b.component;
}
