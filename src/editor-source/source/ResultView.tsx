import * as React from "react";
import {
  Accordion,
  Button,
  CardButton,
  Block,
  Compare,
  CompareCard,
  Feedback,
  Quiz,
  ReadMore,
  ReadMoreItem,
  SectionContainer,
  GeneralCard,
  Heading,
  Image,
  Stack,
  ListItem,
  PageSummary,
  Phrase,
  Prompt,
  Quote,
  Table,
  TableCell,
  TableHeaderCell,
  TableRow,
  Text,
  Video,
  PersonItem,
  type GeneralCardBg,
  type SmallImageName,
} from "@/figma";
import { renderInline, previewHref } from "@/editor-source/richText";
import { iconByName } from "./iconForText";
import { useLogoIndex, useAvatarIndex } from "./orgLogo";
import {
  buildDoc,
  textBlocks,
  type Doc,
  type Node,
  type SectionNode,
  type TableCellValue,
} from "./contentTree";
import type { Directive } from "@/editor-source/directives";
import type { Section } from "./PlaygroundColumn";
import type { ResolveMd } from "./blockResolve";

/*
  «Результат» — как контент выглядит, когда директивы применены.

  Здесь ТОЛЬКО отрисовка: вся раскладка живёт в contentTree.ts и оттуда же
  берётся выгрузка JSON для разработчика. Так превью и выгрузка не могут
  разъехаться — дизайнер видит ровно то, что уедет разработчику.

  Сборка — чистая функция от (блоки источника + директивы): ничего не
  генерится в файлы и не переписывается. Откат бесплатный: вернул директиве
  статус «новая» — блок снова рисуется обычным текстом.
*/

/** Дерево контента текущего модуля. Им же кормится выгрузка. */
export function useContentDoc(
  moduleId: string,
  sections: Section[],
  resolve: ResolveMd,
  directiveAt?: (si: number, bi: number) => Directive | undefined,
): Doc {
  const logoIndex = useLogoIndex();
  const avatarIndex = useAvatarIndex();
  return React.useMemo(
    () =>
      buildDoc(
        moduleId,
        sections,
        resolve,
        logoIndex,
        directiveAt,
        avatarIndex,
      ),
    [moduleId, sections, resolve, logoIndex, directiveAt, avatarIndex],
  );
}

/*
  ВЫБОР УЗЛА — связь превью и JSON.

  На эталонной странице разработчик тыкает в компонент и хочет увидеть, каким
  куском JSON он задан. Поэтому у каждого узла есть адрес — путь индексов
  («1.2.0»), одинаковый в обеих колонках. Контекст, а не проп: иначе адрес
  пришлось бы тащить через каждый компонент библиотеки.

  Контекста нет (страницы модулей) — обёртки не появляются вовсе, разметка
  превью остаётся чистой.
*/
type Pick = {
  selected: string | null;
  /*
    additive — клик с зажатым Shift (или Cmd/Ctrl): компонент ДОБАВЛЯЕТСЯ к
    выделению. Обычный клик выделяет только то, по чему кликнули, — иначе
    прежняя рамка остаётся висеть и кажется, что выделение сломалось.
  */
  onSelect: (path: string, additive: boolean) => void;
  /*
    Набор выбранных компонентов. Комментарий часто относится не к одному блоку,
    а к нескольким подряд («вот эти три карточки надо объединить»), поэтому
    выделение множественное. selected при этом остаётся — это ПОСЛЕДНИЙ
    выбранный, по нему колонка с источником прокручивается к нужному месту.
  */
  picked?: Set<string>;
};
const PickContext = React.createContext<Pick | null>(null);

export function ResultView({ doc, pick }: { doc: Doc; pick?: Pick }) {
  const body = (
    <div className="figma-scope mx-auto max-w-[var(--column-width)] px-6 pb-16">
      {doc.children.map((n, i) =>
        n.component === "Section Container" ? (
          <SectionContainer
            key={(n as SectionNode).anchor ?? `s-${i}`}
            id={(n as SectionNode).anchor}
          >
            {(n as SectionNode).children.map((c, j) => (
              <NodeView key={j} node={c} path={`${i}.${j}`} />
            ))}
          </SectionContainer>
        ) : (
          <NodeView key={i} node={n as Node} path={String(i)} />
        ),
      )}
    </div>
  );
  return pick ? (
    <PickContext.Provider value={pick}>{body}</PickContext.Provider>
  ) : (
    body
  );
}

