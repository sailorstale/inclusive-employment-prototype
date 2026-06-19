import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { TableOfContents } from "@/components/TableOfContents";
import { Callout } from "@/components/Callout";
import { DefinitionList } from "@/components/DefinitionList";
import { RelatedLinks } from "@/components/RelatedLinks";
import { abbreviations, terms } from "@/data/glossary";
import { scrollToId } from "@/lib/scroll";

// 30 — Глоссарий. Сквозная страница-справочник. Контент дословно.
export function GlossaryPage() {
  const location = useLocation();

  // Переход по клику на GlossaryTerm: прокрутка к статье термина.
  useEffect(() => {
    const anchor = (location.state as { anchor?: string } | null)?.anchor;
    if (anchor) {
      // даём списку отрендериться
      const t = setTimeout(() => scrollToId(anchor), 80);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  return (
    <>
      <PageHero
        title="Глоссарий"
        lead="Слова и аббревиатуры из материалов сайта, которые могут быть непонятны без HR- и юридического бэкграунда."
      />

      <TableOfContents
        items={[
          { label: "Аббревиатуры и сокращения", anchor: "#glossary-abbr" },
          { label: "Термины и понятия", anchor: "#glossary-terms" },
        ]}
      />

      <Callout variant="info" title="О терминологии.">
        Гайд придерживается правила «сначала человек, потом особенность»:
        корректно — «человек с инвалидностью», а не «инвалид». Слово «инвалид» —
        юридический термин из законов. В определениях ниже мы следуем этому же
        правилу.
      </Callout>

      <ContentSection anchor="glossary-abbr" title="Аббревиатуры и сокращения">
        <DefinitionList entries={abbreviations} />
      </ContentSection>

      <ContentSection anchor="glossary-terms" title="Термины и понятия">
        <DefinitionList entries={terms} />
      </ContentSection>

      <RelatedLinks
        items={[
          {
            title: "Договор и оформление",
            to: "/companies/legal/contract",
            description: "Как правильно оформить сотрудника с инвалидностью.",
          },
          {
            title: "Команда и коммуникация",
            to: "/companies/team",
            description: "Как подготовить коллектив и наладить общение.",
          },
          {
            title: "Вопросы и ответы",
            to: "/companies/legal/faq",
            description: "Короткие ответы на частые юридические вопросы.",
          },
        ]}
      />
    </>
  );
}
