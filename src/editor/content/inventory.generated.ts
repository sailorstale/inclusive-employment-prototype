import type { InventoryBlock } from "../inventory";

// Инвентарь блоков контента (Компании+НКО), собран флотом (по агенту на
// страницу). Компонент+вариант+фрагмент+секция+смысловой тип. Для унификации.

export const inventoryGenerated: InventoryBlock[] = [
  {
    route: "/companies",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Стоит ли начинать — Реалии, мифы, плюсы и риски. Для тех, кто ещё не решил.",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/companies",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Как устроен наём — Кто участвует в инклюзивном найме, какими путями люди находят работу, где искать кандидатов",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/companies",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Правовые основы — Договор, ИПРА, льготы, квоты, формы занятости. По конкретному вопросу.",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/companies",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Найм по шагам — Воркфлоу от выбора вакансии до сопровождения. По своему проекту найма.",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/companies",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Команда и коммуникация — Как говорить с коллегой с инвалидностью. Карточки, ситуации, памятки.",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/companies/start",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом модуле вы узнаете: что такое инвалидность, кто такие соискатели с инвалидностью...",
    sectionAnchor: null,
    sectionTitle: "PageHero (интро)",
  },
  {
    route: "/companies/start",
    component: "CompareColumns",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Медицинский подход — фокусируется на диагнозе... / Социальный подход — фокусируется на среде...",
    sectionAnchor: "cs-approaches",
    sectionTitle: "Что такое инвалидность: медицинский и социальный подходы",
  },
  {
    route: "/companies/start",
    component: "Paragraph",
    variant: null,
    semanticType: "определение",
    snippet:
      "Социальный подход снимает с работодателя лишнюю тревогу. Вам не нужно быть врачом...",
    sectionAnchor: "cs-approaches",
    sectionTitle: "Что такое инвалидность: медицинский и социальный подходы",
  },
  {
    route: "/companies/start",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например: Человек на инвалидной коляске не может подняться по лестнице, но отлично справится...",
    sectionAnchor: "cs-approaches",
    sectionTitle: "Что такое инвалидность: медицинский и социальный подходы",
  },
  {
    route: "/companies/start",
    component: "Disclosure",
    variant: null,
    semanticType: "определение",
    snippet:
      "Глухие и слабослышащие люди / Люди с особенностями опорно-двигательного аппарата / Незрячие и слабовидящие...",
    sectionAnchor: "cs-applicants-forms",
    sectionTitle: "Особенности разных форм инвалидности",
  },
  {
    route: "/companies/start",
    component: "Callout",
    variant: "briefing",
    semanticType: "пример",
    snippet:
      "Пример: Человек был руководителем подразделения, но после перенесённого онкологического заболевания...",
    sectionAnchor: "cs-applicants-acquired",
    sectionTitle:
      "Врождённая и приобретенная инвалидность: почему это важно учитывать",
  },
  {
    route: "/companies/start",
    component: "BulletList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Почему кандидаты могут не раскрывать статус: боятся дискриминации на этапе собеседования...",
    sectionAnchor: "cs-who-needs-help-invisible",
    sectionTitle: "Когда инвалидность не видна",
  },
  {
    route: "/companies/start",
    component: "Callout",
    variant: "briefing",
    semanticType: "пример",
    snippet:
      "Пример: Слабослышащий сотрудник может пользоваться слуховым аппаратом и эффективно выполнять свои задачи...",
    sectionAnchor: "cs-who-needs-help-conditions",
    sectionTitle: "Когда требуются специальные условия труда",
  },
  {
    route: "/companies/start",
    component: "Disclosure",
    variant: null,
    semanticType: "миф-факт",
    snippet:
      "Утверждение 1. Сотрудники с инвалидностью берут больше отпусков за свой счёт... (Миф/Правда, 9 утверждений)",
    sectionAnchor: "cs-myths",
    sectionTitle: "Мифы инклюзивного трудоустройства",
  },
  {
    route: "/companies/start",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "В компании «Уфанет» я проработал 9 лет. Изначально их CRM была неудобна для слабовидящих...",
    sectionAnchor: "cs-myths-voices",
    sectionTitle: "Что говорят люди с инвалидностью и НКО",
  },
  {
    route: "/companies/start",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Елена более 10 лет проработала в маркетинге, потом поняла, что хочет в дизайн...",
    sectionAnchor: "cs-myths-voices",
    sectionTitle: "Что говорят люди с инвалидностью и НКО",
  },
  {
    route: "/companies/start",
    component: "CompareColumns",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Повысить имидж компании — возможности / Вызовы (6 пар возможности↔вызовы: имидж, господдержка, разнообразие...)",
    sectionAnchor: "cs-why",
    sectionTitle: "Зачем внедрять инклюзивное трудоустройство",
  },
  {
    route: "/companies/start",
    component: "Callout",
    variant: "info",
    semanticType: "задание",
    snippet:
      "Ваш вариант: Если не нашли подходящий ответ, напишите свой. Мы ценим ваше мнение...",
    sectionAnchor: "cs-why",
    sectionTitle: "Зачем внедрять инклюзивное трудоустройство",
  },
  {
    route: "/companies/start",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Решение запустить направление трудоустройства людей с инвалидностью стало результатом понимания масштаба...",
    sectionAnchor: "cs-why-voices",
    sectionTitle: "Что говорят бизнес и НКО",
  },
  {
    route: "/companies/start",
    component: "Disclosure",
    variant: null,
    semanticType: "совет",
    snippet:
      "Правовое сопровождение / Финансовое планирование / Организация рабочих процессов... (6 направлений, В чём суть / На что обратить внимание / Как выстроить)",
    sectionAnchor: "cs-processes",
    sectionTitle: "Как выстроить устойчивые процессы",
  },
  {
    route: "/companies/start",
    component: "Callout",
    variant: "highlight",
    semanticType: "совет",
    snippet:
      "Итоговые рекомендации: Планируйте заранее... Обучайте команду... Сотрудничайте с экспертами...",
    sectionAnchor: "cs-processes",
    sectionTitle: "Как выстроить устойчивые процессы",
  },
  {
    route: "/companies/start",
    component: "Card",
    variant: null,
    semanticType: "совет",
    snippet:
      "Качество важнее скорости / Адаптация имеет свой ритм / Профессионализм вместо «вечной лояльности»... (5 карточек)",
    sectionAnchor: "cs-different",
    sectionTitle:
      "Чем трудоустройство людей с инвалидностью отличается от стандартного найма",
  },
  {
    route: "/companies/start",
    component: "Checklist",
    variant: null,
    semanticType: "прочее",
    snippet:
      "укрепить репутацию социально ответственной компании, обогатить команду за счёт разнообразия опыта...",
    sectionAnchor: "cs-summary",
    sectionTitle: "Подведём итоги",
  },
  {
    route: "/companies/start",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "Остались вопросы? Есть пожелания? Оставьте их здесь. Мы их учтём в следующей редакции гида.",
    sectionAnchor: null,
    sectionTitle: "Футер страницы",
  },
  {
    route: "/companies/how",
    component: "Callout",
    variant: "briefing",
    semanticType: "прочее",
    snippet:
      "В этом модуле вы узнаете: кто основные участники инклюзивного трудоустройства, где искать соискателей",
    sectionAnchor: "intro",
    sectionTitle: "Как работает инклюзивный наём: от поиска до партнёрства",
  },
  {
    route: "/companies/how",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Соискатель с инвалидностью. Соискателю важно быть не пассивным благополучателем, а активным участником",
    sectionAnchor: "participants",
    sectionTitle: "Участники инклюзивного трудоустройства и их роли",
  },
  {
    route: "/companies/how",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Работодатель. Работодатель — не благотворитель. Он хочет получить подготовленного, мотивированного",
    sectionAnchor: "participants",
    sectionTitle: "Участники инклюзивного трудоустройства и их роли",
  },
  {
    route: "/companies/how",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Некоммерческая организация (НКО). Многие НКО работают с людьми с инвалидностью годами",
    sectionAnchor: "participants",
    sectionTitle: "Участники инклюзивного трудоустройства и их роли",
  },
  {
    route: "/companies/how",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Центр занятости населения (ЦЗН). Центр занятости выступает государственным регулятором",
    sectionAnchor: "participants",
    sectionTitle: "Участники инклюзивного трудоустройства и их роли",
  },
  {
    route: "/companies/how",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Как это работает на практике: До выхода на работу. Куратор помогает кандидату подготовить резюме",
    sectionAnchor: "supported",
    sectionTitle: "Сопровождаемое трудоустройство",
  },
  {
    route: "/companies/how",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "HeadHunter, Avito Работа — универсальные платформы для поиска работы",
    sectionAnchor: "channels-universal",
    sectionTitle: "Универсальные платформы для поиска работы",
  },
  {
    route: "/companies/how",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Центры занятости населения (ЦЗН). Вузы и колледжи. Абилимпикс — государственные и образовательные",
    sectionAnchor: "channels-state",
    sectionTitle: "Государственные и образовательные учреждения",
  },
  {
    route: "/companies/how",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Некоммерческие организации (НКО): РООИ «Перспектива», «Everland», «Все получится!»; ВОС и ВОГ",
    sectionAnchor: "channels-orgs",
    sectionTitle: "Профильные организации",
  },
  {
    route: "/companies/how",
    component: "Disclosure",
    variant: null,
    semanticType: "пример",
    snippet:
      "Telegram- и ВКонтакте-сообщества — список каналов и сообществ с вакансиями",
    sectionAnchor: "channels-direct",
    sectionTitle: "Прямой поиск и нетворкинг",
  },
  {
    route: "/companies/how",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Где вы ищете соискателей с инвалидностью? Кандидатов с инвалидностью, которые готовы к самостоятельному",
    sectionAnchor: "channels-business-says",
    sectionTitle: "Что говорит бизнес и НКО",
  },
  {
    route: "/companies/how",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Задача · Ответственность работодателя · Ответственность НКО — кто за что отвечает",
    sectionAnchor: "responsibility",
    sectionTitle: "Взаимодействие работодателей и НКО: кто за что отвечает",
  },
  {
    route: "/companies/how",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Квиз: изучите ситуации и определите, кто должен взять на себя инициативу — работодатель или НКО",
    sectionAnchor: "quiz",
    sectionTitle: "Квиз: кто берёт инициативу — работодатель или НКО",
  },
  {
    route: "/companies/how",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "ОС: Подготовка кандидата, включая психологическую поддержку и информирование о процессе — зона НКО",
    sectionAnchor: "quiz",
    sectionTitle: "Квиз: кто берёт инициативу — работодатель или НКО",
  },
  {
    route: "/companies/how",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "ОС: Создание доступной рабочей среды — это прямая ответственность работодателя",
    sectionAnchor: "quiz",
    sectionTitle: "Квиз: кто берёт инициативу — работодатель или НКО",
  },
  {
    route: "/companies/how",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "ОС: Подготовка коллектива должна начинаться до выхода нового сотрудника",
    sectionAnchor: "quiz",
    sectionTitle: "Квиз: кто берёт инициативу — работодатель или НКО",
  },
  {
    route: "/companies/how",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "ОС: Изменение формата рабочих процессов внутри команды — это ответственность работодателя",
    sectionAnchor: "quiz",
    sectionTitle: "Квиз: кто берёт инициативу — работодатель или НКО",
  },
  {
    route: "/companies/how",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Шаг 1: Успешный опыт. Шаг 2: Расширение диалога. Шаг 3: Поддержание связи — путь «От кандидата НКО к компании»",
    sectionAnchor: "partnership-from-nko",
    sectionTitle: "Путь «От кандидата НКО к компании»",
  },
  {
    route: "/companies/how",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Шаг 1: Поиск и первый контакт. Шаг 2: Встреча. Шаг 3: Совместное планирование — путь «От компании к НКО»",
    sectionAnchor: "partnership-from-company",
    sectionTitle: "Путь «От компании к НКО»",
  },
  {
    route: "/companies/how",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Мастер ОК: Любому работодателю нужен работник, который быстро и качественно будет выполнять свою работу",
    sectionAnchor: "partnership-business-says",
    sectionTitle: "Что говорит бизнес и НКО",
  },
  {
    route: "/companies/how",
    component: "Paragraph",
    variant: null,
    semanticType: "совет",
    snippet:
      "Как действовать / Результат: Сообщите партнёру (НКО) заранее. Компания не готова продолжать наём",
    sectionAnchor: "failure-frozen",
    sectionTitle:
      "Компания не готова продолжать наём (заморозка вакансий, изменение стратегии)",
  },
  {
    route: "/companies/how",
    component: "Paragraph",
    variant: null,
    semanticType: "совет",
    snippet:
      "Как действовать / Результат: Проведите встречу и обсудите, почему кандидаты не подходят",
    sectionAnchor: "failure-nocandidates",
    sectionTitle:
      "НКО не может найти подходящих кандидатов (несоответствие профиля, долгий поиск)",
  },
  {
    route: "/companies/how",
    component: "Paragraph",
    variant: null,
    semanticType: "совет",
    snippet:
      "Как действовать / Результат: непрохождение испытательного срока — обычная рабочая ситуация",
    sectionAnchor: "failure-probation",
    sectionTitle:
      "Неудачный опыт трудоустройства (например, сотрудник не прошел испытательный срок)",
  },
  {
    route: "/companies/how",
    component: "Paragraph",
    variant: null,
    semanticType: "совет",
    snippet:
      "Как действовать / Принцип: Используйте механизм обратной связи, прописанный в начале сотрудничества",
    sectionAnchor: "failure-breach",
    sectionTitle: "Нарушение договоренностей одной из сторон",
  },
  {
    route: "/companies/how",
    component: "Disclosure",
    variant: null,
    semanticType: "миф-факт",
    snippet:
      "МИФ: инклюзивное трудоустройство для крупных компаний, у нас маленький бизнес — нам это не по силам",
    sectionAnchor: "myths",
    sectionTitle: "Какие мифы работодателей могут помешать сотрудничеству",
  },
  {
    route: "/companies/how",
    component: "DataTable",
    variant: null,
    semanticType: "пример",
    snippet:
      "Город · Имя · Должность · Форма инвалидности — реальные примеры трудоустройства в малых компаниях",
    sectionAnchor: "myths",
    sectionTitle: "Какие мифы работодателей могут помешать сотрудничеству",
  },
  {
    route: "/companies/how",
    component: "Disclosure",
    variant: null,
    semanticType: "миф-факт",
    snippet:
      "МИФ: работодатель должен быть идеально готов ко всему; МИФ: НКО просто пришлёт резюме; и ещё 3 мифа",
    sectionAnchor: "myths",
    sectionTitle: "Какие мифы работодателей могут помешать сотрудничеству",
  },
  {
    route: "/companies/how",
    component: "Callout",
    variant: "info",
    semanticType: "совет",
    snippet:
      "ИИ-помощник: Если у вас возникли сложности в выстраивание партнерских отношений, за советом можно обратиться к ИИ",
    sectionAnchor: "summary",
    sectionTitle: "Подведём итоги",
  },
  {
    route: "/companies/legal",
    component: "BulletList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "работать по трудовому договору, · заключать договор ГПХ, · быть самозанятым исполнителем.",
    sectionAnchor: "vstuplenie",
    sectionTitle: "Вступление",
  },
  {
    route: "/companies/legal",
    component: "BulletList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "что даёт справка об инвалидности, · что такое ИПРА и как её соблюдать, · какие льготы положены сотрудникам с инвалид",
    sectionAnchor: "vstuplenie",
    sectionTitle: "Вступление",
  },
  {
    route: "/companies/legal",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Договор и оформление — Как оформить сотрудника по трудовому договору. Справка об инвалидности, группы, ИПРА.",
    sectionAnchor: "razdely",
    sectionTitle: "Разделы",
  },
  {
    route: "/companies/legal",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Льготы — Какие льготы положены сотрудникам с инвалидностью и какие формы занятости доступны.",
    sectionAnchor: "razdely",
    sectionTitle: "Разделы",
  },
  {
    route: "/companies/legal",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Квоты — Что такое квоты, как их выполнить, на какие субсидии и меры господдержки рассчитывать.",
    sectionAnchor: "razdely",
    sectionTitle: "Разделы",
  },
  {
    route: "/companies/legal",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Особые ситуации — Недееспособность, сохранение пособий при трудовом договоре, основания увольнения.",
    sectionAnchor: "razdely",
    sectionTitle: "Разделы",
  },
  {
    route: "/companies/legal",
    component: "Card",
    variant: null,
    semanticType: "faq",
    snippet:
      "Вопросы и ответы — Итоговый тест и частые вопросы по правовым нюансам трудоустройства.",
    sectionAnchor: "razdely",
    sectionTitle: "Разделы",
  },
  {
    route: "/companies/legal/contract",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "1-я группа — самые значительные нарушения, часто требуется постоянная помощь. 2-я группа — выраженные нарушения…",
    sectionAnchor: "lc-spravka",
    sectionTitle: "Справка об инвалидности",
  },
  {
    route: "/companies/legal/contract",
    component: "Callout",
    variant: "warning",
    semanticType: "предупреждение",
    snippet:
      "Важно не оценивать возможности сотрудника только по группе инвалидности. Человек с 1-й группой может быть высок…",
    sectionAnchor: "lc-spravka",
    sectionTitle: "Справка об инвалидности",
  },
  {
    route: "/companies/legal/contract",
    component: "BulletList",
    variant: null,
    semanticType: "определение",
    snippet:
      "Условия труда. Оборудование рабочего места. Доступные виды труда. Ограничения по видам работ. Особенности графика.",
    sectionAnchor: "lc-ipra",
    sectionTitle: "Индивидуальная программа реабилитации и абилитации (ИПРА)",
  },
  {
    route: "/companies/legal/contract",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Сотрудник предоставил справку об инвалидности / Сотрудник предоставил ИПРА / Работодатель обязан соблюдать льготы…",
    sectionAnchor: "lc-obligation",
    sectionTitle:
      "Когда работодатель обязан соблюдать льготы для сотрудника с инвалидностью",
  },
  {
    route: "/companies/legal/contract",
    component: "Footnote",
    variant: null,
    semanticType: "прочее",
    snippet: "* О льготах сотрудников с инвалидностью расскажем далее.",
    sectionAnchor: "lc-obligation",
    sectionTitle:
      "Когда работодатель обязан соблюдать льготы для сотрудника с инвалидностью",
  },
  {
    route: "/companies/legal/contract",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Степень ограничения способности к трудовой деятельности / Что означает / Как оформить / Пример",
    sectionAnchor: "lc-degrees",
    sectionTitle: "Степень ограничения способности к трудовой деятельности",
  },
  {
    route: "/companies/legal/contract",
    component: "Disclosure",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Пример 1. Трудоустройство контент-менеджера с нарушением зрения. Пример 2. …слуха. Пример 3. …почек. Пример 4. …эпилепсией.",
    sectionAnchor: "lc-examples",
    sectionTitle: "Примеры формулировок в трудовой договор",
  },
  {
    route: "/companies/legal/contract",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Работодатель обеспечивает Работнику условия труда с учётом рекомендаций индивидуальной программы реабилитации…»",
    sectionAnchor: "lc-examples",
    sectionTitle: "Примеры формулировок в трудовой договор",
  },
  {
    route: "/companies/legal/contract",
    component: "Disclosure",
    variant: null,
    semanticType: "совет",
    snippet:
      "1. Нарушения опорно-двигательного аппарата… 2. Слепота 3. Слабовидение 4. Глухота 5. Снижение слуха 6. Хронические состояния",
    sectionAnchor: "lc-forms",
    sectionTitle:
      "Как прописать условия труда в трудовом договоре: рекомендации по типам инвалидности",
  },
  {
    route: "/companies/legal/contract",
    component: "Callout",
    variant: "warning",
    semanticType: "предупреждение",
    snippet:
      "Если работодатель не может обеспечить условия труда, указанные в ИПРА, он не имеет права допустить сотрудника к работе.",
    sectionAnchor: "lc-forms",
    sectionTitle:
      "Как прописать условия труда в трудовом договоре: рекомендации по типам инвалидности",
  },
  {
    route: "/companies/legal/contract",
    component: "LinkList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Конституция РФ / Трудовой кодекс РФ / Федеральный закон № 181-ФЗ / № 565-ФЗ / Постановления Правительства…",
    sectionAnchor: "lc-acts",
    sectionTitle: "Ключевые нормативные акты",
  },
  {
    route: "/companies/legal/contract",
    component: "Callout",
    variant: "info",
    semanticType: "промпт-шаблон",
    snippet:
      "Чтобы сделать корректную запись в трудовом договоре и не забыть о льготах… рекомендуем обращаться к нейросети. Мы подготовили промпт.",
    sectionAnchor: "lc-ai",
    sectionTitle: "ИИ-помощник: запись в договор и льготы",
  },
  {
    route: "/companies/legal/contract",
    component: "RelatedLinks",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Льготы и формы занятости / Квоты и господдержка / Вопросы и ответы",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/companies/legal/benefits",
    component: "CompareColumns",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Что сохраняется в полном объёме: пенсия по инвалидности, ежемесячная денежная выплата... / Что отменяется при трудоустройстве: социальная доплата до прожиточного минимума",
    sectionAnchor: "lb-payments",
    sectionTitle:
      "Сохранятся ли пособия и льготы при трудоустройстве по трудовому договору",
  },
  {
    route: "/companies/legal/benefits",
    component: "Callout",
    variant: "highlight",
    semanticType: "пример",
    snippet:
      "Давайте рассмотрим на примере. Человек не работает. Его пенсия по инвалидности составляет 12 000 рублей.",
    sectionAnchor: "lb-payments",
    sectionTitle:
      "Сохранятся ли пособия и льготы при трудоустройстве по трудовому договору",
  },
  {
    route: "/companies/legal/benefits",
    component: "Callout",
    variant: "warning",
    semanticType: "предупреждение",
    snippet:
      "Важно помнить. Если человек состоит на бирже труда, ему обязательно стоит сообщить в ЦЗН и Социальный фонд России о том, что он работает.",
    sectionAnchor: "lb-forms",
    sectionTitle: "Дополнительные форматы работы",
  },
  {
    route: "/companies/legal/benefits",
    component: "Disclosure",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Разовая юридическая консультация / Тестировщик ПО на постоянную удалённую работу",
    sectionAnchor: "lb-forms-cases",
    sectionTitle: "Типовые ситуации",
  },
  {
    route: "/companies/legal/benefits",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Сравнительная таблица форм занятости. Критерий / Трудовой договор / Договор ГПХ с физлицом / Самозанятость",
    sectionAnchor: "lb-summary-choose",
    sectionTitle: "Как выбрать формат занятости?",
  },
  {
    route: "/companies/legal/quotas",
    component: "Callout",
    variant: "highlight",
    semanticType: "пример",
    snippet:
      "В компании по производству корпусной мебели среднесписочная численность за предыдущий квартал — 208 человек.",
    sectionAnchor: "quotas",
    sectionTitle: "Что такое квоты и как их выполнить",
  },
  {
    route: "/companies/legal/quotas",
    component: "BulletList",
    variant: null,
    semanticType: "определение",
    snippet:
      "До 35 сотрудников — квотирование не применяется. От 35 до 100 сотрудников — размер квоты устанавливают ре",
    sectionAnchor: "quotas",
    sectionTitle: "Что такое квоты и как их выполнить",
  },
  {
    route: "/companies/legal/quotas",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "Логистическая компания “Ромашка” по закону, из-за численности штата обязана создать несколько рабочих мест",
    sectionAnchor: "how-to-fill",
    sectionTitle: "Как выполнить квоту",
  },
  {
    route: "/companies/legal/quotas",
    component: "OrderedList",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Компания предприняла меры. Работодатель выполнил необходимые действия... его тем не менее могут привлечь к",
    sectionAnchor: "not-filled",
    sectionTitle: "Что происходит, если квота не выполнена",
  },
  {
    route: "/companies/legal/quotas",
    component: "Disclosure",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Компенсация за оснащение рабочего места · Компенсация затрат на заработную плату · Субсидии для социального",
    sectionAnchor: "support",
    sectionTitle: "Субсидии и меры господдержки",
  },
  {
    route: "/companies/legal/status",
    component: "BulletList",
    variant: null,
    semanticType: "определение",
    snippet:
      "1-я группа — самые значительные нарушения, часто требуется постоянная помощь, 2-я группа — выраженные...",
    sectionAnchor: "status-spravka",
    sectionTitle: "Справка об инвалидности",
  },
  {
    route: "/companies/legal/status",
    component: "BulletList",
    variant: null,
    semanticType: "факт-цифра",
    snippet:
      "1-я группа инвалидности устанавливается на 2 года. 2-я и 3-я группы — на 1 год. Возможно установление...",
    sectionAnchor: "status-spravka",
    sectionTitle: "Справка об инвалидности",
  },
  {
    route: "/companies/legal/status",
    component: "Callout",
    variant: "info",
    semanticType: "совет",
    snippet:
      "Важно не оценивать возможности сотрудника только по группе инвалидности. Человек с 1-й группой может быть",
    sectionAnchor: "status-spravka",
    sectionTitle: "Справка об инвалидности",
  },
  {
    route: "/companies/legal/status",
    component: "BulletList",
    variant: null,
    semanticType: "определение",
    snippet:
      "Условия труда — например: противопоказана работа в запылённых помещениях или с химическими веществами.",
    sectionAnchor: "status-ipra-content",
    sectionTitle: "Что указано в ИПРА:",
  },
  {
    route: "/companies/legal/status",
    component: "BulletList",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "ИПРА не всегда даёт чёткие инструкции — часто формулировки общие («щадящие условия», «умеренная нагрузка»).",
    sectionAnchor: "status-ipra-notes",
    sectionTitle: "Важные нюансы:",
  },
  {
    route: "/companies/legal/status",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Справка и ИПРА: возможные ситуации и обязанность работодателя соблюдать льготы",
    sectionAnchor: "status-table",
    sectionTitle: "Справка и ИПРА: возможные ситуации",
  },
  {
    route: "/companies/legal/status",
    component: "Footnote",
    variant: null,
    semanticType: "прочее",
    snippet: "* О льготах сотрудников с инвалидностью расскажем далее.",
    sectionAnchor: "status-table",
    sectionTitle: "Справка и ИПРА: возможные ситуации",
  },
  {
    route: "/companies/legal/status",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Степени ограничения способности к трудовой деятельности: что означает, как оформить, пример",
    sectionAnchor: "status-degrees",
    sectionTitle: "Степени ограничения способности к трудовой деятельности",
  },
  {
    route: "/companies/legal/status",
    component: "Disclosure",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Пример 1. Трудоустройство контент-менеджера с нарушением зрения / Пример 2 … Пример 4",
    sectionAnchor: "status-degrees",
    sectionTitle: "Степени ограничения способности к трудовой деятельности",
  },
  {
    route: "/companies/legal/status",
    component: "Disclosure",
    variant: null,
    semanticType: "шаги",
    snippet:
      "1. Нарушения опорно-двигательного аппарата / 2. Слепота / 3. Слабовидение / … 6. Хронические состояния",
    sectionAnchor: "status-types",
    sectionTitle:
      "Как прописать условия труда в трудовом договоре: рекомендации по типам инвалидности",
  },
  {
    route: "/companies/legal/status",
    component: "Callout",
    variant: "warning",
    semanticType: "предупреждение",
    snippet:
      "Если работодатель не может обеспечить условия труда, указанные в ИПРА, он не имеет права допустить сотрудника",
    sectionAnchor: "status-types",
    sectionTitle:
      "Как прописать условия труда в трудовом договоре: рекомендации по типам инвалидности",
  },
  {
    route: "/companies/legal/status",
    component: "BulletList",
    variant: null,
    semanticType: "определение",
    snippet:
      "если человек живёт в семье — обычно родственник, если в психоневрологическом интернате — директор учреждения.",
    sectionAnchor: "status-incapacitated-guardian",
    sectionTitle: "Кто может быть опекуном:",
  },
  {
    route: "/companies/legal/status",
    component: "BulletList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "паспорт опекуна, документ, подтверждающий назначение опекуна, письменное согласие органов опеки…",
    sectionAnchor: "status-incapacitated-docs",
    sectionTitle: "Какие документы нужны для оформления",
  },
  {
    route: "/companies/legal/status",
    component: "BulletList",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "заработная плата поступает на специальный счёт, открытый опекуном, ежегодно опекун должен отчитываться…",
    sectionAnchor: "status-incapacitated-payments",
    sectionTitle: "Особенности выплат и ответственности:",
  },
  {
    route: "/companies/legal/faq",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "1. Какая форма занятости позволяет закрыть квоту? … 8. Представьте: крупной IT-компании нужен тестировщик…",
    sectionAnchor: "self-check",
    sectionTitle: "Проверьте себя",
  },
  {
    route: "/companies/legal/faq",
    component: "Disclosure",
    variant: null,
    semanticType: "faq",
    snippet:
      "1. Может ли сотрудник не сообщать работодателю о своей инвалидности? … 15. Можно ли совмещать самозанятость…",
    sectionAnchor: "faq",
    sectionTitle: "Вопросы и ответы",
  },
  {
    route: "/companies/hire",
    component: "Callout",
    variant: "wip",
    semanticType: "прочее",
    snippet:
      "Видео с Гульнарой Горишней — в работе. Слот под короткое видео с руководителем направления инклюзивного тр",
    sectionAnchor: "vstuplenie",
    sectionTitle: "Вступление",
  },
  {
    route: "/companies/hire",
    component: "StepsShelf",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Шаг 1. Выбор вакансии для инклюзивного найма. Инклюзивный наём в компании начинается не с поиска кандидатов",
    sectionAnchor: "shest-shagov",
    sectionTitle: "Шесть шагов найма",
  },
  {
    route: "/companies/hire/step-1",
    component: "BulletList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: как выбрать вакансию для инклюзивного найма в своей компании,",
    sectionAnchor: "s1-intro",
    sectionTitle: "Вступление",
  },
  {
    route: "/companies/hire/step-1",
    component: "ImagePlaceholder",
    variant: null,
    semanticType: "прочее",
    snippet: "Схема-маршрут шага (слот под иллюстрацию маршрута Шага 1).",
    sectionAnchor: "s1-intro",
    sectionTitle: "Вступление",
  },
  {
    route: "/companies/hire/step-1",
    component: "Callout",
    variant: "info",
    semanticType: "предупреждение",
    snippet:
      "Важно: на этом этапе не нужно продумывать все изменения заранее. Важнее понять, подходит ли вакансия для пилота",
    sectionAnchor: "s1-compare",
    sectionTitle:
      "3. Сравните вакансии между собой и выберите позицию для пилота",
  },
  {
    route: "/companies/hire/step-1",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "Общие вопросы: Можно ли обеспечить безопасные условия труда? Есть ли возможности для адаптации рабочего места?",
    sectionAnchor: "s1-checklist",
    sectionTitle: "Чек-лист",
  },
  {
    route: "/companies/hire/step-1",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "Вопросы для типовых и массовых позиций: Задачи у этой роли понятны и конкретны? Работа строится по предсказуемому",
    sectionAnchor: "s1-checklist",
    sectionTitle: "Чек-лист",
  },
  {
    route: "/companies/hire/step-1",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Пример: разбор вакансии Сборщик заказов на складе. Функция 1: Приём товара и сверка с накладными.",
    sectionAnchor: "s1-functions",
    sectionTitle: "4. Выпишите функционал вакансии",
  },
  {
    route: "/companies/hire/step-1",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например: если работа требует постоянной навигации по помещению и зрительного контроля, она точно не подойдёт",
    sectionAnchor: "s1-match",
    sectionTitle:
      "Подумайте, кандидатам с какими особенностями здоровья вакансия подходит лучше всего",
  },
  {
    route: "/companies/hire/step-1",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "С какими задачами могут справиться кандидаты и какие задачи могут вызвать сложности. Форма инвалидности / ...",
    sectionAnchor: "s1-match",
    sectionTitle:
      "Подумайте, кандидатам с какими особенностями здоровья вакансия подходит лучше всего",
  },
  {
    route: "/companies/hire/step-1",
    component: "DataTable",
    variant: null,
    semanticType: "пример",
    snippet:
      "Вакансия: Сборщик заказов на складе. Комплектация заказов / Взвешивание и упаковка / Сверка товара / Маркировка",
    sectionAnchor: "s1-match",
    sectionTitle:
      "Подумайте, кандидатам с какими особенностями здоровья вакансия подходит лучше всего",
  },
  {
    route: "/companies/hire/step-1",
    component: "Disclosure",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Кейс 1 — Специалист по видеомонтажу; Кейс 2 — Консультант по психологической поддержке; Кейс 3 — Специалист техподдержки; Кейс 4 — Рабочий по уходу за растениями",
    sectionAnchor: "s1-cases",
    sectionTitle:
      "Прочитайте описание вакансии и подумайте, для какой формы инвалидности она подходит",
  },
  {
    route: "/companies/hire/step-1",
    component: "Paragraph",
    variant: null,
    semanticType: "задание",
    snippet:
      "Практика позволяет лучше закрепить материал. Предлагаем вам попробовать разобраться самим.. Прочитайте описание",
    sectionAnchor: "s1-cases",
    sectionTitle:
      "Прочитайте описание вакансии и подумайте, для какой формы инвалидности она подходит",
  },
  {
    route: "/companies/hire/step-1",
    component: "Paragraph",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например, на складе «Яндекс Маркета» для глухих и слабослышащих исполнителей выделили участок, где не ездит",
    sectionAnchor: "s1-safety",
    sectionTitle:
      "5. Оцените безопасность вакансии вместе со специалистами охраны труда",
  },
  {
    route: "/companies/hire/step-1",
    component: "Paragraph",
    variant: null,
    semanticType: "пример",
    snippet:
      "Пример: ювелиру необходимо обсуждать детали изделий с клиентами. Для глухого или слабослышащего сотрудника",
    sectionAnchor: "s1-redistribute",
    sectionTitle: "Передача недоступной задачи другому специалисту",
  },
  {
    route: "/companies/hire/step-1",
    component: "Paragraph",
    variant: null,
    semanticType: "пример",
    snippet:
      "Пример: в вакансии Специалист по контекстной рекламе есть функция «еженедельно представлять устные отчёты»",
    sectionAnchor: "s1-swap",
    sectionTitle: "Обмен задачами между коллегами на основе сильных сторон",
  },
  {
    route: "/companies/hire/step-1",
    component: "Paragraph",
    variant: null,
    semanticType: "пример",
    snippet:
      "Пример: кандидат с ментальной инвалидностью хорошо справляется с повторяющимися задачами по чёткому алгоритму.",
    sectionAnchor: "s1-newrole",
    sectionTitle:
      "Создание новой роли, основанной на сильных сторонах специалистов",
  },
  {
    route: "/companies/hire/step-1",
    component: "Paragraph",
    variant: null,
    semanticType: "пример",
    snippet:
      "Пример: в вакансии Оператор колл-центра есть функция «вручную заносить типовые обращения клиентов в CRM-систему»",
    sectionAnchor: "s1-automation",
    sectionTitle: "Автоматизация процессов",
  },
  {
    route: "/companies/hire/step-1",
    component: "Paragraph",
    variant: null,
    semanticType: "задание",
    snippet:
      "Выберите вакансию для пилотного найма. Прежде чем начинать поиск кандидатов, важно выбрать правильную точку входа",
    sectionAnchor: "s1-task",
    sectionTitle: "Практическое задание для работодателей",
  },
  {
    route: "/companies/hire/step-1",
    component: "RelatedLinks",
    variant: null,
    semanticType: "прочее",
    snippet: "Шаг 2. Внутренний аудит; Договор и оформление; Стоит ли начинать",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/companies/hire/step-2",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "Такой аудит помогает: заранее оценить, сможет ли кандидат безопасно и эффективно выполнять работу; выявить барьеры",
    sectionAnchor: null,
    sectionTitle: "PageHero (Шаг 2. Внутренний аудит рабочей среды...)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Callout",
    variant: "briefing",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: кто может проводить аудит; что важно проверить на каждом этапе пути кандидата",
    sectionAnchor: null,
    sectionTitle: "PageHero (Шаг 2. Внутренний аудит рабочей среды...)",
  },
  {
    route: "/companies/hire/step-2",
    component: "DataTable",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Специалист / Когда — для чего подключать: HR — на этапах подбора, собеседования, оформления и онбординга",
    sectionAnchor: "s2-participants",
    sectionTitle: "Участники аудита",
  },
  {
    route: "/companies/hire/step-2",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "На контрольно-пропускном пункте охранник общается только устно. Глухому или слабослышащему кандидату будет сложно",
    sectionAnchor: "s2-participants",
    sectionTitle: "Участники аудита (h3: Эксперт — проводник в аудите)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Callout",
    variant: "info",
    semanticType: "совет",
    snippet:
      "Важный нюанс: даже у людей с одинаковой формой инвалидности потребности могут различаться. Поэтому по возможности",
    sectionAnchor: "s2-participants",
    sectionTitle: "Участники аудита (h3: Эксперт — проводник в аудите)",
  },
  {
    route: "/companies/hire/step-2",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "при аудите вакансии для глухих и слабослышащих сотрудников полезно пригласить и глухого, и слабослышащего эксперта",
    sectionAnchor: "s2-participants",
    sectionTitle: "Участники аудита (h3: Эксперт — проводник в аудите)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Paragraph",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например, для сотрудницы, использующей кресло-коляску, заранее подготовили рабочее место. Однако после выхода на работу",
    sectionAnchor: "s2-check",
    sectionTitle: "Что важно проверить во время аудита",
  },
  {
    route: "/companies/hire/step-2",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "Пример. Во время одного из аудитов представитель работодателя сопровождал глухого сотрудника по пути от склада",
    sectionAnchor: "s2-check",
    sectionTitle: "Что важно проверить во время аудита",
  },
  {
    route: "/companies/hire/step-2",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "указано, что вакансия доступна для людей с инвалидностью; обязанности сотрудника описаны понятно и конкретно",
    sectionAnchor: "s2-check",
    sectionTitle:
      "Что важно проверить во время аудита (h3: Публикация вакансии)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "кандидат получает понятную и доступную информацию о том, как добраться до места: описание маршрута, ориентиры",
    sectionAnchor: "s2-check",
    sectionTitle:
      "Что важно проверить во время аудита (h3: Дорога до собеседования или места работы)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "кандидат понимает порядок действий до начала собеседования: какие документы понадобятся на проходной",
    sectionAnchor: "s2-check",
    sectionTitle: "Что важно проверить во время аудита (h3: Собеседование)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "понятны ли документы по содержанию; предусмотрено ли время для ответов на вопросы сотрудника",
    sectionAnchor: "s2-check",
    sectionTitle:
      "Что важно проверить во время аудита (h3: Оформление документов)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "сотруднику понятен план первого рабочего дня: что будет происходить, в какой последовательности и кто отвечает",
    sectionAnchor: "s2-check",
    sectionTitle:
      "Что важно проверить во время аудита (h3: Инструктаж и обучение)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "может ли сотрудник без препятствий попасть в здание; может ли он самостоятельно добраться до рабочего места",
    sectionAnchor: "s2-check",
    sectionTitle:
      "Что важно проверить во время аудита (h3: Рабочее место и физическая среда)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "задачи сотрудника сформулированы понятно и конкретно; заранее понятно, какой результат считается успешным",
    sectionAnchor: "s2-check",
    sectionTitle:
      "Что важно проверить во время аудита (h3: Рабочие процессы и задачи)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "корпоративные сервисы, программы и внутренние системы соответствуют базовым требованиям цифровой доступности",
    sectionAnchor: "s2-check",
    sectionTitle:
      "Что важно проверить во время аудита (h3: Материалы и цифровые сервисы)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "порядок действий при тревоге или эвакуации понятен сотруднику; сигналы оповещения доступны в разных форматах",
    sectionAnchor: "s2-check",
    sectionTitle:
      "Что важно проверить во время аудита (h3: Безопасность и экстренные ситуации)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Checklist",
    variant: null,
    semanticType: "задание",
    snippet:
      "какие цифровые сервисы использует сотрудник; доступны ли они с точки зрения интерфейса; как проходят онлайн-встречи",
    sectionAnchor: "s2-check",
    sectionTitle:
      "Что важно проверить во время аудита (h3: Особенности аудита удалённой работы)",
  },
  {
    route: "/companies/hire/step-2",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "принимать входящие звонки; отвечать на сообщения клиентов в чате; вносить данные в CRM-систему",
    sectionAnchor: "s2-brief",
    sectionTitle:
      "Как составить техническое задание на аудит (h3: Функционал вакансии)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Аудит может дать вполне конкретные результаты. Например, помочь определить: список выявленных барьеров",
    sectionAnchor: "s2-brief",
    sectionTitle:
      "Как составить техническое задание на аудит (h3: Какой результат важно получить)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 1. Проводить аудит слишком поздно. Одна из самых распространённых ошибок — начинать аудит, когда сотрудник",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 1)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 2. Полностью перекладывать аудит на внешнего эксперта. Иногда работодателю кажется, что достаточно пригласить",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 2)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 3. Оценивать доступность без участия эксперта. Иногда компания пытается определить возможные сложности",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 3)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 4. Проводить аудит без технического задания. Без технического задания аудит часто получается слишком общим",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 4)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 5. Проверять только пространство и игнорировать весь путь сотрудника. Работодатели часто сводят аудит к проверке",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 5)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 6. Считать, что одного эксперта достаточно. Иногда работодателю кажется, что один эксперт сможет оценить",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 6)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 7. Проверять компанию в целом, а не конкретную вакансию. Во время аудита важно оценивать не абстрактную готовность",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 7)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 8. Считать, что аудит не нужен для удалённой работы. Удалённая работа часто кажется более простым вариантом",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 8)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 9. Фиксировать замечания, но не переводить их в план действий. Иногда аудит заканчивается подробным отчётом",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 9)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 10. Сразу думать о дорогих изменениях и не замечать простых решений. У некоторых работодателей инклюзивный наём",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 10)",
  },
  {
    route: "/companies/hire/step-2",
    component: "ContentSection",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Ошибка 11. Пытаться сначала создать идеальные условия, а потом начинать наём. Иногда компания годами готовится",
    sectionAnchor: "s2-mistakes",
    sectionTitle:
      "Типичные ошибки работодателей при проведении аудита (h3: Ошибка 11)",
  },
  {
    route: "/companies/hire/step-2",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Практическое задание для работодателя — Создайте свой чек-лист аудита. Теперь ваша задача — создать собственный чек-лист",
    sectionAnchor: "s2-summary",
    sectionTitle: "Подведём итоги",
  },
  {
    route: "/companies/hire/step-3",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: что такое разумная адаптация; как адаптировать физическую среду;",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/companies/hire/step-3",
    component: "Callout",
    variant: "info",
    semanticType: "совет",
    snippet:
      "Если сотрудник с инвалидностью будет работать полностью удалённо, раздел про адаптацию физической среды можно пропустить",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/companies/hire/step-3",
    component: "Paragraph",
    variant: null,
    semanticType: "определение",
    snippet:
      "Разумная адаптация — это изменения в рабочей среде, процессах, материалах или коммуникации, которые помогают сотруднику",
    sectionAnchor: "s3-reasonable",
    sectionTitle: "Что такое разумная адаптация",
  },
  {
    route: "/companies/hire/step-3",
    component: "Callout",
    variant: "highlight",
    semanticType: "пример",
    snippet:
      "Для сотрудника, использующего кресло-коляску, заранее расширили проход, убрали лишнюю мебель и подготовили доступную",
    sectionAnchor: "s3-reasonable",
    sectionTitle: "Что такое разумная адаптация",
  },
  {
    route: "/companies/hire/step-3",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Базовые решения по подготовке к нештатным ситуациям по группам сотрудников",
    sectionAnchor: "s3-physical-emergency",
    sectionTitle: "Как подготовить пространство к нештатным ситуациям",
  },
  {
    route: "/companies/hire/step-3",
    component: "Callout",
    variant: "briefing",
    semanticType: "задание",
    snippet:
      "Что говорит бизнес: Как вы решили вопрос с безопасностью сотрудников с инвалидностью на рабочих местах при нештатных",
    sectionAnchor: "s3-physical-emergency",
    sectionTitle: "Как подготовить пространство к нештатным ситуациям",
  },
  {
    route: "/companies/hire/step-3",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet: "Базовые решения для входа и навигации по группам сотрудников",
    sectionAnchor: "s3-physical-entry",
    sectionTitle: "Как убрать барьеры на входе и в навигации",
  },
  {
    route: "/companies/hire/step-3",
    component: "Paragraph",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например, если вся команда работает на третьем этаже, а сотрудника, использующего кресло-коляску, размещают на первом",
    sectionAnchor: "s3-physical-entry",
    sectionTitle: "Как убрать барьеры на входе и в навигации",
  },
  {
    route: "/companies/hire/step-3",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet: "Базовые решения для рабочего места по группам сотрудников",
    sectionAnchor: "s3-physical-workplace",
    sectionTitle: "Как адаптировать рабочее место под повседневные задачи",
  },
  {
    route: "/companies/hire/step-3",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet: "Базовые решения для общих зон по группам сотрудников",
    sectionAnchor: "s3-physical-common",
    sectionTitle: "Как убрать барьеры в общих зонах",
  },
  {
    route: "/companies/hire/step-3",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Для офисных сотрудников с особенностями здоровья адаптированы общие и рабочие пространства. Например, для сотрудников",
    sectionAnchor: "s3-physical-business",
    sectionTitle: "Что говорит бизнес",
  },
  {
    route: "/companies/hire/step-3",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Инвалидность у всех разная, и универсальных решений нет — есть конкретный человек с конкретными потребностями.",
    sectionAnchor: "s3-physical-people",
    sectionTitle: "Что говорят люди с инвалидностью",
  },
  {
    route: "/companies/hire/step-3",
    component: "BulletList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "инструкции; документы; шаблоны; обучающие материалы; внутренние сервисы; рабочие чаты;",
    sectionAnchor: "s3-digital",
    sectionTitle:
      "Как адаптировать материалы, цифровые сервисы и рабочие инструменты",
  },
  {
    route: "/companies/hire/step-3",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Базовые решения для рабочих и обучающих материалов по группам сотрудников",
    sectionAnchor: "s3-digital-materials",
    sectionTitle: "Как сделать рабочие и обучающие материалы доступными",
  },
  {
    route: "/companies/hire/step-3",
    component: "Paragraph",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "Хорошим помощником при адаптации материалов может стать нейросеть. Мы подготовили промпт, который вы можете использовать",
    sectionAnchor: "s3-digital-materials",
    sectionTitle: "Как сделать рабочие и обучающие материалы доступными",
  },
  {
    route: "/companies/hire/step-3",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Базовые решения для рабочих инструментов и техники по группам сотрудников",
    sectionAnchor: "s3-digital-tools",
    sectionTitle: "Как настроить рабочие инструменты и технику",
  },
  {
    route: "/companies/hire/step-3",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Сотрудник с особенностями зрения, скорее всего, сможет пользоваться базовыми стандартными программами, веб-сайтами",
    sectionAnchor: "s3-digital-people-tools",
    sectionTitle: "Что говорят люди с инвалидностью",
  },
  {
    route: "/companies/hire/step-3",
    component: "CollapsibleBlock",
    variant: null,
    semanticType: "сравнение",
    snippet: "Таблица: нейросети и инструменты по группам сотрудников",
    sectionAnchor: "s3-digital-ai",
    sectionTitle: "Как нейросети помогают в работе",
  },
  {
    route: "/companies/hire/step-3",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "В работе ИИ помогает мне почти каждый день. В работе он объясняет код, пишет тексты и помогает ориентироваться",
    sectionAnchor: "s3-digital-people-ai",
    sectionTitle: "Что говорят люди с инвалидностью",
  },
  {
    route: "/companies/hire/step-3",
    component: "Callout",
    variant: "briefing",
    semanticType: "задание",
    snippet:
      "Что говорит бизнес: Приведите примеры адаптации материалов, цифровых сервисов, рабочих инструментов для людей",
    sectionAnchor: "s3-digital-business",
    sectionTitle: "Что говорит бизнес",
  },
  {
    route: "/companies/hire/step-3",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet: "Что важно объяснить руководителю и команде",
    sectionAnchor: "s3-team-prepare",
    sectionTitle: "Как подготовить руководителя и команду",
  },
  {
    route: "/companies/hire/step-3",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet: "Основные особенности коммуникации по группам сотрудников",
    sectionAnchor: "s3-team-prepare",
    sectionTitle: "Как подготовить руководителя и команду",
  },
  {
    route: "/companies/hire/step-3",
    component: "Callout",
    variant: "briefing",
    semanticType: "задание",
    snippet:
      "Что говорит бизнес: Как вы готовили команду и руководителя к выходу сотрудников с инвалидностью. Поделитесь опытом.",
    sectionAnchor: "s3-team-business",
    sectionTitle: "Что говорит бизнес",
  },
  {
    route: "/companies/hire/step-3",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Составьте план адаптации инклюзивной среды. Вы уже: выбрали вакансию, определили кандидатов, составили чек-лист",
    sectionAnchor: "s3-task",
    sectionTitle: "Практическое задание для работодателей",
  },
  {
    route: "/companies/hire/step-3",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Остались вопросы? Есть пожелания? Оставьте их здесь. Мы учтём их в следующей редакции гида.",
    sectionAnchor: "s3-task",
    sectionTitle: "Практическое задание для работодателей",
  },
  {
    route: "/companies/hire/step-4",
    component: "Callout",
    variant: "briefing",
    semanticType: "задание",
    snippet:
      "Практическое задание. Давайте сразу перейём к практике. Прочитайте описание вакансии и оцените её по нескольким критериям.",
    sectionAnchor: "step4-vacancy",
    sectionTitle: "Практическое задание",
  },
  {
    route: "/companies/hire/step-4",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "Должность: Администратор в офис. Требуемый опыт: 1–3 года. Обязанности: обеспечение жизнедеятельности офиса…",
    sectionAnchor: "step4-vacancy",
    sectionTitle: "Практическое задание",
  },
  {
    route: "/companies/hire/step-4",
    component: "BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Критерии для оценки вакансии: ☐ Все задачи сотрудника понятны. ☐ В вакансии нет расплывчатых требований…",
    sectionAnchor: "step4-vacancy",
    sectionTitle: "Практическое задание",
  },
  {
    route: "/companies/hire/step-4",
    component: "Disclosure",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Обратная связь. Эта вакансия содержит сразу несколько серьёзных ошибок. Некоторые формулировки могут быть дискриминационными…",
    sectionAnchor: "step4-vacancy",
    sectionTitle: "Практическое задание",
  },
  {
    route: "/companies/hire/step-4",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "Должность: Администратор офиса. Вакансия открыта для соискателей с инвалидностью. Ключевые задачи: приём и размещение посетителей…",
    sectionAnchor: "step4-vacancy",
    sectionTitle: "Пример переработанной вакансии",
  },
  {
    route: "/companies/hire/step-4",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "Должность: Тестировщик программного обеспечения (QA Engineer). Вакансия открыта для соискателей с инвалидностью…",
    sectionAnchor: "step4-vacancy",
    sectionTitle: "Пример переработанной вакансии",
  },
  {
    route: "/companies/hire/step-4",
    component: "Disclosure",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Где искать кандидатов с инвалидностью — пять каналов: НКО, Работные сайты, Службы занятости населения, Вузы и колледжи…",
    sectionAnchor: "step4-vacancy",
    sectionTitle: "Где искать кандидатов с инвалидностью",
  },
  {
    route: "/companies/hire/step-4",
    component: "DataTable",
    variant: null,
    semanticType: "совет",
    snippet:
      "Определите канал связи. Глухие и слабослышащие кандидаты — Не звонить без предварительного согласования…",
    sectionAnchor: "step4-interview",
    sectionTitle: "Определите канал связи",
  },
  {
    route: "/companies/hire/step-4",
    component: "DataTable",
    variant: null,
    semanticType: "совет",
    snippet:
      "Обсудите формат встречи. Глухие и слабослышащие кандидаты — Предупредить охрану или администратора…",
    sectionAnchor: "step4-interview",
    sectionTitle: "Обсудите формат встречи",
  },
  {
    route: "/companies/hire/step-4",
    component: "DataTable",
    variant: null,
    semanticType: "совет",
    snippet:
      "Подготовьте материалы. Незрячие и слабовидящие кандидаты — Отправлять материалы в редактируемом текстовом формате…",
    sectionAnchor: "step4-interview",
    sectionTitle: "Подготовьте материалы",
  },
  {
    route: "/companies/hire/step-4",
    component: "DataTable",
    variant: null,
    semanticType: "совет",
    snippet:
      "Адаптируйте коммуникацию. Глухие и слабослышащие кандидаты — Говорить, глядя на человека, не отворачиваться…",
    sectionAnchor: "step4-interview",
    sectionTitle: "Адаптируйте коммуникацию",
  },
  {
    route: "/companies/hire/step-4",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "кандидат с РАС может избегать зрительного контакта; кандидат с особенностями речи может отвечать с паузами, заикаться…",
    sectionAnchor: "step4-interview",
    sectionTitle: "Оценивайте компетенции, а не особенности здоровья",
  },
  {
    route: "/companies/hire/step-4",
    component: "BulletList",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "«Есть ли что-то, что нам важно учесть в формате работы или коммуникации?» «Какие инструменты или условия помогут…»",
    sectionAnchor: "step4-interview",
    sectionTitle: "Оценивайте компетенции, а не особенности здоровья",
  },
  {
    route: "/companies/hire/step-4",
    component: "Disclosure",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Ситуация 1. Соискатель заметно заикается и делает паузы… (7 ситуаций собеседования с вариантами действий и обратной связью)",
    sectionAnchor: "step4-situations",
    sectionTitle: "Разбор ситуаций собеседования",
  },
  {
    route: "/companies/hire/step-4",
    component: "Disclosure",
    variant: null,
    semanticType: "совет",
    snippet:
      "Совет 1. Объясните порядок оформления… (8 советов по оформлению сотрудника с инвалидностью)",
    sectionAnchor: "step4-hiring",
    sectionTitle: "Оформление сотрудников с инвалидностью",
  },
  {
    route: "/companies/hire/step-4",
    component: "Callout",
    variant: "briefing",
    semanticType: "задание",
    snippet:
      "Практическое задание для работодателей. В шаге 1 вы выбрали вакансию, на которую будете искать кандидатов…",
    sectionAnchor: "step4-hiring",
    sectionTitle: "Практическое задание для работодателей",
  },
  {
    route: "/companies/hire/step-4",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Остались вопросы или пожелания? Оставьте их здесь. Мы учтём ваши комментарии при подготовке следующей версии гида.",
    sectionAnchor: "step4-hiring",
    sectionTitle: "Остались вопросы или пожелания?",
  },
  {
    route: "/companies/hire/step-5",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: почему адаптация важна в том числе для сотрудников с приобретённой инвалидностью",
    sectionAnchor: null,
    sectionTitle:
      "PageHero (Шаг 5. Онбординг и сопровождение сотрудника с инвалидностью)",
  },
  {
    route: "/companies/hire/step-5",
    component: "CompareColumns",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Разумная адаптация / Гиперопека: договориться об удобном формате коммуникации … выполнять задачи за сотрудника",
    sectionAnchor: "step5-newcomers",
    sectionTitle: "Почему адаптация важна для новичков",
  },
  {
    route: "/companies/hire/step-5",
    component: "Callout",
    variant: "warning",
    semanticType: "предупреждение",
    snippet:
      "Положительная дискриминация. Более того, такая ситуация может привести к положительной дискриминации.",
    sectionAnchor: "step5-newcomers",
    sectionTitle: "Почему адаптация важна для новичков",
  },
  {
    route: "/companies/hire/step-5",
    component: "Paragraph",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например, сотрудник работал менеджером на складе … После несчастного случая он потерял ноги и теперь передвигается на протезах.",
    sectionAnchor: "step5-acquired",
    sectionTitle:
      "Почему адаптация важна для сотрудников с приобретённой инвалидностью",
  },
  {
    route: "/companies/hire/step-5",
    component: "Callout",
    variant: "info",
    semanticType: "предупреждение",
    snippet:
      "НКО не заменяет работодателя. При этом НКО не заменяет руководителя, HR или наставника.",
    sectionAnchor: "step5-roles",
    sectionTitle: "Кто может помочь адаптироваться сотруднику с инвалидностью",
  },
  {
    route: "/companies/hire/step-5",
    component: "DataTable",
    variant: null,
    semanticType: "совет",
    snippet:
      "Группа сотрудников / Какие базовые решения можно использовать — график работы (ОДА, ментальная, хронические заболевания)",
    sectionAnchor: "step5-process-schedule",
    sectionTitle: "Как адаптировать график работы",
  },
  {
    route: "/companies/hire/step-5",
    component: "DataTable",
    variant: null,
    semanticType: "совет",
    snippet:
      "Группа сотрудников / Какие базовые решения можно использовать — постановка задач (слух, зрение, ментальная)",
    sectionAnchor: "step5-process-tasks",
    sectionTitle: "Как ставить задачи",
  },
  {
    route: "/companies/hire/step-5",
    component: "DataTable",
    variant: null,
    semanticType: "совет",
    snippet:
      "Группа сотрудников / Какие базовые решения можно использовать — командная коммуникация (слух, зрение, ментальная, речь)",
    sectionAnchor: "step5-process-comm",
    sectionTitle: "Как сделать командную коммуникацию удобной",
  },
  {
    route: "/companies/hire/step-5",
    component: "DataTable",
    variant: null,
    semanticType: "совет",
    snippet:
      "Группа сотрудников / Какие базовые решения можно использовать — обратная связь (слух, ментальная)",
    sectionAnchor: "step5-process-feedback",
    sectionTitle:
      "Как контролировать результаты работы и давать обратную связь",
  },
  {
    route: "/companies/hire/step-5",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Ситуация 1. Сотрудник без предупреждения не выходит на работу … (8 ситуаций-тренажёров: варианты реакции + блок «Обратная связь»)",
    sectionAnchor: "step5-cases",
    sectionTitle: "Что делать, если адаптация идёт не по плану",
  },
  {
    route: "/companies/hire/step-5",
    component: "Callout",
    variant: "info",
    semanticType: "промпт-шаблон",
    snippet:
      "Что говорит бизнес. С какими сложностями вы сталкивались на этапе онбординга … можно использовать нейросеть как инструмент для анализа ситуации",
    sectionAnchor: "step5-cases",
    sectionTitle: "Что делать, если адаптация идёт не по плану",
  },
  {
    route: "/companies/hire/step-6",
    component: "Callout",
    variant: "highlight",
    semanticType: "предупреждение",
    snippet:
      "Время — тоже ресурс. При этом важно учитывать не только финансовые, но и временные затраты. Они возникают",
    sectionAnchor: "step6-intro",
    sectionTitle: "Введение",
  },
  {
    route: "/companies/hire/step-6",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: какие первоначальные затраты могут возникнуть при подготовке к инклюзивному найму",
    sectionAnchor: "step6-intro",
    sectionTitle: "Введение",
  },
  {
    route: "/companies/hire/step-6",
    component: "Disclosure",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Затраты на аудит / Затраты на адаптацию физической среды / Затраты на адаптацию материалов… (6 статей первоначальных расходов)",
    sectionAnchor: "pervonachalnye",
    sectionTitle:
      "Какие первоначальные затраты могут возникнуть и как их оптимизировать",
  },
  {
    route: "/companies/hire/step-6",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Группа сотрудников / Какие затраты могут возникнуть — затраты на адаптацию физической среды по группам",
    sectionAnchor: "pervonachalnye",
    sectionTitle:
      "Какие первоначальные затраты могут возникнуть и как их оптимизировать",
  },
  {
    route: "/companies/hire/step-6",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Группа сотрудников / Какие затраты могут возникнуть — адаптация материалов, цифровых сервисов и инструментов",
    sectionAnchor: "pervonachalnye",
    sectionTitle:
      "Какие первоначальные затраты могут возникнуть и как их оптимизировать",
  },
  {
    route: "/companies/hire/step-6",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Группа сотрудников / Какие затраты могут возникнуть — наём, собеседование и оформление",
    sectionAnchor: "pervonachalnye",
    sectionTitle:
      "Какие первоначальные затраты могут возникнуть и как их оптимизировать",
  },
  {
    route: "/companies/hire/step-6",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Группа сотрудников / Какие регулярные расходы могут возникнуть — поддержка инфраструктуры по группам",
    sectionAnchor: "regulyarnye-infra",
    sectionTitle: "Поддержка инфраструктуры",
  },
  {
    route: "/companies/hire/step-6",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Группа сотрудников / Какие регулярные расходы могут возникнуть — время команды по группам",
    sectionAnchor: "regulyarnye-time",
    sectionTitle: "Время команды",
  },
  {
    route: "/companies/hire/step-6",
    component: "Callout",
    variant: "highlight",
    semanticType: "совет",
    snippet:
      "Инвестиция в устойчивость бизнеса. Инклюзивное трудоустройство — это инвестиция в устойчивость бизнеса.",
    sectionAnchor: "itogi",
    sectionTitle: "Подведём итоги",
  },
  {
    route: "/companies/hire/step-6",
    component: "Card",
    variant: null,
    semanticType: "задание",
    snippet:
      "Составьте список затрат на инклюзивный наём. Это задание поможет оценить реальный объём ресурсов…",
    sectionAnchor: "zadanie",
    sectionTitle: "Практическое задание для работодателей",
  },
  {
    route: "/companies/team",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом модуле вы узнаете. Что говорят компании и НКО: как общаться с людьми с инвалидностью без неловкости",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/companies/team",
    component: "ContentSection+ BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Какие общие формулировки допустимы: человек с инвалидностью; человек с особенностями здоровья; человек с особенностями развития",
    sectionAnchor: "team-terms",
    sectionTitle: "Как говорить о людях с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "ContentSection+ BulletList",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Чего избегать: выражения «особые потребности»; противопоставлений вроде «нормальные люди»; сравнений «здоровые люди» и «инвалиды»",
    sectionAnchor: "team-terms",
    sectionTitle: "Как говорить о людях с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "«у него диабет» вместо «он страдает диабетом»; «девушка с ДЦП» вместо «девушка, страдающая ДЦП»",
    sectionAnchor: "team-terms",
    sectionTitle: "Как говорить о людях с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Терминологический квиз по пяти категориям (Зрение, Слух, Речь, Передвижение, Ментальная инвалидность) — предпочтительные формулировки и обратная связь",
    sectionAnchor: "team-quiz",
    sectionTitle:
      "Выберите, какие слова и формулировки допустимо использовать в отношении людей с разными особенностями здоровья",
  },
  {
    route: "/companies/team",
    component: "Card",
    variant: null,
    semanticType: "совет",
    snippet:
      "8 карточек-рекомендаций: 1. Обращайтесь напрямую к человеку; 2. Будьте терпеливы; ... 8. Главное правило",
    sectionAnchor: "team-rules",
    sectionTitle: "Как общаться с людьми с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "5 ситуаций-тренажёров с вариантами реакции (верно/не стоит/неверно) и обратной связью «ОС»",
    sectionAnchor: "team-rules",
    sectionTitle: "Как общаться с людьми с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Что советует Олег: «Мне важно, чтобы собеседник был моим проводником в визуальном мире...» (незрячий юрист)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: Представляйтесь при встрече и предупреждайте, когда уходите; Кратко описывайте пространство",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Что советует Марина: «Перед началом разговора убедитесь, что я на вас смотрю...» (слабослышащий сисадмин)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: Перед началом разговора убедитесь, что человек вас видит; Говорите чётко и спокойно",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Что советует Артём: «Когда вы стоите рядом со мной, мне приходится постоянно смотреть вверх...» (UX-дизайнер на коляске)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: По возможности разговаривайте с человеком на одном уровне; Прежде чем помогать, спросите",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Что советует Анна: «Для меня важнее всего ясность и порядок...» (гончар с ментальной инвалидностью)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: Формулируйте задачи максимально конкретно; По возможности используйте примеры, фотографии",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Что советует Максим: «Пожалуйста, дайте мне договорить...» (продавец лакокрасочных материалов, заикается)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: Не перебивайте и не договаривайте фразы за человека; Дайте собеседнику время",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Что советует Игорь: «Моя инвалидность незаметна окружающим...» (аналитик с аутоиммунным заболеванием)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: Не оценивайте состояние человека по внешнему виду; Не ставьте под сомнение слова коллеги",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "Callout",
    variant: "info",
    semanticType: "совет",
    snippet:
      "Совет руководителю: Если сотрудник сообщил об особенностях здоровья, обсудите с ним условия...",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "На самом деле всё проще, чем кажется. Для уважительного общения не нужно помнить десятки правил...",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения с людьми с разными формами инвалидности",
  },
  {
    route: "/companies/team",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Гульфия Коновалова, слабослышащий бригадир в Яндекс Маркете: «Главное — не бойтесь. Если я не поняла, переспрошу...»",
    sectionAnchor: "team-yandex",
    sectionTitle: "Что говорят сотрудники с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Ксения Ломакина, дизайнер продукта на коляске в HR Tech Яндекса: «Обычно достаточно общаться с людьми на коляске так же...»",
    sectionAnchor: "team-yandex",
    sectionTitle: "Что говорят сотрудники с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Анатолий Попко, незрячий руководитель группы тестирования: «Попытайтесь преодолеть свои сомнения и неуверенность...»",
    sectionAnchor: "team-yandex",
    sectionTitle: "Что говорят сотрудники с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например: человек на коляске не может попасть в здание из-за отсутствия пандуса; участнику с особенностями слуха сложно следить",
    sectionAnchor: "team-events",
    sectionTitle:
      "Как подготовить и провести мероприятие с участием людей с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "Paragraph+ BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Оборудование площадки — Вход и перемещение / Зоны для гостей / Безопасность: пандусы пологие, места с обзором, читаемые указатели",
    sectionAnchor: "team-events",
    sectionTitle:
      "Как подготовить и провести мероприятие с участием людей с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "Paragraph+ BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Ясность и доступность контента — Перевод / Раздаточные материалы / Подача информации / Цифровая доступность",
    sectionAnchor: "team-events",
    sectionTitle:
      "Как подготовить и провести мероприятие с участием людей с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Подготовка команды организаторов: провести короткий инструктаж по этике; назначить сотрудников для помощи",
    sectionAnchor: "team-events",
    sectionTitle:
      "Как подготовить и провести мероприятие с участием людей с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "Paragraph+ Paragraph",
    variant: null,
    semanticType: "совет",
    snippet:
      "Анонс мероприятия: заранее сообщайте об условиях доступности; честно предупреждайте об ограничениях; уточняйте потребности",
    sectionAnchor: "team-events",
    sectionTitle:
      "Как подготовить и провести мероприятие с участием людей с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "Callout + CodeSnippet",
    variant: "info",
    semanticType: "промпт-шаблон",
    snippet:
      "ИИ-промпт: чек-лист доступного мероприятия — «Я организую [формат] на [N человек]... Помоги собрать чек-лист»",
    sectionAnchor: "team-events",
    sectionTitle:
      "Как подготовить и провести мероприятие с участием людей с инвалидностью",
  },
  {
    route: "/companies/team",
    component: "Lead + OrderedList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Давайте коротко резюмируем: 1. Замечайте человека, а не диагноз; 2. Опирайтесь на уважение и здравый смысл; ...",
    sectionAnchor: "team-summary",
    sectionTitle: "Подведём итоги",
  },
  {
    route: "/companies/team",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Остались вопросы или предложения? Помогите сделать следующую версию гида лучше — оставьте их здесь",
    sectionAnchor: "team-summary",
    sectionTitle: "Подведём итоги",
  },
  {
    route: "/ngo",
    component: "Callout",
    variant: "wip",
    semanticType: "прочее",
    snippet:
      "Видео с экспертами Яндекса. Короткое видео с экспертами Яндекса. Ролик появится здесь после получения файла.",
    sectionAnchor: "intro",
    sectionTitle: "Вступление",
  },
  {
    route: "/ngo",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Реалии и мифы — Реалии инклюзивного трудоустройства, плюсы для бизнеса, риски и короткая проверка мифов.",
    sectionAnchor: "basics",
    sectionTitle: "Основы",
  },
  {
    route: "/ngo",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Как устроен наём — Кто участвует в инклюзивном найме, какими путями люди находят работу, где искать кандидатов.",
    sectionAnchor: "basics",
    sectionTitle: "Основы",
  },
  {
    route: "/ngo",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Правовые основы — Договор, ИПРА, льготы, квоты, формы занятости. По конкретному правовому вопросу.",
    sectionAnchor: "basics",
    sectionTitle: "Основы",
  },
  {
    route: "/ngo",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Этика и коммуникация — Как говорить о людях с инвалидностью и с ними. Корректные слова, ситуации, памятки.",
    sectionAnchor: "basics",
    sectionTitle: "Основы",
  },
  {
    route: "/ngo",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Запустить программу — Решить, нужна ли программа вообще; собрать команду; проанализировать свою аудиторию.",
    sectionAnchor: "program",
    sectionTitle: "Программа НКО",
  },
  {
    route: "/ngo",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Работать с соискателем — Первичное интервью, профориентация, подбор вакансии, подготовка к собеседованию.",
    sectionAnchor: "program",
    sectionTitle: "Программа НКО",
  },
  {
    route: "/ngo",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Выходить на работодателей — Найти подходящих, провести первый контакт, презентовать кандидата, ответить на возражения.",
    sectionAnchor: "program",
    sectionTitle: "Программа НКО",
  },
  {
    route: "/ngo",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Сопровождать сотрудника — Выход на работу, первые недели, кризис-менеджмент, профилактика выгорания.",
    sectionAnchor: "program",
    sectionTitle: "Программа НКО",
  },
  {
    route: "/ngo",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Развивать и масштабировать — Дорожная карта, новая география, новая форма инвалидности, передача опыта.",
    sectionAnchor: "program",
    sectionTitle: "Программа НКО",
  },
  {
    route: "/ngo",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Финансировать программу — Из чего складывается бюджет, как писать заявку на грант, какие есть грантодатели.",
    sectionAnchor: "program",
    sectionTitle: "Программа НКО",
  },
  {
    route: "/ngo",
    component: "Paragraph",
    variant: null,
    semanticType: "факт-цифра",
    snippet:
      "По опыту экспертов только 10-20% участников программ трудоустройства в результате выходят на работу.",
    sectionAnchor: "intro",
    sectionTitle: "Вступление",
  },
  {
    route: "/ngo",
    component: "CollapsibleBlock",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Полезные каналы — список Telegram-каналов (Инклюзия в Яндексе, Совет бизнеса, Everland и др.).",
    sectionAnchor: "conclusion",
    sectionTitle: "Заключение",
  },
  {
    route: "/ngo",
    component: "Callout",
    variant: "wip",
    semanticType: "прочее",
    snippet:
      "Видео со словами напутствия. Финальное видео со словами напутствия от авторов гида. Появится здесь после получения файла.",
    sectionAnchor: "conclusion",
    sectionTitle: "Заключение",
  },
  {
    route: "/ngo/reality",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом модуле вы узнаете: что такое инвалидность, кто такие соискатели с инвалидностью, кому нужна помощь",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/ngo/reality",
    component: "CompareColumns",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Медицинский подход — фокусируется на диагнозе… / Социальный подход — фокусируется на среде…",
    sectionAnchor: "cs-approaches",
    sectionTitle: "Что такое инвалидность: медицинский и социальный подходы",
  },
  {
    route: "/ngo/reality",
    component: "Paragraph",
    variant: null,
    semanticType: "определение",
    snippet:
      "Социальный подход снимает с работодателя лишнюю тревогу. Вам не нужно быть врачом или реабилитологом…",
    sectionAnchor: "cs-approaches",
    sectionTitle: "Что такое инвалидность: медицинский и социальный подходы",
  },
  {
    route: "/ngo/reality",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например: Человек на инвалидной коляске не может подняться по лестнице, но отлично справится с работой в офисе…",
    sectionAnchor: "cs-approaches",
    sectionTitle: "Что такое инвалидность: медицинский и социальный подходы",
  },
  {
    route: "/ngo/reality",
    component: "Disclosure",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Глухие и слабослышащие люди / Люди с особенностями опорно-двигательного аппарата / Незрячие и слабовидящие…",
    sectionAnchor: "cs-applicants-forms",
    sectionTitle: "Особенности разных форм инвалидности",
  },
  {
    route: "/ngo/reality",
    component: "Callout",
    variant: "briefing",
    semanticType: "пример",
    snippet:
      "Пример: Человек был руководителем подразделения, но после перенесённого онкологического заболевания…",
    sectionAnchor: "cs-applicants-acquired",
    sectionTitle:
      "Врождённая и приобретенная инвалидность: почему это важно учитывать",
  },
  {
    route: "/ngo/reality",
    component: "BulletList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Почему кандидаты могут не раскрывать статус: боятся дискриминации на этапе собеседования…",
    sectionAnchor: "cs-who-needs-help-invisible",
    sectionTitle: "Когда инвалидность не видна",
  },
  {
    route: "/ngo/reality",
    component: "Callout",
    variant: "briefing",
    semanticType: "пример",
    snippet:
      "Пример: Слабослышащий сотрудник может пользоваться слуховым аппаратом и эффективно выполнять свои задачи…",
    sectionAnchor: "cs-who-needs-help-conditions",
    sectionTitle: "Когда требуются специальные условия труда",
  },
  {
    route: "/ngo/reality",
    component: "Disclosure",
    variant: null,
    semanticType: "миф-факт",
    snippet:
      "Миф 1. Сотрудники с инвалидностью берут больше отпусков за свой счёт… (9 карточек «Миф/Правда» с Badge)",
    sectionAnchor: "cs-myths",
    sectionTitle: "Мифы инклюзивного трудоустройства",
  },
  {
    route: "/ngo/reality",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "В компании «Уфанет» я проработал 9 лет. Изначально их CRM была неудобна для слабовидящих сотрудников…",
    sectionAnchor: "cs-myths-voices",
    sectionTitle: "Что говорят люди с инвалидностью и НКО",
  },
  {
    route: "/ngo/reality",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Елена более 10 лет проработала в маркетинге, потом поняла, что хочет в дизайн… (фонд «Действуй!»)",
    sectionAnchor: "cs-myths-voices",
    sectionTitle: "Что говорят люди с инвалидностью и НКО",
  },
  {
    route: "/ngo/reality",
    component: "CompareColumns",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Повысить имидж компании — возможности / Вызовы (серия из 6 блоков возможности↔вызовы)",
    sectionAnchor: "cs-why",
    sectionTitle: "Зачем внедрять инклюзивное трудоустройство",
  },
  {
    route: "/ngo/reality",
    component: "Callout",
    variant: "info",
    semanticType: "задание",
    snippet:
      "Ваш вариант: Если не нашли подходящий ответ, напишите свой. Мы ценим ваше мнение…",
    sectionAnchor: "cs-why",
    sectionTitle: "Зачем внедрять инклюзивное трудоустройство",
  },
  {
    route: "/ngo/reality",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Решение запустить направление трудоустройства людей с инвалидностью стало результатом понимания масштаба… (ОРБИ)",
    sectionAnchor: "cs-why-voices",
    sectionTitle: "Что говорят бизнес и НКО",
  },
  {
    route: "/ngo/reality",
    component: "Disclosure",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Правовое сопровождение / Финансовое планирование / Организация рабочих процессов… (6 направлений)",
    sectionAnchor: "cs-processes",
    sectionTitle: "Как выстроить устойчивые процессы",
  },
  {
    route: "/ngo/reality",
    component: "Callout",
    variant: "highlight",
    semanticType: "совет",
    snippet:
      "Итоговые рекомендации: Планируйте заранее… Обучайте команду… Сотрудничайте с экспертами…",
    sectionAnchor: "cs-processes",
    sectionTitle: "Как выстроить устойчивые процессы",
  },
  {
    route: "/ngo/reality",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Качество важнее скорости / Адаптация имеет свой ритм / Профессионализм вместо «вечной лояльности»… (5 карточек)",
    sectionAnchor: "cs-different",
    sectionTitle:
      "Чем трудоустройство людей с инвалидностью отличается от стандартного найма",
  },
  {
    route: "/ngo/reality",
    component: "Checklist",
    variant: null,
    semanticType: "прочее",
    snippet:
      "укрепить репутацию социально ответственной компании, обогатить команду за счёт разнообразия опыта…",
    sectionAnchor: "cs-summary",
    sectionTitle: "Подведём итоги",
  },
  {
    route: "/ngo/reality",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "Остались вопросы? Есть пожелания? Оставьте их здесь. Мы их учтём в следующей редакции гида.",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/ngo/how",
    component: "Callout",
    variant: "briefing",
    semanticType: "прочее",
    snippet:
      "В этом модуле вы узнаете: кто основные участники инклюзивного трудоустройства, где искать соискателей",
    sectionAnchor: "intro",
    sectionTitle: "Как работает инклюзивный наём: от поиска до партнёрства",
  },
  {
    route: "/ngo/how",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Соискатель с инвалидностью. Соискателю важно быть не пассивным благополучателем, а активным участником",
    sectionAnchor: "participants",
    sectionTitle: "Участники инклюзивного трудоустройства и их роли",
  },
  {
    route: "/ngo/how",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Работодатель. Работодатель — не благотворитель. Он хочет получить подготовленного, мотивированного сотрудника",
    sectionAnchor: "participants",
    sectionTitle: "Участники инклюзивного трудоустройства и их роли",
  },
  {
    route: "/ngo/how",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Некоммерческая организация (НКО). Многие НКО работают с людьми с инвалидностью годами",
    sectionAnchor: "participants",
    sectionTitle: "Участники инклюзивного трудоустройства и их роли",
  },
  {
    route: "/ngo/how",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Центр занятости населения (ЦЗН). Центр занятости выступает государственным регулятором",
    sectionAnchor: "participants",
    sectionTitle: "Участники инклюзивного трудоустройства и их роли",
  },
  {
    route: "/ngo/how",
    component: "BulletList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "До выхода на работу. Куратор помогает кандидату подготовить резюме, потренировать навыки собеседования",
    sectionAnchor: "supported",
    sectionTitle: "Сопровождаемое трудоустройство",
  },
  {
    route: "/ngo/how",
    component: "Disclosure",
    variant: null,
    semanticType: "прочее",
    snippet: "Telegram- и ВКонтакте-сообщества",
    sectionAnchor: "channels-direct",
    sectionTitle: "Прямой поиск и нетворкинг",
  },
  {
    route: "/ngo/how",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Где вы ищете соискателей с инвалидностью? Кандидатов с инвалидностью, которые готовы к самостоятельному поиску",
    sectionAnchor: "channels-business-says",
    sectionTitle: "Что говорит бизнес и НКО",
  },
  {
    route: "/ngo/how",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet: "Задача / Ответственность работодателя / Ответственность НКО",
    sectionAnchor: "responsibility",
    sectionTitle: "Взаимодействие работодателей и НКО: кто за что отвечает",
  },
  {
    route: "/ngo/how",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Ситуация 1. Подготовка Марины к собеседованию. Марину пригласили на собеседование на позицию",
    sectionAnchor: "quiz-marina",
    sectionTitle: "Ситуация 1. Подготовка Марины к собеседованию",
  },
  {
    route: "/ngo/how",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "ОС. Подготовка кандидата, включая психологическую поддержку и информирование о процессе, — это зона",
    sectionAnchor: "quiz-marina",
    sectionTitle: "Ситуация 1. Подготовка Марины к собеседованию",
  },
  {
    route: "/ngo/how",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Ситуация 2. Условия для работы Ильи. В компанию на позицию контент-менеджера приняли Илью",
    sectionAnchor: "quiz-ilya",
    sectionTitle: "Ситуация 2. Условия для работы Ильи",
  },
  {
    route: "/ngo/how",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "ОС. Создание доступной рабочей среды — это прямая ответственность работодателя. НКО может подсказать",
    sectionAnchor: "quiz-ilya",
    sectionTitle: "Ситуация 2. Условия для работы Ильи",
  },
  {
    route: "/ngo/how",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Ситуация 3. Подготовка коллектива к приходу Володи. Через несколько дней в магазин должен выйти новый",
    sectionAnchor: "quiz-volodya",
    sectionTitle: "Ситуация 3. Подготовка коллектива к приходу Володи",
  },
  {
    route: "/ngo/how",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "ОС. Подготовка коллектива должна начинаться до выхода нового сотрудника. Работодатель назначает встречу",
    sectionAnchor: "quiz-volodya",
    sectionTitle: "Ситуация 3. Подготовка коллектива к приходу Володи",
  },
  {
    route: "/ngo/how",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Ситуация 4. Формат планёрок для Нины. Нина вышла на работу в отдел документооборота. У нее ДЦП",
    sectionAnchor: "quiz-nina",
    sectionTitle: "Ситуация 4. Формат планёрок для Нины",
  },
  {
    route: "/ngo/how",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "ОС. Изменение формата рабочих процессов внутри команды — это ответственность работодателя",
    sectionAnchor: "quiz-nina",
    sectionTitle: "Ситуация 4. Формат планёрок для Нины",
  },
  {
    route: "/ngo/how",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Шаг 1: Успешный опыт. НКО предлагает бизнесу конкретного кандидата на открытую вакансию",
    sectionAnchor: "partnership-from-nko",
    sectionTitle: "Путь «От кандидата НКО к компании»",
  },
  {
    route: "/ngo/how",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Шаг 1: Поиск и первый контакт. Логичнее всего начать с поиска некоммерческих организаций",
    sectionAnchor: "partnership-from-company",
    sectionTitle: "Путь «От компании к НКО»",
  },
  {
    route: "/ngo/how",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Любому работодателю нужен работник, который быстро и качественно будет выполнять свою работу",
    sectionAnchor: "partnership-business-says",
    sectionTitle: "Что говорит бизнес и НКО",
  },
  {
    route: "/ngo/how",
    component: "Paragraph",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Как действовать. Сообщите партнёру (НКО) об этом заранее, как только стало известно о решении",
    sectionAnchor: "failure-frozen",
    sectionTitle:
      "Компания не готова продолжать наём (заморозка вакансий, изменение стратегии)",
  },
  {
    route: "/ngo/how",
    component: "Paragraph",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Как действовать. Проведите встречу и обсудите, почему кандидаты не подходят: завышены ли требования",
    sectionAnchor: "failure-no-candidates",
    sectionTitle:
      "НКО не может найти подходящих кандидатов (несоответствие профиля, долгий поиск)",
  },
  {
    route: "/ngo/how",
    component: "Paragraph",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Как действовать: Важно помнить, что непрохождение испытательного срока — это обычная рабочая ситуация",
    sectionAnchor: "failure-bad-experience",
    sectionTitle:
      "Неудачный опыт трудоустройства (например, сотрудник не прошел испытательный срок)",
  },
  {
    route: "/ngo/how",
    component: "Paragraph",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Как действовать: Используйте механизм обратной связи, прописанный в начале сотрудничества",
    sectionAnchor: "failure-broken-agreement",
    sectionTitle: "Нарушение договоренностей одной из сторон",
  },
  {
    route: "/ngo/how",
    component: "Paragraph",
    variant: null,
    semanticType: "миф-факт",
    snippet:
      "МИФ: инклюзивное трудоустройство для крупных компаний... Реальность: гибкость малого бизнеса часто",
    sectionAnchor: "myth-small-business",
    sectionTitle:
      "МИФ: инклюзивное трудоустройство для крупных компаний, у нас маленький бизнес — нам это не по силам и не по карману",
  },
  {
    route: "/ngo/how",
    component: "DataTable",
    variant: null,
    semanticType: "пример",
    snippet:
      "Город / Имя / Должность / Форма инвалидности — реальные примеры трудоустройства в малых компаниях",
    sectionAnchor: "myth-small-business",
    sectionTitle:
      "МИФ: инклюзивное трудоустройство для крупных компаний, у нас маленький бизнес — нам это не по силам и не по карману",
  },
  {
    route: "/ngo/how",
    component: "Paragraph",
    variant: null,
    semanticType: "миф-факт",
    snippet:
      "МИФ: работодатель должен быть идеально готов ко всему... Реальность: ждать идеальных условий",
    sectionAnchor: "myth-perfect-ready",
    sectionTitle:
      "МИФ: работодатель должен быть идеально готов ко всему ещё до появления кандидата с инвалидностью",
  },
  {
    route: "/ngo/how",
    component: "Paragraph",
    variant: null,
    semanticType: "миф-факт",
    snippet:
      "МИФ: НКО просто пришлёт нам резюме... Реальность: НКО не стоит воспринимать как кадровое агентство",
    sectionAnchor: "myth-just-resume",
    sectionTitle:
      "МИФ: НКО просто пришлёт нам резюме, а мы уже сами разберёмся",
  },
  {
    route: "/ngo/how",
    component: "Paragraph",
    variant: null,
    semanticType: "миф-факт",
    snippet:
      "МИФ: если мы возьмём человека с инвалидностью, НКО будет вечно... Реальность: цель НКО — помочь на старте",
    sectionAnchor: "myth-forever-care",
    sectionTitle:
      "МИФ: если мы возьмём человека с инвалидностью, НКО будет вечно приходить с ним на работу и опекать его",
  },
  {
    route: "/ngo/how",
    component: "Paragraph",
    variant: null,
    semanticType: "миф-факт",
    snippet:
      "МИФ: все люди с особенностями здоровья... Реальность: НКО работают с самыми разными людьми",
    sectionAnchor: "myth-severe-disability",
    sectionTitle:
      "МИФ: все люди с особенностями здоровья, с которыми работает НКО, имеют сложные формы инвалидности и нуждаются в постоянной помощи",
  },
  {
    route: "/ngo/how",
    component: "Paragraph",
    variant: null,
    semanticType: "миф-факт",
    snippet:
      "МИФ: НКО занимаются благотворительностью, а не профессиональным подбором. Реальность: НКО действительно",
    sectionAnchor: "myth-charity",
    sectionTitle:
      "МИФ: НКО занимаются благотворительностью, а не профессиональным подбором.",
  },
  {
    route: "/ngo/how",
    component: "Callout",
    variant: "info",
    semanticType: "промпт-шаблон",
    snippet:
      "ИИ-помощник. Если у вас возникли сложности в выстраивание партнерских отношений... за советом можно обратиться к ИИ",
    sectionAnchor: "summary",
    sectionTitle: "Подведём итоги",
  },
  {
    route: "/ngo/legal",
    component: "Callout",
    variant: "briefing",
    semanticType: "совет",
    snippet:
      "Для специалиста НКО. Эти же нормы — рабочий инструмент сопровождения. Куратор опирается на них, готовя соискателя",
    sectionAnchor: null,
    sectionTitle: "PageHero",
  },
  {
    route: "/ngo/legal",
    component: "BulletList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "работать по трудовому договору, заключать договор ГПХ, быть самозанятым исполнителем.",
    sectionAnchor: null,
    sectionTitle: "PageHero",
  },
  {
    route: "/ngo/legal",
    component: "BulletList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "что даёт справка об инвалидности, что такое ИПРА и как её соблюдать, какие льготы положены сотрудникам",
    sectionAnchor: "summary",
    sectionTitle: "Что разобрано в правовом разделе",
  },
  {
    route: "/ngo/legal",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Договор и оформление — Как оформить сотрудника по трудовому договору; справка об инвалидности, группы, ИПРА.",
    sectionAnchor: "full",
    sectionTitle: "Полный правовой раздел",
  },
  {
    route: "/ngo/legal",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Льготы и формы занятости — Какие льготы положены сотрудникам с инвалидностью и какие формы занятости доступны.",
    sectionAnchor: "full",
    sectionTitle: "Полный правовой раздел",
  },
  {
    route: "/ngo/legal",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Квоты и господдержка — Что такое квоты, как их выполнить, на какие субсидии и меры господдержки рассчитывать.",
    sectionAnchor: "full",
    sectionTitle: "Полный правовой раздел",
  },
  {
    route: "/ngo/legal",
    component: "Card",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Особые ситуации — Недееспособность, сохранение пособий при трудовом договоре, основания увольнения.",
    sectionAnchor: "full",
    sectionTitle: "Полный правовой раздел",
  },
  {
    route: "/ngo/legal",
    component: "Card",
    variant: null,
    semanticType: "faq",
    snippet:
      "Вопросы и ответы — Итоговый тест и частые вопросы по правовым нюансам трудоустройства.",
    sectionAnchor: "full",
    sectionTitle: "Полный правовой раздел",
  },
  {
    route: "/ngo/legal",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet: "Открыть полный правовой раздел",
    sectionAnchor: "full",
    sectionTitle: "Полный правовой раздел",
  },
  {
    route: "/ngo/legal",
    component: "RelatedLinks",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Выходить на работодателей · Работать с соискателем · Сопровождать сотрудника",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/ngo/ethics",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом материале вы узнаете: как общаться с людьми с инвалидностью без неловкости и лишних стереотипов",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "человек с инвалидностью; человек с особенностями здоровья; человек с особенностями развития.",
    sectionAnchor: "team-terms",
    sectionTitle: "Как говорить о людях с инвалидностью",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "выражения «особые потребности» — потребности есть у всех людей; противопоставлений вроде «нормальные люди»",
    sectionAnchor: "team-terms",
    sectionTitle: "Как говорить о людях с инвалидностью",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "«у него диабет» вместо «он страдает диабетом»; «девушка с ДЦП» вместо «девушка, страдающая ДЦП»",
    sectionAnchor: "team-terms",
    sectionTitle: "Как говорить о людях с инвалидностью",
  },
  {
    route: "/ngo/ethics",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Терминологический квиз по пяти категориям (Зрение / Слух / Речь / Передвижение / Ментальная инвалидность)",
    sectionAnchor: "team-terms",
    sectionTitle: "Как говорить о людях с инвалидностью",
  },
  {
    route: "/ngo/ethics",
    component: "Card",
    variant: null,
    semanticType: "совет",
    snippet:
      "1. Обращайтесь напрямую к человеку … 8. Главное правило (8 карточек-принципов общения)",
    sectionAnchor: "team-rules",
    sectionTitle: "Общие правила общения",
  },
  {
    route: "/ngo/ethics",
    component: "Disclosure",
    variant: null,
    semanticType: "кейс",
    snippet:
      "5 ситуаций-тренажёров с вариантами реакции (Badge верно/неверно/не стоит) и обратной связью «ОС»",
    sectionAnchor: "team-rules",
    sectionTitle: "Общие правила общения",
  },
  {
    route: "/ngo/ethics",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Мне важно, чтобы собеседник был моим проводником в визуальном мире…» — Что советует Олег (незрячий)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: Представляйтесь при встрече и предупреждайте, когда уходите…",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Перед началом разговора убедитесь, что я на вас смотрю…» — Что советует Марина (слабослышащая)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: Перед началом разговора убедитесь, что человек вас видит…",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Когда вы стоите рядом со мной, мне приходится постоянно смотреть вверх…» — Что советует Артём (коляска)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: По возможности разговаривайте с человеком на одном уровне…",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Для меня важнее всего ясность и порядок…» — Что советует Анна (ментальная инвалидность)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet: "Краткое саммари: Формулируйте задачи максимально конкретно…",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Пожалуйста, дайте мне договорить…» — Что советует Максим (особенности речи, заикание)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: Не перебивайте и не договаривайте фразы за человека…",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Моя инвалидность незаметна окружающим…» — Что советует Игорь (невидимая инвалидность)",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Краткое саммари: Не оценивайте состояние человека по внешнему виду…",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "Callout",
    variant: "info",
    semanticType: "совет",
    snippet:
      "Совет руководителю: Если сотрудник сообщил об особенностях здоровья, обсудите с ним условия…",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "На самом деле всё проще, чем кажется. Для уважительного общения не нужно помнить десятки правил…",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Главное — не бойтесь. Если я не поняла, переспрошу…» — Гульфия Коновалова, Яндекс Маркет",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Обычно достаточно общаться с людьми на коляске так же, как с любыми другими…» — Ксения Ломакина, Яндекс",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Попытайтесь преодолеть свои сомнения и неуверенность…» — Анатолий Попко, Яндекс",
    sectionAnchor: "team-heroes",
    sectionTitle: "Особенности общения — шесть историй",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "человек на коляске не может попасть в здание из-за отсутствия пандуса; участнику с особенностями слуха сложно следить",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "дверь должна легко открываться; пандусы должны быть пологими; на путях передвижения не должно быть проводов",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "для людей на колясках — места с хорошим обзором; участникам с особенностями слуха ближе к спикеру",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "хорошо ли читаются навигационные указатели; доступны ли туалеты, зоны отдыха и эвакуационные выходы",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "пригласить переводчика РЖЯ; заранее передать ему программу, презентации и другие материалы",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "добавьте QR-код со ссылкой на электронную версию; подготовьте материалы для программ экранного доступа",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "использовать простой и понятный язык; объяснять профессиональные термины; указывать уровень сложности",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "размещать важную информацию в тексте, а не только на изображениях; добавлять текстовые описания к фото",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "провести короткий инструктаж по этике общения; назначить сотрудников для помощи гостям",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "Callout",
    variant: "info",
    semanticType: "промпт-шаблон",
    snippet:
      "ИИ-промпт: чек-лист доступного мероприятия — заготовка для копирования в ИИ-модель",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "CodeSnippet",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "Я организую [формат: митап / конференция / корпоратив / выезд] на [N человек]… Помоги собрать чек-лист",
    sectionAnchor: "team-events",
    sectionTitle: "Доступные встречи и мероприятия",
  },
  {
    route: "/ngo/ethics",
    component: "Lead + OrderedList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Давайте коротко резюмируем: 1. Замечайте человека, а не диагноз. 2. Опирайтесь на уважение и здравый смысл…",
    sectionAnchor: "team-summary",
    sectionTitle: "Главное в общении",
  },
  {
    route: "/ngo/ethics",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Остались вопросы или предложения? Помогите сделать следующую версию гида лучше — оставьте их здесь",
    sectionAnchor: "team-summary",
    sectionTitle: "Главное в общении",
  },
  {
    route: "/ngo/start",
    component: "Callout",
    variant: "wip",
    semanticType: "прочее",
    snippet:
      "Слот для видео с экспертами Яндекса (упомянуто автором; материал — в работе).",
    sectionAnchor: "start-intro",
    sectionTitle: "Введение",
  },
  {
    route: "/ngo/start",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: с чего начинается работа НКО в программах трудоустройства; какой формат работы выбрать",
    sectionAnchor: "start-role",
    sectionTitle: "Роль НКО в программах трудоустройства людей с инвалидностью",
  },
  {
    route: "/ngo/start",
    component: "Callout",
    variant: "briefing",
    semanticType: "задание",
    snippet:
      "Перед запуском важно честно ответить. Перед тем как запускать программу инклюзивного трудоустройства, НКО важно честно ответить",
    sectionAnchor: "start-program",
    sectionTitle: "Программа трудоустройства в НКО",
  },
  {
    route: "/ngo/start",
    component: "DataTable",
    variant: null,
    semanticType: "пример",
    snippet:
      "Функционал / Содержание — Работа с соискателями: Первичные встречи, помощь человеку в понимании своих возможностей",
    sectionAnchor: "start-program",
    sectionTitle: "Программа трудоустройства в НКО",
  },
  {
    route: "/ngo/start",
    component: "StepsShelf",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Шаг 1: Определить, с какой аудиторией вы работаете. Шаг 2: Определить формат работы НКО...",
    sectionAnchor: "start-stages",
    sectionTitle: "Этапы работы НКО",
  },
  {
    route: "/ngo/start",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«У нас сложилась модель: соискатель, карьерный консультант и фонд. У каждого свои 100% ответственности...»",
    sectionAnchor: "start-partnership",
    sectionTitle:
      "Почему НКО важно выстраивать партнёрские отношения и с соискателями, и с работодателями",
  },
  {
    route: "/ngo/start",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Хочу от всего сердца поблагодарить БФ «Спина Бифида» и куратора программы по поиску работы...» — Софья Юдина",
    sectionAnchor: "start-inclusive",
    sectionTitle: "Почему для НКО важен инклюзивный подход",
  },
  {
    route: "/ngo/start",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: как НКО понять свою текущую аудиторию и не переоценить её готовность",
    sectionAnchor: "start-audience",
    sectionTitle: "Анализ аудитории НКО",
  },
  {
    route: "/ngo/start",
    component: "Callout",
    variant: "briefing",
    semanticType: "кейс",
    snippet:
      "Ситуация. НКО несколько лет помогает людям с ДЦП в вопросах обучения, повседневной адаптации... Что команде НКО важно сделать в первую очередь?",
    sectionAnchor: "start-audience",
    sectionTitle: "Анализ аудитории НКО",
  },
  {
    route: "/ngo/start",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«Для меня проект по трудоустройству был абсолютно новым...» — Мария Горданова",
    sectionAnchor: "start-audience",
    sectionTitle: "Анализ аудитории НКО",
  },
  {
    route: "/ngo/start",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "У нас есть проект «Самое время жить. Карьера». Ядро проекта — онлайн-курс для наших благополучателей... — Людмила Писаренко",
    sectionAnchor: "start-current-audience",
    sectionTitle: "Как понять свою текущую аудиторию и не переоценить её",
  },
  {
    route: "/ngo/start",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "«Артём был перспективным соискателем, но на первом этапе взаимодействия ему было непросто...» — Алла Сотникова",
    sectionAnchor: "start-segment",
    sectionTitle: "Насколько аудитория готова к трудоустройству",
  },
  {
    route: "/ngo/start",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Кирилл Борисович всю сознательную жизнь работал судовым слесарем-монтажником, но получил тяжёлую травму... — Татьяна Самбурова",
    sectionAnchor: "start-segment",
    sectionTitle: "Насколько аудитория готова к трудоустройству",
  },
  {
    route: "/ngo/start",
    component: "BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Вопрос 1. Сколько потенциальных участников программы вы видите сейчас? 10–30 / 31–60 / 61–100 / больше 100. Обратная связь...",
    sectionAnchor: "start-selfcheck-q1",
    sectionTitle: "Вопрос 1",
  },
  {
    route: "/ngo/start",
    component: "BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Вопрос 2. Если сейчас вы видите 10–30 потенциальных участников, сколько из них смогут трудоустроиться? 1–5 / 6–10 / 11–20 / почти все",
    sectionAnchor: "start-selfcheck-q2",
    sectionTitle: "Вопрос 2",
  },
  {
    route: "/ngo/start",
    component: "BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Вопрос 3. Если сейчас вы видите 31–60 потенциальных участников, сколько из них смогут трудоустроиться? 5–10 / 11–20 / 21–40 / почти все",
    sectionAnchor: "start-selfcheck-q3",
    sectionTitle: "Вопрос 3",
  },
  {
    route: "/ngo/start",
    component: "BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Вопрос 4. Если сейчас вы видите 61–100 потенциальных участников, сколько из них смогут трудоустроиться? 10–20 / 21–40 / 41–70 / почти все",
    sectionAnchor: "start-selfcheck-q4",
    sectionTitle: "Вопрос 4",
  },
  {
    route: "/ngo/start",
    component: "BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Вопрос 5. Если сейчас вы видите больше 100 потенциальных участников, сколько из них смогут трудоустроиться? 10–30 / 31–60 / 61–100 / почти все",
    sectionAnchor: "start-selfcheck-q5",
    sectionTitle: "Вопрос 5",
  },
  {
    route: "/ngo/start",
    component: "Paragraph",
    variant: null,
    semanticType: "факт-цифра",
    snippet:
      "Если вы выбрали низкий диапазон. Это самый реалистичный сценарий. По опыту экспертов, работу находят около 10–20% участников",
    sectionAnchor: "start-selfcheck",
    sectionTitle: "С кем начинать работать",
  },
  {
    route: "/ngo/start",
    component: "Callout",
    variant: "briefing",
    semanticType: "кейс",
    snippet:
      "Ситуация 2. Команда выяснила, что потенциальные участники программы живут в трёх соседних регионах... Что команде важно уточнить перед запуском?",
    sectionAnchor: "start-selfcheck",
    sectionTitle: "С кем начинать работать",
  },
  {
    route: "/ngo/start",
    component: "DataTable",
    variant: null,
    semanticType: "пример",
    snippet:
      "Задача / Возможные каналы — Если нужно быстро найти новую аудиторию: Профильные НКО, ВОГ, ВОС, реабилитационные центры",
    sectionAnchor: "start-where",
    sectionTitle: "Где искать аудиторию",
  },
  {
    route: "/ngo/start",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "«У нас было заключено соглашение с центром реабилитации, у которого есть сильная профессиональная база...» — Мария Бурчакова",
    sectionAnchor: "start-where",
    sectionTitle: "Где искать аудиторию",
  },
  {
    route: "/ngo/start",
    component: "Blockquote",
    variant: null,
    semanticType: "определение",
    snippet:
      "Узнал о программе → Заинтересовался → Оставил заявку → Пришёл на первую встречу → Стал участником программы → Прошёл все этапы → Трудоустроился",
    sectionAnchor: "start-channels",
    sectionTitle: "Каналы продвижения программы",
  },
  {
    route: "/ngo/start",
    component: "Paragraph",
    variant: null,
    semanticType: "задание",
    snippet:
      "Практическое задание для представителей НКО. Предлагаем составить карту каналов привлечения аудитории... готовыми промптами и шаблонами",
    sectionAnchor: "start-channels",
    sectionTitle: "Каналы продвижения программы",
  },
  {
    route: "/ngo/start",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "Подведём итоги. Помимо общего интереса к теме работы, НКО важно понимать и практическую готовность аудитории",
    sectionAnchor: "start-channels",
    sectionTitle: "Каналы продвижения программы",
  },
  {
    route: "/ngo/start",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "задание",
    snippet:
      "Практическое задание для представителей НКО. Найдите две-три НКО или программы, которые помогают людям с инвалидностью в вопросах трудоустройства",
    sectionAnchor: "start-task",
    sectionTitle: "Практическое задание для представителей НКО",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: зачем НКО проводить первичное интервью с соискателем; о чём говорить на интервью",
    sectionAnchor: "cand-interview",
    sectionTitle: "Первичное интервью с соискателем",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "briefing",
    semanticType: "совет",
    snippet:
      "Особенности интервью с кандидатом с ментальной инвалидностью. Интервью с человеком с ментальной инвалидностью",
    sectionAnchor: "cand-interview-conduct",
    sectionTitle: "Проведение первичного интервью",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "промпт-шаблон",
    snippet:
      "Использование нейросетей для подготовки интервью. С помощью виртуального помощника Алиса AI можно составить",
    sectionAnchor: "cand-interview-conduct",
    sectionTitle: "Проведение первичного интервью",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например, можно сказать: «Сейчас мне важно понять ваш опыт и запрос. Это поможет нам подобрать более подходящие",
    sectionAnchor: "cand-interview-start",
    sectionTitle: "Начало разговора",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "Если вопрос кажется слишком личным, стоит коротко объяснить, зачем он нужен. Например: «Я спрашиваю об этом",
    sectionAnchor: "cand-interview-start",
    sectionTitle: "Начало разговора",
  },
  {
    route: "/ngo/candidates",
    component: "OrderedList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Не отвечайте за человека. Иногда человек волнуется, долго подбирает слова... Говорите в первую очередь с самим",
    sectionAnchor: "cand-interview-start",
    sectionTitle: "Начало разговора",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "briefing",
    semanticType: "совет",
    snippet:
      "Если человек пока не готов к трудоустройству. По итогам интервью может оказаться, что человек с ментальной",
    sectionAnchor: "cand-interview-start",
    sectionTitle: "Начало разговора",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "Сквозной кейс. Чтобы увидеть логику интервью, разберём пример. На консультацию приходит Марина.",
    sectionAnchor: "cand-interview-portrait",
    sectionTitle: "Составление портрета соискателя",
  },
  {
    route: "/ngo/candidates",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Ситуация 1. Марина говорит, что хочет работать в сфере дизайна и давно этим интересуется. Что специалисту НКО",
    sectionAnchor: "cand-interview-portrait",
    sectionTitle: "Составление портрета соискателя",
  },
  {
    route: "/ngo/candidates",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Ситуация 2. Вы уже поняли, что у Марины есть опыт и интерес к этой сфере. Что теперь важно уточнить?",
    sectionAnchor: "cand-interview-skills",
    sectionTitle: "Опыт и навыки",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "briefing",
    semanticType: "совет",
    snippet:
      "Оценка навыков людей с ментальной инвалидностью. Во время первичного интервью с кандидатом с ментальной",
    sectionAnchor: "cand-interview-skills",
    sectionTitle: "Опыт и навыки",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "кейс",
    snippet:
      "Кейс. Соискательница с ментальной инвалидностью рассказывала, что каждый день шьёт платья. Однако в ходе",
    sectionAnchor: "cand-interview-skills",
    sectionTitle: "Опыт и навыки",
  },
  {
    route: "/ngo/candidates",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Ситуация 3. Марина говорит, что хочет развиваться в дизайне. Что важно уточнить дальше, чтобы лучше понять",
    sectionAnchor: "cand-interview-expectations",
    sectionTitle: "Ожидания от работы",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "За помощью в трудоустройстве обратился Андрей. Недавно он женился и хотел найти стабильную работу, чтобы",
    sectionAnchor: "cand-interview-motivation",
    sectionTitle: "Мотивация и готовность к работе",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Ярослава имеет инвалидность по слуху. Ей недавно исполнилось 20 лет, но желание найти работу уже давно стало",
    sectionAnchor: "cand-interview-motivation",
    sectionTitle: "Мотивация и готовность к работе",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Наталья Ивановна пришла в проект самостоятельно: после сложной операции она опасалась за здоровье и искала",
    sectionAnchor: "cand-interview-format",
    sectionTitle: "Формат и условия работы",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Олег Борисович, соискатель с особенностями опорно-двигательного аппарата, передвигается на коляске. Отдел",
    sectionAnchor: "cand-interview-other",
    sectionTitle: "Что ещё стоит учесть",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: что такое профориентация и когда она нужна; как её проводить",
    sectionAnchor: "cand-orientation",
    sectionTitle: "Профориентация и психологическая поддержка",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "определение",
    snippet:
      "Определение. Профориентация — это помощь человеку в поиске реалистичного профессионального направления",
    sectionAnchor: "cand-orientation-what",
    sectionTitle: "Что такое профориентация и когда она нужна",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Результат этапа: заполненный профиль кандидата со всеми данными, необходимыми для дальнейшего анализа.",
    sectionAnchor: "cand-orientation-step1",
    sectionTitle: "Этап 1. Соберите данные",
  },
  {
    route: "/ngo/candidates",
    component: "DataTable",
    variant: null,
    semanticType: "определение",
    snippet:
      "Хочу / Могу / Надо. Это интересы, желания и мотивация соискателя с инвалидностью / навыки, опыт... / реальность",
    sectionAnchor: "cand-orientation-step2",
    sectionTitle: "Этап 2. Проанализируйте портрета соискателя",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "пример",
    snippet:
      "Пример 1. Соискатель с инвалидностью опорно-двигательного аппарата",
    sectionAnchor: "cand-orientation-step2",
    sectionTitle: "Этап 2. Проанализируйте портрета соискателя",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "пример",
    snippet: "Пример 2. Соискатель с инвалидностью по слуху",
    sectionAnchor: "cand-orientation-step2",
    sectionTitle: "Этап 2. Проанализируйте портрета соискателя",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "пример",
    snippet: "Пример 3. Соискатель с инвалидностью по зрению",
    sectionAnchor: "cand-orientation-step2",
    sectionTitle: "Этап 2. Проанализируйте портрета соискателя",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "пример",
    snippet: "Пример 4. Соискатель с приобретённой инвалидностью",
    sectionAnchor: "cand-orientation-step2",
    sectionTitle: "Этап 2. Проанализируйте портрета соискателя",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Результат второго этапа: есть понимание, какие направления работы реалистичны для конкретного соискателя",
    sectionAnchor: "cand-orientation-step2",
    sectionTitle: "Этап 2. Проанализируйте портрета соискателя",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "Если человек хочет работать удалённо, но пока недостаточно уверенно пользуется цифровыми инструментами",
    sectionAnchor: "cand-orientation-step3",
    sectionTitle: "Этап 3. Обсудите противоречия",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "Если человек хочет вернуться в прежнюю профессию, но часть задач стала недоступна по состоянию здоровья",
    sectionAnchor: "cand-orientation-step3",
    sectionTitle: "Этап 3. Обсудите противоречия",
  },
  {
    route: "/ngo/candidates",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet: "Что не совпадает / Что это может означать / Что можно сделать",
    sectionAnchor: "cand-orientation-step3",
    sectionTitle: "Этап 3. Обсудите противоречия",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Результат третьего этапа: соискатель с инвалидностью понимает, где совпадают его интересы, возможности",
    sectionAnchor: "cand-orientation-step3",
    sectionTitle: "Этап 3. Обсудите противоречия",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "определение",
    snippet:
      "Определение. Карьерная гипотеза — это предположение о том, какое направление работы может подойти соискателю",
    sectionAnchor: "cand-orientation-step4",
    sectionTitle: "Этап 4. Сформулируйте карьерные гипотезы",
  },
  {
    route: "/ngo/candidates",
    component: "DataTable",
    variant: null,
    semanticType: "пример",
    snippet:
      "Тип гипотезы / Роль / На чём строится / Что нужно освоить / Адаптации / Риски и сложности",
    sectionAnchor: "cand-orientation-step4",
    sectionTitle: "Этап 4. Сформулируйте карьерные гипотезы",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например, можно сказать: «Сейчас у нас есть несколько направлений, которые могут вам подойти. Давайте",
    sectionAnchor: "cand-orientation-no-hypo",
    sectionTitle: "Что делать, если гипотезы не появляются",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Результат четвёртого этапа: у вас есть несколько карьерных гипотез, согласованных с соискателем.",
    sectionAnchor: "cand-orientation-step4",
    sectionTitle: "Этап 4. Сформулируйте карьерные гипотезы",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "предупреждение",
    snippet:
      "Важно: экскурсия не обязывает соискателя соглашаться на работу, а работодателя — делать предложение",
    sectionAnchor: "cand-orientation-step5",
    sectionTitle: "Этап 5. Проверьте гипотезы на практике",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Сначала мы собираем небольшую группу соискателей — до 5 человек. Это ребята с ментальной инвалидностью",
    sectionAnchor: "cand-orientation-step5",
    sectionTitle: "Этап 5. Проверьте гипотезы на практике",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Результат этапа: одна или несколько гипотез стали понятнее. Они могут подтвердиться, измениться или быть",
    sectionAnchor: "cand-orientation-step5",
    sectionTitle: "Этап 5. Проверьте гипотезы на практике",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "предупреждение",
    snippet:
      "Важно: если человек пока не готов к трудоустройству, это не отказ от работы. Это означает, что сейчас ему",
    sectionAnchor: "cand-orientation-step6",
    sectionTitle: "Этап 6. Выберите направление работы",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "В начале работы мы оценили навыки наших подопечных с помощью инструмента AFLS: трудоустройство и работа.",
    sectionAnchor: "cand-orientation-mental",
    sectionTitle: "Особенности профориентации людей с ментальной инвалидностью",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "задание",
    snippet:
      "Практическое задание для представителей НКО. Это задание поможет пройти все основные этапы профориентации",
    sectionAnchor: "cand-orientation-mental",
    sectionTitle: "Особенности профориентации людей с ментальной инвалидностью",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "Когда нужна поддержка. Психологическая поддержка может быть особенно полезна, если соискатель: боится",
    sectionAnchor: "cand-psy",
    sectionTitle: "Психологическая поддержка соискателя с инвалидностью",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "пример",
    snippet:
      "Пример. Женщина 52 лет с инвалидностью II группы на первой встрече отвергала почти все предложенные варианты",
    sectionAnchor: "cand-psy",
    sectionTitle: "Психологическая поддержка соискателя с инвалидностью",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: как помочь кандидату найти подходящую вакансию; как составить резюме",
    sectionAnchor: "cand-search",
    sectionTitle: "Подбор вакансий и подготовка к собеседованию",
  },
  {
    route: "/ngo/candidates",
    component: "DataTable",
    variant: null,
    semanticType: "совет",
    snippet:
      "Группа кандидатов / На что обратить внимание при подборе вакансий",
    sectionAnchor: "cand-search-step1",
    sectionTitle: "Шаг 1. Определение приоритетов",
  },
  {
    route: "/ngo/candidates",
    component: "DataTable",
    variant: null,
    semanticType: "пример",
    snippet:
      "Вакансия / Компания / Ссылка / Дата / Почему подходит / Статус — Оператор ввода данных, ООО «Ромашка»",
    sectionAnchor: "cand-search-step2",
    sectionTitle: "Шаг 2. Поиск вакансий на подходящих площадках",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "После инсульта Павел не смог вернуться на прежнюю работу на заводе металлоконструкций, хотя до этого имел",
    sectionAnchor: "cand-search-step3",
    sectionTitle: "Шаг 3. Помощь кандидату в понимании описания вакансии",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "К специалистам фонда обратился молодой человек с резюме, в котором было буквально две строки: имя и название",
    sectionAnchor: "cand-search-step4",
    sectionTitle: "Шаг 4. Составление или обновление резюме",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "briefing",
    semanticType: "совет",
    snippet:
      "Резюме соискателя с ментальной инвалидностью. Для части людей с ментальной инвалидностью стандартное резюме",
    sectionAnchor: "cand-search-step4",
    sectionTitle: "Шаг 4. Составление или обновление резюме",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "промпт-шаблон",
    snippet:
      "ИИ-промпт для составления резюме. Здесь приведён пример промпта для составления резюме.",
    sectionAnchor: "cand-search-step4",
    sectionTitle: "Шаг 4. Составление или обновление резюме",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "промпт-шаблон",
    snippet:
      "ИИ-промпт для сопоставления резюме с вакансией. Вот промпт, который поможет сопоставить резюме кандидата",
    sectionAnchor: "cand-search-step5",
    sectionTitle: "Шаг 5. Согласование решения об отклике",
  },
  {
    route: "/ngo/candidates",
    component: "DataTable",
    variant: null,
    semanticType: "совет",
    snippet:
      "Группа кандидатов / Канал связи и формат встречи / Материалы и задания / Что объяснить кандидату перед собесед",
    sectionAnchor: "cand-search-step6",
    sectionTitle: "Шаг 6. Подготовка к собеседованию",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "У одной соискательницы были особенности походки и затруднения речи: она говорила громко и не всегда чётко",
    sectionAnchor: "cand-search-step6",
    sectionTitle: "Шаг 6. Подготовка к собеседованию",
  },
  {
    route: "/ngo/candidates",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Молодой человек с первой группой инвалидности по слуху пришёл в фонд, прошёл проект «Шаг в профессию»",
    sectionAnchor: "cand-search-step6",
    sectionTitle: "Шаг 6. Подготовка к собеседованию",
  },
  {
    route: "/ngo/candidates",
    component: "BulletList",
    variant: null,
    semanticType: "faq",
    snippet:
      "Типичные вопросы работодателя: Расскажите о себе; Почему вас интересует эта вакансия; Что у вас получается",
    sectionAnchor: "cand-search-step6",
    sectionTitle: "Шаг 6. Подготовка к собеседованию",
  },
  {
    route: "/ngo/candidates",
    component: "Callout",
    variant: "highlight",
    semanticType: "задание",
    snippet:
      "Практическое задание. Подготовка к собеседованию — один из ключевых этапов перед трудоустройством, и нейросеть",
    sectionAnchor: "cand-search-summary",
    sectionTitle: "Подведём итоги",
  },
  {
    route: "/ngo/employers",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: зачем НКО выстраивать работу с работодателями заранее; где искать компании...",
    sectionAnchor: "intro",
    sectionTitle: "С чего начинается поиск работодателей",
  },
  {
    route: "/ngo/employers",
    component: "Paragraph",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например, НКО готовит соискателя с расстройством аутистического спектра к работе помощником администратора",
    sectionAnchor: "why-early",
    sectionTitle: "Зачем НКО искать работодателей заранее",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Поэтому поиск работодателей стоит начинать параллельно с анализом аудитории, профориентацией и подготовкой",
    sectionAnchor: "why-early",
    sectionTitle: "Зачем НКО искать работодателей заранее",
  },
  {
    route: "/ngo/employers",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Например: Нам подходят работодатели, у которых есть понятные повторяющиеся задачи, возможность частичной",
    sectionAnchor: "how-find-step1",
    sectionTitle:
      "Этап 1. Определите, какие работодатели нужны вашей аудитории",
  },
  {
    route: "/ngo/employers",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Пример. Компания активно нанимает сотрудников на склад. Возможно, там есть повторяющиеся задачи",
    sectionAnchor: "how-find-step3",
    sectionTitle: "Этап 3. Составьте список работодателей",
  },
  {
    route: "/ngo/employers",
    component: "DataTable",
    variant: null,
    semanticType: "прочее",
    snippet: "Что фиксировать о каждом работодателе — Поле / Что указать",
    sectionAnchor: "how-find-step3",
    sectionTitle: "Этап 3. Составьте список работодателей",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "В большинстве случаев, работодателей нахожу через сайты по поиску работы, провожу разъяснительные беседы",
    sectionAnchor: "how-find-step2",
    sectionTitle: "Этап 2. Найдите потенциальных работодателей",
  },
  {
    route: "/ngo/employers",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "Подведём итоги. Поиск работодателей — это не разовая задача перед трудоустройством конкретного кандидата",
    sectionAnchor: "how-find",
    sectionTitle: "Как найти работодателей",
  },
  {
    route: "/ngo/employers",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: как подготовиться к разговору с работодателем; с чего начать общение",
    sectionAnchor: "interaction-intro",
    sectionTitle: "Взаимодействие с работодателями",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "«У нас есть подопечные с инвалидностью, им очень нужна работа. Можете кого-нибудь взять?»",
    sectionAnchor: "prepare-partner",
    sectionTitle: "Говорите с позиции партнёра",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "«Мы помогаем людям с инвалидностью найти работу и сопровождаем работодателей на первых этапах",
    sectionAnchor: "prepare-partner",
    sectionTitle: "Говорите с позиции партнёра",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "«Мы не только помогаем кандидатам найти работу, но и сопровождаем работодателей на этапе подбора",
    sectionAnchor: "prepare-useful",
    sectionTitle: "Объясните, чем НКО может быть полезна работодателю",
  },
  {
    route: "/ngo/employers",
    component: "CodeSnippet",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "Пример письма: Добрый день! Меня зовут ..., я представляю НКО ...",
    sectionAnchor: "first-contact-letter",
    sectionTitle: "Письмо",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet: "«К вам порекомендовал обратиться ...»",
    sectionAnchor: "first-contact-letter",
    sectionTitle: "Письмо",
  },
  {
    route: "/ngo/employers",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Чего лучше избегать в первом письме: просьб «помочь нашим подопечным»; давления через социальную",
    sectionAnchor: "first-contact-letter",
    sectionTitle: "Письмо",
  },
  {
    route: "/ngo/employers",
    component: "CodeSnippet",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "Пример сопроводительного письма: Добрый день! Меня зовут ..., я представляю НКО ...",
    sectionAnchor: "first-contact-response",
    sectionTitle: "Отклик на вакансию",
  },
  {
    route: "/ngo/employers",
    component: "CodeSnippet",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "Если резюме уже можно направить: С согласия кандидата направляем его резюме на вакансию ...",
    sectionAnchor: "first-contact-response",
    sectionTitle: "Отклик на вакансию",
  },
  {
    route: "/ngo/employers",
    component: "CodeSnippet",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "Пример обращения: «Добрый день! Меня зовут ..., я представляю НКО ...",
    sectionAnchor: "first-contact-call",
    sectionTitle: "Звонок",
  },
  {
    route: "/ngo/employers",
    component: "CodeSnippet",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "Если звонок связан с конкретной вакансией: «Добрый день! Меня зовут ..., я представляю НКО ...",
    sectionAnchor: "first-contact-call",
    sectionTitle: "Звонок",
  },
  {
    route: "/ngo/employers",
    component: "OrderedList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Удобно выстроить встречу по следующему плану: Коротко представить НКО. Узнать потребности работодателя",
    sectionAnchor: "first-contact-meeting",
    sectionTitle: "Встреча",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "«Мы работаем с людьми с инвалидностью, которые хотят найти работу. Перед тем как предложить кандидата",
    sectionAnchor: "first-contact-meeting",
    sectionTitle: "Встреча",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "«Наша задача — не просто направить резюме, а помочь работодателю и кандидату заранее понять",
    sectionAnchor: "first-contact-meeting",
    sectionTitle: "Встреча",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "«Мы уточняем эти условия, чтобы заранее понять, кому из кандидатов вакансия действительно подойдёт",
    sectionAnchor: "first-contact-meeting",
    sectionTitle: "Встреча",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "«Чтобы не оставлять разговор на уровне общих договорённостей, давайте определим следующий шаг",
    sectionAnchor: "first-contact-meeting",
    sectionTitle: "Встреча",
  },
  {
    route: "/ngo/employers",
    component: "Card",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "6 карточек форматов сотрудничества: Консультация или встреча-знакомство; Разбор вакансии; Экскурсия; Стажировка; Подбор; Пилотный проект",
    sectionAnchor: "formats",
    sectionTitle: "Какие форматы сотрудничества могут быть",
  },
  {
    route: "/ngo/employers",
    component: "Callout",
    variant: "warning",
    semanticType: "предупреждение",
    snippet:
      "Не стоит предлагать все варианты одновременно. Обычно эффективнее выбрать один или два формата",
    sectionAnchor: "formats",
    sectionTitle: "Какие форматы сотрудничества могут быть",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "«У кандидата есть опыт работы с таблицами. Он внимателен к деталям и хорошо выполняет повторяющиеся",
    sectionAnchor: "presenting-tasks",
    sectionTitle: "Говорите о кандидате через задачи и условия успешной работы",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "«Кандидат может выполнять складские операции: сортировку, маркировку и упаковку товаров",
    sectionAnchor: "presenting-tasks",
    sectionTitle: "Говорите о кандидате через задачи и условия успешной работы",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "пример",
    snippet:
      "«Кандидату подходит удалённая работа с письменной коммуникацией. Он уверенно пользуется базовыми",
    sectionAnchor: "presenting-tasks",
    sectionTitle: "Говорите о кандидате через задачи и условия успешной работы",
  },
  {
    route: "/ngo/employers",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet: "Как переформулировать — Как не надо / Как сказать по-другому",
    sectionAnchor: "presenting-factors",
    sectionTitle: "Заранее обсудите важные условия работы",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Подготовка и презентация кандидата работодателю — это не рассказ о диагнозе и не попытка вызвать сочувствие",
    sectionAnchor: "presenting",
    sectionTitle: "Как представить кандидата с инвалидностью",
  },
  {
    route: "/ngo/employers",
    component: "OrderedList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "алгоритм из четырёх этапов: Признать опасение; Уточнить детали; Дать ответ; Предложить небольшой следующий шаг",
    sectionAnchor: "objections",
    sectionTitle: "Как отвечать на возражения работодателя",
  },
  {
    route: "/ngo/employers",
    component: "Callout",
    variant: "briefing",
    semanticType: "задание",
    snippet:
      "Квиз «Выберите верный вариант ответа». Ситуация: работодатель говорит: «Мы боимся, что коллектив не примет",
    sectionAnchor: "objections",
    sectionTitle: "Как отвечать на возражения работодателя",
  },
  {
    route: "/ngo/employers",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Этап 1. Признать опасение / Этап 2. Уточнить детали / Этап 3. Дать ответ / Этап 4. Предложить шаг — квиз с вариантами",
    sectionAnchor: "objections",
    sectionTitle: "Как отвечать на возражения работодателя",
  },
  {
    route: "/ngo/employers",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet: "Возражение → Что можно предложить → Пример ответа",
    sectionAnchor: "objections",
    sectionTitle: "Как отвечать на возражения работодателя",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "цитата",
    snippet:
      "Работа с возражениями — это навык, который тренируется. Часто работодатель готов сказать «да»",
    sectionAnchor: "objections",
    sectionTitle: "Как отвечать на возражения работодателя",
  },
  {
    route: "/ngo/employers",
    component: "OrderedList",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Структура итогового письма: Благодарность; Резюме встречи; План действий; Дата следующего контакта; Приложения",
    sectionAnchor: "after-letter",
    sectionTitle: "Отправьте итоговое письмо",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "«Добрый день, [Имя]! Напоминаю о своём письме от [дата]. Удалось ли ознакомиться?",
    sectionAnchor: "after-silence",
    sectionTitle: "Работодатель не отвечает после встречи: что делать",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "«Добрый день, [Имя]! Понимаю, что сейчас может быть много задач. Если встречу организовать сложно",
    sectionAnchor: "after-silence",
    sectionTitle: "Работодатель не отвечает после встречи: что делать",
  },
  {
    route: "/ngo/employers",
    component: "Blockquote",
    variant: null,
    semanticType: "промпт-шаблон",
    snippet:
      "«Понимаю, что сейчас у вас другие приоритеты. Мы поставим наше общение на паузу",
    sectionAnchor: "after-silence",
    sectionTitle: "Работодатель не отвечает после встречи: что делать",
  },
  {
    route: "/ngo/support",
    component: "Callout",
    variant: "info",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: какое сопровождение может понадобиться людям с физической и ментальной формами",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/ngo/support",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "Сопровождение — важная часть программы трудоустройства. Во многом именно от него зависит, станет ли трудоустройство",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/ngo/support",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Дистанционное сопровождение. Для людей с физической инвалидностью. При сопровождении сотрудника с физической",
    sectionAnchor: "sup-formats",
    sectionTitle: "Два формата сопровождения",
  },
  {
    route: "/ngo/support",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Физическое сопровождение. Для людей с ментальной инвалидностью. Физическое сопровождение чаще требуется людям",
    sectionAnchor: "sup-formats",
    sectionTitle: "Два формата сопровождения",
  },
  {
    route: "/ngo/support",
    component: "Callout",
    variant: "highlight",
    semanticType: "совет",
    snippet:
      "Основной принцип — обучение через действие. Не рекомендуется выполнять работу за сотрудника. Если человек совсем",
    sectionAnchor: "sup-formats",
    sectionTitle: "Два формата сопровождения",
  },
  {
    route: "/ngo/support",
    component: "Callout",
    variant: "warning",
    semanticType: "предупреждение",
    snippet:
      "Важно. При этом важно понимать, что родитель или другой близкий человек не может выступать сопровождающим.",
    sectionAnchor: "sup-formats",
    sectionTitle: "Два формата сопровождения",
  },
  {
    route: "/ngo/support",
    component: "Callout",
    variant: "briefing",
    semanticType: "пример",
    snippet:
      "Пример. Николай — человек с ментальной инвалидностью. Он работает в сфере общественного питания, где сотрудники",
    sectionAnchor: "sup-employer",
    sectionTitle: "Сопровождение работодателя при трудоустройстве кандидата",
  },
  {
    route: "/ngo/support",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "Виталий — человек с ментальной инвалидностью. Он обратился с запросом на трудоустройство, было проведено",
    sectionAnchor: "sup-medical",
    sectionTitle: "Шаг 1. Пройти медкомиссию",
  },
  {
    route: "/ngo/support",
    component: "BulletList",
    variant: null,
    semanticType: "совет",
    snippet:
      "Помочь разобраться в процессе. Объяснить, нужна ли медкомиссия для конкретной вакансии, каких специалистов",
    sectionAnchor: "sup-medical",
    sectionTitle: "Шаг 1. Пройти медкомиссию",
  },
  {
    route: "/ngo/support",
    component: "Blockquote",
    variant: null,
    semanticType: "кейс",
    snippet:
      "У Кристины ДЦП, тугоухость и сахарный диабет первого типа. Образование — только школа. Пришла на консультацию",
    sectionAnchor: "sup-medical",
    sectionTitle: "Шаг 1. Пройти медкомиссию",
  },
  {
    route: "/ngo/support",
    component: "Card",
    variant: null,
    semanticType: "совет",
    snippet:
      "Для человека с физической инвалидностью / Для человека с ментальной инвалидностью — сопровождение в первый рабочий день",
    sectionAnchor: "sup-weeks",
    sectionTitle: "Шаг 3. Выход на работу: сопровождение в первые недели",
  },
  {
    route: "/ngo/support",
    component: "Callout",
    variant: "briefing",
    semanticType: "пример",
    snippet:
      "Пример. Андрей работает специалистом клиентской поддержки в крупной IT-компании. У него инвалидность II группы",
    sectionAnchor: "sup-crisis",
    sectionTitle: "Что дальше? Кризис-менеджмент на рабочем месте",
  },
  {
    route: "/ngo/support",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "Подведём итог. Сопровождаемое трудоустройство — это непрерывная система поддержки, в которой НКО выступает",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/ngo/scale",
    component: "Callout",
    variant: "briefing",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: как составить дорожную карту; как определить цели, задачи и ожидаемые результаты",
    sectionAnchor: "sc-roadmap",
    sectionTitle: "Дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "BulletList",
    variant: null,
    semanticType: "определение",
    snippet:
      "Это краткое описание стартовой точки программы. В этом разделе важно определить: кто входит в целевую группу",
    sectionAnchor: "sc-roadmap",
    sectionTitle: "Дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Цель должна быть понятной и измеримой. Например, вместо формулировки «развить направление трудоустройства»",
    sectionAnchor: "sc-roadmap",
    sectionTitle: "Дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Промежуточными результатами могут быть: прохождение диагностики и составление индивидуального маршрута",
    sectionAnchor: "sc-roadmap",
    sectionTitle: "Дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "BulletList",
    variant: null,
    semanticType: "определение",
    snippet:
      "Заранее стоит определить метрики и критерии успеха. Например: человек работает по трудовому договору более трёх",
    sectionAnchor: "sc-roadmap",
    sectionTitle: "Дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "BulletList",
    variant: null,
    semanticType: "пример",
    snippet:
      "Обычно задачи формулируются как основные направления работы. Например: провести оценку мотивации",
    sectionAnchor: "sc-roadmap",
    sectionTitle: "Дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Этап · Направление работы · Описание · Ответственные · Сроки · Ожидаемый результат (пустой шаблон дорожной карты)",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph",
    variant: null,
    semanticType: "определение",
    snippet:
      "Этап — это крупная часть программы. Он помогает сразу понять, к какому отрезку маршрута относится каждое действие",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph",
    variant: null,
    semanticType: "определение",
    snippet:
      "Направление работы — это конкретный участок работы внутри этапа. Например: оценка мотивации кандидатов",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "определение",
    snippet:
      "Описание — краткое пояснение того, что именно делает команда в рамках выбранного направления. Например:",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph",
    variant: null,
    semanticType: "определение",
    snippet:
      "Ответственные — сотрудники или организации, отвечающие за выполнение конкретного участка работы",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph",
    variant: null,
    semanticType: "определение",
    snippet:
      "Сроки — период выполнения задачи. Это может быть конкретная дата или временной интервал. Например: до 15 апреля",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph + BulletList",
    variant: null,
    semanticType: "определение",
    snippet:
      "Ожидаемый результат — показатель того, что работа действительно выполнена. Например:",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph",
    variant: null,
    semanticType: "пример",
    snippet:
      "Здесь приведён пример заполнения дорожной карты для этапа «Диагностика».",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph",
    variant: null,
    semanticType: "определение",
    snippet:
      "Групповой формат подходит для задач, через которые участники проходят примерно одинаковым образом",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph",
    variant: null,
    semanticType: "определение",
    snippet:
      "Индивидуальный формат становится особенно важным там, где различия между участниками начинают играть",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Paragraph",
    variant: null,
    semanticType: "предупреждение",
    snippet:
      "Одна из распространённых ошибок при планировании программы — воспринимать её как последовательность",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "Подведём итоги. Дорожная карта помогает НКО превратить идею программы трудоустройства в понятный план",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Callout",
    variant: "info",
    semanticType: "задание",
    snippet:
      "Практическое задание для представителей НКО. Опишите основу дорожной карты вашей программы",
    sectionAnchor: "sc-roadmap-table",
    sectionTitle: "Как может выглядеть дорожная карта",
  },
  {
    route: "/ngo/scale",
    component: "Callout",
    variant: "briefing",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: как расширить географию деятельности; как включить в программу людей",
    sectionAnchor: "sc-scaling",
    sectionTitle:
      "Масштабирование и устойчивость: как вырасти, не теряя качества",
  },
  {
    route: "/ngo/scale",
    component: "Disclosure",
    variant: null,
    semanticType: "faq",
    snippet:
      "Полезно ответить на следующие вопросы: с какой формой инвалидности планирует работать организация",
    sectionAnchor: "sc-geography",
    sectionTitle: "Масштабирование географии деятельности",
  },
  {
    route: "/ngo/scale",
    component: "Disclosure",
    variant: null,
    semanticType: "faq",
    snippet:
      "Полезно ответить на следующие вопросы: есть ли в городе или районе филиалы крупных компаний",
    sectionAnchor: "sc-geography",
    sectionTitle: "Масштабирование географии деятельности",
  },
  {
    route: "/ngo/scale",
    component: "Callout",
    variant: "info",
    semanticType: "пример",
    snippet:
      "Пример. В моногороде работает металлургический завод, на котором занята значительная часть жителей",
    sectionAnchor: "sc-geography",
    sectionTitle: "Масштабирование географии деятельности",
  },
  {
    route: "/ngo/scale",
    component: "Disclosure",
    variant: null,
    semanticType: "faq",
    snippet:
      "Полезно выяснить: пользуются ли местные НКО доверием целевой аудитории; могут ли они помочь с поиском",
    sectionAnchor: "sc-geography",
    sectionTitle: "Масштабирование географии деятельности",
  },
  {
    route: "/ngo/scale",
    component: "Disclosure",
    variant: null,
    semanticType: "faq",
    snippet:
      "Полезно заранее выяснить: как работодатели говорят о людях с инвалидностью; есть ли у них опасения",
    sectionAnchor: "sc-geography",
    sectionTitle: "Масштабирование географии деятельности",
  },
  {
    route: "/ngo/scale",
    component: "Disclosure",
    variant: null,
    semanticType: "faq",
    snippet:
      "Перед запуском работы на новой территории важно оценить: сколько времени команда сможет уделять",
    sectionAnchor: "sc-geography",
    sectionTitle: "Масштабирование географии деятельности",
  },
  {
    route: "/ngo/scale",
    component: "Disclosure",
    variant: null,
    semanticType: "faq",
    snippet:
      "Полезно обсудить следующие вопросы: какие люди с инвалидностью чаще всего обращаются за поддержкой",
    sectionAnchor: "sc-geography",
    sectionTitle: "Масштабирование географии деятельности",
  },
  {
    route: "/ngo/scale",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Онлайн-сопровождение. Этот формат подходит в случаях, когда соискатели уверенно пользуются интернетом",
    sectionAnchor: "sc-geography",
    sectionTitle: "Масштабирование географии деятельности",
  },
  {
    route: "/ngo/scale",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Выездная служба. Этот формат предполагает регулярные выезды команды на территорию",
    sectionAnchor: "sc-geography",
    sectionTitle: "Масштабирование географии деятельности",
  },
  {
    route: "/ngo/scale",
    component: "Card",
    variant: null,
    semanticType: "определение",
    snippet:
      "Местный специалист. Если работа на территории становится постоянной, можно привлечь местного специалиста",
    sectionAnchor: "sc-geography",
    sectionTitle: "Масштабирование географии деятельности",
  },
  {
    route: "/ngo/scale",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Чек-лист готовности команды. Предлагаем представителям НКО пройтись по пунктам чек-листа",
    sectionAnchor: "sc-form",
    sectionTitle: "Работа с другой формой инвалидности",
  },
  {
    route: "/ngo/scale",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Группа соискателей · Какие изменения могут потребоваться (люди с особенностями слуха, ОДА, зрения, ментальной)",
    sectionAnchor: "sc-form",
    sectionTitle: "Работа с другой формой инвалидности",
  },
  {
    route: "/ngo/scale",
    component: "Disclosure",
    variant: null,
    semanticType: "задание",
    snippet:
      "Чек-лист готовности материалов к передаче. Предлагаем представителям НКО пройтись по каждому пункту",
    sectionAnchor: "sc-share",
    sectionTitle: "Как поделиться своей экспертизой",
  },
  {
    route: "/ngo/scale",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Формат · Цель (вебинары, очные тренинги, публикации, консультации, участие в конференциях)",
    sectionAnchor: "sc-share",
    sectionTitle: "Как поделиться своей экспертизой",
  },
  {
    route: "/ngo/scale",
    component: "Callout",
    variant: "highlight",
    semanticType: "прочее",
    snippet:
      "Подведём итоги. Масштабирование требует ресурсов, опыта и готовности команды к новым задачам",
    sectionAnchor: "sc-share",
    sectionTitle: "Как поделиться своей экспертизой",
  },
  {
    route: "/ngo/funding",
    component: "Callout",
    variant: "briefing",
    semanticType: "прочее",
    snippet:
      "В этом разделе вы узнаете: из чего складывается бюджет программы инклюзивного трудоустройства; как готовить грантовые заявки",
    sectionAnchor: null,
    sectionTitle: null,
  },
  {
    route: "/ngo/funding",
    component: "BulletList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "К базовым статьям расходов относятся: фонд оплаты труда и обязательные платежи; приобретение мебели и оборудования",
    sectionAnchor: "fund-budget",
    sectionTitle:
      "Из чего складывается бюджет проекта инклюзивного трудоустройства",
  },
  {
    route: "/ngo/funding",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Как правильно / Пример типичной ошибки: Мы проведём 10 тренингов по подготовке к собеседованию для 50 людей с инвалидностью",
    sectionAnchor: "fund-grant",
    sectionTitle: "Что учесть при написании заявки на грант / Простота языка",
  },
  {
    route: "/ngo/funding",
    component: "Paragraph",
    variant: null,
    semanticType: "шаги",
    snippet:
      "Проблема → Решение (цель) → Шаги (задачи и план работы) → Результат → Устойчивость проекта.",
    sectionAnchor: "fund-grant",
    sectionTitle:
      "Что учесть при написании заявки на грант / Логическая цепочка",
  },
  {
    route: "/ngo/funding",
    component: "DataTable",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Как правильно / Пример типичной ошибки: В регионе N только 15% людей с инвалидностью трудоспособного возраста имеют работу",
    sectionAnchor: "fund-grant",
    sectionTitle: "Что учесть при написании заявки на грант / Опора на факты",
  },
  {
    route: "/ngo/funding",
    component: "Paragraph + Paragraph",
    variant: null,
    semanticType: "сравнение",
    snippet:
      "Например, корректной будет формулировка: «существует риск отказа соискателей...» ... Менее удачная формулировка — «существует риск отказа соискателей от выхода на работу»",
    sectionAnchor: "fund-structure",
    sectionTitle:
      "Структура заявки / Подтверждение адекватной оценки рисков и стратегии их минимизации",
  },
  {
    route: "/ngo/funding",
    component: "ContentSection",
    variant: null,
    semanticType: "задание",
    snippet:
      "Проверьте заявку на грант с помощью AI-ассистента. Написание заявки — только часть работы. Мы подготовили промпт для AI-ассистента",
    sectionAnchor: "fund-task",
    sectionTitle: "Практическое задание для представителей НКО",
  },
  {
    route: "/ngo/funding",
    component: "LinkList",
    variant: null,
    semanticType: "прочее",
    snippet:
      "Инклюзия в Яндексе; Совет бизнеса по вопросам инвалидности; Everland. PRO инклюзию и работу; Всё получится!",
    sectionAnchor: "fund-conclusion",
    sectionTitle: "Заключение",
  },
  {
    route: "/ngo/funding",
    component: "ImagePlaceholder",
    variant: null,
    semanticType: "прочее",
    snippet:
      "ВИДЕО — плейсхолдер под встроенное видео-напутствие авторов гида.",
    sectionAnchor: "fund-conclusion",
    sectionTitle: "Заключение",
  },
];
