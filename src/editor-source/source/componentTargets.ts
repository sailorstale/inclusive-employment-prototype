// Меню «во что превратить» + модификаторы под каждый компонент. Только
// содержательные компоненты (без обвязки, контейнеров-обёрток, форм и декора).
// Это конфиг директив — по нему рисуется карточка; при «Применить» я читаю
// target + modifiers и собираю раскладку.

export type Modifier =
  | {
      key: string;
      label: string;
      type: "select";
      options: { value: string; label: string }[];
      default: string;
    }
  | { key: string; label: string; type: "toggle"; default?: boolean };

export type Target = { value: string; label: string; modifiers?: Modifier[] };
export type TargetGroup = { group: string; items: Target[] };

const level: Modifier = {
  key: "level",
  label: "Уровень",
  type: "select",
  options: ["H2", "H3", "H4", "H5"].map((v) => ({ value: v, label: v })),
  default: "H2",
};

export const TARGET_GROUPS: TargetGroup[] = [
  {
    group: "Текст",
    items: [
      { value: "Heading", label: "Заголовок", modifiers: [level] },
      {
        value: "Text",
        label: "Текст",
        modifiers: [
          {
            key: "size",
            label: "Размер",
            type: "select",
            options: [
              { value: "XL", label: "XL — лид" },
              { value: "L", label: "L — основной" },
              { value: "M", label: "M — пояснение" },
              { value: "S", label: "S — сноска" },
            ],
            default: "L",
          },
        ],
      },
      {
        value: "Phrase",
        label: "Фраза-врезка",
        modifiers: [
          {
            key: "size",
            label: "Размер",
            type: "select",
            options: [
              { value: "L", label: "L — крупная" },
              { value: "M", label: "M — компактная" },
            ],
            default: "L",
          },
        ],
      },
    ],
  },
  {
    group: "Списки",
    items: [
      {
        value: "List",
        label: "Список",
        modifiers: [
          {
            key: "marker",
            label: "Маркер",
            type: "select",
            options: [
              { value: "Dot", label: "Точка" },
              { value: "Icon", label: "Галочка" },
              { value: "Number", label: "Номер" },
            ],
            default: "Dot",
          },
        ],
      },
    ],
  },
  {
    group: "Карточки и блоки",
    items: [
      {
        value: "GeneralCard",
        label: "General Card",
        modifiers: [
          {
            key: "orient",
            label: "Ориентация",
            type: "select",
            options: [
              { value: "Vertical", label: "Вертикально" },
              { value: "Horizontal", label: "Горизонтально — 2 в ряд" },
            ],
            default: "Vertical",
          },
          {
            key: "bg",
            label: "Фон",
            type: "select",
            options: [
              { value: "blue", label: "Синий — обычная" },
              { value: "yellow", label: "Жёлтый — важное" },
              { value: "pink", label: "Розовый — опасное" },
              { value: "green", label: "Зелёный — позитив" },
              { value: "white", label: "Белый" },
              { value: "beige", label: "Бежевый" },
              { value: "gray", label: "Серый" },
            ],
            default: "blue",
          },
          { key: "icon", label: "Иконка", type: "toggle" },
          { key: "step", label: "Метка шага", type: "toggle" },
        ],
      },
      {
        value: "Quote",
        label: "Цитата",
        modifiers: [
          {
            key: "size",
            label: "Размер",
            type: "select",
            options: [
              { value: "L", label: "L — акцентная" },
              { value: "S", label: "S — спокойная" },
            ],
            default: "L",
          },
          { key: "yandex", label: "Автор из Яндекса", type: "toggle" },
        ],
      },
      { value: "Compare", label: "Compare — за / против" },
      {
        value: "Accordion",
        label: "Accordion — вопрос-ответ",
        modifiers: [
          {
            key: "state",
            label: "По умолчанию",
            type: "select",
            options: [
              { value: "Collapsed", label: "Свёрнут" },
              { value: "Expanded", label: "Раскрыт" },
            ],
            default: "Collapsed",
          },
        ],
      },
      { value: "Prompt", label: "Prompt — заготовка «Скопировать»" },
      { value: "Quiz", label: "Quiz — самопроверка" },
      { value: "PageSummary", label: "Page Summary — вступление" },
    ],
  },
  { group: "Таблица", items: [{ value: "Table", label: "Table" }] },
  {
    group: "Медиа",
    items: [
      { value: "Image", label: "Image" },
      { value: "Video", label: "Video" },
    ],
  },
  {
    group: "Кнопка",
    items: [
      {
        value: "TextButton",
        label: "Card Button",
        modifiers: [
          {
            key: "type",
            label: "Тип",
            type: "select",
            options: [
              { value: "Primary", label: "Primary" },
              { value: "Secondary", label: "Secondary" },
              { value: "Outline", label: "Outline" },
              { value: "Ghost", label: "Ghost" },
            ],
            default: "Primary",
          },
        ],
      },
    ],
  },
];

const BY_VALUE = new Map<string, Target>();
for (const g of TARGET_GROUPS) for (const t of g.items) BY_VALUE.set(t.value, t);

export const findTarget = (value: string | null): Target | undefined =>
  value ? BY_VALUE.get(value) : undefined;

/** Дефолтные значения модификаторов для выбранной цели. */
export function defaultModifiers(value: string): Record<string, string | boolean> {
  const t = BY_VALUE.get(value);
  const out: Record<string, string | boolean> = {};
  for (const m of t?.modifiers ?? []) {
    out[m.key] = m.type === "select" ? m.default : Boolean(m.default);
  }
  return out;
}
