import * as React from "react";
import { cn } from "@/lib/utils";
import { Callout } from "@/components/Callout";
import { Warning } from "@/components/Warning";
import { Blockquote } from "@/components/Blockquote";
import { PersonaCard } from "@/components/PersonaCard";
import { Disclosure } from "@/components/Disclosure";
import { StepsShelf } from "@/components/StepsShelf";
import { CompareColumns } from "@/components/CompareColumns";
import { StatBlock } from "@/components/StatBlock";
import { CodeSnippet } from "@/components/CodeSnippet";
import { GlossaryTerm } from "@/components/GlossaryTerm";
import { QuizItem } from "@/components/QuizItem";
import { Paragraph, OrderedList, BulletList } from "@/components/Prose";
import { Badge } from "@/components/ui/badge";

// Каталог компонентов (/catalog) — дизайн-референс канонического набора.
// Не плодит новые компоненты: показывает МАЛЕНЬКИЙ набор существующих
// примитивов и то, какие смысловые типы на них ложатся (вариантом/режимом).
// Живые примеры — реальные компоненты сайта, поэтому всегда точны.

type Primitive = {
  name: string;
  /** Что это одной строкой. */
  tagline: string;
  /** Смысловые типы, которые ложатся на этот примитив. */
  meanings: string[];
  /** Когда брать. */
  when: string;
  /** Когда НЕ брать (граница). */
  notWhen: string;
  /** Как написать. */
  code: string;
  /** Живой пример — реальный компонент. */
  preview: React.ReactNode;
};

// Карта: смысловой тип → примитив (вариант/режим).
const SEMANTIC_MAP: { meaning: string; maps: string }[] = [
  { meaning: "Совет / рекомендация", maps: "Callout · highlight" },
  {
    meaning: "Предупреждение / риск",
    maps: "Callout · warning (обёртка Warning)",
  },
  { meaning: "Практическое задание", maps: "Callout · briefing" },
  { meaning: "Определение (развёрнутое)", maps: "Callout · info" },
  { meaning: "Определение (в тексте)", maps: "GlossaryTerm (инлайн)" },
  { meaning: "Пример (именованный)", maps: "Callout · highlight «Пример»" },
  { meaning: "Пример (серия)", maps: "Card / DataTable" },
  { meaning: "Цитата", maps: "Blockquote" },
  { meaning: "Кейс (короткий)", maps: "Blockquote с атрибуцией" },
  { meaning: "Кейс (портрет)", maps: "PersonaCard" },
  { meaning: "Вопрос-ответ (faq)", maps: "Disclosure" },
  { meaning: "Миф / факт", maps: "Disclosure (режим-квиз, Badge)" },
  {
    meaning: "Тест / тренажёр (кейс → варианты → разбор)",
    maps: "QuizItem (новый)",
  },
  { meaning: "ИИ-промпт / шаблон", maps: "CodeSnippet" },
  { meaning: "Пошаговый список (в тексте)", maps: "OrderedList" },
  { meaning: "Шаги-ссылки", maps: "StepsShelf" },
  { meaning: "Сравнение", maps: "CompareColumns" },
  { meaning: "Факт-цифра", maps: "StatBlock" },
];

