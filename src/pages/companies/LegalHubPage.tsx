import { PageHero } from "@/components/PageHero";
import { ContentSection } from "@/components/ContentSection";
import { Card, CardGrid } from "@/components/Card";
import { Callout } from "@/components/Callout";
import { Paragraph } from "@/components/Prose";
import { SmartLink } from "@/components/SmartLink";

// 04 — Правила оформления (хаб раздела трека «Для компаний»). Контент дословно.
export function LegalHubPage() {
  return (
    <>
      <PageHero
        variant="section-hub"
        title="Правила оформления"
        lead="Справочник для HR, кадровика, бухгалтера, юриста. Заходите по конкретному вопросу — каждый раздел самодостаточный."
      />

      <Callout variant="info" title="Как пользоваться.">
        Все числа (МРОТ, лимиты компенсаций) помечены датой актуальности.
        Готовые формулировки для договора — копируемые, но требуют юр-проверки
        перед использованием в реальных документах. Ссылки на ключевые
        федеральные акты — в блоке «Нормативная база» ниже. ИИ-помощник под
        юр-вопрос — в разделе «Договор и оформление».
      </Callout>

      <ContentSection title="Разделы справочника">
        <CardGrid cols={2}>
          <Card
            link="internal"
            to="/companies/legal/contract"
            title="Договор и оформление"
            description="Трудовой договор, справка, группы I/II/III, ИПРА, шесть форм инвалидности. Готовая формулировка ТД. ИИ-помощник под юр-вопрос."
          />
          <Card
            link="internal"
            to="/companies/legal/benefits"
            title="Льготы и формы занятости"
            description="Сокращённая неделя, удлинённый отпуск, ночные смены, право отказа. Детальное сравнение ТД vs ГПХ vs самозанятость и нюанс «квоту закрывает только трудовой договор» — здесь."
          />
          <Card
            link="internal"
            to="/companies/legal/quotas"
            title="Квоты и господдержка"
            description="Размер квоты, три способа выполнить, отчётность и штрафы. Субсидии на оснащение и ЗП, налоговые льготы."
          />
          <Card
            link="internal"
            to="/companies/legal/status"
            title="Особые ситуации"
            description="Недееспособность, опекун и спец-счёт. Сохранение пособий при ТД. Основания увольнения."
          />
          <Card
            link="internal"
            to="/companies/legal/faq"
            title="Вопросы и ответы"
            description="Типовые вопросы: справка, ночные смены, увольнение, самозанятость, квоты и пенсия."
          />
        </CardGrid>
      </ContentSection>

      <ContentSection title="Нормативная база">
        <Paragraph>
          Ключевые федеральные акты со ссылками на первоисточник. Региональные
          акты дополняют федеральные — точные значения квот, размеры субсидий и
          дополнительные льготы устанавливает регион.
        </Paragraph>
        <CardGrid cols={2}>
          <Card
            link="external"
            to="https://www.consultant.ru/document/cons_doc_LAW_28399/"
            eyebrow="Документ"
            title="Конституция РФ"
            description="Равенство прав и запрет дискриминации по личным и социальным характеристикам."
          />
          <Card
            link="external"
            to="https://www.consultant.ru/document/cons_doc_LAW_34683/"
            eyebrow="Закон"
            title="Трудовой кодекс РФ"
            description="Льготы и права сотрудников с инвалидностью."
          />
          <Card
            link="external"
            to="https://www.consultant.ru/document/cons_doc_LAW_8559/"
            eyebrow="Закон"
            title="181-ФЗ «О социальной защите инвалидов в РФ»"
            description="Квотирование рабочих мест и создание специальных условий труда."
          />
          <Card
            link="external"
            to="https://www.consultant.ru/document/cons_doc_LAW_60/"
            eyebrow="Закон"
            title="565-ФЗ от 12.12.2023 «О занятости населения в РФ»"
            description="Нормы по трудоустройству людей с инвалидностью."
          />
          <Card
            link="external"
            to="https://www.consultant.ru/document/cons_doc_LAW_411620/"
            eyebrow="Документ"
            title="ПП № 366 от 14.03.2022"
            description="Как рассчитывать квоту для приёма на работу инвалидов и отчитываться о её выполнении."
          />
          <Card
            link="external"
            to="https://www.consultant.ru/document/cons_doc_LAW_413991/"
            eyebrow="Документ"
            title="ПП № 588 от 05.04.2022 (ред. 03.02.2025)"
            description="Единые правила и критерии медико-социальной экспертизы и установления инвалидности."
          />
          <Card
            link="external"
            to="http://publication.pravo.gov.ru/document/0001202502050022"
            eyebrow="Документ"
            title="Приказ Минтруда № 466н от 18.09.2024"
            description="Порядок разработки ИПРА: документа с рекомендациями работодателю по условиям труда сотрудника."
          />
        </CardGrid>
      </ContentSection>

      <Callout variant="info" title="Не нашли свой вопрос?">
        Напишите на{" "}
        <SmartLink to="mailto:inclusion@yandex-team.ru">
          inclusion@yandex-team.ru
        </SmartLink>{" "}
        — добавим в раздел или ответим лично.
      </Callout>
    </>
  );
}
