import type { PageOutline } from "./pageOutline";
import type { QuestionGroup } from "./questionGroups";

// КАРТА СТРАНИЦ САЙТА: страница → секции источника (по якорям H2).
//
// «Основы» (М1–4) сгенерированы скриптом из заголовков. Треки «Для компаний»
// (М5) и «Для НКО» (М6) добавлены тем же приёмом, но разложены руками: там
// страницы уже были названы в меню, и секции разносились по ним по смыслу.
//
// Только ВЫБОР секций, без правок текста. Исключены строительные леса курса:
// заголовки «Модуль N», «Введение», «Заключение», дубли-оглавления в начале
// модуля и служебное «Остались вопросы или пожелания?». «Подведём итоги»
// переносится как есть — это содержательная сводка.

/*
  intro — секция источника, которая идёт ВСТУПЛЕНИЕМ: над списком «вы узнаете»,
  без своего заголовка и без пункта в оглавлении. Так «Введение» модуля попадает
  на страницу текстом, а не разделом наравне с материалом.

  outline — перекройка: страница сама называет свои разделы, не спрашивая, каким
  уровнем заголовок оформлен в источнике (см. pageOutline.ts). Нужна там, где
  курс сложил в один ряд темы и врезки с цитатами. Без неё страница собирается
  по-старому: раздел = секция источника.
*/
export type OsnovyPage = {
  slug: string;
  title: string;
  module: string;
  sections: string[];
  intro?: string;
  outline?: PageOutline;
  /*
    questions — деление длинного списка вопросов на разделы по темам (см.
    questionGroups.ts). Нужно там, где страница целиком состоит из аккордеона:
    заголовков внутри него нет, и навигации не за что зацепиться.
  */
  questions?: QuestionGroup[];
  /*
    noToc — якоря заголовков, которых не должно быть в оглавлении. Уровень у них
    остаётся свой: прятать заголовок понижением уровня нельзя, это ломает
    структуру документа. Для страниц с перекройкой ту же роль играет inline.
  */
  noToc?: string[];
};