const PRIMITIVES: Primitive[] = [
  {
    name: "QuizItem — тест / тренажёр",
    tagline: "Условие → варианты с вердиктом → разбор. Интерактивный.",
    meanings: ["тест", "тренажёр", "кейс-вопрос"],
    when: "Кейс/вопрос с вариантами ответа, где важно показать верный и разобрать почему. Условие видно всегда, скрыт только разбор.",
    notWhen:
      "Просто вопрос-ответ без выбора → Disclosure. Перечень задач для галочек → Checklist.",
    code: '<QuizItem question="…" options={[{ text, verdict: "correct|wrong|partial" }]} explanation={<>…</>} />',
    preview: (
      <QuizItem
        context={
          <>
            <p className="font-medium text-foreground">
              Кейс — специалист по видеомонтажу
            </p>
            <BulletList>
              <li>работа с таймкодами и визуальными переходами;</li>
              <li>сборка ролика по ТЗ, обратная связь письменно.</li>
            </BulletList>
          </>
        }
        question="Кому из кандидатов эта вакансия подходит лучше всего?"
        options={[
          { text: "Люди с инвалидностью по зрению", verdict: "wrong" },
          { text: "Люди с инвалидностью по слуху", verdict: "wrong" },
          {
            text: "Люди с инвалидностью опорно-двигательного аппарата",
            verdict: "correct",
          },
        ]}
        explanation={
          <p>
            Монтаж требует зрительной концентрации и работы со звуковой дорожкой
            — кандидатам с инвалидностью по зрению и слуху он подойдёт хуже.
            Наиболее подходят соискатели с инвалидностью опорно-двигательного
            аппарата (с учётом доступности помещения).
          </p>
        }
      />
    ),
  },
  {
    name: "Callout — врезка",
    tagline: "Редакционная плашка с закрытым списком вариантов.",
    meanings: ["совет", "предупреждение", "задание", "определение", "пример"],
    when: "Короткая выделенная мысль в стороне от основного текста: совет (highlight), риск (warning), задание (briefing), справка (info).",
    notWhen:
      "Не для длинных абзацев, не для цитат людей (→ Blockquote) и не для крупных чисел-крючков (→ StatBlock).",
    code: '<Callout variant="highlight" title="Совет">…</Callout>\n<Warning>…</Warning>   // = Callout · warning',
    preview: (
      <div className="space-y-3">
        <Callout variant="highlight" title="Совет">
          Начните с одной пилотной вакансии, а не с массового найма.
        </Callout>
        <Warning>
          Сверхурочная работа — только с письменного согласия и при отсутствии
          противопоказаний в ИПРА.
        </Warning>
      </div>
    ),
  },
  {
    name: "Blockquote — голос",
    tagline: "Прямая речь одного человека с атрибуцией.",
    meanings: ["цитата", "кейс (короткий)"],
    when: "Цитата эксперта или короткая история от первого лица.",
    notWhen:
      "Развёрнутый портрет с раскрытием → PersonaCard. Не для обычного текста.",
    code: '<Blockquote attribution="Денис, оператор">…</Blockquote>',
    preview: (
      <Blockquote attribution="Денис, оператор колл-центра">
        В «Уфанете» я проработал 9 лет: CRM доработали под слабовидящих — и всё
        заработало.
      </Blockquote>
    ),
  },
  {
    name: "PersonaCard — портрет-история",
    tagline: "Имя, роль, описание + сворачиваемое саммари.",
    meanings: ["кейс (портрет)"],
    when: "Развёрнутая история человека, которую хочется свернуть/раскрыть.",
    notWhen: "Короткая цитата без портрета → Blockquote.",
    code: '<PersonaCard name="Денис" role="оператор" summary="…">…</PersonaCard>',
    preview: (
      <PersonaCard
        name="Денис"
        role="оператор колл-центра"
        description="Слабовидящий, 9 лет в профессии."
        summaryLabel="Краткое саммари"
        summary="CRM доработали под слабовидящих — сотрудник вышел на полную нагрузку."
      >
        История о том, как небольшая адаптация рабочего инструмента открыла
        человеку полноценную занятость.
      </PersonaCard>
    ),
  },
  {
    name: "Disclosure — сворачивание",
    tagline: "Список «заголовок → раскрыть разбор».",
    meanings: ["faq", "миф-факт"],
    when: "Частые вопросы; «миф или правда» как квиз (утверждение + бейдж → разбор).",
    notWhen: "Не для линейного чтения, где всё важно сразу.",
    code: "<Disclosure entries={[{ trigger, badge?, content }]} />",
    preview: (
      <Disclosure
        entries={[
          {
            trigger: "Сотрудники с инвалидностью берут больше больничных",
            badge: <Badge tone="bad">Миф</Badge>,
            content: "Разница с другими сотрудниками — 1–2 дня в год.",
          },
          {
            trigger: "Можно ли уволить сотрудника с инвалидностью?",
            content:
              "Да — по всем общим основаниям ТК; есть нюансы по медпоказаниям.",
          },
        ]}
      />
    ),
  },
  {
    name: "StepsShelf / OrderedList — шаги",
    tagline: "Последовательность: список в тексте или полка-ссылки.",
    meanings: ["шаги"],
    when: "Шаги в тексте → OrderedList. Шаги, ведущие на отдельные страницы → StepsShelf.",
    notWhen: "Не для несвязанного перечня (→ BulletList).",
    code: '<OrderedList><li>…</li></OrderedList>\n<StepsShelf steps={[…]} link="each-step-link" />',
    preview: (
      <div className="space-y-4">
        <OrderedList>
          <li>Определить аудиторию</li>
          <li>Выбрать формат работы</li>
          <li>Найти партнёров-работодателей</li>
        </OrderedList>
        <StepsShelf
          link="non-link"
          cols={3}
          steps={[
            { number: "1", title: "Оценка готовности" },
            { number: "2", title: "Поиск вакансии" },
            { number: "3", title: "Сопровождение" },
          ]}
        />
      </div>
    ),
  },
  {
    name: "CompareColumns — сравнение",
    tagline: "Две панели рядом: можно/нельзя, было/стало.",
    meanings: ["сравнение"],
    when: "Противопоставление двух подходов или состояний.",
    notWhen: "Больше двух колонок или табличные данные → DataTable.",
    code: "<CompareColumns left={{title, tone, items}} right={{…}} />",
    preview: (
      <CompareColumns
        left={{
          title: "Разумная адаптация",
          tone: "good",
          items: [
            "Гибкий график по договорённости",
            "Наставник на первый месяц",
          ],
        }}
        right={{
          title: "Гиперопека",
          tone: "bad",
          items: [
            "Решать всё за сотрудника",
            "Освобождать от задач «на всякий случай»",
          ],
        }}
      />
    ),
  },
  {
    name: "StatBlock — факт-цифра",
    tagline: "Крупное число + короткая подпись.",
    meanings: ["факт-цифра"],
    when: "Число-крючок, которое должно бросаться в глаза.",
    notWhen: "Не для расчётов и таблиц с числами (→ DataTable).",
    code: "<StatBlock stats={[{ value, label }]} />",
    preview: (
      <StatBlock
        stats={[
          {
            value: "4,3 млн",
            label: "человек трудоспособного возраста с инвалидностью в России",
          },
          { value: "~30%", label: "из них работают" },
        ]}
      />
    ),
  },
  {
    name: "CodeSnippet — копируемое",
    tagline: "Моноширинный блок с кнопкой «Копировать».",
    meanings: ["промпт-шаблон"],
    when: "ИИ-промпт или шаблон письма, который копируют целиком.",
    notWhen: "Не для обычного текста, даже если он в рамке.",
    code: '<CodeSnippet tag="ИИ-промпт" text={`…`} />',
    preview: (
      <CodeSnippet
        tag="ИИ-промпт"
        text={
          "Ты — HR-специалист. Составь текст инклюзивной вакансии для оператора колл-центра."
        }
      />
    ),
  },
  {
    name: "GlossaryTerm — термин в тексте",
    tagline: "Инлайн-подсветка со ссылкой на глоссарий.",
    meanings: ["определение (в тексте)"],
    when: "Термин прямо в абзаце, который стоит пояснить, не разрывая мысль.",
    notWhen: "Развёрнутое определение отдельным блоком → Callout · info.",
    code: '…в основе — <GlossaryTerm term="ИПРА">ИПРА</GlossaryTerm>…',
    preview: (
      <Paragraph>
        В основе — <GlossaryTerm term="ИПРА">ИПРА</GlossaryTerm>: убрать барьер
        — человек работает наравне.
      </Paragraph>
    ),
  },
];