/*
  Обёртка вокруг узла: адрес в data-атрибуте и клик, выбирающий САМЫЙ ГЛУБОКИЙ
  узел под курсором (внутренние гасят всплытие). display:contents — обёртка не
  создаёт своего блока, поэтому раскладка не меняется ни на пиксель.
*/
/*
  Содержимое ячейки таблицы. Перечисление внутри ячейки приходит одной строкой с
  маркерами «•»; раскладка расставляет переносы, а здесь каждый пункт становится
  отдельной строкой с висячим отступом — чтобы перенос длинного пункта не
  сбивался под маркер. Текст при этом не меняется: превью и выгрузка совпадают.
*/
/*
  СОДЕРЖИМОЕ ЯЧЕЙКИ. Ячейка с перечислением приходит узлами — рисуем их теми же
  компонентами, что и на странице: Text для вступительной фразы, Stack с List
  Item для списка. Собственные верхние отступы этих компонентов у первого узла
  гасим: внутри ячейки свой отступ уже задан самой ячейкой.

  Обёртки выбора (ds-pick) здесь нет намеренно: таблица выбирается целиком, как
  и раньше. Иначе у ячейки появился бы адрес, которого нет в колонке JSON.
*/
function cellNodes(nodes: Node[]): React.ReactNode {
  return nodes.map((n, i) => {
    const flush = i === 0 ? "pt-0" : undefined;
    if (n.component === "Stack")
      return (
        <Stack key={i} className={flush}>
          {n.children.map((c, j) =>
            c.component === "List Item" ? (
              <ListItem key={j} size={c.size} type={c.type}>
                {renderInline(c.text)}
              </ListItem>
            ) : null,
          )}
        </Stack>
      );
    if (n.component === "Text")
      return (
        <Text key={i} size={n.size} className={flush}>
          {renderInline(n.text)}
        </Text>
      );
    return null;
  });
}

/*
  ТЕКСТ КВИЗА. Вопрос и разбор приходят несколькими абзацами, внутри которых
  бывают перечисления. Рисуем их тем же разбором, что уходит и в выгрузку
  (textBlocks): абзацы отдельными блоками, строки с маркером — настоящим
  списком. Раньше пункты слипались в строку, а «•» оставался символом в тексте.
*/
function quizText(text?: string): React.ReactNode {
  if (!text) return text;
  const blocks = textBlocks(text);
  if (blocks.length <= 1 && blocks[0]?.kind !== "ul") return renderInline(text);
  return blocks.map((b, i) =>
    b.kind === "ul" ? (
      <ul key={i} className="ml-5 list-disc space-y-1">
        {b.lines.map((line, j) => (
          <li key={j}>{renderInline(line)}</li>
        ))}
      </ul>
    ) : (
      <p key={i} className={i ? "mt-[var(--space-s)]" : undefined}>
        {renderInline(b.lines[0])}
      </p>
    ),
  );
}

function cellContent(cell: TableCellValue): React.ReactNode {
  if (typeof cell !== "string") return cellNodes(cell.children);
  const lines = cell.split("\n");
  if (lines.length === 1) return renderInline(cell);
  return lines.map((line, i) => {
    const isItem = line.trimStart().startsWith("•");
    return (
      <span
        key={i}
        className={
          isItem
            ? "block pl-4 -indent-4"
            : // Строка без маркера посреди ячейки открывает новую группу
              // («Санузел:»): отбиваем её от предыдущего перечисления.
              `block${i > 0 ? " mt-[var(--space-s)]" : ""}`
        }
      >
        {renderInline(line)}
      </span>
    );
  });
}

function NodeView({ node, path }: { node: Node; path: string }) {
  const pick = React.useContext(PickContext);
  const inner = <NodeBody node={node} path={path} />;
  if (!pick) return inner;
  return (
    <div
      /*
        Рамка выбора — по НАБОРУ, если он есть: там, где выделение множественное,
        selected остаётся последним кликнутым, и без этого снятый блок оставался
        бы подсвеченным. Где набора нет (редактор модулей) — по selected.
      */
      className={`ds-pick contents${
        (pick.picked ? pick.picked.has(path) : pick.selected === path)
          ? " is-picked"
          : ""
      }`}
      data-json-path={path}
      onClick={(e) => {
        e.stopPropagation();
        pick.onSelect(path, e.shiftKey || e.metaKey || e.ctrlKey);
      }}
    >
      {inner}
    </div>
  );
}