export const OSNOVY_PAGES: OsnovyPage[] = [
  {
    slug: "/general/start",
    title: "Реалии и мифы",
    module: "m1",
    intro: "vvedenie",
    sections: [
      "chto-takoe-invalidnost-medicinskiy-i-socialnyy-p",
      "kto-takie-soiskateli-s-invalidnostyu",
      "osobennosti-raznyh-form-invalidnosti",
      "vrozhdennaya-i-priobretennaya-invalidnost-pochem",
      "komu-nuzhna-pomosch-v-poiske-raboty",
      "mify-ob-inklyuzivnom-trudoustroystve",
      "chto-govoryat-lyudi-s-invalidnostyu-i-nko",
      "zachem-vnedryat-inklyuzivnoe-trudoustroystvo",
      "chto-govoryat-biznes-i-nko",
      "kak-vystroit-ustoychivye-processy",
      "chem-trudoustroystvo-lyudey-s-invalidnostyu-otli",
      "podvedem-itogi",
    ],
    outline: {
      sections: [
        "chto-takoe-invalidnost-medicinskiy-i-socialnyy-p",
        "kto-takie-soiskateli-s-invalidnostyu",
        "osobennosti-raznyh-form-invalidnosti",
        "vrozhdennaya-i-priobretennaya-invalidnost-pochem",
        "komu-nuzhna-pomosch-v-poiske-raboty",
        "mify-ob-inklyuzivnom-trudoustroystve",
        "zachem-vnedryat-inklyuzivnoe-trudoustroystvo",
        "kak-vystroit-ustoychivye-processy",
        "chem-trudoustroystvo-lyudey-s-invalidnostyu-otli",
        "podvedem-itogi",
      ],
      inline: [
        "chto-govoryat-lyudi-s-invalidnostyu-i-nko",
        "chto-govoryat-biznes-i-nko",
      ],
    },
  },
  {
    slug: "/general/how",
    title: "Как устроен наём",
    module: "m4",
    sections: [
      "uchastniki-inklyuzivnogo-trudoustroystva-i-ih-ro",
      "scenarii-poiska-raboty",
      "gde-iskat-kandidatov-s-invalidnostyu",
      "pryamoy-poisk-i-netvorking",
      "chto-govorit-biznes",
      "vzaimodeystvie-rabotodateley-i-nko-kto-za-chto-o",
      "kak-vystroit-partnerskie-otnosheniya-mezhdu-rabo",
      "chto-govorit-biznes-i-nko",
      "chto-delat-esli-sotrudnichestvo-nko-i-rabotodate",
      "podvedem-itogi",
    ],
    outline: {
      sections: [
        "uchastniki-inklyuzivnogo-trudoustroystva-i-ih-ro",
        "scenarii-poiska-raboty",
        "gde-iskat-kandidatov-s-invalidnostyu",
        "vzaimodeystvie-rabotodateley-i-nko-kto-za-chto-o",
        "kak-vystroit-partnerskie-otnosheniya-mezhdu-rabo",
        "chto-delat-esli-sotrudnichestvo-nko-i-rabotodate",
        "podvedem-itogi",
      ],
      inline: ["chto-govorit-biznes", "chto-govorit-biznes-i-nko"],
    },
  },
  {
    slug: "/general/legal",
    title: "Правовые основы",
    module: "m2",
    sections: ["podvedem-itogi", "poleznye-dokumenty"],
  },
  {
    slug: "/general/legal/contract",
    title: "Договор и оформление",
    module: "m2",
    sections: [
      "kak-oformit-sotrudnika-s-invalidnostyu-po-trudov",
      "spravka-ob-invalidnosti",
      "individualnaya-programma-reabilitacii-i-abilitac",
      "kak-propisat-usloviya-truda-v-trudovom-dogovore",
    ],
  },
  {
    slug: "/general/legal/benefits",
    title: "Льготы и формы занятости",
    module: "m2",
    sections: [
      "kakie-lgoty-polozheny-sotrudnikam-s-invalidnosty",
      "sohranyatsya-li-posobiya-i-lgoty-pri-trudoustroy",
      "dopolnitelnye-formaty-zanyatosti",
      "dogovor-grazhdansko-pravovogo-haraktera-gph",
      "samozanyatost",
    ],
    outline: {
      sections: [
        "kakie-lgoty-polozheny-sotrudnikam-s-invalidnosty",
        "sohranyatsya-li-posobiya-i-lgoty-pri-trudoustroy",
        "dopolnitelnye-formaty-zanyatosti",
      ],
    },
  },
  {
    slug: "/general/legal/quotas",
    title: "Квоты и господдержка",
    module: "m2",
    /*
      Четыре меры поддержки («Компенсация расходов на оснащение рабочего места»
      и далее) в карте не перечислены намеренно. В источнике это были секции, но
      разметка собрала их в свёрнутые блоки внутри раздела про господдержку:
      заголовков не осталось, а значит не осталось и секций. Записи в карте
      указывали в пустоту, сборка их молча пропускала.
    */
    sections: [
      "chto-takoe-kvoty-i-kak-ih-vypolnit",
      "kak-vypolnit-kvotu",
      "kak-i-kuda-podavat-otchetnost",
      "chto-proishodit-esli-kvota-ne-vypolnena",
      "na-kakie-subsidii-i-mery-gospodderzhki-mogut-ras",
    ],
    outline: {
      sections: [
        "chto-takoe-kvoty-i-kak-ih-vypolnit",
        "kak-vypolnit-kvotu",
        "kak-i-kuda-podavat-otchetnost",
        "chto-proishodit-esli-kvota-ne-vypolnena",
        "na-kakie-subsidii-i-mery-gospodderzhki-mogut-ras",
      ],
      // Промежуточный «Подведём итог» внутри господдержки: на странице итог уже
      // есть, общий и в конце. Текст под заголовком остаётся на месте.
      drop: ["podvedem-itog"],
    },
  },
  {
    slug: "/general/legal/status",
    title: "Особые ситуации",
    module: "m2",
    sections: [
      "mozhet-li-rabotat-chelovek-so-statusom-nedeespos",
      "mozhno-li-uvolit-sotrudnika-s-invalidnostyu",
    ],
  },
  {
    /*
      Секции «Проверьте себя» здесь нет намеренно: все восемь квизов разъехались
      по страницам своих тем (см. quizzes.ts). От неё оставалась бы одна вводная
      фраза про тест.

      Четырнадцать вопросов подряд неудобно листать, а делить их в источнике
      нечем: там сплошной список. Поэтому страница делит их сама — пятью своими
      заголовками, по темам. Вопросы под ними остаются подзаголовками и в
      оглавлении показываются внутри своей группы.
    */
    slug: "/general/legal/faq",
    title: "Вопросы и ответы",
    module: "m2",
    sections: ["voprosy-i-otvety"],
    questions: [
      {
        title: "Документы об инвалидности",
        anchor: "voprosy-dokumenty",
        from: "Может ли сотрудник не сообщать",
      },
      {
        title: "Рабочее время и льготы",
        anchor: "voprosy-rezhim-i-lgoty",
        from: "Сотрудник с инвалидностью I группы дал письменное согласие",
      },
      {
        title: "Квоты и выплаты",
        anchor: "voprosy-kvoty-i-vyplaty",
        from: "Как работодатель может выполнить квоту",
      },
      {
        title: "Увольнение и особые ситуации",
        anchor: "voprosy-uvolnenie",
        from: "Можно ли уволить сотрудника с инвалидностью",
      },
      {
        title: "Договор ГПХ и самозанятость",
        anchor: "voprosy-gph-i-samozanyatost",
        from: "Чем договор ГПХ отличается",
      },
    ],
  },
  /*
    Секции «Что говорят компании и НКО» здесь нет намеренно: в источнике под её
    заголовком лежат только ряд косых черт (авторская пометка) и список «в этом
    модуле вы узнаете», который дизайнер удалил директивой. На сайте роль этого
    списка играет блок «На этой странице вы узнаете», так что показывать было
    нечего — оставался заголовок с косыми чертами.
  */
  {
    slug: "/general/team",
    title: "Команда и коммуникация",
    module: "m3",
    sections: [
      "kak-govorit-o-lyudyah-s-invalidnostyu",
      "vyberite-kakie-slova-i-formulirovki-dopustimo-is",
      "kak-obschatsya-s-lyudmi-s-invalidnostyu",
      "osobennosti-obscheniya-s-lyudmi-s-raznymi-formam",
      "chto-govoryat-sotrudniki-s-invalidnostyu",
      "kak-podgotovit-i-provesti-meropriyatie-s-uchasti",
      "podvedem-itogi",
    ],
    outline: {
      sections: [
        "kak-govorit-o-lyudyah-s-invalidnostyu",
        "kak-obschatsya-s-lyudmi-s-invalidnostyu",
        "osobennosti-obscheniya-s-lyudmi-s-raznymi-formam",
        "kak-podgotovit-i-provesti-meropriyatie-s-uchasti",
        "podvedem-itogi",
      ],
      inline: ["chto-govoryat-sotrudniki-s-invalidnostyu"],
    },
  },

  // ── Для компаний: наём по шагам (М5) ────────────────────────────────────
  {
    slug: "/companies/hire/step-1",
    title: "Шаг 1. Выбор вакансии",
    module: "m5-1",
    sections: [
      "shag-1-vybor-vakansii-dlya-inklyuzivnogo-nayma",
      "podvedem-itogi",
    ],
    outline: {
      sections: [
        "opredelite-tsel-inklyuzivnogo-nayma",
        "sostavte-spisok-potentsialnyh-vakansiy",
        "sravnite-vakansii-mezhdu-soboy-i-vyberite-pozits",
        "vypishite-funktsional-vakansii",
        "otsenite-bezopasnost-vakansii-vmeste-so-spetsial",
        "sostavte-itogovyy-spisok-zadach-novogo-sotrudnik",
        "podvedem-itogi",
      ],
    },
  },
  {
    slug: "/companies/hire/step-2",
    title: "Шаг 2. Аудит готовности",
    module: "m5-1",
    sections: [
      "shag-2-vnutrenniy-audit-rabochey-sredy-processov",
      "tipichnye-oshibki-rabotodateley-pri-provedenii-a",
      "podvedem-itogi-2",
    ],
    outline: {
      sections: [
        "uchastniki-audita",
        "chto-vazhno-proverit-vo-vremya-audita",
        "kak-sostavit-tehnicheskoe-zadanie-na-audit",
        "tipichnye-oshibki-rabotodateley-pri-provedenii-a",
        "podvedem-itogi-2",
      ],
    },
  },
  /*
    Шаг 3 собран перекройкой (outline). В источнике весь шаг — одна секция-глава,
    внутри которой темы лежат третьим уровнем, а шесть врезок с цитатами стоят
    вторым и потому становились разделами наравне с материалом. Здесь разделами
    названы четыре темы шага, итог и задание, а голоса разжалованы во врезки.
  */
  {
    slug: "/companies/hire/step-3",
    title: "Шаг 3. Создание среды",
    module: "m5-2",
    sections: [
      "shag-3-sozdanie-inklyuzivnoy-sredy",
      "chto-govorit-biznes-2",
      "chto-govoryat-lyudi-s-invalidnostyu",
      "chto-govoryat-lyudi-s-invalidnostyu-2",
      "chto-govoryat-lyudi-s-invalidnostyu-3",
      "chto-govorit-biznes-3",
      "chto-govorit-biznes-4",
    ],
    outline: {
      sections: [
        "chto-takoe-razumnaya-adaptaciya",
        "kak-adaptirovat-fizicheskuyu-sredu",
        "kak-adaptirovat-materialy-cifrovye-servisy-i-rab",
        "kak-podgotovit-rukovoditelya-komandu-i-kolleg-k",
        "podvedem-itogi-6",
        "prakticheskoe-zadanie-dlya-rabotodateley-3",
      ],
      inline: [
        "chto-govorit-biznes-2",
        "chto-govoryat-lyudi-s-invalidnostyu",
        "chto-govoryat-lyudi-s-invalidnostyu-2",
        "chto-govoryat-lyudi-s-invalidnostyu-3",
        "chto-govorit-biznes-3",
        "chto-govorit-biznes-4",
      ],
    },
  },
  {
    slug: "/companies/hire/step-4",
    title: "Шаг 4. Поиск и оформление",
    module: "m5-2",
    sections: [
      "shag-4-poisk-kandidatov-provedenie-sobesedovaniy",
      "kak-sostavit-vakansiyu-i-gde-nayti-kandidatov-s-",
      "kak-sostavit-opisanie-vakansii",
      "prakticheskoe-zadanie",
      "kak-sostavit-opisanie-vakansii-2",
      "gde-iskat-kandidatov-s-invalidnostyu",
      "kak-podgotovit-i-provesti-sobesedovanie-s-kandid",
      "chto-govorit-biznes-5",
      "proforientacionnaya-ekskursiya",
      "oformlenie-sotrudnikov-s-invalidnostyu",
      "podvedem-itogi-3",
      "prakticheskoe-zadanie-dlya-rabotodateley",
    ],
    outline: {
      sections: [
        "kak-sostavit-opisanie-vakansii",
        "prakticheskoe-zadanie",
        "kak-sostavit-opisanie-vakansii-2",
        /*
          Строка появилась из абзаца («Мы переделали описание вакансии…» →
          разметка Heading + наша правка текста), поэтому якорь считается из
          нового текста. Раздел нужен, чтобы два готовых описания вакансии не
          читались как ещё одно правило написания вакансии.
        */
        "primery-vakansiy",
        "gde-iskat-kandidatov-s-invalidnostyu",
        "kak-podgotovit-i-provesti-sobesedovanie-s-kandid",
        "oformlenie-sotrudnikov-s-invalidnostyu",
        "podvedem-itogi-3",
        "prakticheskoe-zadanie-dlya-rabotodateley",
      ],
      inline: ["chto-govorit-biznes-5"],
    },
  },
  {
    slug: "/companies/hire/step-5",
    title: "Шаг 5. Онбординг",
    module: "m5-3",
    sections: [
      "shag-5-onbording-i-soprovozhdenie-sotrudnika-s-i",
      "pochemu-adaptaciya-vazhna-dlya-novichkov",
      "pochemu-adaptaciya-vazhna-dlya-sotrudnikov-s-pri",
      "kto-mozhet-pomoch-adaptirovatsya-sotrudniku-s-in",
      "chto-govoryat-lyudi-s-invalidnostyu-4",
      "chto-delat-esli-adaptaciya-idet-ne-po-planu",
      "chto-govorit-biznes-6",
      "podvedem-itogi-4",
      "prakticheskoe-zadanie-dlya-rabotodatelya",
    ],
    outline: {
      sections: [
        "pochemu-adaptaciya-vazhna-dlya-novichkov",
        "pochemu-adaptaciya-vazhna-dlya-sotrudnikov-s-pri",
        "kto-mozhet-pomoch-adaptirovatsya-sotrudniku-s-in",
        "kak-nastroit-rabochie-processy",
        "chto-delat-esli-adaptaciya-idet-ne-po-planu",
        "podvedem-itogi-4",
        "prakticheskoe-zadanie-dlya-rabotodatelya",
      ],
      inline: [
        "chto-govoryat-lyudi-s-invalidnostyu-4",
        "chto-govorit-biznes-6",
      ],
    },
  },
  {
    slug: "/companies/hire/step-6",
    title: "Шаг 6. Затраты",
    module: "m5-3",
    sections: [
      "shag-6-kakie-zatraty-zhdut-kompaniyu-pervonachal",
      "kakie-pervonachalnye-zatraty-mogut-vozniknut-i-k",
      "kakie-regulyarnye-rashody-nuzhno-uchityvat-i-moz",
      "podvedem-itogi-5",
      "prakticheskoe-zadanie-dlya-rabotodateley-2",
    ],
    outline: {
      sections: [
        "kakie-pervonachalnye-zatraty-mogut-vozniknut-i-k",
        "kakie-regulyarnye-rashody-nuzhno-uchityvat-i-moz",
        "podvedem-itogi-5",
        "prakticheskoe-zadanie-dlya-rabotodateley-2",
      ],
    },
  },

  /*
    Для НКО: программа трудоустройства (М6).

    Модули 6.1–6.3 разрезаны на страницы по СВОИМ главам: в источнике это
    заголовки верхнего уровня, и они же оказались естественным швом. Без
    разреза выходили полотна на сто тысяч знаков — вчетверо больше самой
    длинной страницы «Основ».
  */
  {
    slug: "/ngo/start",
    title: "Запустить программу",
    module: "m6-1",
    sections: [
      "rol-nko-v-programmah-trudoustroystva-lyudey-s-in",
      "programma-trudoustroystva-v-nko",
      "etapy-raboty-nko",
      "pochemu-nko-vazhno-vystraivat-partnerskie-otnosh",
      "pochemu-dlya-nko-vazhen-inklyuzivnyy-podhod",
      "prakticheskoe-zadanie-dlya-predstaviteley-nko",
    ],
  },
  {
    slug: "/ngo/audience",
    title: "Аудитория программы",
    module: "m6-1",
    sections: [
      "analiz-auditorii-nko",
      "kak-ponyat-svoyu-tekuschuyu-auditoriyu-i-ne-pere",
      "kak-segmentirovat-auditoriyu-i-vydelit-ee-yadro",
      "s-kem-nachinat-rabotat",
      "rabota-s-vneshney-auditoriey",
      "pochemu-vazhno-zaranee-opredelit-obem-uslug",
      "gde-iskat-auditoriyu",
      "kanaly-prodvizheniya-programmy",
      "kak-ocenit-effektivnost-privlecheniya",
      "prakticheskoe-zadanie-dlya-predstaviteley-nko-2",
      "podvedem-itogi",
    ],
    outline: {
      sections: [
        "analiz-auditorii-nko",
        "kak-ponyat-svoyu-tekuschuyu-auditoriyu-i-ne-pere",
        "kak-segmentirovat-auditoriyu-i-vydelit-ee-yadro",
        "s-kem-nachinat-rabotat",
        "rabota-s-vneshney-auditoriey",
        "gde-iskat-auditoriyu",
        "kanaly-prodvizheniya-programmy",
        "prakticheskoe-zadanie-dlya-predstaviteley-nko-2",
        "podvedem-itogi",
      ],
    },
  },
  {
    slug: "/ngo/candidates",
    title: "Первичное интервью",
    module: "m6-2",
    sections: [
      "pervichnoe-intervyu-s-soiskatelem",
      "provedenie-pervichnogo-intervyu",
      "nachalo-razgovora",
      "sostavlenie-portreta-soiskatelya",
      "kak-zavershit-pervuyu-vstrechu",
      "podvedem-itog",
    ],
    outline: {
      sections: [
        "provedenie-pervichnogo-intervyu",
        "nachalo-razgovora",
        "sostavlenie-portreta-soiskatelya",
        "kak-zavershit-pervuyu-vstrechu",
        "podvedem-itog",
      ],
    },
  },
  {
    slug: "/ngo/candidates/guidance",
    title: "Профориентация",
    module: "m6-2",
    sections: [
      "proforientaciya-i-psihologicheskaya-podderzhka",
      "chto-takoe-proforientaciya-i-kogda-ona-nuzhna",
      "kogda-neobhodima-proforientaciya",
      "kak-provodit-proforientaciyu-poshagovyy-plan-dly",
      "osobennosti-proforientacii-lyudey-s-mentalnoy-in",
    ],
    outline: {
      sections: [
        "chto-takoe-proforientaciya-i-kogda-ona-nuzhna",
        "kak-provodit-proforientaciyu-poshagovyy-plan-dly",
        "osobennosti-proforientacii-lyudey-s-mentalnoy-in",
      ],
    },
  },
  {
    slug: "/ngo/candidates/psychology",
    title: "Психологическая поддержка",
    module: "m6-2",
    sections: [
      "psihologicheskaya-podderzhka-soiskatelya-s-inval",
      "kak-nko-mozhet-pomoch",
      "podvedem-itogi-2",
    ],
  },
  {
    slug: "/ngo/candidates/vacancies",
    title: "Подбор вакансий и собеседование",
    module: "m6-2",
    sections: [
      "podbor-vakansiy-i-podgotovka-k-sobesedovaniyu",
      "shag-1-opredelenie-prioritetov",
      "shag-2-poisk-vakansiy-na-podhodyaschih-ploschadk",
      "shag-3-pomosch-kandidatu-v-ponimanii-opisaniya-v",
      "shag-4-sostavlenie-ili-obnovlenie-rezyume",
      "shag-5-soglasovanie-resheniya-ob-otklike",
      "shag-6-podgotovka-k-sobesedovaniyu",
      "shag-7-provedenie-sobesedovaniya",
      "shag-8-posle-sobesedovaniya",
      "podvedem-itogi-3",
    ],
    outline: {
      sections: [
        "shag-1-opredelenie-prioritetov",
        "shag-2-poisk-vakansiy-na-podhodyaschih-ploschadk",
        "shag-3-pomosch-kandidatu-v-ponimanii-opisaniya-v",
        "shag-4-sostavlenie-ili-obnovlenie-rezyume",
        "shag-5-soglasovanie-resheniya-ob-otklike",
        "shag-6-podgotovka-k-sobesedovaniyu",
        "shag-7-provedenie-sobesedovaniya",
        "shag-8-posle-sobesedovaniya",
        "podvedem-itogi-3",
      ],
    },
  },
  {
    slug: "/ngo/employers",
    title: "Поиск работодателей",
    module: "m6-3",
    sections: ["poisk-rabotodateley", "kak-nayti-rabotodateley"],
    outline: {
      sections: [
        "zachem-nko-iskat-rabotodateley-zaranee",
        "kak-nayti-rabotodateley",
        "podvedem-itogi-4",
      ],
      inline: ["chto-govoryat-nko"],
    },
  },
  {
    slug: "/ngo/employers/talks",
    title: "Разговор с работодателем",
    module: "m6-3",
    sections: [
      "vzaimodeystvie-s-rabotodatelyami",
      "kak-podgotovitsya-k-razgovoru-s-rabotodatelem",
      "pervoe-obschenie-s-rabotodatelem",
      "kakie-formaty-sotrudnichestva-mogut-byt",
      "kak-predstavit-kandidata-s-invalidnostyu-rabotod",
      "kak-otvechat-na-vozrazheniya-rabotodatelya",
      "posle-vstrechi-s-rabotodatelem",
      "rabotodatel-ne-otvechaet-posle-vstrechi-chto-del",
      "chto-delat-esli-vam-otkazali",
      "podvedem-itogi-5",
    ],
    outline: {
      sections: [
        "kak-podgotovitsya-k-razgovoru-s-rabotodatelem",
        "pervoe-obschenie-s-rabotodatelem",
        "kakie-formaty-sotrudnichestva-mogut-byt",
        "kak-predstavit-kandidata-s-invalidnostyu-rabotod",
        "kak-otvechat-na-vozrazheniya-rabotodatelya",
        "posle-vstrechi-s-rabotodatelem",
        "chto-delat-esli-vam-otkazali",
        "podvedem-itogi-5",
      ],
    },
  },
  {
    slug: "/ngo/support",
    title: "Сопровождать сотрудника",
    module: "m6-4",
    sections: [
      "soprovozhdenie-na-etape-trudoustroystva",
      "dva-formata-soprovozhdeniya",
      "chto-dalshe-krizis-menedzhment-na-rabochem-meste",
      "podvedem-itog-2",
      "dorozhnaya-karta",
      "podvedem-itogi-6",
    ],
    outline: {
      sections: [
        "dva-formata-soprovozhdeniya",
        "shag-1-proyti-medkomissiyu",
        "shag-2-oformlenie-dogovora",
        "shag-3-vyhod-na-rabotu-soprovozhdenie-v-pervye-n",
        "chto-dalshe-krizis-menedzhment-na-rabochem-meste",
        "dorozhnaya-karta",
        "podvedem-itogi-6",
      ],
    },
  },
  {
    slug: "/ngo/scale",
    title: "Развивать и масштабировать",
    module: "m6-4",
    sections: [
      "masshtabirovanie-i-ustoychivost-kak-vyrasti-ne-t",
      "kak-podelitsya-svoey-ekspertizoy",
      "podvedem-itogi-7",
    ],
    /*
      «Анализ новой территории» и «Выбор формата работы» подняты в разделы.
      Раньше они лежали внутри «Масштабирования географии», и девять их подтем
      («Оценка аудитории», «Онлайн-сопровождение» и другие) проваливались на
      уровень, где заголовок совпадает с обычным текстом по размеру и отличается
      только жирностью. В навигацию они тоже не попадали: туда идут два верхних
      уровня. Теперь подтемы поднялись на ступень и стали видны и глазом, и в
      оглавлении.
    */
    outline: {
      sections: [
        "masshtabirovanie-geografii-deyatelnosti",
        "analiz-novoy-territorii",
        "vybor-formata-raboty",
        "rabota-s-drugoy-formoy-invalidnosti",
        "kak-podelitsya-svoey-ekspertizoy",
        "podvedem-itogi-7",
      ],
    },
  },
  {
    slug: "/ngo/funding",
    title: "Финансировать программу",
    module: "m6-4",
    sections: [
      "zatraty-i-finansirovanie-kak-sdelat-proekt-ustoy",
      "podvedem-itogi-8",
    ],
    outline: {
      sections: [
        "iz-chego-skladyvaetsya-byudzhet-proekta-inklyuzi",
        "chto-uchest-pri-napisanii-zayavki-na-grant",
        "struktura-zayavki",
        "podvedem-itogi-8",
      ],
    },
  },
];

