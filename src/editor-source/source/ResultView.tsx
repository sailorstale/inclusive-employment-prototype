import * as React from "react";
import {
  Accordion,
  CardContainer,
  SectionContainer,
  GeneralCard,
  Heading,
  Image,
  ListContainer,
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
import { useLogoIndex } from "./orgLogo";
import { buildDoc, type Doc, type Node, type SectionNode } from "./contentTree";
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
  return React.useMemo(
    () => buildDoc(moduleId, sections, resolve, logoIndex, directiveAt),
    [moduleId, sections, resolve, logoIndex, directiveAt],
  );
}

export function ResultView({ doc }: { doc: Doc }) {
  return (
    <div className="figma-scope mx-auto max-w-[var(--column-width)] px-6 pb-16">
      {doc.children.map((n, i) =>
        n.component === "Section Container" ? (
          <SectionContainer key={(n as SectionNode).anchor ?? `s-${i}`}>
            {(n as SectionNode).children.map((c, j) => (
              <NodeView key={j} node={c} />
            ))}
          </SectionContainer>
        ) : (
          <NodeView key={i} node={n as Node} />
        ),
      )}
    </div>
  );
}

function NodeView({ node }: { node: Node }) {
  switch (node.component) {
    case "Heading":
      return <Heading level={node.level}>{renderInline(node.text)}</Heading>;

    case "Text":
      return <Text size={node.size}>{renderInline(node.text)}</Text>;

    case "Phrase":
      return <Phrase size={node.size}>{renderInline(node.text)}</Phrase>;

    case "List Container":
      return (
        <ListContainer as={node.ordered ? "ol" : "ul"}>
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} />
          ))}
        </ListContainer>
      );

    case "List Item":
      return (
        <ListItem size={node.size} type={node.type}>
          {renderInline(node.text)}
        </ListItem>
      );

    case "Card Container":
      return (
        <CardContainer orientation={node.orientation}>
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} />
          ))}
        </CardContainer>
      );

    case "Page Summary":
      return (
        <PageSummary>
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} />
          ))}
        </PageSummary>
      );

    case "General Card":
      return (
        <GeneralCard
          title={node.title}
          bgColor={node.bgColor as GeneralCardBg}
          orient={node.orient}
          iconNode={node.icon ? React.createElement(iconByName(node.icon)) : undefined}
        >
          {node.children.map((c, i) => (
            <NodeView key={i} node={c} />
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
            <NodeView key={i} node={c} />
          ))}
        </Accordion>
      );

    case "Quote":
      return (
        <Quote
          size={node.size}
          yandex={Boolean(node.yandex)}
          org={node.org}
          logo={node.logo}
          author={node.author}
          role={node.role}
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
        <Table>
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
                <TableCell key={ci}>{renderInline(c)}</TableCell>
              ))}
            </TableRow>
          ))}
        </Table>
      );

    case "Image":
      return <Image src={node.src} alt={node.alt} />;

    case "Video":
      return <Video />;

    case "Prompt":
      return (
        <Prompt title={node.title} warning={node.warning}>
          {node.text}
        </Prompt>
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
