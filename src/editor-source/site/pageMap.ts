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
  /*
    Рассказ о самом сайте: кто его сделал, кому он полезен и что где лежит.
    В источнике это начало первого модуля («О гиде», «Кому будет полезно», «Как
    устроен гид») — на сайт оно не переносилось вовсе, хотя читателю нужно
    раньше всего остального. Поэтому страница стоит первой в «Основах».

    Заголовок «О гиде» снимается перекройкой: он повторял бы название страницы.
    Слова про гид и модули меняет раскурсовка (см. decourse.ts) — предложения
    остаются авторскими, меняются только самоназвания курса.
  */
  {
    slug: "/general/about",
    title: "О проекте",
    module: "m1",
    /*
      РАЗДЕЛА «КАК УСТРОЕН САЙТ» ЗДЕСЬ БОЛЬШЕ НЕТ — замечание клиента 7 августа
      2026. Он пересказывал меню: перечислял разделы «Основ» и обоих треков и
      обещал, что читатель в них найдёт. Всё это стоит слева в навигации, и на
      входной странице повторялось третий раз подряд.

      Убран целиком, вместе с заголовком: клиент отдельно попросил снять строку
      «Как устроен сайт» из оглавления справа, а оглавление собирается из этого
      же списка.
    */
    sections: ["o-gide"],
    outline: {
      sections: ["komu-budet-polezno"],
    },
  },
  {
    slug: "/general/start",
    title: "Инклюзивное трудоустройство",
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
      /*
        Оба заголовка «Что говорят…» сняты со страницы совсем — замечание
        клиента 7 августа 2026 («убираем этот заголовок»). Раньше они стояли
        врезками: текст оставался на месте, а из оглавления заголовок был
        спрятан. Клиент попросил убрать и саму строку: голоса продолжают
        предыдущую мысль, и объявлять их отдельно незачем.

        Сами цитаты и текст под заголовками остаются — уходят только строки
        «Что говорят люди с инвалидностью и НКО» и «Что говорят бизнес и НКО».
      */
      drop: [
        "chto-govoryat-lyudi-s-invalidnostyu-i-nko",
        "chto-govoryat-biznes-i-nko",
      ],
    },
  },
  /*
    Страницы «Правовые основы» больше нет (решение дизайнера 5 августа 2026).
    На ней лежали только два куска, и оба нашли себе место по смыслу: итог про
    форматы занятости со сравнительной таблицей переехал на «Льготы и формы
    занятости», а список нормативных актов стал страницей «Полезные документы».
    Меню раздела стало одноуровневым, а адрес /general/legal ведёт на первую
    правовую страницу — так живы восемь ссылок из текста.
  */
  {
    /*
      Сюда переехали «Особые ситуации» и «Вопросы и ответы» — правка клиента от
      5 августа 2026. Обе страницы продолжали одну тему: как оформить сотрудника
      и что делать в нестандартных случаях. Отдельными пунктами меню они дробили
      правовой раздел, а вместе читаются одной страницей.

      Деление четырнадцати вопросов на пять тем приехало вместе с ними (questions
      ниже): без него в оглавлении был бы список из четырнадцати строк подряд.
    */
    slug: "/general/legal/contract",
    title: "Договор и оформление",
    module: "m2",
    /*
      ВСТУПЛЕНИЕ — начало правового модуля: почему мы говорим «человек с
      инвалидностью», какими тремя способами он может работать и почему бояться
      оформления не стоит. Замечание Юли от 6 августа 2026: «в модуле 2 вводная
      часть не попала никуда (4 абзаца), она нам нужна ДО этого заголовка».

      Так и было: страница начиналась сразу с «Как оформить сотрудника…», а
      четыре абзаца перед ним не доезжали ни до одной страницы — секцию «Модуль
      2» карта не брала.

      Заголовок секции снимается сам (см. introNodes): «Модуль 2. Документы,
      льготы и квоты» на сайте не значит ничего, название страницы стоит выше.

      Якорь БЕЗ хвостового дефиса. В источнике он записан как
      «…pravovye-osnovy-»: генератор режет якорь по длине и обрубает его прямо на
      дефисе. Дерево страницы этот дефис снимает (anchorSlug), и карта должна
      называть секцию так, как её зовут в дереве, иначе вступление молча не
      находится — страница просто начинается с первого раздела, и понять почему
      неоткуда.
    */
    intro: "modul-2-dokumenty-lgoty-i-kvoty-pravovye-osnovy",
    sections: [
      "kak-oformit-sotrudnika-s-invalidnostyu-po-trudov",
      "spravka-ob-invalidnosti",
      "individualnaya-programma-reabilitacii-i-abilitac",
      "kak-propisat-usloviya-truda-v-trudovom-dogovore",
      "mozhet-li-rabotat-chelovek-so-statusom-nedeespos",
      "mozhno-li-uvolit-sotrudnika-s-invalidnostyu",
    ],
    /*
      Секции «Вопросы и ответы» в списке выше БОЛЬШЕ НЕТ. Вопросы приходят на
      страницу поимённо (questions ниже) — так же, как квизы: в источнике они
      лежат кучей, а на сайте разданы по темам.

      Здесь остались документы и увольнение. Остальные девять вопросов уехали на
      «Льготы сотрудников», «Квоты и господдержку» и «Форматы занятости» —
      замечания Юли от 6 августа 2026. Группы «Квоты и выплаты» на странице
      больше нет: оба её вопроса уехали, и заголовок остался бы ни над чем.
    */
    questions: [
      {
        title: "Документы об инвалидности",
        anchor: "voprosy-dokumenty",
        questions: [
          "Может ли сотрудник не сообщать",
          "Обязан ли работодатель запрашивать",
        ],
      },
      {
        title: "Увольнение и особые ситуации",
        anchor: "voprosy-uvolnenie",
        questions: [
          "Можно ли уволить сотрудника с инвалидностью",
          "Может ли человек, признанный судом недееспособным",
        ],
      },
    ],
  },
  {
    slug: "/general/legal/benefits",
    title: "Льготы сотрудников",
    module: "m2",
    /*
      Форматы занятости уехали отдельной страницей — правка клиента 5 августа
      2026. Здесь осталось то, что положено сотруднику по трудовому договору:
      сами льготы и судьба пособий при трудоустройстве.
    */
    sections: [
      "kakie-lgoty-polozheny-sotrudnikam-s-invalidnosty",
      "sohranyatsya-li-posobiya-i-lgoty-pri-trudoustroy",
    ],
    /*
      Четыре вопроса приехали с общей страницы вопросов — замечания Юли от
      6 августа 2026: «вопросы про рабочее время и льготы уносим отсюда в раздел
      Льготы» и «уносим отсюда этот вопрос в раздел Льготы» про пенсию.

      В источнике они не подряд: между пятым и седьмым стоит вопрос про квоту, и
      он уехал на «Квоты и господдержку». Поэтому группа называет свои вопросы
      поимённо (см. questionGroups.ts).
    */
    questions: [
      {
        title: "Вопросы и ответы",
        anchor: "voprosy-i-otvety",
        questions: [
          "Сотрудник с инвалидностью I группы дал письменное согласие",
          "Какие льготы положены сотруднику с инвалидностью",
          "Может ли сотрудник с инвалидностью III группы",
          "Сохраняются ли пенсия по инвалидности и льготы при трудоустройстве",
        ],
      },
    ],
    /*
      «Проверьте себя» здесь не отдельный раздел, а подзаголовок внутри раздела
      про сами льготы — замечание Юли от 7 августа 2026 (см. QUIZ_INSIDE в
      quizzes.ts). В оглавлении справа ему не место: раздел там уже назван, а
      строка под ним вела бы на то же самое.
    */
    noToc: ["proverte-sebya"],
  },
  {
    /*
      «Форматы занятости» — отдельный пункт меню по просьбе клиента. Раньше это
      была вторая половина страницы про льготы, и одна страница отвечала сразу
      на два разных вопроса: что человеку положено и как его оформить.

      Заголовок «Подведём итоги» снят перекройкой, а три его части стали
      разделами: на этой странице это не итог, а сравнение форматов. Разделом
      «Как выбрать подходящий формат» страница и заканчивается — в нём таблица.
    */
    slug: "/general/legal/formats",
    title: "Форматы занятости",
    module: "m2",
    sections: [
      "dopolnitelnye-formaty-zanyatosti",
      "dogovor-grazhdansko-pravovogo-haraktera-gph",
      "samozanyatost",
      "podvedem-itogi",
    ],
    outline: {
      sections: [
        "dopolnitelnye-formaty-zanyatosti",
        "trudovoy-dogovor-kogda-eto-horoshiy-variant",
        "gph-i-samozanyatost-osnovnye-preimuschestva",
        "kak-vybrat-podhodyaschiy-format",
      ],
      drop: ["podvedem-itogi"],
    },
    /*
      Пять вопросов приехали с общей страницы вопросов — замечание Юли от
      6 августа 2026: «уносим отсюда вопросы по ГПХ и самозанятости в раздел
      Формы занятости». Вся тема этих вопросов — ровно то, чему посвящена
      страница.

      Страница перекроена картой (outline выше) и при этом забирает вопросы: до
      6 августа так было нельзя, вопросы отменяли перекройку. Теперь раздача
      вопросов добавляет раздел, а не перекраивает страницу (см. pageParts).
    */
    questions: [
      {
        title: "Вопросы и ответы",
        anchor: "voprosy-i-otvety",
        questions: [
          "Чем договор ГПХ отличается",
          "Как зарегистрироваться в качестве самозанятого",
          "Сохраняются ли пенсия по инвалидности и льготы при самозанятости",
          "Что произойдёт, если человек получает пособие по безработице",
          "Можно ли совмещать самозанятость с работой",
        ],
      },
    ],
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
    /*
      Вопрос про выполнение квоты приехал с общей страницы вопросов — замечание
      Юли от 6 августа 2026: «уносим отсюда этот вопрос в раздел "Квоты и
      господдержка"». Внутри вопроса разобраны оба способа, прямое
      трудоустройство и альтернативное квотирование, — они переезжают вместе с
      ним.
    */
    questions: [
      {
        title: "Вопросы и ответы",
        anchor: "voprosy-i-otvety",
        questions: ["Как работодатель может выполнить квоту"],
      },
    ],
  },
  {
    slug: "/general/team",
    title: "Этика и коммуникация",
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
      /*
        Заголовок «Что говорят люди с инвалидностью» снят со страницы совсем —
        замечание Юли от 7 августа 2026 («убрать заголовок»). Раньше он стоял
        врезкой: текст оставался, а из оглавления заголовок был спрятан. Клиент
        попросила убрать и саму строку — три рассказа под ней продолжают раздел
        про особенности общения, и объявлять их отдельно незачем.

        Сами рассказы остаются на месте, уходит только строка. Так же сделано с
        двумя такими же заголовками на «Инклюзивном трудоустройстве».
      */
      drop: ["chto-govoryat-sotrudniki-s-invalidnostyu"],
    },
  },
  {
    slug: "/general/how",
    title: "Как устроен наём",
    module: "m4",
    /*
      ВСТУПЛЕНИЕ — начало модуля про наём: с какими одинаковыми вопросами
      сталкиваются компания и НКО, почему инклюзивный наём редко работает в
      одиночку и что даёт совместная работа сторон. Замечание Юли от 7 августа
      2026: «в модуле 4 пропал заголовок, а он нам нужен, надо вернуть».

      Так и было: страница начиналась сразу с «Участники инклюзивного
      трудоустройства и их роли», а вся первая секция модуля не доезжала ни до
      одной страницы сайта — карта её не брала.

      Заголовок секции снимается сам (см. introNodes): «Модуль 4. Как работает
      инклюзивный наём: от поиска до партнёрства» на сайте не значит ничего,
      название страницы стоит выше. Список «В этом модуле вы узнаете» не
      возвращается: он снят разметкой, как и на всех остальных страницах.
    */
    intro: "modul-4-kak-rabotaet-inklyuzivnyy-naem-ot-poiska",
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
      /*
        Оба заголовка «Что говорят…» сняты со страницы совсем — замечания Юли от
        7 августа 2026: «убираем строку» на первом и «убрать строку» на втором.
        Раньше они стояли врезками: строка оставалась на месте, а из оглавления
        была спрятана. Клиент попросила убрать и саму строку — то же решение и
        теми же словами, что на «Инклюзивном трудоустройстве».

        Уходит ТОЛЬКО заголовок. Подводка и цитаты остаются и дочитывают свой
        раздел: тройка голосов — «Где искать кандидатов с инвалидностью», пара —
        «Как выстроить партнёрские отношения между работодателем и НКО».

        Якоря остаются в sections выше: там перечислено, какие секции источника
        вообще берутся на страницу. Убрать их оттуда — значит потерять вместе с
        заголовком и сами голоса.
      */
      drop: ["chto-govorit-biznes", "chto-govorit-biznes-i-nko"],
      /*
        «Как это работает на практике» и три этапа сопровождения под ним («До
        выхода на работу», «В первые дни работы», «Во время адаптации и работы»)
        в источнике стоят одним и тем же уровнем, хотя этапы — это ответ на
        вопрос, который задаёт первый заголовок. Замечание Юли от 7 августа 2026
        («заголовком») с её же примечанием: «надо тогда понизить следующие
        заголовки для сохранения иерархии».
      */
      nest: ["kak-eto-rabotaet-na-praktike"],
    },
  },
  /*
    Секции «Что говорят компании и НКО» здесь нет намеренно: в источнике под её
    заголовком лежат только ряд косых черт (авторская пометка) и список «в этом
    модуле вы узнаете», который дизайнер удалил директивой. На сайте роль этого
    списка играет блок «На этой странице вы узнаете», так что показывать было
    нечего — оставался заголовок с косыми чертами.
  */
  {
    /*
      Справочник нормативных актов: раньше он был вторым разделом на странице
      «Правовые основы», теперь стоит своей страницей в общем ряду правовых.

      Разделов у страницы нет намеренно. Семь документов разметка собрала в один
      список, заголовков у них не осталось, и делить страницу нечем. Поэтому всё
      содержимое идёт вступлением: заголовок «Полезные документы» снимается (он
      повторял бы название страницы), а под названием сразу лежат вводная фраза
      и список.
    */
    slug: "/general/legal/documents",
    title: "Полезные документы",
    module: "m2",
    sections: [],
    intro: "poleznye-dokumenty",
  },

  // ── Для компаний: наём по шагам (М5) ────────────────────────────────────
  {
    /*
      Вступление ко всему треку стоит здесь, на первой странице. Раньше под него
      была отдельная страница-хаб (/companies), но она оказалась лишним экраном
      между меню и материалом: кроме вступления, там лежали только карточки-
      ссылки на шаги, а их работу делает меню слева. Решение дизайнера 5 августа
      2026: пункт «Для компаний» ведёт сразу на первый шаг, как «Основы» ведут
      на «О проекте».
    */
    slug: "/companies/hire/step-1",
    title: "Шаг 1. Выбор вакансии",
    module: "m5-1",
    intro: "vvedenie",
    sections: [
      "shag-1-vybor-vakansii-dlya-inklyuzivnogo-nayma",
      "podvedem-itogi",
    ],
    outline: {
      /*
        ЗАГОЛОВКА НАД НАЧАЛОМ МАТЕРИАЛА БОЛЬШЕ НЕТ — замечание Мити msothbid2ex7
        от 11 августа 2026 («Удалить»). Строку «Шаг 1. Выбор вакансии для
        инклюзивного найма» до этого просила добавить Юля (msn9o4ot35n0), и
        неделю она стояла первой строкой страницы, повторяя её название в шапке
        и в меню слева. Решение отменено.

        Убирается тем, что якорь не назван разделом: всё, что стоит до первого
        раздела, перекройка складывает во вступление, а его заголовок снимает
        сама (см. recutSections в pageOutline). Текст под ним остаётся на месте.
      */
      sections: [
        "opredelite-tsel-inklyuzivnogo-nayma",
        "sostavte-spisok-potentsialnyh-vakansiy",
        "sravnite-vakansii-mezhdu-soboy-i-vyberite-pozits",
        "vypishite-funktsional-vakansii",
        /*
          «Подумайте, кандидатам с какими особенностями здоровья вакансия
          подходит лучше всего» — замечание Юли msnac3cfrx4j: «этот заголовок
          справа в меню смотрится как подзаголовок, надо выдвинуть». В источнике
          он четвёртого уровня внутри «Выпишите функционал вакансии», хотя
          открывает самостоятельную тему: подбор формы инвалидности под задачи.
        */
        "podumayte-kandidatam-s-kakimi-osobennostyami-zdo",
        "otsenite-bezopasnost-vakansii-vmeste-so-spetsial",
        "sostavte-itogovyy-spisok-zadach-novogo-sotrudnik",
        "podvedem-itogi",
      ],
      /*
        «Вакансия: Сборщик заказов на складе» СО СТРАНИЦЫ СНЯТ — замечание Мити
        msotcb4hmgvl от 11 августа 2026: этот заголовок и абзац над ним слиты в
        одну фразу («Давайте разберём конкретный пример вакансии сборщика
        заказов на складе», см. rewrite в clientEdits/step1.ts), и отдельной
        строкой он повторял бы сказанное.

        Раньше по замечанию Юли msn9zp4iae4l он оставался на странице врезкой —
        строкой без места в меню. Теперь не остаётся вовсе.
      */
      drop: ["vakansiya-sborschik-zakazov-na-sklade"],
    },
    /*
      «Проверьте себя» — заголовок, который мы поставили сами перед четырьмя
      квизами (замечание Мити msotaykioma3, см. inserts в clientEdits/step1.ts).
      Он просил уровень, при котором строка не попадёт в меню справа, но уровнем
      этого не добиться: раздел в источнике четвёртого уровня, и перекройка
      поднимает любой его подзаголовок до H3, а H3 в меню идёт. Поэтому прячем
      строку прямо здесь.
    */
    noToc: ["proverte-sebya"],
  },
  {
    slug: "/companies/hire/step-2",
    /*
      НАЗВАНИЯ ЧЕТЫРЁХ ШАГОВ ПОДРОБНЕЕ — список от клиента, принят дизайнером
      10 августа 2026. Строение трека не менялось: те же шесть страниц в том же
      порядке и с тем же содержанием, поменялись только заголовки.

      Прежние имена были нашими сокращениями («Аудит готовности» вместо аудита
      рабочей среды), и по ним не всегда понятно, чего именно шаг касается.
      Новые ближе к тому, как эти главы названы в гугл-доке.
    */
    title: "Шаг 2. Аудит рабочей среды",
    module: "m5-1",
    sections: [
      "shag-2-vnutrenniy-audit-rabochey-sredy-processov",
      "tipichnye-oshibki-rabotodateley-pri-provedenii-a",
      "podvedem-itogi-2",
    ],
    /*
      ДЕСЯТЬ ПРОВЕРОК — РАЗДЕЛЫ, А НЕ ПОДПУНКТЫ. Замечание Юли от 10 августа
      2026: «в меню справа всё, что в разделе „что важно проверить“, является
      подразделами — не подразделы, а самостоятельные разделы». Так и есть по
      смыслу: каждая проверка разбирает свой этап пути кандидата — публикацию
      вакансии, дорогу, собеседование и так далее, — и по названию понятно, о
      чём часть страницы.

      Заголовок «Что важно проверить во время аудита» разделом ОСТАЁТСЯ: под ним
      три вводных абзаца, пример с корпоративным автобусом, картинка и строка
      «Ниже разберём основные блоки». Это вступление к десятке, и без него первая
      проверка начиналась бы страницы с середины.

      ПОМЕТКА ДИЗАЙНЕРА В ДАННЫХ ТЕПЕРЬ ГОВОРИТ ОБРАТНОЕ, и это не ошибка. У всех
      десяти заголовков в разметке стоит «Heading · H4» с пояснением «строка
      просто станет мельче и в меню страницы справа отдельным пунктом больше не
      появится». Замечание клиента отменяет то решение, а пометку мы не трогаем:
      данные принадлежат дизайнеру, и правка там доехала бы ровно до одного
      стенда. Уровень H4 из пометки здесь просто перестаёт что-либо решать —
      перекройка называет эти заголовки разделами и ставит им H2.

      Кстати, само по себе H4 из пометки в меню их и не убирало: раздел «Что
      важно проверить» в источнике третьего уровня, перекройка поднимает его в
      разделы, а вместе с ним на ступень поднимаются и его части. Четвёртый
      уровень становился третьим, а третий в меню как раз и показывается — из-за
      этого клиент и видела десять подпунктов.

      Четыре последних абзаца («Итак, у вас получился полноценный чек-лист…» и
      далее до перехода к техническому заданию) закрывают весь перечень проверок,
      а стоят внутри последней из них — «Особенности аудита удалённой работы».
      Правка их никуда не переносит, они и раньше лежали там же; новое только то,
      что на этот раздел теперь можно перейти из меню. Перенести их отдельным
      куском нечем: механизма «унести блок в другой раздел» в слое нет.
    */
    outline: {
      sections: [
        "uchastniki-audita",
        "chto-vazhno-proverit-vo-vremya-audita",
        "publikaciya-vakansii",
        "doroga-do-sobesedovaniya-ili-mesta-raboty",
        "sobesedovanie",
        "oformlenie-dokumentov",
        "instruktazh-i-obuchenie",
        "rabochee-mesto-i-fizicheskaya-sreda",
        "rabochie-processy-i-zadachi",
        "materialy-i-cifrovye-servisy",
        "bezopasnost-i-ekstrennye-situacii",
        "osobennosti-audita-udalennoy-raboty",
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
    title: "Шаг 3. Создание инклюзивной среды",
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
      /*
        Все шесть заголовков голосов сняты со страницы совсем — замечания Юли от
        7 августа 2026, по одному на каждый: «убрать заголовок». Раньше они
        стояли врезками: текст оставался, а из оглавления заголовок был спрятан.
        Клиент попросила убрать и сами строки.

        Рассказы и цитаты под ними остаются на месте и продолжают свой раздел.
        Объявлять их отдельно незачем: на четыре темы шага приходилось шесть
        одинаковых строк «Что говорят компании» и «Что говорят люди с
        инвалидностью», и они делили каждую тему надвое.

        Так же сделано на «Этике и коммуникации» и на «Как устроен наём».
      */
      drop: [
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
    title: "Шаг 4. Поиск и оформление сотрудника",
    module: "m5-2",
    /*
      ДВУХ РАЗДЕЛОВ ИСТОЧНИКА ЗДЕСЬ БОЛЬШЕ НЕТ — замечания дизайнера от
      14 августа 2026, оба со словом «Удалить».

      «Как составить описание вакансии» (первый из двух одинаковых) — это
      заголовок-дубль и один абзац-подводка «Хорошая вакансия помогает не только
      привлечь кандидатов…» (замечание msspupkkdwo2). Абзац почти дословно
      повторял начало настоящего раздела, который идёт следом: «Хорошая вакансия
      не только привлекает кандидатов, но и помогает понять…». Заголовок мы и
      раньше снимали отдельно, а теперь уходит вся секция.

      «Практическое задание» (замечание msspt2jc0pow) — упражнение из курса:
      плохая вакансия, список критериев для её оценки и разбор ошибок. На сайте
      оценивать некому и негде, а разбор ошибок слово в слово повторяет
      следующий раздел «Как составить описание вакансии». Дизайнер попросил
      убрать всё от заголовка «Практическое задание» до заголовка «Как составить
      описание вакансии», не трогая последний.

      Убирать надо ИЗ ОБОИХ списков — из этого и из outline.sections ниже. Здесь
      решается, какие секции источника вообще берутся на страницу; там — какие
      из взятых становятся разделами. Убрать только внизу мало: секция осталась
      бы на странице и целиком уехала бы во вступление.
    */
    sections: [
      "shag-4-poisk-kandidatov-provedenie-sobesedovaniy",
      "kak-sostavit-vakansiyu-i-gde-nayti-kandidatov-s-",
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
      /*
        ЗАГОЛОВОК «ЧТО ГОВОРЯТ КОМПАНИИ» СНЯТ — замечания Юли от 12 августа 2026
        (msq1kyba9ac4) и дизайнера от 14 августа (mssqk2yonb4c). Юля написала, что
        на этом месте будет цитата от Melon Fashion Group, дизайнер — «Удалить».
        Вместе это одна правка: строка уходит, а на её месте встаёт карточка
        цитаты (см. importantCards/step4.ts и clientEdits/step4.ts).

        Секцию «chto-govorit-biznes-5» из sections выше при этом НЕ убираем: под
        заголовком живут четыре абзаца про обратную связь после собеседования, и
        они остаются на странице, продолжая раздел о собеседовании.
      */
      drop: ["chto-govorit-biznes-5"],
      sections: [
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
      /*
        ТРИ ДЛИННЫХ ПЕРЕЧНЯ УБРАНЫ ИЗ МЕНЮ СПРАВА — замечания дизайнера от
        14 августа 2026 (mssqds86t53f, mssqjy1b9el5, mssqiob8p0n9), во всех трёх
        одна метка «H4».

        Где искать кандидатов — пять источников, как готовить собеседование —
        десять правил, как оформлять — восемь советов. Пересчёт от раздела давал
        всем двадцати трём третий уровень, а третий уровень идёт в меню справа:
        оглавление страницы становилось списком из тридцати с лишним строк, и
        разделы в нём терялись.

        Четвёртый уровень оставляет строки заголовками — они видны на странице и
        приходят заголовками в выгрузку, — но в меню не идут.
      */
      level: {
        /*
          «Как составить описание вакансии» — четыре правила написания вакансии.
          Замечание дизайнера от 14 августа 2026 (msspzsde1cpm) стояло на трёх из
          них, четвёртое — «Опишите задачи без расплывчатых формулировок» —
          добавлено его же решением 15 августа: три правила из четырёх в меню не
          показываются, а четвёртое висело бы там одинокой строкой, и меню
          читалось бы как ошибка.
        */
        "opishite-zadachi-bez-rasplyvchatyh-formulirovok": "H4",
        "ukazhite-chto-vakansiya-dostupna-lyudyam-s-inval": "H4",
        "proverte-vakansiyu-na-otsutstvie-diskriminacii": "H4",
        "budte-prozrachny-v-usloviyah-raboty": "H4",
        /*
          «Примеры вакансий» — два готовых описания. Замечания Юли от 12 августа
          2026 (mspqiqnx8806 и mspqjimlxfil): «убираем заголовок из меню справа,
          понизить уровень заголовка», метка дизайнера — «H4».

          Части каждой вакансии («Ключевые задачи:», «Мы предлагаем:» и ещё пять
          таких же) едут за своим заголовком сами и становятся пятым уровнем:
          сдвиг запоминается той же стопкой, что и пересчёт (makeDemoter в
          pageOutline). Руками их уровень трогать не надо.
        */
        "dolzhnost-administrator-ofisa": "H4",
        "dolzhnost-testirovschik-programmnogo-obespecheni": "H4",
        // «Где искать кандидатов с инвалидностью» — пять источников поиска.
        nko: "H4",
        "rabotnye-sayty": "H4",
        "sluzhby-zanyatosti-naseleniya": "H4",
        "vuzy-i-kolledzhi": "H4",
        "professionalnye-soobschestva-i-socialnye-seti": "H4",
        // «Как подготовить и провести собеседование» — десять правил подряд.
        "utochnite-kakoy-format-sobesedovaniya-udoben-kan": "H4",
        "opredelite-kanal-svyazi": "H4",
        "obsudite-format-vstrechi": "H4",
        "podgotovte-materialy": "H4",
        "budte-gotovy-k-prisutstviyu-soprovozhdayuschego": "H4",
        "adaptiruyte-kommunikaciyu": "H4",
        "ocenivayte-kompetencii-a-ne-osobennosti-zdorovya": "H4",
        "govorite-prosto-i-ponyatno": "H4",
        "budte-gotovy-k-dopolnitelnym-voprosam": "H4",
        "proforientacionnaya-ekskursiya": "H4",
        // «Оформление сотрудников с инвалидностью» — восемь советов подряд.
        "sovet-1-obyasnite-poryadok-oformleniya": "H4",
        "sovet-2-ne-zaprashivayte-lishnie-dokumenty": "H4",
        "sovet-3-obsuzhdayte-ne-diagnoz-a-usloviya-raboty": "H4",
        "sovet-4-srazu-fiksiruyte-vazhnye-dogovorennosti": "H4",
        "sovet-5-naznachte-kontaktnoe-lico": "H4",
        "sovet-6-esli-kandidat-prishel-s-kuratorom-nko-za": "H4",
        "sovet-7-ne-zatyagivayte-process-bez-obyasneniy": "H4",
        "sovet-8-spokoyno-otvechayte-na-voprosy": "H4",
      },
    },
  },
  {
    slug: "/companies/hire/step-5",
    title: "Шаг 5. Онбординг и сопровождение",
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
      /*
        ДВА ЗАГОЛОВКА СНЯТЫ СО СТРАНИЦЫ — замечания Юли от 12 августа 2026
        (msprj6f78x9z «убрать заголовок» и msq1o0atsp39 «убираем», с пометкой
        «Тут будет цитата Гюзель Казаковой»).

        «Что говорят люди с инвалидностью» и «Что говорят компании» ничего не
        называли: за каждым стоял служебный вопрос интервью, а самой речи не
        было. 14 августа Юлия Фролова прислала обе цитаты прямо в замечаниях, и
        теперь на месте вопросов стоят карточки цитат — Ольги Крыловой и Гюзель
        Казаковой (см. clientEdits/step5.ts и importantCards/step5.ts). У
        карточки цитаты подписью работают имя и должность, заголовок над ней
        лишний.

        Якоря остаются в sections выше: там перечислено, какие секции источника
        вообще берутся на страницу. Убрать их оттуда — значит потерять вместе с
        заголовками и сами цитаты.
      */
      drop: [
        "chto-govoryat-lyudi-s-invalidnostyu-4",
        "chto-govorit-biznes-6",
      ],
      /*
        Пять заголовков убраны из меню справа — замечания клиента от 12–14
        августа 2026 (msprc4ctt3k8, msprc8oud8zt, msprfehfx6qm, msprfkdi5yh5,
        msprfpmwonpq) и пометка дизайнера «H4» к каждому. Это разборы отдельных
        случаев внутри своих разделов: две крайности помощи новичку и три
        причины, по которым адаптация идёт не по плану.
      */
      level: {
        "razumnaya-adaptaciya": "H4",
        giperopeka: "H4",
        "peresmotr-formata-i-usloviy-raboty": "H4",
        "izmenenie-zhiznennyh-prioritetov": "H4",
        "perezhivaniya-svyazannye-s-priobretennoy-invalid": "H4",
      },
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
    // Вступление ко всему треку — здесь, по той же причине, что и у компаний.
    slug: "/ngo/start",
    title: "Запустить программу",
    module: "m6-1",
    intro: "vvedenie",
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
      /*
        «Почему важно заранее определить объём услуг» — замечание Юли от
        11 августа 2026 («убрать из меню справа») и пометка дизайнера «H4».
        Заголовок остаётся на странице, но строкой в оглавлении он лишний:
        раздел «Работа с внешней аудиторией» там уже назван, а подзаголовок
        ведёт читателя туда же.

        Сначала строку просто прятали из меню (noToc), а уровень у неё
        оставался третий. Метка «H4» просит другого — сделать заголовок мельче,
        и тогда он не идёт в меню сам собой. Переделано 16 августа 2026.
      */
      level: { "pochemu-vazhno-zaranee-opredelit-obem-uslug": "H4" },
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
      /*
        Два заголовка убраны из меню справа — замечания клиента от 14 августа
        2026 (msogt9847b04, msogtdyzgfht) и пометка дизайнера «H4» к обоим. Оба
        подводят черту под уже описанной встречей, своей темы не открывают.
      */
      level: {
        "chto-vazhno-ponyat-po-itogam-intervyu": "H4",
        "kakim-mozhet-byt-sleduyuschiy-shag": "H4",
      },
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
      /*
        «Когда необходима профориентация» ушло из меню справа — замечания от
        14 августа 2026 (msoh9p2hzykc клиента и msssm7z8lb5h дизайнера, оба про
        один и тот же заголовок, метка «H4»). Строка продолжает разговор о том,
        что такое профориентация, и отдельной темы страницы не открывает.
      */
      /*
        Ещё три заголовка убраны из меню справа — замечания клиента от 14 августа
        2026 (msq3w8os3gj8, msq3wissww4s, msq3yb703w0l), пометка «H4» к каждому.
        «Теоретическая часть» и «Практическая часть» делят одно упражнение,
        «Фиксируйте результаты наблюдений» — совет внутри разбора вакансий.
      */
      level: {
        "kogda-neobhodima-proforientaciya": "H4",
        "teoreticheskaya-chast": "H4",
        "prakticheskaya-chast": "H4",
        "fiksiruyte-rezultaty-nablyudeniy": "H4",
      },
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
  /*
    ВОСЕМЬ ШАГОВ ПОДБОРА РАЗРЕЗАНЫ НА ТРИ СТРАНИЦЫ — новая структура раздела от
    клиента, решение дизайнера 10 августа 2026. Раньше все восемь стояли одной
    страницей на сорок три тысячи знаков, самой длинной в разделе.

    Шов прошёл по смыслу работы: сначала кандидат и НКО выбирают, на что
    откликаться, потом готовят резюме, потом готовятся к встрече. Вступление
    главы («Поиск работы включает несколько этапов») осталось лидом первой
    страницы: оно перечисляет ровно эти три темы.

    Номера «Шаг N» из заголовков сняты (см. NGO_VACANCY_STEPS ниже): на трёх
    коротких страницах нумерация начиналась бы с четвёртого и шестого шага, и
    читателю негде было бы найти начало.
  */
  {
    slug: "/ngo/candidates/vacancies",
    title: "Подбор вакансий",
    module: "m6-2",
    intro: "podbor-vakansiy-i-podgotovka-k-sobesedovaniyu",
    sections: [
      "shag-1-opredelenie-prioritetov",
      "shag-2-poisk-vakansiy-na-podhodyaschih-ploschadk",
      "shag-3-pomosch-kandidatu-v-ponimanii-opisaniya-v",
    ],
    outline: {
      sections: [
        "shag-1-opredelenie-prioritetov",
        "shag-2-poisk-vakansiy-na-podhodyaschih-ploschadk",
        "shag-3-pomosch-kandidatu-v-ponimanii-opisaniya-v",
      ],
    },
  },
  {
    slug: "/ngo/candidates/resume",
    title: "Помощь с резюме",
    module: "m6-2",
    /*
      «Согласование решения об отклике» стоит здесь ВРЕМЕННО — дизайнер решает
      отдельно, куда его отнести. По тексту оно идёт сразу за резюме (кандидат
      откликается уже с готовым резюме), но по смыслу тянется и к подбору
      вакансий. Чтобы перенести, достаточно переставить якорь отсюда на
      страницу «Подбор вакансий», в sections и в outline.
    */
    sections: [
      "shag-4-sostavlenie-ili-obnovlenie-rezyume",
      "shag-5-soglasovanie-resheniya-ob-otklike",
    ],
    outline: {
      sections: [
        "shag-4-sostavlenie-ili-obnovlenie-rezyume",
        "chto-vazhno-uchityvat-pri-sostavlenii-rezyume",
        "shag-5-soglasovanie-resheniya-ob-otklike",
      ],
    },
  },
  {
    slug: "/ngo/candidates/interview",
    title: "Подготовка к собеседованию",
    module: "m6-2",
    /*
      Итог главы («Подведём итоги») достаётся последней из трёх страниц: он
      подводит черту под всем путём от приоритетов до разбора встречи. Сам текст
      итога на страницу не попадает (см. recap.ts), от секции остаётся хвост —
      практическое задание.
    */
    sections: [
      "shag-6-podgotovka-k-sobesedovaniyu",
      "shag-7-provedenie-sobesedovaniya",
      "shag-8-posle-sobesedovaniya",
      "podvedem-itogi-3",
    ],
    /*
      Заглавный раздел «Подготовка к собеседованию» разделом страницы НЕ стоит:
      он слово в слово повторял бы её название в шапке. Вместо него разделами
      стали его семь частей, а вводный абзац («собеседование — это не экзамен»)
      открывает страницу лидом. Так же собраны страницы шагов найма у компаний.

      Вместе с заглавным уходит и подзаголовок «Что важно проверить и
      подготовить заранее»: он объявлял ровно тот список, который теперь стоит
      разделами прямо под ним.
    */
    outline: {
      sections: [
        "informaciya-o-kompanii",
        "format-sobesedovaniya-i-dostupnost-mesta-vstrech",
        "vneshniy-vid",
        "dokumenty",
        "podgotovka-k-razgovoru",
        "tipichnye-voprosy-rabotodatelya",
        "voprosy-so-storony-kandidata",
        "shag-7-provedenie-sobesedovaniya",
        "shag-8-posle-sobesedovaniya",
        "podvedem-itogi-3",
      ],
      /*
        Три заголовка убраны из меню справа — замечания клиента от 14 августа
        2026 (msq4qjyljn21, msq4qo9lim96, msq4qtlhvpvq) и пометка дизайнера «H4»
        к каждому. Все три — части одного раздела «После собеседования»: сначала
        разбор встречи, потом два возможных исхода.
      */
      level: {
        "razbor-vstrechi": "H4",
        "esli-prishel-otkaz": "H4",
        "esli-kandidat-poluchil-predlozhenie-o-rabote": "H4",
      },
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
    /*
      Название вернулось к формулировке источника — так эта глава называется в
      гугл-доке, и так же на неё ссылается текст соседней страницы («читайте в
      разделах „Поиск работодателей“ и „Взаимодействие с работодателями“»).
      В меню пункт стоит под заголовком группы «Работодатели» и называется
      просто «Взаимодействие».
    */
    title: "Взаимодействие с работодателями",
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
      /*
        ОДИННАДЦАТЬ ЗАГОЛОВКОВ ЧЕТВЁРТОГО УРОВНЯ — замечания клиента «убрать из
        меню справа» и метка дизайнера «H4» к каждому.

        Первые два разобраны 14 августа 2026 (msq7n14bhm97, msq7rx5yyxrc).
        «Ситуация: работодатель говорит…» — разбор одного возражения внутри
        раздела о возражениях, а в меню он занимал строку длиннее самого
        раздела. «Структура итогового письма» — часть письма, о котором идёт
        речь строкой выше.

        Остальные девять сначала закрыли иначе: заголовок снимали совсем, и
        строка оставалась обычным текстом (untype в clientEdits/ngoTalks.ts).
        Из меню она при этом уходила, но переставала быть заголовком, а метка
        «H4» просит другого — оставить заголовком, только мельче. 16 августа
        2026 переделано на уровень.

        «Отклик на вакансию» и «Встреча» ведут за собой свои части: они стоят в
        источнике уровнем ниже и опускаются на ту же ступень, до пятого уровня.
        Так «Кандидат откликается самостоятельно» остаётся частью отклика, а не
        встаёт вровень с ним.
      */
      level: {
        "situaciya-rabotodatel-govorit-my-boimsya-chto-ko": "H4",
        "struktura-itogovogo-pisma": "H4",
        "govorite-s-pozicii-partnera": "H4",
        "obyasnite-chem-nko-mozhet-byt-polezna-rabotodate": "H4",
        "opredelite-cel-kontakta": "H4",
        "podgotovte-voprosy-ob-usloviyah-raboty": "H4",
        "pismo": "H4",
        "chego-luchshe-izbegat-v-pervom-pisme": "H4",
        "otklik-na-vakansiyu": "H4",
        "zvonok": "H4",
        "vstrecha": "H4",
      },
    },
  },
  {
    slug: "/ngo/support",
    title: "Сопровождение сотрудника",
    module: "m6-4",
    /*
      ДОРОЖНОЙ КАРТЫ ЗДЕСЬ БОЛЬШЕ НЕТ — новая структура раздела от клиента,
      решение дизайнера 10 августа 2026. Она лежала вторым куском этой страницы
      и занимала около тридцати тысяч знаков, то есть больше половины. В новой
      структуре у неё своя страница в группе «Развитие и масштабирование»: карта
      описывает программу целиком, а не поддержку конкретного сотрудника.
    */
    sections: [
      "soprovozhdenie-na-etape-trudoustroystva",
      "dva-formata-soprovozhdeniya",
      "chto-dalshe-krizis-menedzhment-na-rabochem-meste",
      "podvedem-itog-2",
    ],
    /*
      ТРИ ШАГА СОПРОВОЖДЕНИЯ УШЛИ ПОД «РОЛЬ НКО» — замечания клиента от
      14 августа 2026 (mssoi56m05n2, mssoizsventi, msson7h4tl0b, mssopc257obo,
      mssoqvtvbcu5) и решение дизайнера: H2 первым двум, H3 трём шагам.

      Было так: раздел «Два формата сопровождения» тянулся до конца главы и
      держал внутри себя две большие темы, а медкомиссия, договор и выход на
      работу стояли разделами вровень с ним. Из меню справа читатель не мог
      понять, что эти три шага — части работы НКО при трудоустройстве.

      Стало так: «Сопровождение работодателя» и «Роль НКО в процессе адаптации»
      сами стали разделами, а три шага — подзаголовками внутри «Роли НКО».
    */
    outline: {
      sections: [
        "dva-formata-soprovozhdeniya",
        "soprovozhdenie-rabotodatelya-pri-trudoustroystve",
        "rol-nko-v-processe-adaptacii",
        "chto-dalshe-krizis-menedzhment-na-rabochem-meste",
        /*
          «ПОДВЕДЁМ ИТОГ» ЗДЕСЬ РАДИ ТОГО, ЧТОБЫ ЕГО УБРАТЬ, — замечание
          Фроловой mssosmsf9a8y («убираем»). Итоги курса снимает общий механизм
          (recap.ts + withRecap в pageStructure.ts), но снимает он ЦЕЛУЮ секцию,
          а перекройка разделами оставляет секциями только те якоря, что
          перечислены здесь. После правки от 14 августа этот якорь из списка
          выпал, итог перестал быть секцией и механизм его больше не видел:
          заголовок съехал внутрь кризис-менеджмента, а четыре абзаца остались
          на странице.

          У соседних страниц («Дорожная карта», «Развивать и масштабировать»)
          якорь итога перечислен и здесь, и в sections выше — эта страница
          просто выпала из общего правила.
        */
        "podvedem-itog-2",
      ],
      /*
        «Что может сделать сотрудник НКО при прохождении медкомиссии» и «Для
        людей с ментальной инвалидностью» стоят в источнике вровень с самой
        медкомиссией, хотя это её части. Пока медкомиссия была разделом, разница
        держалась на разделе; теперь она подзаголовок, и без выравнивания её
        части встали бы с ней на одну ступень.

        Договор и выход на работу названы здесь по другой причине: они тоже
        стоят вровень с медкомиссией, но её частями не являются. Группу
        закрывает только заголовок выше открывшего, поэтому без этой записи оба
        уехали бы вниз вместе с частями медкомиссии.
      */
      nest: [
        "shag-1-proyti-medkomissiyu",
        "shag-2-oformlenie-dogovora",
        "shag-3-vyhod-na-rabotu-soprovozhdenie-v-pervye-n",
      ],
    },
  },
  {
    /*
      Дорожная карта — отдельная страница (новая структура раздела от клиента,
      10 августа 2026). В источнике это самостоятельная глава со своим «в этом
      разделе вы узнаете», поэтому вынималась она целиком, без разрезов по
      живому. Восемь её частей подняты в разделы: без этого страница на тридцать
      тысяч знаков состояла бы из одного раздела и оглавления бы не имела.
    */
    slug: "/ngo/roadmap",
    title: "Дорожная карта",
    module: "m6-4",
    sections: ["dorozhnaya-karta", "podvedem-itogi-6"],
    outline: {
      sections: [
        "s-chego-nachinaetsya-rabota",
        "kak-mozhet-vyglyadet-dorozhnaya-karta",
        "podvedem-itogi-6",
      ],
      /*
        Шесть заголовков разделами быть перестали — замечания от 14 августа 2026
        (mssotsh9q9mg, mssotv2bkith, mssou1k2tc30, mssou7pdtyxz, mssubjoq66y1,
        mssubszwl2tk), в каждом метка «H4».

        «Исходная ситуация», «Цели» и «Задачи для решения» — три части одного
        разговора о том, с чего начинается работа. «Разберём каждый блок»,
        «Индивидуальный или групповой формат работы» и «Параллельные процессы»
        объясняют, как вести уже показанную карту. Ни одно из шести не открывает
        новой темы страницы, поэтому в меню справа их больше нет.
      */
      level: {
        "ishodnaya-situaciya": "H4",
        celi: "H4",
        "zadachi-dlya-resheniya": "H4",
        "razberem-kazhdyy-blok": "H4",
        "individualnyy-ili-gruppovoy-format-raboty": "H4",
        "parallelnye-processy-chto-vazhno-delat-odnovreme": "H4",
      },
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
      /*
        Два заголовка убраны из меню справа — замечания клиента от 14 августа
        2026 (mssp8cbofqlx, mssp8f2a7q5u) и пометка дизайнера «H4» к обоим. В
        источнике оба и стоят четвёртым уровнем: это разговор о том, как оценить
        готовность команды, и список вопросов к нему.

        «Оценку готовности команды и ресурсов» сначала закрыли иначе: заголовок
        сняли совсем, и строка осталась обычным текстом. Переделано 16 августа
        2026 — вслед за соседним чек-листом, который так же переделали двумя
        днями раньше.
      */
      level: {
        "ocenka-gotovnosti-komandy-i-resursov": "H4",
        "chek-list-gotovnosti-komandy": "H4",
      },
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
      /*
        Четыре принципа заявки убраны из меню справа — замечания клиента от
        14 августа 2026 (msspbxz74g6b, msspc76ob1uu, msspccp9h38y, msspchgkbk5p)
        и пометка дизайнера «H4» к каждому. В источнике все четыре и стоят
        четвёртым уровнем: пересчёт от раздела поднимал их до третьего, и они
        попадали в меню.
      */
      level: {
        "prostota-yazyka": "H4",
        "logicheskaya-cepochka": "H4",
        "opora-na-fakty": "H4",
        "gotovnost-predostavit-otchetnost": "H4",
      },
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

  Снимаем префикс у заглавной секции страницы, которая сама называется
  «Шаг N. …» (шесть страниц трека «Для компаний»).
*/
/*
  ИСКЛЮЧЕНИЕ ИЗ ЭТОГО ПРАВИЛА — «Шаг 1». Клиент попросила поставить над началом
  материала заголовок «Шаг 1. Выбор вакансии для инклюзивного найма» целиком
  (замечание msn9o4ot35n0), и дизайнер согласился держать два названия: короткое
  «Шаг 1. Выбор вакансии» в шапке и в меню слева, полное — над текстом. Номер
  здесь часть названия, о котором просили, а не третий его повтор.
*/
const KEEP_STEP_NUMBER = new Set([
  "shag-1-vybor-vakansii-dlya-inklyuzivnogo-nayma",
]);

const STEP_TITLE_ANCHORS = new Set(
  OSNOVY_PAGES.filter((p) => /^Шаг\s+\d+\./u.test(p.title))
    .map((p) => p.sections[0])
    .filter((a) => !KEEP_STEP_NUMBER.has(a)),
);

/*
  НОМЕРА «1.»–«6.» У ШАГОВ ВЫБОРА ВАКАНСИИ — замечание Юли msnacst2mdc9 от
  11 августа 2026: «убираем нумерацию пунктов в тексте и в меню справа». Меню и
  текст берут заголовок из одного места, поэтому одна правка чинит оба.

  Номер приписан не источником, а нами. В гугл-доке эти шаги размечены списком,
  и при выгрузке разметка заголовка потерялась; чиня её, normalizeBlocks заодно
  восстанавливает порядковый номер. Правило там общее для всего сайта, и под
  него попадают ещё восемь заголовков на страницах НКО, которых клиент не
  просила трогать, — поэтому снимаем номера здесь и точечно (решение дизайнера
  11 августа 2026).

  СНИМАЕМ ЗДЕСЬ, А НЕ В ПОЧИНКЕ ИСТОЧНИКА, ещё и по технической причине: адрес
  заголовка считается по его тексту, и убери мы номер раньше — у шести
  заголовков сменились бы адреса, а вместе с ними отвалились бы правки редактора
  и разметка дизайнера, если они на них стоят.

  Названа СЕКЦИЯ, а не каждый заголовок: до этого места доезжает якорь секции
  источника, а не самого заголовка (см. contentTree, поле it.anchor), и шесть
  подзаголовков одной секции по нему не различить. Сужать и не нужно — из
  одиннадцати подзаголовков этой секции с цифры начинаются ровно эти шесть.
*/
const NUMBERED_STEP_SECTION = "shag-1-vybor-vakansii-dlya-inklyuzivnogo-nayma";

/*
  ВОСЕМЬ ШАГОВ ПОДБОРА ВАКАНСИЙ — номера сняты со ВСЕХ восьми заголовков
  (решение дизайнера 10 августа 2026). Раньше они жили одной страницей, и
  сквозная нумерация была там единственным признаком последовательности.

  По новой структуре раздела шаги разъехались на три страницы: подбор вакансий,
  помощь с резюме и подготовка к собеседованию. Страница про резюме начиналась
  бы с «Шага 4», страница про собеседование — с «Шага 6», и читатель, пришедший
  из меню, искал бы начало, которого на странице нет. Порядок при этом никуда не
  делся: он виден по меню слева и по порядку разделов на странице.

  Список якорей заведён руками, а не вычислен по заголовкам: правило «снять
  номер везде, где он есть» задело бы три шага оформления на «Сопровождении
  сотрудника», где страница целая и нумерация читается.
*/
const NGO_VACANCY_STEPS = new Set([
  "shag-1-opredelenie-prioritetov",
  "shag-2-poisk-vakansiy-na-podhodyaschih-ploschadk",
  "shag-3-pomosch-kandidatu-v-ponimanii-opisaniya-v",
  "shag-4-sostavlenie-ili-obnovlenie-rezyume",
  "shag-5-soglasovanie-resheniya-ob-otklike",
  "shag-6-podgotovka-k-sobesedovaniyu",
  "shag-7-provedenie-sobesedovaniya",
  "shag-8-posle-sobesedovaniya",
]);

/*
  ПЯТЬ ЭТАПОВ РАБОТЫ НКО на «Запуске программы» — номера сняты со всех пяти
  заголовков. Пять замечаний Юли от 10 августа 2026, по одному на каждый:
  «убираем Шаг 1», «убираем „Шаг 2“» и так далее. Решение дизайнера 11 августа
  2026: снимать номера только там, где просил клиент.

  Порядок никуда не делся — он виден по самому порядку разделов на странице и в
  оглавлении справа. Адреса разделов не меняются: они берутся из источника, а не
  из показанного текста, поэтому ссылки на них не ломаются.

  Здесь назван РАЗДЕЛ, а не пять заголовков: подзаголовку достаётся якорь его
  раздела, своего у него нет. Промахнуться это не даёт — заголовков третьего
  уровня в разделе ровно пять, и все пять начинаются с «Шага». Якорь раздела во
  всём источнике встречается один раз.
*/
const NGO_STEPS_SECTION = "etapy-raboty-nko";

/*
  ПРАВИЛА УВАЖИТЕЛЬНОГО ОБЩЕНИЯ на «Этике и коммуникации» — номера сняты со всех
  пяти названий (просьба разработчика 17 августа 2026). Правила собраны в пять
  карточек, стоящих рядом, и порядок в них ничего не значит: «Не бойтесь
  ошибиться» не следует из «Замечайте человека». Номер обещал последовательность,
  которой нет.

  Здесь названы СЕКЦИЯ И МОДУЛЬ, а не пять заголовков: подзаголовку достаётся
  якорь его секции, своего у него нет. Модуль нужен потому, что якорь
  «podvedem-itogi» не уникален — такая же секция есть ещё в четырёх модулях. Ни
  один их подзаголовок сегодня с цифры не начинается, но полагаться на это
  значит ждать беды: допишут в чужой модуль нумерованный подзаголовок, и номер
  тихо исчезнет там, где его не трогали.
*/
const RULES_SECTION = "podvedem-itogi";
const RULES_MODULE = "m3";

/** Начало «Шаг 3.», «Шаг 3 —», «Шаг 3:» — с любым знаком после номера или без него. */
const STEP_PREFIX = /^\s*Шаг\s+\d+\s*(?:[.)]|—|–|-|:)?\s+/u;

/*
  Срезанный префикс — или прежний заголовок, если от него ничего не осталось.
  Пустой заголовок хуже лишнего номера: в оглавлении появилась бы пустая строка.
*/
function cutPrefix(md: string, re: RegExp): string {
  const out = md.replace(re, "");
  return out.trim() ? out : md;
}

/** Ведущий порядковый номер: «1. », «2) ». */
const NUMBER_PREFIX = /^\s*\d+\s*[.)]\s+/u;

/** Заголовок шага — без ведущего «Шаг N.» и без порядкового номера. */
export function dropStepNumber(
  type: string,
  md: string,
  anchor?: string,
  module?: string,
): string {
  if (!anchor) return md;
  if (type === "h3" && anchor === NUMBERED_STEP_SECTION)
    return cutPrefix(md, NUMBER_PREFIX);
  if (type === "h3" && anchor === RULES_SECTION && module === RULES_MODULE)
    return cutPrefix(md, NUMBER_PREFIX);
  if (type === "h3" && anchor === NGO_STEPS_SECTION)
    return cutPrefix(md, STEP_PREFIX);
  if (type !== "h2") return md;
  if (!STEP_TITLE_ANCHORS.has(anchor) && !NGO_VACANCY_STEPS.has(anchor))
    return md;
  return cutPrefix(md, STEP_PREFIX);
}

/*
  СТРАНИЦ-ХАБОВ У ТРЕКОВ БОЛЬШЕ НЕТ (решение дизайнера 5 августа 2026).

  «Для компаний» и «Для НКО» были собранными руками страницами: вступление к
  треку и карточки-ссылки на его страницы. Карточки повторяли меню слева, а
  вступление переехало лидом на первую страницу трека (см. поле intro у
  «Шага 1» и у «Запустить программу»). Сам адрес раздела теперь ведёт на эту
  первую страницу — так же, как «Основы» ведут на «О проекте».
*/