export const pageBySlug = (slug: string): OsnovyPage | undefined =>
  OSNOVY_PAGES.find((p) => p.slug === slug);

/*
  НОМЕР ШАГА В ЗАГОЛОВКЕ. В курсе шесть шагов найма были секциями одного модуля,
  и номер в заголовке отличал их друг от друга. На сайте каждый шаг стал
  отдельной страницей: номер уже стоит в меню слева и в шапке страницы, поэтому
  в самом заголовке он третий по счёту — читатель видит «Шаг 2» трижды подряд.

  Снимаем префикс ТОЛЬКО у заглавной секции страницы, которая сама называется
  «Шаг N. …» (шесть страниц трека «Для компаний»). Восемь шагов подбора вакансий
  у НКО живут на одной странице — там нумерация единственный признак
  последовательности, и её мы не трогаем.
*/
const STEP_TITLE_ANCHORS = new Set(
  OSNOVY_PAGES.filter((p) => /^Шаг\s+\d+\./u.test(p.title)).map(
    (p) => p.sections[0],
  ),
);

/** Заголовок H2 заглавной секции шага — без ведущего «Шаг N.». */
export function dropStepNumber(
  type: string,
  md: string,
  anchor?: string,
): string {
  if (type !== "h2" || !anchor || !STEP_TITLE_ANCHORS.has(anchor)) return md;
  const out = md.replace(/^\s*Шаг\s+\d+\s*(?:[.)]|—|–|-|:)?\s+/u, "");
  return out.trim() ? out : md;
}

/*
  ХАБЫ ТРЕКОВ — «Для компаний» (/companies) и «Для НКО» (/ngo).

  Их содержимое собрано руками: это навигация по треку, а не материал источника.
  Поэтому в OSNOVY_PAGES их нет и в общую выгрузку они не идут. Но инструмент
  сверки им нужен такой же, как остальным страницам, — иначе при переходе на хаб
  интерфейс просто исчезал. Здесь описано, чем наполнить левую колонку: секция
  «Введение» того модуля, из которого хаб и написан.
*/
export const HUB_PAGES: OsnovyPage[] = [
  {
    slug: "/companies",
    title: "Для компаний",
    module: "m5-1",
    sections: ["vvedenie"],
  },
  { slug: "/ngo", title: "Для НКО", module: "m6-1", sections: ["vvedenie"] },
];

export const hubBySlug = (slug: string): OsnovyPage | undefined =>
  HUB_PAGES.find((p) => p.slug === slug);
