import {
  Accordion,
  Button,
  CardContainer,
  Checkbox,
  Compare,
  CompareCard,
  Dropdown,
  ExternalLink,
  GeneralCard,
  Heading,
  Image,
  Input,
  ListContainer,
  ListItem,
  Prompt,
  Quiz,
  QuizBadge,
  QuizItems,
  Quote,
  Radio,
  Search,
  SectionContainer,
  SmallImage,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
  Text,
  TextButton,
  Textarea,
  Tooltip,
  Video,
  type SmallImageName,
} from "@/figma";
import {
  Copy,
  Download,
  FileText,
  Minus,
  Search as SearchIcon,
  ShieldCheck,
} from "lucide-react";

/*
  Разделы витрины компонентов. Каждый раздел показывает и сам компонент,
  и то, как он вкладывается. Тексты — рыба: задача страницы не в контенте,
  а в проверке системы и вложенностей.

  Везде соблюдается главное правило: Heading и Text лежат прямо в
  Section Container, всё остальное — только внутри Card Container.
*/

export function TypographySection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="typography">
        Типографика
      </Heading>
      <Text size="L">
        Заголовки и абзацы — единственное, что кладётся прямо в{" "}
        <Tooltip
          title="Section Container"
          content="Каркас смыслового раздела страницы. Отбивает раздел сверху на 56 и держит ширину колонки. Сам ничего не рисует."
        >
          Section Container
        </Tooltip>
        . Всё остальное заворачивается в Card Container. Подробности — в
        документе <ExternalLink href="https://www.figma.com/design/k5eUmzpvQR96XrwBxUfGgS/">макет в Figma</ExternalLink>.
      </Text>

      <Heading level="H3">Heading · H3 — подраздел</Heading>
      <Text size="L">
        Text · L — основной текст лонгрида. Единственный размер с интерлиньяжем
        1.4: он рассчитан на долгое чтение и потому взят дефолтом.
      </Text>
      <Heading level="H4">Heading · H4 — третий уровень</Heading>
      <Text size="M">
        Text · M — пояснения и второстепенные абзацы, кегль 16.
      </Text>
      <Heading level="H5">Heading · H5 — самый мелкий</Heading>
      <Text size="S">
        Text · S — сноски, подписи и дисклеймеры, кегль 14. От H4 заголовок H5
        отличается всего на 2 пикселя — на глаз почти не читается как отдельный
        уровень.
      </Text>

      <Heading level="H4">Text · Phrase — фраза-врезка</Heading>
      <Text size="M">
        Новый размер Text. Не цитата (автора нет) — выделенная мысль или
        инструкция прямо в потоке, с вертикальной чертой слева:
      </Text>
      <Text size="Phrase">
        «Давайте посмотрим на трёх героев, которые по-разному используют гаджеты.
        Отметьте тех, кто, на ваш взгляд, обладает цифровой грамотностью».
      </Text>
    </SectionContainer>
  );
}

export function ListsSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="lists">
        Списки
      </Heading>
      <Text size="L">
        List Container — не «список», а вертикальный стек с шагом 8. Обычно в нём
        List Item, но лечь может и другой блок (ниже, в разделе «Цитаты»,
        показан живой случай с двумя Quote внутри).
      </Text>

      <ListContainer>
        <ListItem size="L" type="Dot">
          List Item · L · Dot — пункт с точкой, кегль 18
        </ListItem>
        <ListItem size="L" type="Dot">
          Точка красится в text/secondary, сам текст — в text/primary
        </ListItem>
      </ListContainer>

      <ListContainer>
        <ListItem size="L" type="Icon">
          List Item · L · Icon — по умолчанию галочка вместо точки
        </ListItem>
        <ListItem size="M" type="Icon" iconNode={<Minus />}>
          Иконку можно заменить (iconNode) — здесь минус для исключения
        </ListItem>
        <ListItem size="M" type="Dot">
          List Item · M · Dot — точка, кегль 16
        </ListItem>
      </ListContainer>

      <Text size="L">
        Новый маркер Number — нумерованный список. Номера считает CSS-счётчик,
        руками их проставлять не нужно. Тег контейнера — ol, чтобы разметка была
        честной:
      </Text>
      <ListContainer as="ol">
        <ListItem size="L" type="Number">
          List Item · L · Number — первый шаг, номер печатается сам
        </ListItem>
        <ListItem size="L" type="Number">
          Второй шаг — счётчик увеличивается автоматически
        </ListItem>
        <ListItem size="L" type="Number">
          Третий шаг — теперь «Наём по шагам» можно нумеровать по-настоящему
        </ListItem>
      </ListContainer>
    </SectionContainer>
  );
}

