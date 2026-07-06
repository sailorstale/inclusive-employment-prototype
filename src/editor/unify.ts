import type { SemanticType } from "./inventory";

// Предложение по унификации: для каждого смыслового типа — канонический формат
// (как он должен выглядеть) + два способа авторинга: «соглашение о вариантах»
// (существующие компоненты) и «семантический компонент» (<Example>, <Tip>…).
// Визуально канон один; отличается только код и то, как держится порядок.
// Живые превью рисует UnifyPage (switch по type); здесь — данные.

export type Approach = "convention" | "component";

export type Subgroup = {
  label: string;
  canonical: string;
  note: string;
};

export type CanonProposal = {
  type: Exclude<SemanticType, "прочее">;
  label: string;
  /** Короткое имя канона, напр. «Callout · highlight». */
  canonical: string;
  /** Почему так. */
  why: string;
  /** Как писать: соглашение о вариантах (существующие компоненты). */
  conventionCode: string;
  /** Как писать: семантический компонент. */
  componentCode: string;
  /** Подгруппы по контексту (если тип не сводится к одному канону). */
  subgroups?: Subgroup[];
};

export const CANON: CanonProposal[] = [
  {
    type: "пример",
    label: "Пример",
    canonical: "по контексту (инлайн / Callout «Пример» / карточки / таблица)",
    why: "«Пример» сейчас в 9 форматах. Он не сводится к одному — зависит от объёма: короткий поясняющий пример живёт в тексте, именованный отдельный — во врезке, серия сравнимых — в карточках/таблице.",
    conventionCode:
      '<Callout variant="highlight" title="Пример">\n  Слабослышащий сотрудник пользуется слуховым аппаратом…\n</Callout>',
    componentCode:
      "<Example>\n  Слабослышащий сотрудник пользуется слуховым аппаратом…\n</Example>",
    subgroups: [
      {
        label: "Короткий пример в тексте («например, …»)",
        canonical: "инлайн в абзаце",
        note: "Не выделять в блок — остаётся частью мысли.",
      },
      {
        label: "Именованный отдельный пример («Пример: …»)",
        canonical: "Callout · highlight «Пример»",
        note: "Единая врезка с меткой «Пример».",
      },
      {
        label: "Серия сравнимых примеров/кейсов",
        canonical: "карточки (Card) или таблица",
        note: "Когда примеров несколько и они однотипны.",
      },
    ],
  },
  {
    type: "совет",
    label: "Совет / рекомендация",
    canonical: "Callout · highlight",
    why: "Советы должны читаться единообразно и отличаться от предупреждений. Синяя акцент-врезка «Совет».",
    conventionCode:
      '<Callout variant="highlight" title="Совет">\n  Начните с одной пилотной вакансии…\n</Callout>',
    componentCode: "<Tip>\n  Начните с одной пилотной вакансии…\n</Tip>",
  },
  {
    type: "предупреждение",
    label: "Предупреждение / риск",
    canonical: "Callout · warning",
    why: "Риски — отдельный визуальный сигнал (янтарная врезка с треугольником), не путать с советом.",
    conventionCode:
      '<Callout variant="warning" title="Важно">\n  Без письменного согласия сверхурочная работа запрещена…\n</Callout>',
    componentCode:
      "<Warning>\n  Без письменного согласия сверхурочная работа запрещена…\n</Warning>",
  },
  {
    type: "задание",
    label: "Практическое задание",
    canonical: "Callout · briefing",
    why: "«Практическое задание» сейчас то список, то абзац, то аккордеон. Единая врезка-бриф с меткой «Задание».",
    conventionCode:
      '<Callout variant="briefing" title="Практическое задание">\n  Составьте карту каналов привлечения аудитории…\n</Callout>',
    componentCode:
      "<Task>\n  Составьте карту каналов привлечения аудитории…\n</Task>",
  },
  {
    type: "кейс",
    label: "Кейс-история",
    canonical: "Blockquote с атрибуцией / PersonaCard",
    why: "Истории людей — голос от первого лица. Короткая — цитата с атрибуцией; развёрнутый портрет — карточка-персона.",
    conventionCode:
      '<Blockquote attribution="Денис, оператор">\n  В «Уфанете» я проработал 9 лет…\n</Blockquote>',
    componentCode:
      '<Case author="Денис, оператор">\n  В «Уфанете» я проработал 9 лет…\n</Case>',
    subgroups: [
      {
        label: "Короткая история-цитата",
        canonical: "Blockquote + атрибуция",
        note: "Прямая речь одного человека.",
      },
      {
        label: "Портрет-история (с раскрытием)",
        canonical: "PersonaCard",
        note: "Имя, роль, описание + «Краткое саммари».",
      },
    ],
  },
  {
    type: "цитата",
    label: "Цитата",
    canonical: "Blockquote",
    why: "Цитаты уже почти всегда Blockquote — подтянуть отклонения к одному виду с атрибуцией.",
    conventionCode:
      '<Blockquote attribution="Гульнара Горишняя, Яндекс">\n  Инклюзия — это не про жалость…\n</Blockquote>',
    componentCode:
      '<Blockquote attribution="Гульнара Горишняя, Яндекс">\n  Инклюзия — это не про жалость…\n</Blockquote>',
  },
  {
    type: "определение",
    label: "Определение / термин",
    canonical: "инлайн GlossaryTerm / Callout · info",
    why: "Термин в тексте — подсветка со ссылкой на глоссарий; развёрнутое определение — нейтральная врезка.",
    conventionCode:
      '…в основе — <GlossaryTerm term="ИПРА">ИПРА</GlossaryTerm>…\n\n<Callout variant="info" title="ИПРА">\n  Индивидуальная программа реабилитации…\n</Callout>',
    componentCode:
      '<GlossaryTerm term="ИПРА">ИПРА</GlossaryTerm>\n\n<Definition term="ИПРА">\n  Индивидуальная программа реабилитации…\n</Definition>',
  },
  {
    type: "миф-факт",
    label: "Миф / факт",
    canonical: "Disclosure-квиз",
    why: "«Миф или правда» работает как квиз: утверждение → раскрыть разбор (нативный details, находится Ctrl+F).",
    conventionCode:
      '<Disclosure entries={[{ trigger: "Берут больше больничных",\n  badge: <Badge tone="bad">Миф</Badge>, content: "Разница 1–2 дня…" }]} />',
    componentCode:
      '<MythQuiz items={[{ claim: "Берут больше больничных",\n  verdict: "миф", explain: "Разница 1–2 дня…" }]} />',
  },
  {
    type: "промпт-шаблон",
    label: "ИИ-промпт / шаблон",
    canonical: "CodeSnippet (копируемый)",
    why: "Промпты и шаблоны писем нужно копировать целиком — моноширинный блок с кнопкой «Копировать».",
    conventionCode:
      '<CodeSnippet tag="ИИ-промпт" text={`Ты — HR-специалист…`} />',
    componentCode: '<Prompt tag="ИИ-промпт">Ты — HR-специалист…</Prompt>',
  },
  {
    type: "шаги",
    label: "Пошаговый список",
    canonical: "OrderedList / StepsShelf",
    why: "Шаги в тексте — нумерованный список; шаги-ссылки на страницы — полка карточек StepsShelf.",
    conventionCode:
      "<OrderedList>\n  <li>Определить аудиторию</li>\n  <li>Выбрать формат</li>\n</OrderedList>",
    componentCode:
      "<Steps>\n  <li>Определить аудиторию</li>\n  <li>Выбрать формат</li>\n</Steps>",
  },
  {
    type: "сравнение",
    label: "Сравнение",
    canonical: "CompareColumns",
    why: "Противопоставления (можно/нельзя, было/стало, подход А/Б) — две панели рядом.",
    conventionCode:
      '<CompareColumns\n  left={{ title: "Разумная адаптация", tone: "good", items: […] }}\n  right={{ title: "Гиперопека", tone: "bad", items: […] }}\n/>',
    componentCode:
      '<Compare\n  left={{ title: "Разумная адаптация", tone: "good" }}\n  right={{ title: "Гиперопека", tone: "bad" }}\n/>',
  },
  {
    type: "факт-цифра",
    label: "Факт-цифра",
    canonical: "StatBlock",
    why: "Крупные числа-крючки — единый блок «число + подпись».",
    conventionCode:
      '<StatBlock stats={[{ value: "4,3 млн", label: "человек трудоспособного возраста с инвалидностью" }]} />',
    componentCode:
      '<Stat value="4,3 млн" label="человек трудоспособного возраста с инвалидностью" />',
  },
  {
    type: "faq",
    label: "Вопрос-ответ",
    canonical: "Disclosure",
    why: "Частые вопросы — сворачиваемый список «вопрос → ответ».",
    conventionCode:
      '<Disclosure entries={[{ trigger: "Можно ли уволить?", content: "Да, по общим основаниям…" }]} />',
    componentCode:
      '<Faq items={[{ q: "Можно ли уволить?", a: "Да, по общим основаниям…" }]} />',
  },
];