export function CatalogPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Каталог компонентов
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Маленький закрытый набор визуальных «кубиков». Каждый смысловой тип
          ложится на один из них — вариантом или режимом, а не отдельным
          компонентом. Примеры живые: это реальные компоненты сайта.
        </p>
      </header>

      {/* Карта смыслов → примитив */}
      <section className="space-y-3 rounded-lg border p-4">
        <h2 className="text-lg font-semibold text-foreground">
          Карта: смысл → кубик
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-semibold">Смысловой тип</th>
                <th className="py-2 font-semibold">Кубик · вариант</th>
              </tr>
            </thead>
            <tbody>
              {SEMANTIC_MAP.map((r) => (
                <tr key={r.meaning} className="border-b last:border-0">
                  <td className="py-2 pr-4 text-foreground">{r.meaning}</td>
                  <td className="py-2 font-mono text-xs text-muted-foreground">
                    {r.maps}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Кубики */}
      <div className="space-y-6">
        {PRIMITIVES.map((p) => (
          <section key={p.name} className="space-y-4 rounded-lg border p-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {p.name}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {p.meanings.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{p.tagline}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium text-foreground">
                      Когда брать.{" "}
                    </span>
                    <span className="text-muted-foreground">{p.when}</span>
                  </p>
                  <p>
                    <span className="font-medium text-[hsl(var(--warn))]">
                      Когда не брать.{" "}
                    </span>
                    <span className="text-muted-foreground">{p.notWhen}</span>
                  </p>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-muted/60 px-3 py-2 font-mono text-xs leading-relaxed text-foreground">
                  {p.code}
                </pre>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Живой пример
                </p>
                <div className={cn("rounded-md border bg-background p-3")}>
                  {p.preview}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