export function ButtonsSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="buttons">
        Кнопки
      </Heading>
      <Text size="L">
        Кнопки — из набора Controls дизайн-системы: нейтральный тёмно-синий
        Primary (не жёлтая кнопка-легаси старого сайта), с наведением и
        выключенным состоянием. Один Primary на смысловой блок, подпись — глагол
        с объектом. Кнопку в поток текста ставят через Text · Button (внизу) — это
        правильный способ; ряды ниже показывают типы, размеры и иконки.
      </Text>

      {/* Card Container с одиночной кнопкой — так сделано в живом шаблоне */}
      <CardContainer orientation="Horizontal">
        <Button type="Primary" size="L">
          Primary · L
        </Button>
        <Button type="Secondary" size="L">
          Secondary · L
        </Button>
        <Button type="Outline" size="L">
          Outline · L
        </Button>
        <Button type="Ghost" size="L">
          Ghost · L
        </Button>
      </CardContainer>

      <CardContainer orientation="Horizontal">
        <Button type="Primary" size="M" icon="Left" iconNode={<Download />}>
          Скачать шаблон
        </Button>
        <Button type="Outline" size="S" icon="Left" iconNode={<Copy />}>
          Скопировать
        </Button>
        <Button
          type="Secondary"
          size="M"
          icon="Only"
          iconNode={<SearchIcon />}
          aria-label="Поиск"
        />
        <Button type="Primary" size="M" disabled>
          Выключена
        </Button>
      </CardContainer>

      {/* Второй способ: кнопка внутри Text · Button */}
      <TextButton type="Primary" size="L" icon="Right" iconNode={<FileText />}>
        Text · Button — кнопка в потоке текста
      </TextButton>
    </SectionContainer>
  );
}

export function CardsSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="cards">
        Карточки
      </Heading>
      <Text size="L">
        General Card — универсальный блок со слотом. Ряд карточек собирается
        через Card Container · Horizontal: 380 + 8 + 380 = ширина колонки.
      </Text>

      {/* Ряд карточек: Card Container · Horizontal → General Card ×2 */}
      <CardContainer orientation="Horizontal">
        <GeneralCard
          className="min-w-[380px] flex-1"
          title="Карточка со всеми украшениями"
          bgColor="blue"
          step="1 шаг"
          image="Собеседование"
          iconNode={<ShieldCheck />}
        >
          <Text size="M">
            Иллюстрация, метка шага и круг с иконкой — всё опционально. В мастере
            Figma они включены одновременно, но это витрина возможностей, а не
            рекомендуемый вид.
          </Text>
        </GeneralCard>

        <GeneralCard
          className="min-w-[380px] flex-1"
          title="Карточка со списком внутри"
          bgColor="green"
        >
          <Text size="M">
            В слот карточки кладут Text, List Container и Button:
          </Text>
          {/* Глубокая вложенность: Card Container → Card → Slot → List Container → List Item */}
          <ListContainer>
            <ListItem size="M" type="Dot">
              Первый пункт внутри карточки
            </ListItem>
            <ListItem size="M" type="Dot">
              Второй пункт
            </ListItem>
            <ListItem size="M" type="Dot">
              Третий пункт
            </ListItem>
          </ListContainer>
        </GeneralCard>
      </CardContainer>

      <Text size="L">
        Цвет фона — свойство bgColor со смыслом. По умолчанию синий; жёлтый —
        важное; розовый — опасное или предупреждающее; зелёный — позитивное.
        Белый, бежевый и серый — нейтральные, без закреплённого значения.
      </Text>

      <CardContainer orientation="Horizontal">
        {(
          [
            { bg: "blue", note: "по умолчанию — обычная карточка" },
            { bg: "yellow", note: "важный контент" },
            { bg: "pink", note: "опасное, предупреждение" },
            { bg: "green", note: "радостное, позитивное" },
          ] as const
        ).map(({ bg, note }) => (
          <GeneralCard
            key={bg}
            className="min-w-[180px] flex-1"
            title={`card/bg-${bg}`}
            bgColor={bg}
          >
            <Text size="S">{note}</Text>
          </GeneralCard>
        ))}
      </CardContainer>

      {/* Orient=Horizontal — компактная строка, высота НЕ фиксирована */}
      <CardContainer>
        <GeneralCard
          orient="Horizontal"
          title="General Card · Horizontal"
          bgColor="beige"
          image="Документы"
        >
          <Text size="M">
            Горизонтальная карточка: высота растёт по содержимому, а не зашита в
            118 — проверено по живому узлу, где она 420.
          </Text>
        </GeneralCard>
      </CardContainer>
    </SectionContainer>
  );
}