function NodeBody({ node, path }: { node: Node; path: string }) {
  switch (node.component) {
    case "Heading":
      // id-якорь для H3–H5 (для оглавления/scrollspy); у H2 якорь уже на
      // Section Container — второй такой же id не заводим.
      return (
        <Heading
          level={node.level}
          id={node.level === "H2" ? undefined : node.anchor}
        >
          {renderInline(node.text)}
        </Heading>
      );

    case "Text":
      return <Text size={node.size}>{renderInline(node.text)}</Text>;

    case "Phrase": {
      // Слитая врезка может содержать несколько абзацев (разделены пустой
      // строкой) — переносим их через <br/>, не плодя вложенные <p>.
      const parts = node.text.split(/\n\n+/);
      return (
        <Phrase size={node.size}>
          {parts.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 ? (
                <>
                  <br />
                  <br />
                </>
              ) : null}
              {renderInline(p)}
            </React.Fragment>
          ))}
        </Phrase>
      );
    }

    case "Stack":
      return (
        <Stack as={node.ordered ? "ol" : "ul"}>
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} path={`${path}.${i}`} />
          ))}
        </Stack>
      );

    case "List Item": {
      // Пункт из двух строк («ссылка, дальше описание») — перенос значащий.
      const lines = node.text.split("\n");
      return (
        <ListItem
          size={node.size}
          type={node.type}
          iconNode={
            node.icon ? React.createElement(iconByName(node.icon)) : undefined
          }
        >
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <br /> : null}
              {renderInline(line)}
            </React.Fragment>
          ))}
        </ListItem>
      );
    }

    case "Block":
      return (
        <Block orientation={node.orientation}>
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} path={`${path}.${i}`} />
          ))}
        </Block>
      );

    case "Page Summary":
      return (
        <PageSummary>
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} path={`${path}.${i}`} />
          ))}
        </PageSummary>
      );

    // Проп в Figma зовётся orient, в данных — orientation (одно имя на
    // понятие, как у Block). Здесь переходник.
    case "General Card":
      return (
        <GeneralCard
          title={node.title}
          bgColor={node.bgColor as GeneralCardBg}
          orient={node.orientation}
          image={node.image as SmallImageName | undefined}
          iconNode={
            node.icon ? React.createElement(iconByName(node.icon)) : undefined
          }
        >
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} path={`${path}.${i}`} />
          ))}
        </GeneralCard>
      );

    case "Accordion":
      return (
        <Accordion
          question={renderInline(node.question)}
          defaultOpen={node.state === "Expanded"}
        >
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} path={`${path}.${i}`} />
          ))}
        </Accordion>
      );

    case "Quote":
      return (
        <Quote
          size={node.size}
          // Отдельного флага в данных больше нет: круглый знак Яндекса — это
          // просто значение logo. Переходник к пропам Figma-компонента.
          yandex={node.logo === "yandex"}
          org={node.org}
          logo={node.logo === "yandex" ? undefined : node.logo}
          author={node.author}
          // Должность приходит с markdown-ссылкой на сайт фонда (см. orgSites).
          role={node.role ? renderInline(node.role) : undefined}
          // Клиент отказался от фото у этой цитаты — значит, и серого кружка на
          // его месте быть не должно (см. noPhoto в contentTree).
          photo={!node.noPhoto}
          photoSrc={
            node.photo
              ? `${import.meta.env.BASE_URL}figma/avatars/${node.photo}.jpg`
              : undefined
          }
        >
          {/*
            Абзацы цитаты разбираем тем же механизмом, что и выгрузка: строки,
            начатые маркером, — настоящий список, а не абзац с символом внутри
            (см. paragraphsToTags). Иначе прототип и JSON разъедутся.
          */}
          {quizText(node.paragraphs.join("\n"))}
        </Quote>
      );

    case "Table": {
      /*
        ШИРОКАЯ ТАБЛИЦА ЕДЕТ ВБОК, А НЕ СЖИМАЕТСЯ.

        Замечание клиента 6 августа 2026 к таблице про справку и ИПРА:
        «визуально сложно выглядит». Причина была в ширине: четыре колонки
        прозы делили 652 пикселя колонки текста, каждая выходила по 155, и
        таблица вытягивалась на 1920 пикселей вниз — читать её приходилось не
        строками, а колодцами.

        Решение дизайнера: на боевом сайте такая таблица прокручивается вбок.
        Повторяем это здесь — каждой колонке даём не меньше 15rem, и если сумма
        не влезает в колонку текста, таблица получает СВОЮ полосу прокрутки.
        Страница при этом вбок не едет: прокручивается только обёртка.

        Порог — от трёх колонок. Таблицы из двух колонок делятся пополам
        (см. Table) и всегда влезают; давать им минимум значило бы включить
        прокрутку там, где она не нужна.
      */
      const columns = node.header.length || node.rows[0]?.length || 0;
      /*
        Длина серии одинаковых первых ячеек: у первой строки серии — сколько
        строк она накрывает, у продолжений — ноль (такую ячейку не рисуем).
        Пустой массив, когда объединения не просили, — тогда ветка ниже работает
        как раньше.
      */
      const merged: number[] = [];
      if (node.mergeFirstColumn)
        node.rows.forEach((r, i) => {
          const key = (x: TableCellValue) => (typeof x === "string" ? x.trim() : null);
          const here = key(r[0]);
          if (here !== null && i > 0 && key(node.rows[i - 1][0]) === here) {
            merged.push(0);
            return;
          }
          let n = 1;
          while (
            here !== null &&
            i + n < node.rows.length &&
            key(node.rows[i + n][0]) === here
          )
            n += 1;
          merged.push(n);
        });
      const table = (
        <Table
          caption={node.caption}
          className={columns >= 3 ? "min-w-[var(--table-min-width)]" : undefined}
          style={
            columns >= 3
              ? ({ "--table-min-width": `${columns * 15}rem` } as React.CSSProperties)
              : undefined
          }
        >
          {node.header.some(Boolean) && (
            <TableRow header>
              {node.header.map((c, i) => (
                <TableHeaderCell key={i}>{renderInline(c)}</TableHeaderCell>
              ))}
            </TableRow>
          )}
          {node.rows.map((r, ri) => (
            <TableRow key={ri}>
              {r.map((c, ci) => {
                /*
                  ОБЪЕДИНЁННАЯ ПЕРВАЯ КОЛОНКА. Ячейку рисуем один раз на всю
                  серию одинаковых подряд идущих значений, а у остальных строк
                  серии её не рисуем вовсе — так работает rowSpan.

                  Только первая колонка и только простые строковые ячейки:
                  ячейка с перечислением внутри — это узел с детьми, и сравнить
                  такие можно было бы разве что по виду, а не по смыслу.
                */
                const span = ci === 0 ? merged[ri] : undefined;
                if (span === 0) return null;
                return (
                  <TableCell key={ci} rowSpan={span && span > 1 ? span : undefined}>
                    {cellContent(c)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </Table>
      );
      return columns >= 3 ? <div className="overflow-x-auto">{table}</div> : table;
    }

    case "Image":
      return <Image src={node.src} alt={node.alt} />;

    case "Video":
      return <Video href={node.href} />;

    case "Person Item":
      return (
        <PersonItem
          // Как у цитаты: в данных имя файла, адрес собираем здесь.
          photo={
            node.photo
              ? `${import.meta.env.BASE_URL}figma/avatars/${node.photo}.jpg`
              : undefined
          }
          name={node.name}
          role={node.role}
        />
      );

    case "Prompt":
      return (
        <Prompt title={node.title} subtitle={node.subtitle}>
          {node.text}
        </Prompt>
      );

    case "Card Button":
      return (
        <CardButton>
          <Button type={node.type}>{node.text}</Button>
        </CardButton>
      );

    case "Compare":
      return (
        <Compare>
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} path={`${path}.${i}`} />
          ))}
        </Compare>
      );

    // Слой в Figma называется txt, в данных — title (как у всех остальных).
    case "Compare Card":
      return (
        <CompareCard tone={node.tone} txt={node.title}>
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} path={`${path}.${i}`} />
          ))}
        </CompareCard>
      );

    case "Quiz":
      return (
        <Quiz
          title={node.title}
          description={quizText(node.description)}
          question={quizText(node.question)}
          items={node.items}
          // Один ответ или несколько — решает раскладка, по числу верных вариантов.
          mode={node.mode}
          instant={node.instant}
          noVerdict={node.noVerdict}
          explanation={quizText(node.explanation)}
        />
      );

    case "Feedback":
      return <Feedback roles={node.roles} defaultRole={node.defaultRole} />;

    case "Read More":
      return (
        <ReadMore title={node.title}>
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} path={`${path}.${i}`} />
          ))}
        </ReadMore>
      );

    case "Read More Item":
      return (
        <ReadMoreItem
          title={node.title}
          description={node.description}
          /* В данных путь от корня; решётку прототипа приписываем при показе. */
          href={previewHref(node.href)}
        />
      );

    case "note":
      /*
        Пометки инструмента («просили 6, собралось 5», «дополнить авторство»,
        «убрано по директиве») на страницах больше не показываем — решение
        дизайнера: раскладка настроена, и предупреждения только мешают читать.
        В выгрузку разработчику они не шли и раньше (см. toExport).

        Сами проверки в сборке дерева остались: узел по-прежнему появляется,
        просто ничего не рисует. Значит вернуть показ — это одна строка здесь,
        а не восстановление всей логики.
      */
      return null;
  }
}
