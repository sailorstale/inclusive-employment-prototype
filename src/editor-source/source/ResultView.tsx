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
  type GeneralCardBg,
} from "@/figma";
import { renderInline } from "@/editor-source/richText";
import { iconByName } from "./iconForText";
import { useLogoIndex, useAvatarIndex } from "./orgLogo";
import {
  buildDoc,
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
  onSelect: (path: string) => void;
  /** Пути компонентов с комментарием — для маркера (режим «Сайт»). */
  commented?: Set<string>;
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
      className={`ds-pick contents${pick.selected === path ? " is-picked" : ""}${
        pick.commented?.has(path) ? " has-comment" : ""
      }`}
      data-json-path={path}
      onClick={(e) => {
        e.stopPropagation();
        pick.onSelect(path);
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
          role={node.role}
          photoSrc={
            node.photo
              ? `${import.meta.env.BASE_URL}figma/avatars/${node.photo}.jpg`
              : undefined
          }
        >
          {node.paragraphs.map((p, i) => (
            <p key={i} className={i ? "mt-[var(--space-s)]" : undefined}>
              {renderInline(p)}
            </p>
          ))}
        </Quote>
      );

    case "Table":
      return (
        <Table caption={node.caption}>
          {node.header.some(Boolean) && (
            <TableRow header>
              {node.header.map((c, i) => (
                <TableHeaderCell key={i}>{renderInline(c)}</TableHeaderCell>
              ))}
            </TableRow>
          )}
          {node.rows.map((r, ri) => (
            <TableRow key={ri}>
              {r.map((c, ci) => (
                <TableCell key={ci}>{cellContent(c)}</TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      );

    case "Image":
      return <Image src={node.src} alt={node.alt} />;

    case "Video":
      return <Video href={node.href} />;

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
          description={node.description}
          question={node.question}
          items={node.items}
          explanation={node.explanation}
        />
      );

    case "Feedback":
      return <Feedback roles={node.roles} />;

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
          href={node.href}
        />
      );

    case "note":
      // Пометка инструмента для редактора: в превью видна, в выгрузку не идёт.
      return (
        <div className="ds-body-s py-2 text-[color:var(--text-secondary)]">
          ⚠ {node.text}
        </div>
      );
  }
}
