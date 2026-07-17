// AUTO-GENERATED через tools/source-export/parse.mjs — НЕ редактировать вручную.
// Источник: Источники истины/_verbatim-export/Модуль N.md (дословная выгрузка).
// Правки текста — в Google-доке → npm run export → npm run parse.

export type SourceHeading = {
  kind: "heading";
  level: 2 | 3 | 4;
  /** Разметка (для рендера через renderInline). */
  md: string;
  /** Чистый текст (для сопоставления вариантов). */
  text: string;
  anchor: string;
};
export type SourceParagraph = { kind: "paragraph"; md: string; text: string; hl?: string };
export type SourceListItem = { md: string; text: string };
export type SourceListBlock = { kind: "list"; ordered: boolean; items: SourceListItem[] };
export type SourceQuote = { kind: "quote"; md: string; text: string; hl?: string };
export type SourceTable = { kind: "table"; header: string[]; rows: string[][] };
export type SourceImage = { kind: "image"; src: string; alt?: string };
export type SourceBlock = SourceHeading | SourceParagraph | SourceListBlock | SourceQuote | SourceTable | SourceImage;
export type SourceTocItem = { anchor: string; title: string; level: 2 | 3 };
export type SourceModuleMeta = {
  id: string;
  num: number;
  file: string;
  /** Google-Doc id клиентского источника (для iframe в инструменте). */
  docId: string;
  title: string;
  toc: SourceTocItem[];
};