export function QuotesSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="quotes">
        Цитаты
      </Heading>
      <Text size="L">
        Quote — только прямая речь конкретного человека с именем и должностью
        (они показываются всегда). Слева — логотип его организации; а если говорит
        сотрудник Яндекса, вместо логотипа знак «Я». Длинная цитата уходит «под
        кат»: обрезается до пяти строк, ссылка «Далее» раскрывает остальное.
      </Text>

      <CardContainer>
        <Quote
          size="L"
          author="Гульнара Горишняя"
          role="Руководитель направления по инклюзивному трудоустройству"
          yandex
        >
          Quote · L — акцентная цитата на кремовой подложке. Автор из Яндекса,
          поэтому слева знак «Я». А это уже длинный текст, чтобы показать кат: мы
          взяли первого сотрудника с инвалидностью, потому что подходили под
          квоту. Через полгода поняли, что он один из лучших в команде — и стали
          искать ещё. Сейчас у нас работает девять человек, и мы не собираемся
          останавливаться на достигнутом. Инклюзия оказалась не
          благотворительностью, а обычным управленческим решением, которое
          окупается: люди держатся за место, реже уходят и приводят знакомых. Мы
          жалеем только о том, что не начали заниматься этим на пару лет раньше.
        </Quote>
        <Quote
          size="S"
          author="Имя Фамилия"
          role="Руководитель программ, БФ «Помощь рядом»"
          org="Помощь рядом"
          logo="pomosch-ryadom"
        >
          Quote · S — спокойная цитата без подложки. Автор из внешнего фонда,
          поэтому слева плашка-логотип организации. Короткая цитата в пять строк
          укладывается, поэтому «Далее» не появляется.
        </Quote>
      </CardContainer>

      <Text size="L">
        Живой случай из шаблона: две Quote лежат внутри List Container — то есть
        стек принимает не только пункты списка.
      </Text>

      <CardContainer>
        <ListContainer as="div">
          <Quote size="S" author="Первый автор" role="Должность">
            Первая цитата внутри List Container.
          </Quote>
          <Quote size="S" author="Второй автор" role="Должность">
            Вторая цитата — промежуток 8 задаёт стек.
          </Quote>
        </ListContainer>
      </CardContainer>
    </SectionContainer>
  );
}

export function CompareSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="compare">
        Сравнение «за / против»
      </Heading>
      <Text size="L">
        Пара собирается компонентом Compare — он держит две Compare Card в ряд,
        бок о бок, и не переносит их одна под другую.
      </Text>

      <CardContainer>
        <Compare>
          <CompareCard tone="positive" txt="Так правильно">
            <Text size="M">В слот половинки кладут текст и список:</Text>
            <ListContainer>
              <ListItem size="M" type="Icon">
                Понятная формулировка вакансии
              </ListItem>
              <ListItem size="M" type="Icon">
                Указаны условия и доступность офиса
              </ListItem>
            </ListContainer>
          </CompareCard>

          <CompareCard tone="negative" txt="Так неправильно">
            <Text size="M">Смысл задаётся только цветом — свойства нет:</Text>
            <ListContainer>
              <ListItem size="M" type="Dot">
                Требования без объяснения
              </ListItem>
              <ListItem size="M" type="Dot">
                Про доступность ни слова
              </ListItem>
            </ListContainer>
          </CompareCard>
        </Compare>
      </CardContainer>
    </SectionContainer>
  );
}

export function TableSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="table">
        Таблица
      </Heading>
      <Text size="L">
        Готовой «Таблицы» в Figma нет, поэтому Table — наша сборка из уже
        существующих ячеек: шапку собирают строкой из Table header cell, тело —
        строками из Table cell.
      </Text>

      <CardContainer>
        <Table>
          <TableRow header>
            <TableHeaderCell>Контейнер</TableHeaderCell>
            <TableHeaderCell>Зачем нужен</TableHeaderCell>
          </TableRow>
          <TableRow>
            <TableCell weight="Medium">Section Container</TableCell>
            <TableCell>Каркас смыслового раздела страницы</TableCell>
          </TableRow>
          <TableRow>
            <TableCell weight="Medium">Card Container</TableCell>
            <TableCell>Конверт для всего, что не проза</TableCell>
          </TableRow>
          <TableRow>
            <TableCell weight="Medium">List Container</TableCell>
            <TableCell>Вертикальный стек с равным шагом</TableCell>
          </TableRow>
        </Table>
      </CardContainer>
    </SectionContainer>
  );
}