/** Мета всех модулей (для навигации/оглавления) — без тяжёлых блоков. */
export const sourceModulesMeta: SourceModuleMeta[] = [
  {
    "id": "m1",
    "num": 1,
    "file": "Модуль 1.md",
    "docId": "1zGSz7A-hUEsSlxl1x-jnEcqrWhp1Csi_yfuYqVYAdSw",
    "title": "Инклюзивное трудоустройство: взгляд без предубеждений",
    "toc": [
      {
        "anchor": "inklyuzivnoe-trudoustroystvo-prakticheskiy-gid-d",
        "title": "Инклюзивное трудоустройство: практический гид для работодателей и НКО",
        "level": 2
      },
      {
        "anchor": "vvedenie",
        "title": "Введение",
        "level": 2
      },
      {
        "anchor": "o-gide",
        "title": "О гиде",
        "level": 2
      },
      {
        "anchor": "komu-budet-polezno",
        "title": "Кому будет полезно",
        "level": 3
      },
      {
        "anchor": "kak-ustroen-gid",
        "title": "Как устроен гид",
        "level": 2
      },
      {
        "anchor": "modul-1-inklyuzivnoe-trudoustroystvo-vzglyad-bez",
        "title": "Модуль 1. Инклюзивное трудоустройство: взгляд без предубеждений",
        "level": 2
      },
      {
        "anchor": "chto-takoe-invalidnost-medicinskiy-i-socialnyy-p",
        "title": "Что такое инвалидность: медицинский и социальный подходы",
        "level": 2
      },
      {
        "anchor": "kto-takie-soiskateli-s-invalidnostyu",
        "title": "Кто такие соискатели с инвалидностью",
        "level": 2
      },
      {
        "anchor": "osobennosti-raznyh-form-invalidnosti",
        "title": "Особенности разных форм инвалидности",
        "level": 2
      },
      {
        "anchor": "gluhie-i-slaboslyshaschie-lyudi",
        "title": "Глухие и слабослышащие люди",
        "level": 3
      },
      {
        "anchor": "lyudi-s-osobennostyami-oporno-dvigatelnogo-appar",
        "title": "Люди с особенностями опорно-двигательного аппарата",
        "level": 3
      },
      {
        "anchor": "nezryachie-i-slabovidyaschie-lyudi",
        "title": "Незрячие и слабовидящие люди",
        "level": 3
      },
      {
        "anchor": "lyudi-s-mentalnoy-invalidnostyu",
        "title": "Люди с ментальной инвалидностью",
        "level": 3
      },
      {
        "anchor": "lyudi-s-osobennostyami-rechi",
        "title": "Люди с особенностями речи",
        "level": 3
      },
      {
        "anchor": "lyudi-s-obschimi-zabolevaniyami",
        "title": "Люди с общими заболеваниями",
        "level": 3
      },
      {
        "anchor": "vrozhdennaya-i-priobretennaya-invalidnost-pochem",
        "title": "Врождённая и приобретённая инвалидность: почему это важно учитывать",
        "level": 2
      },
      {
        "anchor": "komu-nuzhna-pomosch-v-poiske-raboty",
        "title": "Кому нужна помощь в поиске работы",
        "level": 2
      },
      {
        "anchor": "kogda-invalidnost-ne-vidna",
        "title": "Когда инвалидность не видна",
        "level": 3
      },
      {
        "anchor": "kogda-trebuyutsya-specialnye-usloviya-truda",
        "title": "Когда требуются специальные условия труда",
        "level": 3
      },
      {
        "anchor": "samostoyatelnyy-poisk-ili-soprovozhdaemoe-trudou",
        "title": "Самостоятельный поиск или сопровождаемое трудоустройство",
        "level": 3
      },
      {
        "anchor": "mify-ob-inklyuzivnom-trudoustroystve",
        "title": "Мифы об инклюзивном трудоустройстве",
        "level": 2
      },
      {
        "anchor": "sotrudniki-s-invalidnostyu-berut-bolshe-otpuskov",
        "title": "Сотрудники с инвалидностью берут больше отпусков за свой счёт, чем их коллеги без инвалидности",
        "level": 3
      },
      {
        "anchor": "vsem-lyudyam-s-invalidnostyu-nuzhny-specialnye-p",
        "title": "Всем людям с инвалидностью нужны специальные приспособления или особые условия труда",
        "level": 3
      },
      {
        "anchor": "sotrudnika-s-invalidnostyu-nevozmozhno-ili-ochen",
        "title": "Сотрудника с инвалидностью невозможно или очень сложно уволить, даже если он плохо работает",
        "level": 3
      },
      {
        "anchor": "sotrudniki-s-invalidnostyu-mogut-rabotat-sverhur",
        "title": "Сотрудники с инвалидностью могут работать сверхурочно",
        "level": 3
      },
      {
        "anchor": "u-sotrudnika-s-invalidnostyu-ukorochennyy-raboch",
        "title": "У сотрудника с инвалидностью укороченный рабочий день",
        "level": 3
      },
      {
        "anchor": "sotrudniki-s-invalidnostyu-spravlyayutsya-so-svo",
        "title": "Сотрудники с инвалидностью справляются со своими обязанностями хуже других, поэтому им можно платить меньше",
        "level": 3
      },
      {
        "anchor": "kollektiv-chasto-negativno-otnositsya-k-lyudyam-",
        "title": "Коллектив часто негативно относится к людям с инвалидностью и не принимает их",
        "level": 3
      },
      {
        "anchor": "s-lyudmi-s-invalidnostyu-stoit-obraschatsya-na-r",
        "title": "С людьми с инвалидностью стоит обращаться на равных, как и с любым другим сотрудником",
        "level": 3
      },
      {
        "anchor": "sotrudniku-s-invalidnostyu-slozhno-adaptirovatsy",
        "title": "Сотруднику с инвалидностью сложно адаптироваться в команде и наладить контакт с коллегами",
        "level": 3
      },
      {
        "anchor": "chto-govoryat-lyudi-s-invalidnostyu-i-nko",
        "title": "Что говорят люди с инвалидностью и НКО",
        "level": 2
      },
      {
        "anchor": "zachem-vnedryat-inklyuzivnoe-trudoustroystvo",
        "title": "Зачем внедрять инклюзивное трудоустройство",
        "level": 2
      },
      {
        "anchor": "povysit-privlekatelnost-kompanii-kak-rabotodatel",
        "title": "Повысить привлекательность компании как работодателя",
        "level": 3
      },
      {
        "anchor": "ispolzovat-mery-gosudarstvennoy-podderzhki",
        "title": "Использовать меры государственной поддержки",
        "level": 3
      },
      {
        "anchor": "sozdavat-bolee-raznoobraznye-komandy",
        "title": "Создавать более разнообразные команды",
        "level": 3
      },
      {
        "anchor": "rasshirit-krug-potencialnyh-kandidatov",
        "title": "Расширить круг потенциальных кандидатов",
        "level": 3
      },
      {
        "anchor": "povysit-loyalnost-deystvuyuschih-sotrudnikov",
        "title": "Повысить лояльность действующих сотрудников",
        "level": 3
      },
      {
        "anchor": "realizovat-lichnye-i-korporativnye-cennosti",
        "title": "Реализовать личные и корпоративные ценности",
        "level": 3
      },
      {
        "anchor": "chto-govoryat-biznes-i-nko",
        "title": "Что говорят бизнес и НКО",
        "level": 2
      },
      {
        "anchor": "kak-vystroit-ustoychivye-processy",
        "title": "Как выстроить устойчивые процессы",
        "level": 2
      },
      {
        "anchor": "pravovoe-soprovozhdenie",
        "title": "Правовое сопровождение",
        "level": 3
      },
      {
        "anchor": "finansovoe-planirovanie",
        "title": "Финансовое планирование",
        "level": 3
      },
      {
        "anchor": "organizaciya-rabochih-processov",
        "title": "Организация рабочих процессов",
        "level": 3
      },
      {
        "anchor": "kommunikaciya-v-komande",
        "title": "Коммуникация в команде",
        "level": 3
      },
      {
        "anchor": "podbor-i-ocenka-kandidatov",
        "title": "Подбор и оценка кандидатов",
        "level": 3
      },
      {
        "anchor": "korporativnaya-kultura-i-reputaciya",
        "title": "Корпоративная культура и репутация",
        "level": 3
      },
      {
        "anchor": "itogovye-rekomendacii",
        "title": "Итоговые рекомендации",
        "level": 3
      },
      {
        "anchor": "chem-trudoustroystvo-lyudey-s-invalidnostyu-otli",
        "title": "Чем трудоустройство людей с инвалидностью отличается от стандартного найма",
        "level": 2
      },
      {
        "anchor": "kachestvo-vazhnee-skorosti",
        "title": "Качество важнее скорости",
        "level": 3
      },
      {
        "anchor": "adaptaciya-imeet-svoy-ritm",
        "title": "Адаптация имеет свой ритм",
        "level": 3
      },
      {
        "anchor": "professionalizm-vmesto-vechnoy-loyalnosti",
        "title": "Профессионализм вместо «вечной лояльности»",
        "level": 3
      },
      {
        "anchor": "rabota-s-korporativnoy-kulturoy",
        "title": "Работа с корпоративной культурой",
        "level": 3
      },
      {
        "anchor": "realistichnyy-vzglyad-na-process",
        "title": "Реалистичный взгляд на процесс",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "ostalis-voprosy-ili-pozhelaniya",
        "title": "Остались вопросы или пожелания?",
        "level": 3
      }
    ]
  },
  {
    "id": "m2",
    "num": 2,
    "file": "Модуль 2.md",
    "docId": "1h40j97GIfCyVx_GbNQaSbv_3UjCOtiiL_BM4RLpECaE",
    "title": "Документы, льготы и квоты: правовые основы трудоустройства",
    "toc": [
      {
        "anchor": "modul-2-dokumenty-lgoty-i-kvoty-pravovye-osnovy-",
        "title": "Модуль 2. Документы, льготы и квоты: правовые основы трудоустройства",
        "level": 2
      },
      {
        "anchor": "kak-oformit-sotrudnika-s-invalidnostyu-po-trudov",
        "title": "Как оформить сотрудника с инвалидностью по трудовому договору",
        "level": 2
      },
      {
        "anchor": "spravka-ob-invalidnosti",
        "title": "Справка об инвалидности",
        "level": 2
      },
      {
        "anchor": "individualnaya-programma-reabilitacii-i-abilitac",
        "title": "Индивидуальная программа реабилитации и абилитации (ИПРА)",
        "level": 2
      },
      {
        "anchor": "usloviya-truda",
        "title": "Условия труда",
        "level": 3
      },
      {
        "anchor": "oborudovanie-rabochego-mesta",
        "title": "Оборудование рабочего места",
        "level": 3
      },
      {
        "anchor": "dostupnye-vidy-truda",
        "title": "Доступные виды труда",
        "level": 3
      },
      {
        "anchor": "ogranicheniya-po-vidam-rabot",
        "title": "Ограничения по видам работ",
        "level": 3
      },
      {
        "anchor": "osobennosti-grafika",
        "title": "Особенности графика",
        "level": 3
      },
      {
        "anchor": "vazhnye-nyuansy",
        "title": "Важные нюансы",
        "level": 3
      },
      {
        "anchor": "primer-1-trudoustroystvo-kontent-menedzhera-s-na",
        "title": "Пример 1. Трудоустройство контент-менеджера с нарушением зрения",
        "level": 3
      },
      {
        "anchor": "primer-2-trudoustroystvo-sistemnogo-administrato",
        "title": "Пример 2. Трудоустройство системного администратора с нарушением слуха",
        "level": 3
      },
      {
        "anchor": "primer-3-trudoustroystvo-buhgaltera-s-hronichesk",
        "title": "Пример 3. Трудоустройство бухгалтера с хроническим заболеванием почек",
        "level": 3
      },
      {
        "anchor": "primer-4-trudoustroystvo-specialista-po-dokument",
        "title": "Пример 4. Трудоустройство специалиста по документообороту с эпилепсией",
        "level": 3
      },
      {
        "anchor": "kak-propisat-usloviya-truda-v-trudovom-dogovore",
        "title": "Как прописать условия труда в трудовом договоре",
        "level": 2
      },
      {
        "anchor": "1-osobennosti-oporno-dvigatelnogo-apparata",
        "title": "1. Особенности опорно-двигательного аппарата",
        "level": 3
      },
      {
        "anchor": "2-slepota",
        "title": "2. Слепота",
        "level": 3
      },
      {
        "anchor": "4-gluhota",
        "title": "4. Глухота",
        "level": 3
      },
      {
        "anchor": "5-snizhenie-sluha",
        "title": "5. Снижение слуха",
        "level": 3
      },
      {
        "anchor": "6-hronicheskie-sostoyaniya",
        "title": "6. Хронические состояния",
        "level": 3
      },
      {
        "anchor": "kakie-lgoty-polozheny-sotrudnikam-s-invalidnosty",
        "title": "Какие льготы положены сотрудникам с инвалидностью",
        "level": 2
      },
      {
        "anchor": "sokraschennaya-rabochaya-nedelya",
        "title": "Сокращённая рабочая неделя",
        "level": 3
      },
      {
        "anchor": "udlinennyy-ezhegodnyy-otpusk",
        "title": "Удлинённый ежегодный отпуск",
        "level": 3
      },
      {
        "anchor": "otpusk-bez-sohraneniya-zarabotnoy-platy",
        "title": "Отпуск без сохранения заработной платы",
        "level": 3
      },
      {
        "anchor": "ogranicheniya-na-otdelnye-vidy-rabot",
        "title": "Ограничения на отдельные виды работ",
        "level": 3
      },
      {
        "anchor": "pravo-otkazatsya-ot-raboty-v-nochnoe-vremya",
        "title": "Право отказаться от работы в ночное время",
        "level": 3
      },
      {
        "anchor": "kogda-mozhet-izmenitsya-zarabotnaya-plata",
        "title": "Когда может измениться заработная плата",
        "level": 3
      },
      {
        "anchor": "mozhet-li-rabotat-chelovek-so-statusom-nedeespos",
        "title": "Может ли работать человек со статусом недееспособности",
        "level": 2
      },
      {
        "anchor": "kto-mozhet-byt-opekunom",
        "title": "Кто может быть опекуном",
        "level": 3
      },
      {
        "anchor": "kakie-dokumenty-potrebuyutsya",
        "title": "Какие документы потребуются",
        "level": 3
      },
      {
        "anchor": "chto-vazhno-uchityvat",
        "title": "Что важно учитывать",
        "level": 3
      },
      {
        "anchor": "zarabotnaya-plata",
        "title": "Заработная плата",
        "level": 3
      },
      {
        "anchor": "otchetnost-opekuna",
        "title": "Отчётность опекуна",
        "level": 3
      },
      {
        "anchor": "materialnaya-otvetstvennost",
        "title": "Материальная ответственность",
        "level": 3
      },
      {
        "anchor": "sohranyatsya-li-posobiya-i-lgoty-pri-trudoustroy",
        "title": "Сохранятся ли пособия и льготы при трудоустройстве по трудовому договору",
        "level": 2
      },
      {
        "anchor": "chto-sohranyaetsya",
        "title": "Что сохраняется",
        "level": 3
      },
      {
        "anchor": "chto-mozhet-izmenitsya-pri-trudoustroystve",
        "title": "Что может измениться при трудоустройстве",
        "level": 3
      },
      {
        "anchor": "primer",
        "title": "Пример",
        "level": 3
      },
      {
        "anchor": "mozhno-li-uvolit-sotrudnika-s-invalidnostyu",
        "title": "Можно ли уволить сотрудника с инвалидностью",
        "level": 2
      },
      {
        "anchor": "po-sobstvennomu-zhelaniyu",
        "title": "По собственному желанию",
        "level": 3
      },
      {
        "anchor": "po-iniciative-rabotodatelya",
        "title": "По инициативе работодателя",
        "level": 3
      },
      {
        "anchor": "po-soglasheniyu-storon",
        "title": "По соглашению сторон",
        "level": 3
      },
      {
        "anchor": "po-medicinskim-pokazaniyam",
        "title": "По медицинским показаниям",
        "level": 3
      },
      {
        "anchor": "v-svyazi-s-istecheniem-sroka-srochnogo-trudovogo",
        "title": "В связи с истечением срока срочного трудового договора",
        "level": 3
      },
      {
        "anchor": "chto-takoe-kvoty-i-kak-ih-vypolnit",
        "title": "Что такое квоты и как их выполнить",
        "level": 2
      },
      {
        "anchor": "kak-opredelyaetsya-razmer-kvoty",
        "title": "Как определяется размер квоты",
        "level": 3
      },
      {
        "anchor": "primer-2",
        "title": "Пример",
        "level": 3
      },
      {
        "anchor": "vazhno",
        "title": "Важно",
        "level": 3
      },
      {
        "anchor": "kak-vypolnit-kvotu",
        "title": "Как выполнить квоту",
        "level": 2
      },
      {
        "anchor": "trudoustroit-novogo-sotrudnika",
        "title": "Трудоустроить нового сотрудника",
        "level": 3
      },
      {
        "anchor": "uchest-uzhe-rabotayuschih-sotrudnikov-s-invalidn",
        "title": "Учесть уже работающих сотрудников с инвалидностью",
        "level": 3
      },
      {
        "anchor": "ispolzovat-alternativnoe-kvotirovanie",
        "title": "Использовать альтернативное квотирование",
        "level": 3
      },
      {
        "anchor": "primer-3",
        "title": "Пример",
        "level": 3
      },
      {
        "anchor": "kak-i-kuda-podavat-otchetnost",
        "title": "Как и куда подавать отчётность",
        "level": 2
      },
      {
        "anchor": "chto-proishodit-esli-kvota-ne-vypolnena",
        "title": "Что происходит, если квота не выполнена",
        "level": 2
      },
      {
        "anchor": "rabotodatel-predprinyal-neobhodimye-mery",
        "title": "Работодатель предпринял необходимые меры",
        "level": 3
      },
      {
        "anchor": "rabotodatel-ne-predprinimal-nikakih-deystviy",
        "title": "Работодатель не предпринимал никаких действий",
        "level": 3
      },
      {
        "anchor": "na-kakie-subsidii-i-mery-gospodderzhki-mogut-ras",
        "title": "На какие субсидии и меры господдержки могут рассчитывать работодатели",
        "level": 2
      },
      {
        "anchor": "davayte-rassmotrim-osnovnye-mery-podderzhki",
        "title": "Давайте рассмотрим основные меры поддержки",
        "level": 3
      },
      {
        "anchor": "kompensaciya-rashodov-na-osnaschenie-rabochego-m",
        "title": "Компенсация расходов на оснащение рабочего места",
        "level": 2
      },
      {
        "anchor": "kompensaciya-zatrat-na-zarabotnuyu-platu",
        "title": "Компенсация затрат на заработную плату",
        "level": 2
      },
      {
        "anchor": "subsidii-dlya-socialnogo-predprinimatelstva",
        "title": "Субсидии для социального предпринимательства",
        "level": 2
      },
      {
        "anchor": "nalogovye-lgoty",
        "title": "Налоговые льготы",
        "level": 2
      },
      {
        "anchor": "podvedem-itog",
        "title": "Подведём итог",
        "level": 3
      },
      {
        "anchor": "dopolnitelnye-formaty-zanyatosti",
        "title": "Дополнительные форматы занятости",
        "level": 2
      },
      {
        "anchor": "ekonomicheskiy-faktor",
        "title": "Экономический фактор",
        "level": 3
      },
      {
        "anchor": "sostoyanie-zdorovya",
        "title": "Состояние здоровья",
        "level": 3
      },
      {
        "anchor": "specifika-professii",
        "title": "Специфика профессии",
        "level": 3
      },
      {
        "anchor": "vazhno-2",
        "title": "Важно",
        "level": 3
      },
      {
        "anchor": "dogovor-grazhdansko-pravovogo-haraktera-gph",
        "title": "Договор гражданско-правового характера (ГПХ)",
        "level": 2
      },
      {
        "anchor": "samozanyatost",
        "title": "Самозанятость",
        "level": 2
      },
      {
        "anchor": "kto-mozhet-stat-samozanyatym",
        "title": "Кто может стать самозанятым",
        "level": 3
      },
      {
        "anchor": "kto-ne-mozhet-primenyat-etot-rezhim",
        "title": "Кто не может применять этот режим",
        "level": 3
      },
      {
        "anchor": "kak-oformit-samozanyatost",
        "title": "Как оформить самозанятость",
        "level": 3
      },
      {
        "anchor": "kak-platit-nalogi",
        "title": "Как платить налоги",
        "level": 3
      },
      {
        "anchor": "chto-budet-esli-narushit-pravila",
        "title": "Что будет, если нарушить правила",
        "level": 3
      },
      {
        "anchor": "socialnye-garantii-i-pensiya",
        "title": "Социальные гарантии и пенсия",
        "level": 3
      },
      {
        "anchor": "sohranyayutsya-li-lgoty-i-posobiya",
        "title": "Сохраняются ли льготы и пособия",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "trudovoy-dogovor-kogda-eto-horoshiy-variant",
        "title": "Трудовой договор: когда это хороший вариант",
        "level": 3
      },
      {
        "anchor": "gph-i-samozanyatost-osnovnye-preimuschestva",
        "title": "ГПХ и самозанятость: основные преимущества",
        "level": 3
      },
      {
        "anchor": "kak-vybrat-podhodyaschiy-format",
        "title": "Как выбрать подходящий формат",
        "level": 3
      },
      {
        "anchor": "poleznye-dokumenty",
        "title": "Полезные документы",
        "level": 2
      },
      {
        "anchor": "konstituciya-rossiyskoy-federacii",
        "title": "Конституция Российской Федерации",
        "level": 3
      },
      {
        "anchor": "trudovoy-kodeks-rossiyskoy-federacii",
        "title": "Трудовой кодекс Российской Федерации",
        "level": 3
      },
      {
        "anchor": "federalnyy-zakon-181-fz-o-socialnoy-zaschite-inv",
        "title": "Федеральный закон № 181-ФЗ «О социальной защите инвалидов в Российской Федерации»",
        "level": 3
      },
      {
        "anchor": "federalnyy-zakon-ot-12122023-565-fz-o-zanyatosti",
        "title": "Федеральный закон от 12.12.2023 № 565-ФЗ «О занятости населения в Российской Федерации»",
        "level": 3
      },
      {
        "anchor": "postanovlenie-pravitelstva-rf-ot-14032022-366-ob",
        "title": "Постановление Правительства РФ от 14.03.2022 № 366 «Об утверждении Правил выполнения работодателем квоты для приёма на работу инвалидов при оформлении трудовых отношений с инвалидом на любое рабочее место»",
        "level": 3
      },
      {
        "anchor": "postanovlenie-pravitelstva-rf-ot-05042022-588-o-",
        "title": "Постановление Правительства РФ от 05.04.2022 № 588 «О признании лица инвалидом»",
        "level": 3
      },
      {
        "anchor": "prikaz-mintruda-rossii-ot-18092024-466n-ob-utver",
        "title": "Приказ Минтруда России от 18.09.2024 № 466н «Об утверждении порядка разработки и реализации индивидуальной программы реабилитации и абилитации»",
        "level": 3
      },
      {
        "anchor": "proverte-sebya",
        "title": "Проверьте себя",
        "level": 2
      },
      {
        "anchor": "kakaya-forma-zanyatosti-pozvolyaet-vypolnit-kvot",
        "title": "Какая форма занятости позволяет выполнить квоту по трудоустройству людей с инвалидностью?",
        "level": 3
      },
      {
        "anchor": "chto-iz-perechislennogo-mozhet-byt-ukazano-v-ipr",
        "title": "Что из перечисленного может быть указано в ИПРА?",
        "level": 3
      },
      {
        "anchor": "kakie-utverzhdeniya-verny",
        "title": "Какие утверждения верны?",
        "level": 3
      },
      {
        "anchor": "kakie-lgoty-polozheny-sotrudniku-s-invalidnostyu",
        "title": "Какие льготы положены сотруднику с инвалидностью I или II группы, работающему по трудовому договору?",
        "level": 3
      },
      {
        "anchor": "predpolozhim-chto-chelovek-s-invalidnostyu-ii-gr",
        "title": "Предположим, что человек с инвалидностью II группы, состоящий на учёте в службе занятости населения, планирует зарегистрироваться как самозанятый. Что ему нужно сделать?",
        "level": 3
      },
      {
        "anchor": "kakoy-iz-perechislennyh-vidov-deyatelnosti-zapre",
        "title": "Какой из перечисленных видов деятельности запрещён для самозанятых?",
        "level": 3
      },
      {
        "anchor": "voprosy-i-otvety",
        "title": "Вопросы и ответы",
        "level": 2
      },
      {
        "anchor": "1-mozhet-li-sotrudnik-ne-soobschat-rabotodatelyu",
        "title": "1. Может ли сотрудник не сообщать работодателю о своей инвалидности?",
        "level": 3
      },
      {
        "anchor": "2-obyazan-li-rabotodatel-zaprashivat-u-soiskatel",
        "title": "2. Обязан ли работодатель запрашивать у соискателя справку об инвалидности и ИПРА?",
        "level": 3
      },
      {
        "anchor": "3-sotrudnik-s-invalidnostyu-i-gruppy-dal-pismenn",
        "title": "3. Сотрудник с инвалидностью I группы дал письменное согласие на работу в ночное время. Может ли работодатель привлечь его к такой работе?",
        "level": 3
      },
      {
        "anchor": "4-kakie-lgoty-polozheny-sotrudniku-s-invalidnost",
        "title": "4. Какие льготы положены сотруднику с инвалидностью?",
        "level": 3
      },
      {
        "anchor": "5-mozhet-li-sotrudnik-s-invalidnostyu-iii-gruppy",
        "title": "5. Может ли сотрудник с инвалидностью III группы работать по стандартной 40-часовой неделе?",
        "level": 3
      },
      {
        "anchor": "6-kak-rabotodatel-mozhet-vypolnit-kvotu-po-trudo",
        "title": "6. Как работодатель может выполнить квоту по трудоустройству людей с инвалидностью?",
        "level": 3
      },
      {
        "anchor": "pryamoe-trudoustroystvo",
        "title": "Прямое трудоустройство",
        "level": 3
      },
      {
        "anchor": "alternativnoe-kvotirovanie",
        "title": "Альтернативное квотирование",
        "level": 3
      },
      {
        "anchor": "7-sohranyayutsya-li-pensiya-po-invalidnosti-i-lg",
        "title": "7. Сохраняются ли пенсия по инвалидности и льготы при трудоустройстве по трудовому договору?",
        "level": 3
      },
      {
        "anchor": "8-mozhno-li-uvolit-sotrudnika-s-invalidnostyu-es",
        "title": "8. Можно ли уволить сотрудника с инвалидностью, если он не справляется со своими обязанностями?",
        "level": 3
      },
      {
        "anchor": "9-mozhet-li-chelovek-priznannyy-sudom-nedeesposo",
        "title": "9. Может ли человек, признанный судом недееспособным, официально работать?",
        "level": 3
      },
      {
        "anchor": "10-chem-dogovor-gph-otlichaetsya-ot-trudovogo-do",
        "title": "10. Чем договор ГПХ отличается от трудового договора для человека с инвалидностью?",
        "level": 3
      },
      {
        "anchor": "11-kak-zaregistrirovatsya-v-kachestve-samozanyat",
        "title": "11. Как зарегистрироваться в качестве самозанятого?",
        "level": 3
      },
      {
        "anchor": "12-sohranyayutsya-li-pensiya-po-invalidnosti-i-l",
        "title": "12. Сохраняются ли пенсия по инвалидности и льготы при самозанятости?",
        "level": 3
      },
      {
        "anchor": "13-chto-proizoydet-esli-chelovek-poluchaet-posob",
        "title": "13. Что произойдёт, если человек получает пособие по безработице и оформляет самозанятость?",
        "level": 3
      },
      {
        "anchor": "14-mozhno-li-sovmeschat-samozanyatost-s-rabotoy-",
        "title": "14. Можно ли совмещать самозанятость с работой по трудовому договору?",
        "level": 3
      }
    ]
  },
  {
    "id": "m3",
    "num": 3,
    "file": "Модуль 3.md",
    "docId": "1Jm3egCKSzafx_eOZ8XtwJxttXIqq3HCk8YWyFKQi83w",
    "title": "",
    "toc": [
      {
        "anchor": "chto-govoryat-kompanii-i-nko",
        "title": "Что говорят компании и НКО",
        "level": 2
      },
      {
        "anchor": "kak-govorit-o-lyudyah-s-invalidnostyu",
        "title": "Как говорить о людях с инвалидностью",
        "level": 2
      },
      {
        "anchor": "kakie-obschie-formulirovki-dopustimy",
        "title": "Какие общие формулировки допустимы",
        "level": 3
      },
      {
        "anchor": "chego-izbegat",
        "title": "Чего избегать",
        "level": 3
      },
      {
        "anchor": "vyberite-kakie-slova-i-formulirovki-dopustimo-is",
        "title": "Выберите, какие слова и формулировки допустимо использовать в отношении людей с разными особенностями здоровья",
        "level": 2
      },
      {
        "anchor": "zrenie",
        "title": "Зрение",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "sluh",
        "title": "Слух",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-2",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "rech",
        "title": "Речь",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-3",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "peredvizhenie",
        "title": "Передвижение",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-4",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "mentalnaya-invalidnost",
        "title": "Ментальная инвалидность",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-5",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "kak-obschatsya-s-lyudmi-s-invalidnostyu",
        "title": "Как общаться с людьми с инвалидностью",
        "level": 2
      },
      {
        "anchor": "obraschaytes-napryamuyu-k-cheloveku",
        "title": "Обращайтесь напрямую к человеку",
        "level": 3
      },
      {
        "anchor": "budte-terpelivy",
        "title": "Будьте терпеливы",
        "level": 3
      },
      {
        "anchor": "sohranyayte-ravenstvo-v-obschenii",
        "title": "Сохраняйте равенство в общении",
        "level": 3
      },
      {
        "anchor": "uvazhayte-lichnoe-prostranstvo",
        "title": "Уважайте личное пространство",
        "level": 3
      },
      {
        "anchor": "ne-zadavayte-lichnyh-voprosov-o-zdorove",
        "title": "Не задавайте личных вопросов о здоровье",
        "level": 3
      },
      {
        "anchor": "ispolzuyte-privychnyy-yazyk",
        "title": "Используйте привычный язык",
        "level": 3
      },
      {
        "anchor": "snachala-sprosite-nuzhna-li-pomosch",
        "title": "Сначала спросите, нужна ли помощь",
        "level": 3
      },
      {
        "anchor": "glavnoe-pravilo",
        "title": "Главное правило",
        "level": 3
      },
      {
        "anchor": "osobennosti-obscheniya-s-lyudmi-s-raznymi-formam",
        "title": "Особенности общения с людьми с разными формами инвалидности",
        "level": 2
      },
      {
        "anchor": "obschenie-s-nezryachimi-i-slabovidyaschimi-lyudm",
        "title": "Общение с незрячими и слабовидящими людьми",
        "level": 3
      },
      {
        "anchor": "kratkoe-sammari",
        "title": "Краткое саммари",
        "level": 3
      },
      {
        "anchor": "obschenie-s-neslyshaschimi-i-slaboslyshaschimi-l",
        "title": "Общение с неслышащими и слабослышащими людьми",
        "level": 3
      },
      {
        "anchor": "kratkoe-sammari-2",
        "title": "Краткое саммари",
        "level": 3
      },
      {
        "anchor": "obschenie-s-lyudmi-peredvigayuschimisya-na-inval",
        "title": "Общение с людьми, передвигающимися на инвалидной коляске",
        "level": 3
      },
      {
        "anchor": "kratkoe-sammari-3",
        "title": "Краткое саммари",
        "level": 3
      },
      {
        "anchor": "obschenie-s-lyudmi-s-mentalnoy-invalidnostyu",
        "title": "Общение с людьми с ментальной инвалидностью",
        "level": 3
      },
      {
        "anchor": "kratkoe-sammari-4",
        "title": "Краткое саммари",
        "level": 3
      },
      {
        "anchor": "obschenie-s-lyudmi-s-osobennostyami-rechi",
        "title": "Общение с людьми с особенностями речи",
        "level": 3
      },
      {
        "anchor": "kratkoe-sammari-5",
        "title": "Краткое саммари",
        "level": 3
      },
      {
        "anchor": "obschenie-s-lyudmi-s-nevidimoy-invalidnostyu",
        "title": "Общение с людьми с невидимой инвалидностью",
        "level": 3
      },
      {
        "anchor": "kratkoe-sammari-6",
        "title": "Краткое саммари",
        "level": 3
      },
      {
        "anchor": "sovet-rukovoditelyu",
        "title": "Совет руководителю",
        "level": 3
      },
      {
        "anchor": "chto-govoryat-sotrudniki-s-invalidnostyu",
        "title": "Что говорят сотрудники с инвалидностью",
        "level": 2
      },
      {
        "anchor": "gulfiya-konovalova-slaboslyshaschiy-brigadir-v-y",
        "title": "Гульфия Коновалова, слабослышащий бригадир в Яндекс Маркете",
        "level": 3
      },
      {
        "anchor": "kseniya-lomakina-dizayner-produkta-na-kolyaske-v",
        "title": "Ксения Ломакина, дизайнер продукта на коляске в HR Tech Яндекса",
        "level": 3
      },
      {
        "anchor": "anatoliy-popko-nezryachiy-rukovoditel-gruppy-tes",
        "title": "Анатолий Попко, незрячий руководитель группы тестирования невизуальной доступности в Яндексе",
        "level": 3
      },
      {
        "anchor": "kak-podgotovit-i-provesti-meropriyatie-s-uchasti",
        "title": "Как подготовить и провести мероприятие с участием людей с инвалидностью",
        "level": 2
      },
      {
        "anchor": "oborudovanie-ploschadki",
        "title": "Оборудование площадки",
        "level": 3
      },
      {
        "anchor": "yasnost-i-dostupnost-kontenta",
        "title": "Ясность и доступность контента",
        "level": 3
      },
      {
        "anchor": "podgotovka-komandy-organizatorov",
        "title": "Подготовка команды организаторов",
        "level": 3
      },
      {
        "anchor": "anons-meropriyatiya",
        "title": "Анонс мероприятия",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "1-zamechayte-cheloveka-a-ne-diagnoz",
        "title": "1. Замечайте человека, а не диагноз",
        "level": 3
      },
      {
        "anchor": "2-opiraytes-na-uvazhenie-i-zdravyy-smysl",
        "title": "2. Опирайтесь на уважение и здравый смысл",
        "level": 3
      },
      {
        "anchor": "3-ne-boytes-oshibitsya",
        "title": "3. Не бойтесь ошибиться",
        "level": 3
      },
      {
        "anchor": "4-uvazhayte-temp-sobesednika",
        "title": "4. Уважайте темп собеседника",
        "level": 3
      },
      {
        "anchor": "5-dumayte-o-dostupnosti-zaranee",
        "title": "5. Думайте о доступности заранее",
        "level": 3
      }
    ]
  },
  {
    "id": "m4",
    "num": 4,
    "file": "Модуль 4.md",
    "docId": "1si_hW1_wvlLRZ2BkRCzer_0bl3Bg70OGyWVyU0rAQD8",
    "title": "Как работает инклюзивный наём: от поиска до партнёрства",
    "toc": [
      {
        "anchor": "modul-4-kak-rabotaet-inklyuzivnyy-naem-ot-poiska",
        "title": "Модуль 4. Как работает инклюзивный наём: от поиска до партнёрства",
        "level": 2
      },
      {
        "anchor": "uchastniki-inklyuzivnogo-trudoustroystva-i-ih-ro",
        "title": "Участники инклюзивного трудоустройства и их роли",
        "level": 2
      },
      {
        "anchor": "soiskatel-s-invalidnostyu",
        "title": "Соискатель с инвалидностью",
        "level": 3
      },
      {
        "anchor": "rabotodatel",
        "title": "Работодатель",
        "level": 3
      },
      {
        "anchor": "nekommercheskaya-organizaciya-nko",
        "title": "Некоммерческая организация (НКО)",
        "level": 3
      },
      {
        "anchor": "sluzhby-zanyatosti-naseleniya-szn",
        "title": "Службы занятости населения (СЗН)",
        "level": 3
      },
      {
        "anchor": "scenarii-poiska-raboty",
        "title": "Сценарии поиска работы",
        "level": 2
      },
      {
        "anchor": "trudoustroystvo-pri-podderzhke-sluzhby-zanyatost",
        "title": "Трудоустройство при поддержке Службы занятости населения (СЗН)",
        "level": 3
      },
      {
        "anchor": "trudoustroystvo-s-uchastiem-nekommercheskoy-orga",
        "title": "Трудоустройство с участием некоммерческой организации (НКО)",
        "level": 3
      },
      {
        "anchor": "soprovozhdaemoe-trudoustroystvo",
        "title": "Сопровождаемое трудоустройство",
        "level": 3
      },
      {
        "anchor": "gde-iskat-kandidatov-s-invalidnostyu",
        "title": "Где искать кандидатов с инвалидностью",
        "level": 2
      },
      {
        "anchor": "universalnye-platformy-dlya-poiska-raboty",
        "title": "Универсальные платформы для поиска работы",
        "level": 3
      },
      {
        "anchor": "gosudarstvennye-i-obrazovatelnye-uchrezhdeniya",
        "title": "Государственные и образовательные учреждения",
        "level": 3
      },
      {
        "anchor": "profilnye-organizacii",
        "title": "Профильные организации",
        "level": 3
      },
      {
        "anchor": "pryamoy-poisk-i-netvorking",
        "title": "Прямой поиск и нетворкинг",
        "level": 2
      },
      {
        "anchor": "vserossiyskoe-obschestvo-invalidov-voi",
        "title": "Всероссийское общество инвалидов - ВОИ",
        "level": 2
      },
      {
        "anchor": "chto-govorit-biznes",
        "title": "Что говорит бизнес",
        "level": 2
      },
      {
        "anchor": "vzaimodeystvie-rabotodateley-i-nko-kto-za-chto-o",
        "title": "Взаимодействие работодателей и НКО: кто за что отвечает",
        "level": 2
      },
      {
        "anchor": "situaciya",
        "title": "Ситуация",
        "level": 3
      },
      {
        "anchor": "kak-vystroit-partnerskie-otnosheniya-mezhdu-rabo",
        "title": "Как выстроить партнёрские отношения между работодателем и НКО",
        "level": 2
      },
      {
        "anchor": "put-ot-kandidata-nko-k-kompanii",
        "title": "Путь «От кандидата НКО к компании»",
        "level": 3
      },
      {
        "anchor": "put-ot-kompanii-k-nko",
        "title": "Путь «От компании к НКО»",
        "level": 3
      },
      {
        "anchor": "chto-govorit-biznes-i-nko",
        "title": "Что говорит бизнес и НКО",
        "level": 2
      },
      {
        "anchor": "za-10-let-my-sozdali-inklyuzivnuyu-sredu-dlya-ly",
        "title": "За 10 лет мы создали инклюзивную среду для людей с ОВЗ и детей-сирот вместе с более чем 10 фондами. Некоторые фонды привели сотрудники, с частью мы познакомились на мероприятиях по инклюзии. За годы реализации программы мы вывели свою формулу успеха: открытость со стороны компании и постоянный живой диалог с фондом, лидеры проекта с обеих сторон как единая точка входа, практики наставничества и обмен кейсами.",
        "level": 2
      },
      {
        "anchor": "na-nachalnom-etape-ne-kazhdyy-menedzher-byl-goto",
        "title": "На начальном этапе не каждый менеджер был готов принять такую ответственность и работать с людьми с особенностями. Но регулярное просвещение и обмен лучшими практиками помогли сделать работу системной.",
        "level": 2
      },
      {
        "anchor": "chto-delat-esli-sotrudnichestvo-nko-i-rabotodate",
        "title": "Что делать, если сотрудничество НКО и работодателя складывается не так, как ожидалось",
        "level": 2
      },
      {
        "anchor": "kompaniya-ne-gotova-prodolzhat-naem-zamorozka-va",
        "title": "Компания не готова продолжать наём (заморозка вакансий, изменение стратегии)",
        "level": 3
      },
      {
        "anchor": "nko-ne-mozhet-nayti-podhodyaschih-kandidatov-dol",
        "title": "НКО не может найти подходящих кандидатов (долгий поиск или несоответствие профиля)",
        "level": 3
      },
      {
        "anchor": "neudachnyy-opyt-trudoustroystva-naprimer-sotrudn",
        "title": "Неудачный опыт трудоустройства (например, сотрудник не прошёл испытательный срок)",
        "level": 3
      },
      {
        "anchor": "narushenie-dogovorennostey-odnoy-iz-storon",
        "title": "Нарушение договорённостей одной из сторон",
        "level": 3
      },
      {
        "anchor": "pravilo-zaversheniya-sotrudnichestva",
        "title": "Правило завершения сотрудничества",
        "level": 3
      },
      {
        "anchor": "kakie-mify-rabotodateley-mogut-pomeshat-sotrudni",
        "title": "Какие мифы работодателей могут помешать сотрудничеству?",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "ostalis-voprosy-ili-predlozheniya",
        "title": "Остались вопросы или предложения?",
        "level": 3
      }
    ]
  },
  {
    "id": "m5",
    "num": 5,
    "file": "Модуль 5.md",
    "docId": "1fVRzIziIIRk1l_VNUvvBL6uUI-xWHlqq6lWUEatAJa8",
    "title": "",
    "toc": [
      {
        "anchor": "vvedenie",
        "title": "Введение",
        "level": 2
      },
      {
        "anchor": "opredelite-cel-inklyuzivnogo-nayma",
        "title": "Определите цель инклюзивного найма",
        "level": 2
      },
      {
        "anchor": "sostavte-spisok-potencialnyh-vakansiy",
        "title": "Составьте список потенциальных вакансий",
        "level": 2
      },
      {
        "anchor": "sravnite-vakansii-mezhdu-soboy-i-vyberite-pozici",
        "title": "Сравните вакансии между собой и выберите позицию для пилота",
        "level": 2
      },
      {
        "anchor": "vypishite-funkcional-vakansii",
        "title": "Выпишите функционал вакансии",
        "level": 2
      },
      {
        "anchor": "podumayte-kandidatam-s-kakimi-osobennostyami-zdo",
        "title": "Подумайте, кандидатам с какими особенностями здоровья вакансия подходит лучше всего",
        "level": 2
      },
      {
        "anchor": "vakansiya-sborschik-zakazov-na-sklade",
        "title": "Вакансия: Сборщик заказов на складе",
        "level": 3
      },
      {
        "anchor": "ocenite-bezopasnost-vakansii-vmeste-so-specialis",
        "title": "Оцените безопасность вакансии вместе со специалистами охраны труда",
        "level": 2
      },
      {
        "anchor": "sostavte-itogovyy-spisok-zadach-novogo-sotrudnik",
        "title": "Составьте итоговый список задач нового сотрудника",
        "level": 2
      },
      {
        "anchor": "peredacha-nedostupnoy-zadachi-drugomu-specialist",
        "title": "Передача недоступной задачи другому специалисту",
        "level": 3
      },
      {
        "anchor": "obmen-zadachami-mezhdu-kollegami-na-osnove-silny",
        "title": "Обмен задачами между коллегами на основе сильных сторон",
        "level": 3
      },
      {
        "anchor": "sozdanie-novoy-roli-osnovannoy-na-silnyh-storona",
        "title": "Создание новой роли, основанной на сильных сторонах специалистов",
        "level": 3
      },
      {
        "anchor": "avtomatizaciya-processov",
        "title": "Автоматизация процессов",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "vyberite-vakansiyu-dlya-pilotnogo-nayma",
        "title": "Выберите вакансию для пилотного найма",
        "level": 3
      },
      {
        "anchor": "shag-2-vnutrenniy-audit-rabochey-sredy-processov",
        "title": "Шаг 2. Внутренний аудит рабочей среды, процессов и материалов",
        "level": 2
      },
      {
        "anchor": "uchastniki-audita",
        "title": "Участники аудита",
        "level": 3
      },
      {
        "anchor": "rabotodatel-klyuchevoy-uchastnik-audita",
        "title": "Работодатель — ключевой участник аудита",
        "level": 3
      },
      {
        "anchor": "ekspert-provodnik-v-audite",
        "title": "Эксперт — проводник в аудите",
        "level": 3
      },
      {
        "anchor": "chto-vazhno-proverit-vo-vremya-audita",
        "title": "Что важно проверить во время аудита",
        "level": 3
      },
      {
        "anchor": "publikaciya-vakansii",
        "title": "Публикация вакансии",
        "level": 3
      },
      {
        "anchor": "doroga-do-sobesedovaniya-ili-mesta-raboty",
        "title": "Дорога до собеседования или места работы",
        "level": 3
      },
      {
        "anchor": "sobesedovanie",
        "title": "Собеседование",
        "level": 3
      },
      {
        "anchor": "oformlenie-dokumentov",
        "title": "Оформление документов",
        "level": 3
      },
      {
        "anchor": "instruktazh-i-obuchenie",
        "title": "Инструктаж и обучение",
        "level": 3
      },
      {
        "anchor": "rabochee-mesto-i-fizicheskaya-sreda",
        "title": "Рабочее место и физическая среда",
        "level": 3
      },
      {
        "anchor": "rabochie-processy-i-zadachi",
        "title": "Рабочие процессы и задачи",
        "level": 3
      },
      {
        "anchor": "materialy-i-cifrovye-servisy",
        "title": "Материалы и цифровые сервисы",
        "level": 3
      },
      {
        "anchor": "bezopasnost-i-ekstrennye-situacii",
        "title": "Безопасность и экстренные ситуации",
        "level": 3
      },
      {
        "anchor": "osobennosti-audita-udalennoy-raboty",
        "title": "Особенности аудита удалённой работы",
        "level": 3
      },
      {
        "anchor": "kak-sostavit-tehnicheskoe-zadanie-na-audit",
        "title": "Как составить техническое задание на аудит",
        "level": 3
      },
      {
        "anchor": "kakaya-vakansiya-proveryaetsya",
        "title": "Какая вакансия проверяется",
        "level": 3
      },
      {
        "anchor": "funkcional-vakansii",
        "title": "Функционал вакансии",
        "level": 3
      },
      {
        "anchor": "sroki-format-i-uchastniki",
        "title": "Сроки, формат и участники",
        "level": 3
      },
      {
        "anchor": "chto-imenno-nuzhno-ocenit",
        "title": "Что именно нужно оценить",
        "level": 3
      },
      {
        "anchor": "kakoy-rezultat-vazhno-poluchit",
        "title": "Какой результат важно получить",
        "level": 3
      },
      {
        "anchor": "tipichnye-oshibki-rabotodateley-pri-provedenii-a",
        "title": "Типичные ошибки работодателей при проведении аудита",
        "level": 2
      },
      {
        "anchor": "provodit-audit-slishkom-pozdno",
        "title": "Проводить аудит слишком поздно",
        "level": 3
      },
      {
        "anchor": "polnostyu-perekladyvat-audit-na-vneshnego-eksper",
        "title": "Полностью перекладывать аудит на внешнего эксперта",
        "level": 3
      },
      {
        "anchor": "ocenivat-dostupnost-bez-uchastiya-eksperta",
        "title": "Оценивать доступность без участия эксперта",
        "level": 3
      },
      {
        "anchor": "provodit-audit-bez-tehnicheskogo-zadaniya",
        "title": "Проводить аудит без технического задания",
        "level": 3
      },
      {
        "anchor": "proveryat-tolko-prostranstvo-i-ignorirovat-ves-p",
        "title": "Проверять только пространство и игнорировать весь путь сотрудника",
        "level": 3
      },
      {
        "anchor": "schitat-chto-odnogo-eksperta-dostatochno",
        "title": "Считать, что одного эксперта достаточно",
        "level": 3
      },
      {
        "anchor": "proveryat-kompaniyu-v-celom-a-ne-konkretnuyu-vak",
        "title": "Проверять компанию в целом, а не конкретную вакансию",
        "level": 3
      },
      {
        "anchor": "schitat-chto-audit-ne-nuzhen-dlya-udalennoy-rabo",
        "title": "Считать, что аудит не нужен для удалённой работы",
        "level": 3
      },
      {
        "anchor": "fiksirovat-zamechaniya-no-ne-perevodit-ih-v-plan",
        "title": "Фиксировать замечания, но не переводить их в план действий",
        "level": 3
      },
      {
        "anchor": "srazu-dumat-o-dorogih-izmeneniyah-i-ne-zamechat-",
        "title": "Сразу думать о дорогих изменениях и не замечать простых решений",
        "level": 3
      },
      {
        "anchor": "pytatsya-snachala-sozdat-idealnye-usloviya-a-pot",
        "title": "Пытаться сначала создать идеальные условия, а потом начинать наём",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi-2",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie-dlya-rabotodatelya-2",
        "title": "Практическое задание для работодателя",
        "level": 3
      },
      {
        "anchor": "shag-3-sozdanie-inklyuzivnoy-sredy",
        "title": "Шаг 3. Создание инклюзивной среды",
        "level": 2
      },
      {
        "anchor": "chto-takoe-razumnaya-adaptaciya",
        "title": "Что такое разумная адаптация",
        "level": 3
      },
      {
        "anchor": "kak-adaptirovat-fizicheskuyu-sredu",
        "title": "Как адаптировать физическую среду",
        "level": 3
      },
      {
        "anchor": "kak-podgotovit-prostranstvo-k-neshtatnym-situaci",
        "title": "Как подготовить пространство к нештатным ситуациям",
        "level": 3
      },
      {
        "anchor": "chto-govorit-biznes",
        "title": "Что говорит бизнес",
        "level": 3
      },
      {
        "anchor": "kak-ubrat-barery-na-vhode-i-v-navigacii",
        "title": "Как убрать барьеры на входе и в навигации",
        "level": 3
      },
      {
        "anchor": "kak-adaptirovat-rabochee-mesto-pod-povsednevnye-",
        "title": "Как адаптировать рабочее место под повседневные задачи",
        "level": 3
      },
      {
        "anchor": "kak-ubrat-barery-v-obschih-zonah",
        "title": "Как убрать барьеры в общих зонах",
        "level": 3
      },
      {
        "anchor": "chto-govorit-biznes-2",
        "title": "Что говорит бизнес",
        "level": 2
      },
      {
        "anchor": "chto-govoryat-lyudi-s-invalidnostyu",
        "title": "Что говорят люди с инвалидностью",
        "level": 2
      },
      {
        "anchor": "kak-adaptirovat-materialy-cifrovye-servisy-i-rab",
        "title": "Как адаптировать материалы, цифровые сервисы и рабочие инструменты",
        "level": 3
      },
      {
        "anchor": "kak-sdelat-rabochie-i-obuchayuschie-materialy-do",
        "title": "Как сделать рабочие и обучающие материалы доступными",
        "level": 3
      },
      {
        "anchor": "kak-nastroit-rabochie-instrumenty-i-tehniku",
        "title": "Как настроить рабочие инструменты и технику",
        "level": 3
      },
      {
        "anchor": "chto-govoryat-lyudi-s-invalidnostyu-2",
        "title": "Что говорят люди с инвалидностью",
        "level": 2
      },
      {
        "anchor": "kak-neyroseti-pomogayut-v-rabote",
        "title": "Как нейросети помогают в работе",
        "level": 3
      },
      {
        "anchor": "chto-govoryat-lyudi-s-invalidnostyu-3",
        "title": "Что говорят люди с инвалидностью",
        "level": 2
      },
      {
        "anchor": "chto-govorit-biznes-3",
        "title": "Что говорит бизнес",
        "level": 2
      },
      {
        "anchor": "kak-podgotovit-rukovoditelya-komandu-i-kolleg-k-",
        "title": "Как подготовить руководителя, команду и коллег к выходу сотрудника с инвалидностью",
        "level": 3
      },
      {
        "anchor": "kak-podgotovit-rukovoditelya-i-komandu",
        "title": "Как подготовить руководителя и команду",
        "level": 3
      },
      {
        "anchor": "chto-govorit-biznes-4",
        "title": "Что говорит бизнес",
        "level": 2
      },
      {
        "anchor": "podvedem-itogi-6",
        "title": "Подведём итоги",
        "level": 3
      },
      {
        "anchor": "prakticheskoe-zadanie-dlya-rabotodateley-3",
        "title": "Практическое задание для работодателей",
        "level": 3
      },
      {
        "anchor": "shag-4-poisk-kandidatov-provedenie-sobesedovaniy",
        "title": "Шаг 4. Поиск кандидатов, проведение собеседований и оформление",
        "level": 2
      },
      {
        "anchor": "kak-sostavit-vakansiyu-i-gde-nayti-kandidatov-s-",
        "title": "Как составить вакансию и где найти кандидатов с инвалидностью",
        "level": 2
      },
      {
        "anchor": "kak-sostavit-opisanie-vakansii",
        "title": "Как составить описание вакансии",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie",
        "title": "Практическое задание",
        "level": 2
      },
      {
        "anchor": "kak-sostavit-opisanie-vakansii-2",
        "title": "Как составить описание вакансии",
        "level": 2
      },
      {
        "anchor": "opishite-zadachi-bez-rasplyvchatyh-formulirovok",
        "title": "Опишите задачи без расплывчатых формулировок",
        "level": 3
      },
      {
        "anchor": "ukazhite-chto-vakansiya-dostupna-lyudyam-s-inval",
        "title": "Укажите, что вакансия доступна людям с инвалидностью",
        "level": 3
      },
      {
        "anchor": "proverte-vakansiyu-na-otsutstvie-diskriminacii",
        "title": "Проверьте вакансию на отсутствие дискриминации",
        "level": 3
      },
      {
        "anchor": "budte-prozrachny-v-usloviyah-raboty",
        "title": "Будьте прозрачны в условиях работы",
        "level": 3
      },
      {
        "anchor": "dolzhnost-administrator-ofisa",
        "title": "Должность: Администратор офиса",
        "level": 3
      },
      {
        "anchor": "dolzhnost-testirovschik-programmnogo-obespecheni",
        "title": "Должность: Тестировщик программного обеспечения (QA Engineer)",
        "level": 3
      },
      {
        "anchor": "gde-iskat-kandidatov-s-invalidnostyu",
        "title": "Где искать кандидатов с инвалидностью",
        "level": 2
      },
      {
        "anchor": "nko",
        "title": "НКО",
        "level": 3
      },
      {
        "anchor": "rabotnye-sayty",
        "title": "Работные сайты",
        "level": 3
      },
      {
        "anchor": "sluzhby-zanyatosti-naseleniya",
        "title": "Службы занятости населения",
        "level": 3
      },
      {
        "anchor": "vuzy-i-kolledzhi",
        "title": "Вузы и колледжи",
        "level": 3
      },
      {
        "anchor": "professionalnye-soobschestva-i-socialnye-seti",
        "title": "Профессиональные сообщества и социальные сети",
        "level": 3
      },
      {
        "anchor": "kak-podgotovit-i-provesti-sobesedovanie-s-kandid",
        "title": "Как подготовить и провести собеседование с кандидатом с инвалидностью",
        "level": 2
      },
      {
        "anchor": "utochnite-kakoy-format-sobesedovaniya-udoben-kan",
        "title": "Уточните, какой формат собеседования удобен кандидату",
        "level": 3
      },
      {
        "anchor": "opredelite-kanal-svyazi",
        "title": "Определите канал связи",
        "level": 3
      },
      {
        "anchor": "obsudite-format-vstrechi",
        "title": "Обсудите формат встречи",
        "level": 3
      },
      {
        "anchor": "podgotovte-materialy",
        "title": "Подготовьте материалы",
        "level": 3
      },
      {
        "anchor": "budte-gotovy-k-prisutstviyu-soprovozhdayuschego",
        "title": "Будьте готовы к присутствию сопровождающего",
        "level": 3
      },
      {
        "anchor": "adaptiruyte-kommunikaciyu",
        "title": "Адаптируйте коммуникацию",
        "level": 3
      },
      {
        "anchor": "ocenivayte-kompetencii-a-ne-osobennosti-zdorovya",
        "title": "Оценивайте компетенции, а не особенности здоровья",
        "level": 3
      },
      {
        "anchor": "govorite-prosto-i-ponyatno",
        "title": "Говорите просто и понятно",
        "level": 3
      },
      {
        "anchor": "budte-gotovy-k-dopolnitelnym-voprosam",
        "title": "Будьте готовы к дополнительным вопросам",
        "level": 3
      },
      {
        "anchor": "situaciya-1",
        "title": "Ситуация 1",
        "level": 3
      },
      {
        "anchor": "situaciya-2",
        "title": "Ситуация 2",
        "level": 3
      },
      {
        "anchor": "situaciya-3",
        "title": "Ситуация 3",
        "level": 3
      },
      {
        "anchor": "situaciya-4",
        "title": "Ситуация 4",
        "level": 3
      },
      {
        "anchor": "situaciya-5",
        "title": "Ситуация 5",
        "level": 3
      },
      {
        "anchor": "situaciya-6",
        "title": "Ситуация 6",
        "level": 3
      },
      {
        "anchor": "situaciya-7",
        "title": "Ситуация 7",
        "level": 3
      },
      {
        "anchor": "chto-govorit-biznes-5",
        "title": "Что говорит бизнес",
        "level": 2
      },
      {
        "anchor": "proforientacionnaya-ekskursiya",
        "title": "Профориентационная экскурсия",
        "level": 2
      },
      {
        "anchor": "oformlenie-sotrudnikov-s-invalidnostyu",
        "title": "Оформление сотрудников с инвалидностью",
        "level": 2
      },
      {
        "anchor": "sovet-1-obyasnite-poryadok-oformleniya",
        "title": "Совет 1. Объясните порядок оформления",
        "level": 3
      },
      {
        "anchor": "sovet-2-ne-zaprashivayte-lishnie-dokumenty",
        "title": "Совет 2. Не запрашивайте лишние документы",
        "level": 3
      },
      {
        "anchor": "sovet-3-obsuzhdayte-ne-diagnoz-a-usloviya-raboty",
        "title": "Совет 3. Обсуждайте не диагноз, а условия работы",
        "level": 3
      },
      {
        "anchor": "sovet-4-srazu-fiksiruyte-vazhnye-dogovorennosti",
        "title": "Совет 4. Сразу фиксируйте важные договорённости",
        "level": 3
      },
      {
        "anchor": "sovet-5-naznachte-kontaktnoe-lico",
        "title": "Совет 5. Назначьте контактное лицо",
        "level": 3
      },
      {
        "anchor": "sovet-6-esli-kandidat-prishel-s-kuratorom-nko-za",
        "title": "Совет 6. Если кандидат пришёл с куратором НКО, заранее договоритесь о ролях",
        "level": 3
      },
      {
        "anchor": "sovet-7-ne-zatyagivayte-process-bez-obyasneniy",
        "title": "Совет 7. Не затягивайте процесс без объяснений",
        "level": 3
      },
      {
        "anchor": "sovet-8-spokoyno-otvechayte-na-voprosy",
        "title": "Совет 8. Спокойно отвечайте на вопросы",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi-3",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie-dlya-rabotodateley",
        "title": "Практическое задание для работодателей",
        "level": 2
      },
      {
        "anchor": "ostalis-voprosy-ili-pozhelaniya",
        "title": "Остались вопросы или пожелания?",
        "level": 2
      },
      {
        "anchor": "shag-5-onbording-i-soprovozhdenie-sotrudnika-s-i",
        "title": "Шаг 5. Онбординг и сопровождение сотрудника с инвалидностью",
        "level": 2
      },
      {
        "anchor": "pochemu-adaptaciya-vazhna-dlya-novichkov",
        "title": "Почему адаптация важна для новичков",
        "level": 2
      },
      {
        "anchor": "razumnaya-adaptaciya",
        "title": "Разумная адаптация",
        "level": 3
      },
      {
        "anchor": "giperopeka",
        "title": "Гиперопека",
        "level": 3
      },
      {
        "anchor": "pochemu-adaptaciya-vazhna-dlya-sotrudnikov-s-pri",
        "title": "Почему адаптация важна для сотрудников с приобретённой инвалидностью",
        "level": 2
      },
      {
        "anchor": "peresmotr-formata-i-usloviy-raboty",
        "title": "Пересмотр формата и условий работы",
        "level": 3
      },
      {
        "anchor": "izmenenie-zhiznennyh-prioritetov",
        "title": "Изменение жизненных приоритетов",
        "level": 3
      },
      {
        "anchor": "perezhivaniya-svyazannye-s-priobretennoy-invalid",
        "title": "Переживания, связанные с приобретённой инвалидностью",
        "level": 3
      },
      {
        "anchor": "kto-mozhet-pomoch-adaptirovatsya-sotrudniku-s-in",
        "title": "Кто может помочь адаптироваться сотруднику с инвалидностью",
        "level": 2
      },
      {
        "anchor": "kak-nastroit-rabochie-processy",
        "title": "Как настроить рабочие процессы",
        "level": 3
      },
      {
        "anchor": "kak-adaptirovat-grafik-raboty",
        "title": "Как адаптировать график работы",
        "level": 3
      },
      {
        "anchor": "kak-stavit-zadachi",
        "title": "Как ставить задачи",
        "level": 3
      },
      {
        "anchor": "kak-sdelat-komandnuyu-kommunikaciyu-udobnoy",
        "title": "Как сделать командную коммуникацию удобной",
        "level": 3
      },
      {
        "anchor": "kak-kontrolirovat-rezultaty-raboty-i-davat-obrat",
        "title": "Как контролировать результаты работы и давать обратную связь",
        "level": 3
      },
      {
        "anchor": "chto-govoryat-lyudi-s-invalidnostyu-4",
        "title": "Что говорят люди с инвалидностью",
        "level": 2
      },
      {
        "anchor": "chto-delat-esli-adaptaciya-idet-ne-po-planu",
        "title": "Что делать, если адаптация идёт не по плану",
        "level": 2
      },
      {
        "anchor": "situaciya-1-sotrudnik-bez-preduprezhdeniya-ne-vy",
        "title": "Ситуация 1. Сотрудник без предупреждения не выходит на работу",
        "level": 3
      },
      {
        "anchor": "situaciya-2-sotrudnik-zhdet-osobyh-usloviy",
        "title": "Ситуация 2. Сотрудник ждёт особых условий",
        "level": 3
      },
      {
        "anchor": "situaciya-3-sotrudnik-ne-govorit-o-slozhnostyah",
        "title": "Ситуация 3. Сотрудник не говорит о сложностях",
        "level": 3
      },
      {
        "anchor": "situaciya-4-rabotodatel-nachinaet-chrezmerno-ope",
        "title": "Ситуация 4. Работодатель начинает чрезмерно опекать сотрудника",
        "level": 3
      },
      {
        "anchor": "situaciya-5-konflikt-v-komande",
        "title": "Ситуация 5. Конфликт в команде",
        "level": 3
      },
      {
        "anchor": "situaciya-6-sotrudnik-ustaet-i-nachinaet-huzhe-s",
        "title": "Ситуация 6. Сотрудник устаёт и начинает хуже справляться с работой",
        "level": 3
      },
      {
        "anchor": "situaciya-7-sotrudnik-uhodit-ot-razgovora-o-rabo",
        "title": "Ситуация 7. Сотрудник уходит от разговора о рабочих проблемах",
        "level": 3
      },
      {
        "anchor": "situaciya-8-razgovor-o-zavershenii-sotrudnichest",
        "title": "Ситуация 8. Разговор о завершении сотрудничества",
        "level": 3
      },
      {
        "anchor": "chto-govorit-biznes-6",
        "title": "Что говорит бизнес",
        "level": 2
      },
      {
        "anchor": "podvedem-itogi-4",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie-dlya-rabotodatelya",
        "title": "Практическое задание для работодателя",
        "level": 2
      },
      {
        "anchor": "sostavte-plan-adaptacii-rabochih-processov",
        "title": "Составьте план адаптации рабочих процессов",
        "level": 3
      },
      {
        "anchor": "shag-6-kakie-zatraty-zhdut-kompaniyu-pervonachal",
        "title": "Шаг 6. Какие затраты ждут компанию: первоначальные и регулярные расходы, а также способы их оптимизации",
        "level": 2
      },
      {
        "anchor": "kakie-pervonachalnye-zatraty-mogut-vozniknut-i-k",
        "title": "Какие первоначальные затраты могут возникнуть и как их оптимизировать",
        "level": 2
      },
      {
        "anchor": "zatraty-na-audit",
        "title": "Затраты на аудит",
        "level": 3
      },
      {
        "anchor": "kak-optimizirovat-zatraty-8",
        "title": "Как оптимизировать затраты",
        "level": 3
      },
      {
        "anchor": "zatraty-na-adaptaciyu-fizicheskoy-sredy",
        "title": "Затраты на адаптацию физической среды",
        "level": 3
      },
      {
        "anchor": "kak-optimizirovat-zatraty",
        "title": "Как оптимизировать затраты",
        "level": 3
      },
      {
        "anchor": "zatraty-na-adaptaciyu-materialov-cifrovyh-servis",
        "title": "Затраты на адаптацию материалов, цифровых сервисов и рабочих инструментов",
        "level": 3
      },
      {
        "anchor": "kak-optimizirovat-zatraty-2",
        "title": "Как оптимизировать затраты",
        "level": 3
      },
      {
        "anchor": "zatraty-na-podgotovku-komandy-i-rukovoditelya",
        "title": "Затраты на подготовку команды и руководителя",
        "level": 3
      },
      {
        "anchor": "kak-optimizirovat-zatraty-3",
        "title": "Как оптимизировать затраты",
        "level": 3
      },
      {
        "anchor": "zatraty-na-naem-sobesedovanie-i-oformlenie-sotru",
        "title": "Затраты на наём, собеседование и оформление сотрудников",
        "level": 3
      },
      {
        "anchor": "kak-optimizirovat-zatraty-4",
        "title": "Как оптимизировать затраты",
        "level": 3
      },
      {
        "anchor": "zatraty-na-onbording-i-soprovozhdenie",
        "title": "Затраты на онбординг и сопровождение",
        "level": 3
      },
      {
        "anchor": "kak-optimizirovat-zatraty-5",
        "title": "Как оптимизировать затраты",
        "level": 3
      },
      {
        "anchor": "kakie-regulyarnye-rashody-nuzhno-uchityvat-i-moz",
        "title": "Какие регулярные расходы нужно учитывать и можно ли их сократить",
        "level": 2
      },
      {
        "anchor": "fond-oplaty-truda-i-nalogi",
        "title": "Фонд оплаты труда и налоги",
        "level": 3
      },
      {
        "anchor": "podderzhka-infrastruktury",
        "title": "Поддержка инфраструктуры",
        "level": 3
      },
      {
        "anchor": "kak-optimizirovat-zatraty-6",
        "title": "Как оптимизировать затраты",
        "level": 3
      },
      {
        "anchor": "vremya-komandy",
        "title": "Время команды",
        "level": 3
      },
      {
        "anchor": "kak-optimizirovat-zatraty-7",
        "title": "Как оптимизировать затраты",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi-5",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie-dlya-rabotodateley-2",
        "title": "Практическое задание для работодателей",
        "level": 2
      },
      {
        "anchor": "sostavte-spisok-zatrat-na-inklyuzivnyy-naem",
        "title": "Составьте список затрат на инклюзивный наём",
        "level": 3
      },
      {
        "anchor": "ostalis-voprosy-est-pozhelaniya",
        "title": "Остались вопросы? Есть пожелания?",
        "level": 3
      },
      {
        "anchor": "zaklyuchenie",
        "title": "Заключение",
        "level": 2
      }
    ]
  },
  {
    "id": "m6",
    "num": 6,
    "file": "Модуль 6.md",
    "docId": "1F7_yp0qN2yY4ugFqyasx6BESyOndn3zgsRIDjzL7Wi4",
    "title": "",
    "toc": [
      {
        "anchor": "vvedenie",
        "title": "Введение",
        "level": 2
      },
      {
        "anchor": "rol-nko-v-programmah-trudoustroystva-lyudey-s-in",
        "title": "Роль НКО в программах трудоустройства людей с инвалидностью",
        "level": 2
      },
      {
        "anchor": "programma-trudoustroystva-v-nko",
        "title": "Программа трудоустройства в НКО",
        "level": 2
      },
      {
        "anchor": "etapy-raboty-nko",
        "title": "Этапы работы НКО",
        "level": 2
      },
      {
        "anchor": "shag-1-opredelit-s-kakoy-auditoriey-vy-rabotaete",
        "title": "Шаг 1. Определить, с какой аудиторией вы работаете",
        "level": 3
      },
      {
        "anchor": "shag-2-opredelit-format-raboty-nko",
        "title": "Шаг 2. Определить формат работы НКО",
        "level": 3
      },
      {
        "anchor": "rabota-s-shirokoy-auditoriey-lyudey-s-invalidnos",
        "title": "Работа с широкой аудиторией людей с инвалидностью",
        "level": 3
      },
      {
        "anchor": "rabota-s-opredelennoy-celevoy-gruppoy",
        "title": "Работа с определённой целевой группой",
        "level": 3
      },
      {
        "anchor": "rabota-kak-resursnyy-centr-po-inklyuzivnomu-trud",
        "title": "Работа как ресурсный центр по инклюзивному трудоустройству",
        "level": 3
      },
      {
        "anchor": "shag-3-rabotat-odnovremenno-s-soiskatelyami-i-ra",
        "title": "Шаг 3. Работать одновременно с соискателями и работодателями",
        "level": 3
      },
      {
        "anchor": "shag-4-soprovozhdat-uchastnikov-posle-trudoustro",
        "title": "Шаг 4. Сопровождать участников после трудоустройства",
        "level": 3
      },
      {
        "anchor": "shag-5-masshtabirovat-rezultaty",
        "title": "Шаг 5. Масштабировать результаты",
        "level": 3
      },
      {
        "anchor": "pochemu-nko-vazhno-vystraivat-partnerskie-otnosh",
        "title": "Почему НКО важно выстраивать партнёрские отношения и с соискателями, и с работодателями",
        "level": 2
      },
      {
        "anchor": "pochemu-dlya-nko-vazhen-inklyuzivnyy-podhod",
        "title": "Почему для НКО важен инклюзивный подход",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie-dlya-predstaviteley-nko",
        "title": "Практическое задание для представителей НКО",
        "level": 2
      },
      {
        "anchor": "analiz-auditorii-nko",
        "title": "Анализ аудитории НКО",
        "level": 2
      },
      {
        "anchor": "situaciya",
        "title": "Ситуация",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "kak-ponyat-svoyu-tekuschuyu-auditoriyu-i-ne-pere",
        "title": "Как понять свою текущую аудиторию и не переоценить её",
        "level": 2
      },
      {
        "anchor": "kak-segmentirovat-auditoriyu-i-vydelit-ee-yadro",
        "title": "Как сегментировать аудиторию и выделить её ядро",
        "level": 2
      },
      {
        "anchor": "naskolko-auditoriya-gotova-k-trudoustroystvu",
        "title": "Насколько аудитория готова к трудоустройству",
        "level": 3
      },
      {
        "anchor": "1-lyudi-kotorye-samostoyatelno-ischut-rabotu",
        "title": "1. Люди, которые самостоятельно ищут работу",
        "level": 3
      },
      {
        "anchor": "2-lyudi-kotorye-somnevayutsya-v-svoih-vozmozhnos",
        "title": "2. Люди, которые сомневаются в своих возможностях",
        "level": 3
      },
      {
        "anchor": "3-lyudi-kotorym-trudoustroystvo-poka-ne-aktualno",
        "title": "3. Люди, которым трудоустройство пока не актуально",
        "level": 3
      },
      {
        "anchor": "opyt-i-podgotovka",
        "title": "Опыт и подготовка",
        "level": 3
      },
      {
        "anchor": "kakie-usloviya-raboty-podhodyat-auditorii",
        "title": "Какие условия работы подходят аудитории",
        "level": 3
      },
      {
        "anchor": "s-kem-nachinat-rabotat",
        "title": "С кем начинать работать",
        "level": 2
      },
      {
        "anchor": "vopros-1",
        "title": "Вопрос 1",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-2",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "vopros-2",
        "title": "Вопрос 2",
        "level": 3
      },
      {
        "anchor": "vopros-3",
        "title": "Вопрос 3",
        "level": 3
      },
      {
        "anchor": "vopros-4",
        "title": "Вопрос 4",
        "level": 3
      },
      {
        "anchor": "vopros-5",
        "title": "Вопрос 5",
        "level": 3
      },
      {
        "anchor": "obschaya-obratnaya-svyaz",
        "title": "Общая обратная связь",
        "level": 3
      },
      {
        "anchor": "situaciya-2",
        "title": "Ситуация 2",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-3",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "rabota-s-vneshney-auditoriey",
        "title": "Работа с внешней аудиторией",
        "level": 2
      },
      {
        "anchor": "pochemu-vazhno-zaranee-opredelit-obem-uslug",
        "title": "Почему важно заранее определить объём услуг",
        "level": 2
      },
      {
        "anchor": "gde-iskat-auditoriyu",
        "title": "Где искать аудиторию",
        "level": 2
      },
      {
        "anchor": "profilnye-organizacii-i-centry",
        "title": "Профильные организации и центры",
        "level": 3
      },
      {
        "anchor": "sarafannoe-radio-i-ambassadory",
        "title": "Сарафанное радио и амбассадоры",
        "level": 3
      },
      {
        "anchor": "medicinskie-uchrezhdeniya-i-byuro-mse",
        "title": "Медицинские учреждения и бюро МСЭ",
        "level": 3
      },
      {
        "anchor": "oflayn-ploschadki",
        "title": "Офлайн-площадки",
        "level": 3
      },
      {
        "anchor": "yarmarki-vakansiy-dlya-lyudey-s-invalidnostyu",
        "title": "Ярмарки вакансий для людей с инвалидностью",
        "level": 3
      },
      {
        "anchor": "proforientacionnye-i-karernye-meropriyatiya",
        "title": "Профориентационные и карьерные мероприятия",
        "level": 3
      },
      {
        "anchor": "specializirovannye-forumy-i-konferencii",
        "title": "Специализированные форумы и конференции",
        "level": 3
      },
      {
        "anchor": "vzaimodeystvie-s-vuzami",
        "title": "Взаимодействие с вузами",
        "level": 3
      },
      {
        "anchor": "kanaly-prodvizheniya-programmy",
        "title": "Каналы продвижения программы",
        "level": 2
      },
      {
        "anchor": "socialnye-seti-i-sayt",
        "title": "Социальные сети и сайт",
        "level": 3
      },
      {
        "anchor": "chaty-i-kanaly-v-messendzherah",
        "title": "Чаты и каналы в мессенджерах",
        "level": 3
      },
      {
        "anchor": "media-i-naruzhnaya-reklama",
        "title": "Медиа и наружная реклама",
        "level": 3
      },
      {
        "anchor": "kak-ocenit-effektivnost-privlecheniya",
        "title": "Как оценить эффективность привлечения",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie-dlya-predstaviteley-nko-2",
        "title": "Практическое задание для представителей НКО",
        "level": 2
      },
      {
        "anchor": "podvedem-itogi",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "pervichnoe-intervyu-s-soiskatelem",
        "title": "Первичное интервью с соискателем",
        "level": 2
      },
      {
        "anchor": "v-etom-razdele-vy-uznaete",
        "title": "В этом разделе вы узнаете",
        "level": 3
      },
      {
        "anchor": "provedenie-pervichnogo-intervyu",
        "title": "Проведение первичного интервью",
        "level": 2
      },
      {
        "anchor": "chto-vazhno-ponyat-po-itogam-intervyu",
        "title": "Что важно понять по итогам интервью",
        "level": 3
      },
      {
        "anchor": "kakim-mozhet-byt-sleduyuschiy-shag",
        "title": "Каким может быть следующий шаг",
        "level": 3
      },
      {
        "anchor": "osobennosti-intervyu-s-kandidatom-s-mentalnoy-in",
        "title": "Особенности интервью с кандидатом с ментальной инвалидностью",
        "level": 3
      },
      {
        "anchor": "ispolzovanie-neyrosetey-dlya-podgotovki-intervyu",
        "title": "Использование нейросетей для подготовки интервью",
        "level": 3
      },
      {
        "anchor": "nachalo-razgovora",
        "title": "Начало разговора",
        "level": 2
      },
      {
        "anchor": "dva-pravila-kotorye-pomogut-provesti-pervuyu-vst",
        "title": "Два правила, которые помогут провести первую встречу",
        "level": 3
      },
      {
        "anchor": "esli-chelovek-poka-ne-gotov-k-trudoustroystvu",
        "title": "Если человек пока не готов к трудоустройству",
        "level": 3
      },
      {
        "anchor": "sostavlenie-portreta-soiskatelya",
        "title": "Составление портрета соискателя",
        "level": 2
      },
      {
        "anchor": "vopros-1-2",
        "title": "Вопрос 1",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-k-variantu-1",
        "title": "Обратная связь к варианту 1",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-k-variantu-2",
        "title": "Обратная связь к варианту 2",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-k-variantu-3",
        "title": "Обратная связь к варианту 3",
        "level": 3
      },
      {
        "anchor": "opyt-i-navyki",
        "title": "Опыт и навыки",
        "level": 3
      },
      {
        "anchor": "vopros-2-2",
        "title": "Вопрос 2",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-k-variantu-1-2",
        "title": "Обратная связь к варианту 1",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-k-variantu-2-2",
        "title": "Обратная связь к варианту 2",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-k-variantu-3-2",
        "title": "Обратная связь к варианту 3",
        "level": 3
      },
      {
        "anchor": "ocenka-navykov-lyudey-s-mentalnoy-invalidnostyu",
        "title": "Оценка навыков людей с ментальной инвалидностью",
        "level": 3
      },
      {
        "anchor": "keys",
        "title": "Кейс",
        "level": 3
      },
      {
        "anchor": "obrazovanie-i-obuchenie",
        "title": "Образование и обучение",
        "level": 3
      },
      {
        "anchor": "ozhidaniya-ot-raboty",
        "title": "Ожидания от работы",
        "level": 3
      },
      {
        "anchor": "vopros-3-2",
        "title": "Вопрос 3",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-k-variantu-1-3",
        "title": "Обратная связь к варианту 1",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-k-variantu-2-3",
        "title": "Обратная связь к варианту 2",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-k-variantu-3-3",
        "title": "Обратная связь к варианту 3",
        "level": 3
      },
      {
        "anchor": "motivaciya-i-gotovnost-k-rabote",
        "title": "Мотивация и готовность к работе",
        "level": 3
      },
      {
        "anchor": "format-i-usloviya-raboty",
        "title": "Формат и условия работы",
        "level": 3
      },
      {
        "anchor": "kommunikaciya",
        "title": "Коммуникация",
        "level": 3
      },
      {
        "anchor": "chto-esche-stoit-uchest",
        "title": "Что ещё стоит учесть",
        "level": 3
      },
      {
        "anchor": "kak-zavershit-pervuyu-vstrechu",
        "title": "Как завершить первую встречу",
        "level": 2
      },
      {
        "anchor": "podvedem-itog",
        "title": "Подведём итог",
        "level": 2
      },
      {
        "anchor": "proforientaciya-i-psihologicheskaya-podderzhka",
        "title": "Профориентация и психологическая поддержка",
        "level": 2
      },
      {
        "anchor": "v-etom-razdele-vy-uznaete-2",
        "title": "В этом разделе вы узнаете",
        "level": 3
      },
      {
        "anchor": "chto-takoe-proforientaciya-i-kogda-ona-nuzhna",
        "title": "Что такое профориентация и когда она нужна",
        "level": 2
      },
      {
        "anchor": "kogda-neobhodima-proforientaciya",
        "title": "Когда необходима профориентация",
        "level": 2
      },
      {
        "anchor": "kak-provodit-proforientaciyu-poshagovyy-plan-dly",
        "title": "Как проводить профориентацию: пошаговый план для НКО",
        "level": 2
      },
      {
        "anchor": "etap-1-soberite-dannye",
        "title": "Этап 1. Соберите данные",
        "level": 3
      },
      {
        "anchor": "etap-2-proanaliziruyte-portreta-soiskatelya",
        "title": "Этап 2. Проанализируйте портрета соискателя",
        "level": 3
      },
      {
        "anchor": "primer-1-soiskatel-s-invalidnostyu-oporno-dvigat",
        "title": "Пример 1. Соискатель с инвалидностью опорно-двигательного аппарата.",
        "level": 3
      },
      {
        "anchor": "primer-2-soiskatel-s-invalidnostyu-po-sluhu",
        "title": "Пример 2. Соискатель с инвалидностью по слуху",
        "level": 3
      },
      {
        "anchor": "primer-3-soiskatel-s-invalidnostyu-po-zreniyu",
        "title": "Пример 3. Соискатель с инвалидностью по зрению",
        "level": 3
      },
      {
        "anchor": "primer-4-soiskatel-s-priobretennoy-invalidnostyu",
        "title": "Пример 4. Соискатель с приобретённой инвалидностью",
        "level": 3
      },
      {
        "anchor": "etap-3-obsudite-protivorechiya",
        "title": "Этап 3. Обсудите противоречия",
        "level": 3
      },
      {
        "anchor": "etap-4-sformuliruyte-karernye-gipotezy",
        "title": "Этап 4. Сформулируйте карьерные гипотезы",
        "level": 3
      },
      {
        "anchor": "primer-soiskatel-s-priobretennoy-invalidnostyu",
        "title": "Пример: соискатель с приобретённой инвалидностью",
        "level": 3
      },
      {
        "anchor": "kakie-nyuansy-stoit-uchityvat-pri-formirovanii-g",
        "title": "Какие нюансы стоит учитывать при формировании гипотез",
        "level": 3
      },
      {
        "anchor": "chto-delat-esli-gipotezy-ne-poyavlyayutsya",
        "title": "Что делать, если гипотезы не появляются",
        "level": 3
      },
      {
        "anchor": "proforientacionnye-testy",
        "title": "Профориентационные тесты",
        "level": 3
      },
      {
        "anchor": "etap-5-proverte-gipotezy-na-praktike",
        "title": "Этап 5. Проверьте гипотезы на практике",
        "level": 3
      },
      {
        "anchor": "etap-6-vyberite-napravlenie-raboty",
        "title": "Этап 6. Выберите направление работы",
        "level": 3
      },
      {
        "anchor": "kogda-pora-perehodit-k-realnym-shagam",
        "title": "Когда пора переходить к реальным шагам",
        "level": 3
      },
      {
        "anchor": "osobennosti-proforientacii-lyudey-s-mentalnoy-in",
        "title": "Особенности профориентации людей с ментальной инвалидностью",
        "level": 2
      },
      {
        "anchor": "teoreticheskaya-chast",
        "title": "Теоретическая часть",
        "level": 3
      },
      {
        "anchor": "prakticheskaya-chast",
        "title": "Практическая часть",
        "level": 3
      },
      {
        "anchor": "fiksiruyte-rezultaty-nablyudeniy",
        "title": "Фиксируйте результаты наблюдений",
        "level": 3
      },
      {
        "anchor": "psihologicheskaya-podderzhka-soiskatelya-s-inval",
        "title": "Психологическая поддержка соискателя с инвалидностью",
        "level": 2
      },
      {
        "anchor": "kak-nko-mozhet-pomoch",
        "title": "Как НКО может помочь",
        "level": 2
      },
      {
        "anchor": "pomogite-ponyat-chto-meshaet-sdelat-sleduyuschiy",
        "title": "Помогите понять, что мешает сделать следующий шаг",
        "level": 3
      },
      {
        "anchor": "vozvraschayte-soiskatelya-s-invalidnostyu-k-ego-",
        "title": "Возвращайте соискателя с инвалидностью к его сильным сторонам",
        "level": 3
      },
      {
        "anchor": "razbivayte-put-na-nebolshie-shagi",
        "title": "Разбивайте путь на небольшие шаги",
        "level": 3
      },
      {
        "anchor": "delayte-process-predskazuemym",
        "title": "Делайте процесс предсказуемым",
        "level": 3
      },
      {
        "anchor": "razbirayte-neudachi-bez-obvineniy",
        "title": "Разбирайте неудачи без обвинений",
        "level": 3
      },
      {
        "anchor": "uchityvayte-vliyanie-semi-i-okruzheniya",
        "title": "Учитывайте влияние семьи и окружения",
        "level": 3
      },
      {
        "anchor": "pomogayte-prinyat-izmenenie-professionalnogo-mar",
        "title": "Помогайте принять изменение профессионального маршрута",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi-2",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie-dlya-predstaviteley-nko-3",
        "title": "Практическое задание для представителей НКО",
        "level": 3
      },
      {
        "anchor": "podbor-vakansiy-i-podgotovka-k-sobesedovaniyu",
        "title": "Подбор вакансий и подготовка к собеседованию",
        "level": 2
      },
      {
        "anchor": "shag-1-opredelenie-prioritetov",
        "title": "Шаг 1. Определение приоритетов",
        "level": 2
      },
      {
        "anchor": "shag-2-poisk-vakansiy-na-podhodyaschih-ploschadk",
        "title": "Шаг 2. Поиск вакансий на подходящих площадках",
        "level": 2
      },
      {
        "anchor": "shag-3-pomosch-kandidatu-v-ponimanii-opisaniya-v",
        "title": "Шаг 3. Помощь кандидату в понимании описания вакансии",
        "level": 2
      },
      {
        "anchor": "razberite-vakansiyu-po-zadacham",
        "title": "Разберите вакансию по задачам",
        "level": 3
      },
      {
        "anchor": "sopostavte-vakansiyu-s-vozmozhnostyami-kandidata",
        "title": "Сопоставьте вакансию с возможностями кандидата",
        "level": 3
      },
      {
        "anchor": "izuchite-rabotodatelya",
        "title": "Изучите работодателя",
        "level": 3
      },
      {
        "anchor": "reshite-kak-deystvovat-dalshe",
        "title": "Решите, как действовать дальше",
        "level": 3
      },
      {
        "anchor": "shag-4-sostavlenie-ili-obnovlenie-rezyume",
        "title": "Шаг 4. Составление или обновление резюме",
        "level": 2
      },
      {
        "anchor": "chto-vazhno-uchityvat-pri-sostavlenii-rezyume",
        "title": "Что важно учитывать при составлении резюме",
        "level": 3
      },
      {
        "anchor": "shag-5-soglasovanie-resheniya-ob-otklike",
        "title": "Шаг 5. Согласование решения об отклике",
        "level": 2
      },
      {
        "anchor": "shag-6-podgotovka-k-sobesedovaniyu",
        "title": "Шаг 6. Подготовка к собеседованию",
        "level": 2
      },
      {
        "anchor": "chto-vazhno-proverit-i-podgotovit-zaranee",
        "title": "Что важно проверить и подготовить заранее",
        "level": 3
      },
      {
        "anchor": "informaciya-o-kompanii",
        "title": "Информация о компании",
        "level": 3
      },
      {
        "anchor": "format-sobesedovaniya-i-dostupnost-mesta-vstrech",
        "title": "Формат собеседования и доступность места встречи",
        "level": 3
      },
      {
        "anchor": "vneshniy-vid",
        "title": "Внешний вид",
        "level": 3
      },
      {
        "anchor": "dokumenty",
        "title": "Документы",
        "level": 3
      },
      {
        "anchor": "podgotovka-k-razgovoru",
        "title": "Подготовка к разговору",
        "level": 3
      },
      {
        "anchor": "tipichnye-voprosy-rabotodatelya",
        "title": "Типичные вопросы работодателя",
        "level": 3
      },
      {
        "anchor": "voprosy-so-storony-kandidata",
        "title": "Вопросы со стороны кандидата",
        "level": 3
      },
      {
        "anchor": "shag-7-provedenie-sobesedovaniya",
        "title": "Шаг 7. Проведение собеседования",
        "level": 2
      },
      {
        "anchor": "shag-8-posle-sobesedovaniya",
        "title": "Шаг 8. После собеседования",
        "level": 2
      },
      {
        "anchor": "razbor-vstrechi",
        "title": "Разбор встречи",
        "level": 3
      },
      {
        "anchor": "esli-prishel-otkaz",
        "title": "Если пришёл отказ",
        "level": 3
      },
      {
        "anchor": "esli-kandidat-poluchil-predlozhenie-o-rabote",
        "title": "Если кандидат получил предложение о работе",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi-3",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie",
        "title": "Практическое задание",
        "level": 3
      },
      {
        "anchor": "poisk-rabotodateley",
        "title": "Поиск работодателей",
        "level": 2
      },
      {
        "anchor": "zachem-nko-iskat-rabotodateley-zaranee",
        "title": "Зачем НКО искать работодателей заранее",
        "level": 3
      },
      {
        "anchor": "kandidat-sohranyaet-motivaciyu",
        "title": "Кандидат сохраняет мотивацию",
        "level": 3
      },
      {
        "anchor": "nko-mozhet-podbirat-vakansii-bolee-osoznanno",
        "title": "НКО может подбирать вакансии более осознанно",
        "level": 3
      },
      {
        "anchor": "vozmozhnosti-i-usloviya-mozhno-ocenit-zaranee",
        "title": "Возможности и условия можно оценить заранее",
        "level": 3
      },
      {
        "anchor": "rabotodatel-uspevaet-podgotovitsya",
        "title": "Работодатель успевает подготовиться",
        "level": 3
      },
      {
        "anchor": "u-nko-formiruetsya-set-partnerov",
        "title": "У НКО формируется сеть партнёров",
        "level": 3
      },
      {
        "anchor": "razgovor-s-rabotodatelem-stanovitsya-partnerskim",
        "title": "Разговор с работодателем становится партнёрским",
        "level": 3
      },
      {
        "anchor": "kak-nayti-rabotodateley",
        "title": "Как найти работодателей",
        "level": 2
      },
      {
        "anchor": "etap-1-opredelite-kakie-rabotodateli-nuzhny-vash",
        "title": "Этап 1. Определите, какие работодатели нужны вашей аудитории",
        "level": 3
      },
      {
        "anchor": "etap-2-naydite-potencialnyh-rabotodateley",
        "title": "Этап 2. Найдите потенциальных работодателей",
        "level": 3
      },
      {
        "anchor": "sayty-s-vakansiyami",
        "title": "Сайты с вакансиями",
        "level": 3
      },
      {
        "anchor": "chto-govoryat-nko",
        "title": "Что говорят НКО",
        "level": 3
      },
      {
        "anchor": "ischite-ne-tolko-kompaniyu-no-i-nuzhnogo-chelove",
        "title": "Ищите не только компанию, но и нужного человека",
        "level": 3
      },
      {
        "anchor": "proyavlyayte-iniciativu-pri-poiske-kontaktov",
        "title": "Проявляйте инициативу при поиске контактов",
        "level": 3
      },
      {
        "anchor": "etap-3-sostavte-spisok-rabotodateley",
        "title": "Этап 3. Составьте список работодателей",
        "level": 3
      },
      {
        "anchor": "primer-2",
        "title": "Пример",
        "level": 3
      },
      {
        "anchor": "gde-iskat-informaciyu-o-kompanii",
        "title": "Где искать информацию о компании",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi-4",
        "title": "Подведём итоги",
        "level": 3
      },
      {
        "anchor": "vzaimodeystvie-s-rabotodatelyami",
        "title": "Взаимодействие с работодателями",
        "level": 2
      },
      {
        "anchor": "kak-podgotovitsya-k-razgovoru-s-rabotodatelem",
        "title": "Как подготовиться к разговору с работодателем",
        "level": 2
      },
      {
        "anchor": "govorite-s-pozicii-partnera",
        "title": "Говорите с позиции партнёра",
        "level": 3
      },
      {
        "anchor": "obyasnite-chem-nko-mozhet-byt-polezna-rabotodate",
        "title": "Объясните, чем НКО может быть полезна работодателю",
        "level": 3
      },
      {
        "anchor": "opredelite-cel-kontakta",
        "title": "Определите цель контакта",
        "level": 3
      },
      {
        "anchor": "podgotovte-voprosy-ob-usloviyah-raboty",
        "title": "Подготовьте вопросы об условиях работы",
        "level": 3
      },
      {
        "anchor": "pervoe-obschenie-s-rabotodatelem",
        "title": "Первое общение с работодателем",
        "level": 2
      },
      {
        "anchor": "pismo",
        "title": "Письмо",
        "level": 3
      },
      {
        "anchor": "primer-pisma",
        "title": "Пример письма",
        "level": 3
      },
      {
        "anchor": "chego-luchshe-izbegat-v-pervom-pisme",
        "title": "Чего лучше избегать в первом письме",
        "level": 3
      },
      {
        "anchor": "otklik-na-vakansiyu",
        "title": "Отклик на вакансию",
        "level": 3
      },
      {
        "anchor": "primer-soprovoditelnogo-pisma",
        "title": "Пример сопроводительного письма",
        "level": 3
      },
      {
        "anchor": "esli-rezyume-uzhe-mozhno-napravit",
        "title": "Если резюме уже можно направить",
        "level": 3
      },
      {
        "anchor": "zvonok",
        "title": "Звонок",
        "level": 3
      },
      {
        "anchor": "primer-obrascheniya",
        "title": "Пример обращения",
        "level": 3
      },
      {
        "anchor": "esli-zvonok-svyazan-s-konkretnoy-vakansiey",
        "title": "Если звонок связан с конкретной вакансией",
        "level": 3
      },
      {
        "anchor": "vstrecha",
        "title": "Встреча",
        "level": 3
      },
      {
        "anchor": "kakie-formaty-sotrudnichestva-mogut-byt",
        "title": "Какие форматы сотрудничества могут быть",
        "level": 2
      },
      {
        "anchor": "kak-predstavit-kandidata-s-invalidnostyu-rabotod",
        "title": "Как представить кандидата с инвалидностью работодателю",
        "level": 2
      },
      {
        "anchor": "govorite-o-kandidate-cherez-zadachi-i-usloviya-u",
        "title": "Говорите о кандидате через задачи и условия успешной работы",
        "level": 3
      },
      {
        "anchor": "zaranee-obsudite-vazhnye-usloviya-raboty",
        "title": "Заранее обсудите важные условия работы",
        "level": 3
      },
      {
        "anchor": "soblyudayte-dogovorennosti-s-kandidatom",
        "title": "Соблюдайте договорённости с кандидатом",
        "level": 3
      },
      {
        "anchor": "ne-zamenyayte-kandidata-v-kommunikacii-bez-neobh",
        "title": "Не заменяйте кандидата в коммуникации без необходимости",
        "level": 3
      },
      {
        "anchor": "kak-otvechat-na-vozrazheniya-rabotodatelya",
        "title": "Как отвечать на возражения работодателя",
        "level": 2
      },
      {
        "anchor": "situaciya-rabotodatel-govorit-my-boimsya-chto-ko",
        "title": "Ситуация: работодатель говорит: «Мы боимся, что коллектив не примет человека с инвалидностью»",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-4",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-5",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-6",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "obratnaya-svyaz-7",
        "title": "Обратная связь",
        "level": 3
      },
      {
        "anchor": "posle-vstrechi-s-rabotodatelem",
        "title": "После встречи с работодателем",
        "level": 2
      },
      {
        "anchor": "otpravte-itogovoe-pismo",
        "title": "Отправьте итоговое письмо",
        "level": 3
      },
      {
        "anchor": "struktura-itogovogo-pisma",
        "title": "Структура итогового письма",
        "level": 3
      },
      {
        "anchor": "rabotodatel-ne-otvechaet-posle-vstrechi-chto-del",
        "title": "Работодатель не отвечает после встречи: что делать",
        "level": 2
      },
      {
        "anchor": "napominanie-cherez-3-4-dnya",
        "title": "Напоминание через 3–4 дня",
        "level": 3
      },
      {
        "anchor": "napominanie-cherez-nedelyu",
        "title": "Напоминание через неделю",
        "level": 3
      },
      {
        "anchor": "zavershenie-kontakta-cherez-2-3-nedeli",
        "title": "Завершение контакта через 2–3 недели",
        "level": 3
      },
      {
        "anchor": "chto-delat-esli-vam-otkazali",
        "title": "Что делать, если вам отказали",
        "level": 2
      },
      {
        "anchor": "podvedem-itogi-5",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "soprovozhdenie-na-etape-trudoustroystva",
        "title": "Сопровождение на этапе трудоустройства",
        "level": 2
      },
      {
        "anchor": "v-etom-razdele-vy-uznaete-3",
        "title": "В этом разделе вы узнаете:",
        "level": 3
      },
      {
        "anchor": "dva-formata-soprovozhdeniya",
        "title": "Два формата сопровождения",
        "level": 2
      },
      {
        "anchor": "soprovozhdenie-rabotodatelya-pri-trudoustroystve",
        "title": "Сопровождение работодателя при трудоустройстве кандидата",
        "level": 3
      },
      {
        "anchor": "rol-nko-v-processe-adaptacii",
        "title": "Роль НКО в процессе адаптации",
        "level": 3
      },
      {
        "anchor": "primer-3",
        "title": "Пример",
        "level": 3
      },
      {
        "anchor": "shag-1-proyti-medkomissiyu",
        "title": "Шаг 1. Пройти медкомиссию",
        "level": 3
      },
      {
        "anchor": "chto-mozhet-sdelat-sotrudnik-nko-pri-prohozhdeni",
        "title": "Что может сделать сотрудник НКО при прохождении медкомиссии",
        "level": 3
      },
      {
        "anchor": "pomoch-razobratsya-v-processe",
        "title": "Помочь разобраться в процессе",
        "level": 3
      },
      {
        "anchor": "pomoch-s-organizaciey-processa",
        "title": "Помочь с организацией процесса",
        "level": 3
      },
      {
        "anchor": "pomoch-sobrat-dokumenty",
        "title": "Помочь собрать документы",
        "level": 3
      },
      {
        "anchor": "pomoch-v-spornyh-situaciyah",
        "title": "Помочь в спорных ситуациях",
        "level": 3
      },
      {
        "anchor": "dlya-lyudey-s-mentalnoy-invalidnostyu",
        "title": "Для людей с ментальной инвалидностью",
        "level": 3
      },
      {
        "anchor": "shag-2-oformlenie-dogovora",
        "title": "Шаг 2. Оформление договора",
        "level": 3
      },
      {
        "anchor": "shag-3-vyhod-na-rabotu-soprovozhdenie-v-pervye-n",
        "title": "Шаг 3. Выход на работу: сопровождение в первые недели",
        "level": 3
      },
      {
        "anchor": "chto-dalshe-krizis-menedzhment-na-rabochem-meste",
        "title": "Что дальше? Кризис-менеджмент на рабочем месте",
        "level": 2
      },
      {
        "anchor": "1-regress-navykov",
        "title": "1. Регресс навыков",
        "level": 3
      },
      {
        "anchor": "chto-delat",
        "title": "Что делать",
        "level": 3
      },
      {
        "anchor": "2-sotrudnik-sistematicheski-dopuskaet-oshibki",
        "title": "2. Сотрудник систематически допускает ошибки",
        "level": 3
      },
      {
        "anchor": "chto-delat-2",
        "title": "Что делать",
        "level": 3
      },
      {
        "anchor": "3-vygoranie-sotrudnika",
        "title": "3. Выгорание сотрудника",
        "level": 3
      },
      {
        "anchor": "primer-4",
        "title": "Пример",
        "level": 3
      },
      {
        "anchor": "podvedem-itog-2",
        "title": "Подведём итог",
        "level": 2
      },
      {
        "anchor": "dorozhnaya-karta",
        "title": "Дорожная карта",
        "level": 2
      },
      {
        "anchor": "v-etom-razdele-vy-uznaete-4",
        "title": "В этом разделе вы узнаете:",
        "level": 3
      },
      {
        "anchor": "s-chego-nachinaetsya-rabota",
        "title": "С чего начинается работа?",
        "level": 3
      },
      {
        "anchor": "ishodnaya-situaciya",
        "title": "Исходная ситуация",
        "level": 3
      },
      {
        "anchor": "celi",
        "title": "Цели",
        "level": 3
      },
      {
        "anchor": "zadachi-dlya-resheniya",
        "title": "Задачи для решения",
        "level": 3
      },
      {
        "anchor": "kak-mozhet-vyglyadet-dorozhnaya-karta",
        "title": "Как может выглядеть дорожная карта",
        "level": 3
      },
      {
        "anchor": "razberem-kazhdyy-blok",
        "title": "Разберём каждый блок",
        "level": 3
      },
      {
        "anchor": "individualnyy-ili-gruppovoy-format-raboty",
        "title": "Индивидуальный или групповой формат работы",
        "level": 3
      },
      {
        "anchor": "parallelnye-processy-chto-vazhno-delat-odnovreme",
        "title": "Параллельные процессы: что важно делать одновременно",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi-6",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie-dlya-predstaviteley-nko-4",
        "title": "Практическое задание для представителей НКО",
        "level": 3
      },
      {
        "anchor": "masshtabirovanie-i-ustoychivost-kak-vyrasti-ne-t",
        "title": "Масштабирование и устойчивость: как вырасти, не теряя качества",
        "level": 2
      },
      {
        "anchor": "v-etom-razdele-vy-uznaete-5",
        "title": "В этом разделе вы узнаете:",
        "level": 3
      },
      {
        "anchor": "masshtabirovanie-geografii-deyatelnosti",
        "title": "Масштабирование географии деятельности",
        "level": 3
      },
      {
        "anchor": "analiz-novoy-territorii",
        "title": "Анализ новой территории",
        "level": 3
      },
      {
        "anchor": "primer-5",
        "title": "Пример",
        "level": 3
      },
      {
        "anchor": "vybor-formata-raboty",
        "title": "Выбор формата работы",
        "level": 3
      },
      {
        "anchor": "rabota-s-drugoy-formoy-invalidnosti",
        "title": "Работа с другой формой инвалидности",
        "level": 3
      },
      {
        "anchor": "kak-podelitsya-svoey-ekspertizoy",
        "title": "Как поделиться своей экспертизой",
        "level": 2
      },
      {
        "anchor": "upakovka-opyta-i-sistematizaciya-znaniy",
        "title": "Упаковка опыта и систематизация знаний",
        "level": 3
      },
      {
        "anchor": "vybor-formatov-obucheniya",
        "title": "Выбор форматов обучения",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi-7",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "zatraty-i-finansirovanie-kak-sdelat-proekt-ustoy",
        "title": "Затраты и финансирование: как сделать проект устойчивым",
        "level": 2
      },
      {
        "anchor": "v-etom-razdele-vy-uznaete-6",
        "title": "В этом разделе вы узнаете:",
        "level": 3
      },
      {
        "anchor": "iz-chego-skladyvaetsya-byudzhet-proekta-inklyuzi",
        "title": "Из чего складывается бюджет проекта инклюзивного трудоустройства",
        "level": 3
      },
      {
        "anchor": "chto-uchest-pri-napisanii-zayavki-na-grant",
        "title": "Что учесть при написании заявки на грант",
        "level": 3
      },
      {
        "anchor": "struktura-zayavki",
        "title": "Структура заявки",
        "level": 3
      },
      {
        "anchor": "opisanie-celevoy-auditorii",
        "title": "Описание целевой аудитории",
        "level": 3
      },
      {
        "anchor": "opisanie-socialnoy-problemy",
        "title": "Описание социальной проблемы",
        "level": 3
      },
      {
        "anchor": "podtverzhdenie-togo-chto-proekt-okazyvaet-susche",
        "title": "Подтверждение того, что проект оказывает существенное влияние на качество жизни благополучателей",
        "level": 3
      },
      {
        "anchor": "kolichestvennye-pokazateli",
        "title": "Количественные показатели",
        "level": 3
      },
      {
        "anchor": "opisanie-byudzheta-i-drugih-dopolnitelnyh-resurs",
        "title": "Описание бюджета и других дополнительных ресурсов",
        "level": 3
      },
      {
        "anchor": "opisanie-komandy",
        "title": "Описание команды",
        "level": 3
      },
      {
        "anchor": "plany-na-razvitie-i-podderzhku-iniciativy-posle-",
        "title": "Планы на развитие и поддержку инициативы после окончания финансирования",
        "level": 3
      },
      {
        "anchor": "podtverzhdenie-adekvatnoy-ocenki-riskov-i-strate",
        "title": "Подтверждение адекватной оценки рисков и стратегии их минимизации",
        "level": 3
      },
      {
        "anchor": "podvedem-itogi-8",
        "title": "Подведём итоги",
        "level": 2
      },
      {
        "anchor": "prakticheskoe-zadanie-dlya-predstaviteley-nko-5",
        "title": "Практическое задание для представителей НКО",
        "level": 3
      },
      {
        "anchor": "zaklyuchenie",
        "title": "Заключение",
        "level": 2
      }
    ]
  }
];

/** Ленивая загрузка блоков модуля — отдельный чанк на модуль. */
export const moduleLoaders: Record<string, () => Promise<{ blocks: SourceBlock[] }>> = {
  m1: () => import("./source/m1.generated"),
  m2: () => import("./source/m2.generated"),
  m3: () => import("./source/m3.generated"),
  m4: () => import("./source/m4.generated"),
  m5: () => import("./source/m5.generated"),
  m6: () => import("./source/m6.generated"),
};