export function AccordionSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="accordion">
        Аккордеон
      </Heading>
      <Text size="L">
        Берут, когда контента много, а читателю нужен не весь. Не берут для того,
        что читатель обязан прочесть: свёрнутое не читают.
      </Text>

      <CardContainer>
        <Accordion question="Вопрос с обычным ответом" defaultOpen>
          <Text size="L">
            В слот аккордеона кладут Text, List Container и Quote.
          </Text>
        </Accordion>

        <Accordion question="Вопрос со списком в ответе">
          <Text size="L">Ответ может содержать список:</Text>
          <ListContainer>
            <ListItem size="L" type="Dot">
              Первый пункт ответа
            </ListItem>
            <ListItem size="L" type="Dot">
              Второй пункт ответа
            </ListItem>
          </ListContainer>
        </Accordion>

        {/* Живой случай: внутри аккордеона — List Container с цитатами */}
        <Accordion question="Вопрос с цитатами в ответе">
          <ListContainer as="div">
            <Quote size="S" author="Имя Фамилия" role="Должность">
              Цитата внутри аккордеона — так собрано в живом шаблоне.
            </Quote>
            <Quote size="S" author="Имя Фамилия" role="Должность">
              Вторая цитата рядом.
            </Quote>
          </ListContainer>
        </Accordion>
      </CardContainer>
    </SectionContainer>
  );
}

export function PromptSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="prompt">
        Врезка с заготовкой
      </Heading>
      <Text size="L">
        Суть Prompt не в тексте, а в паре «дисклеймер + кнопка Скопировать»: он
        отдаёт сырьё и сразу предупреждает, что вслепую его применять нельзя.
      </Text>

      <CardContainer>
        <Prompt
          title="ИИ промпт"
          warning="До использования в реальных документах — проверить с юристом."
        >
          Составь текст вакансии для кандидата с инвалидностью: опиши задачи,
          условия труда и доступность офиса. Не используй формулировки, которые
          сужают круг кандидатов без деловой необходимости.
        </Prompt>
      </CardContainer>
    </SectionContainer>
  );
}

export function QuizSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="quiz">
        Квиз
      </Heading>
      <Text size="L">
        Самопроверка после куска обучающего материала. Не форма: данные никуда не
        уходят.
      </Text>

      <CardContainer>
        <Quiz
          title="Проверьте себя"
          description="Отметьте все подходящие варианты и нажмите «Проверить»."
          question="Какая форма занятости позволяет закрыть квоту?"
          items={[
            { text: "Трудовой договор с сотрудником в штат", correct: true },
            { text: "Аренда рабочего места в НКО", correct: true },
            { text: "Разовый договор подряда", correct: false },
            { text: "Стажировка без оформления", correct: false },
          ]}
          explanation="Квота закрывается только оформленными отношениями: штат или соглашение с НКО об аренде рабочего места."
        />
      </CardContainer>

      <Heading level="H3">Состояния Quiz Items и Quiz Badge</Heading>
      <Text size="M">
        Показаны отдельно — на живой странице они появляются только после
        проверки.
      </Text>

      <CardContainer>
        <QuizItems state="Default">Quiz Items · Default</QuizItems>
        <QuizItems state="Correct" checked>
          Quiz Items · Correct
        </QuizItems>
        <QuizItems state="Incorrect" checked>
          Quiz Items · Incorrect
        </QuizItems>
        <QuizItems state="Partly">Quiz Items · Partly</QuizItems>
      </CardContainer>

      <CardContainer orientation="Horizontal">
        <QuizBadge type="Correct" />
        <QuizBadge type="Incorrect" />
        <QuizBadge type="Partly" />
      </CardContainer>
    </SectionContainer>
  );
}

const ALL_IMAGES: readonly SmallImageName[] = [
  "Подготовка резюме",
  "Рамка",
  "Отклик на вакансию",
  "Собеседование",
  "Оформление",
  "Задачи и коммуникация в команде",
  "Комп",
  "Поиск",
  "Чеклист",
  "Пин",
  "Скрепка",
  "Галка",
  "Окно",
  "Рабочий стол",
  "Документы",
  "Баблы",
  "AI",
  "Важная информация",
];

export function SmallImageSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="small-image">
        Иллюстрации
      </Heading>
      <Text size="L">
        Small Image — стикер-декор, а не содержательная картинка: текст без неё
        должен читаться полностью. Здесь все 18 сюжетов набора — настоящие SVG,
        выгруженные из Figma. Два последних («AI» и «Важная информация») в самой
        Figma пустые: там рисунок ещё не залит.
      </Text>

      <CardContainer orientation="Horizontal">
        {ALL_IMAGES.map((name) => (
          <div key={name} className="flex w-[104px] flex-col items-center gap-[var(--space-2xs)]">
            <SmallImage name={name} size={64} />
            <span className="ds-body-s text-center text-[color:var(--text-secondary)]">
              {name}
            </span>
          </div>
        ))}
      </CardContainer>
    </SectionContainer>
  );
}

export function MediaSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="media">
        Медиа: картинка и видео
      </Heading>
      <Text size="L">
        Два новых компонента для тела страницы. Раньше их не было: фото жило
        только в Hero, а Small Image — стикер-декор. Оба кладут в Card Container
        и оба резиновые — ширину задаёт колонка, соотношение сторон ~16:9.
      </Text>

      <Text size="L">
        Image — картинка в тексте: иллюстрация, схема, скриншот. Прототип
        реального фото не показывает, поэтому это рамка-заглушка «здесь будет
        изображение».
      </Text>
      <CardContainer>
        <Image />
      </CardContainer>

      <Text size="L">
        Video — ролик, например интервью героя. Кнопка play по центру; в
        прототипе — пастельный плейсхолдер без реального кадра.
      </Text>
      <CardContainer>
        <Video />
      </CardContainer>
    </SectionContainer>
  );
}

export function ControlsSection() {
  return (
    <SectionContainer>
      <Heading level="H2" id="controls">
        Контролы форм
      </Heading>
      <Text size="L">
        Поля ввода и переключатели из набора Controls. Три состояния у полей:
        обычное, недоступное (серое) и ошибка (красная рамка). Все — настоящие
        элементы формы: доступны с клавиатуры и читалкой.
      </Text>

      <Heading level="H3">Поля ввода</Heading>
      <CardContainer>
        <Input placeholder="Введите текст" />
        <Input state="Disabled" placeholder="Недоступно" />
        <Input state="Error" defaultValue="неверный@email" />
      </CardContainer>

      <Heading level="H3">Выпадающий список</Heading>
      <CardContainer>
        <Dropdown>
          <option>Удалённая работа</option>
          <option>Гибрид</option>
          <option>Офис</option>
        </Dropdown>
        <Dropdown state="Disabled" placeholder="Недоступно" />
        <Dropdown state="Error" placeholder="Не выбрано" />
      </CardContainer>

      <Heading level="H3">Поиск</Heading>
      <CardContainer>
        <Search />
        <Search defaultValue="Удалённая работа" />
        <Search state="Error" />
      </CardContainer>

      <Heading level="H3">Многострочное поле</Heading>
      <CardContainer>
        <Textarea placeholder="Расскажите о вашем опыте" />
        <Textarea state="Error" placeholder="Поле обязательно для заполнения" />
      </CardContainer>

      <Heading level="H3">Флажки и переключатели</Heading>
      <Text size="M">
        Checkbox — независимые пункты (можно отметить несколько), Radio — выбор
        одного из группы. Размеры L и S, отмеченный цвет — тёмно-синий DS.
      </Text>
      <CardContainer orientation="Horizontal">
        <label className="flex items-center gap-[var(--space-xs)]">
          <Checkbox defaultChecked aria-label="Удалённая работа" />
          <Text size="M">Удалённая работа</Text>
        </label>
        <label className="flex items-center gap-[var(--space-xs)]">
          <Checkbox aria-label="Гибкий график" />
          <Text size="M">Гибкий график</Text>
        </label>
        <label className="flex items-center gap-[var(--space-xs)]">
          <Checkbox disabled aria-label="Недоступно" />
          <Text size="M">Недоступно</Text>
        </label>
      </CardContainer>
      <CardContainer orientation="Horizontal">
        <label className="flex items-center gap-[var(--space-xs)]">
          <Radio name="demo-format" defaultChecked aria-label="Полный день" />
          <Text size="M">Полный день</Text>
        </label>
        <label className="flex items-center gap-[var(--space-xs)]">
          <Radio name="demo-format" aria-label="Частичная занятость" />
          <Text size="M">Частичная занятость</Text>
        </label>
        <label className="flex items-center gap-[var(--space-xs)]">
          <Radio name="demo-format" disabled aria-label="Недоступно" />
          <Text size="M">Недоступно</Text>
        </label>
      </CardContainer>
    </SectionContainer>
  );
}
