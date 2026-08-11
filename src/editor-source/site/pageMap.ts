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
      /*
        В источнике два раздела с одинаковым заголовком «Как составить описание
        вакансии». Первый — из заголовка и одного абзаца-подводки, второй — весь
        материал. Читатель видел в оглавлении две одинаковые строки, а первая
        вела на пустое место. Заголовок-дубль снимаем, абзац остаётся и уходит
        во вступление страницы.
      */
      drop: ["kak-sostavit-opisanie-vakansii"],
      sections: [
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
    outline: {
      sections: [
        "dva-formata-soprovozhdeniya",
        "shag-1-proyti-medkomissiyu",
        "shag-2-oformlenie-dogovora",
        "shag-3-vyhod-na-rabotu-soprovozhdenie-v-pervye-n",
        "chto-dalshe-krizis-menedzhment-na-rabochem-meste",
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
        "ishodnaya-situaciya",
        "celi",
        "zadachi-dlya-resheniya",
        "kak-mozhet-vyglyadet-dorozhnaya-karta",
        "razberem-kazhdyy-blok",
        "individualnyy-ili-gruppovoy-format-raboty",
        "parallelnye-processy-chto-vazhno-delat-odnovreme",
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

  Снимаем префикс у заглавной секции страницы, которая сама называется
  «Шаг N. …» (шесть страниц трека «Для компаний»).
*/
const STEP_TITLE_ANCHORS = new Set(
  OSNOVY_PAGES.filter((p) => /^Шаг\s+\d+\./u.test(p.title)).map(
    (p) => p.sections[0],
  ),
);

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
  номер везде, где он есть» задело бы и пять шагов работы НКО на «Запустить
  программу», и три шага оформления на «Сопровождении сотрудника», где страницы
  целые и нумерация читается.
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

/** Заголовок шага — без ведущего «Шаг N.». */
export function dropStepNumber(
  type: string,
  md: string,
  anchor?: string,
): string {
  if (type !== "h2" || !anchor) return md;
  if (!STEP_TITLE_ANCHORS.has(anchor) && !NGO_VACANCY_STEPS.has(anchor))
    return md;
  const out = md.replace(/^\s*Шаг\s+\d+\s*(?:[.)]|—|–|-|:)?\s+/u, "");
  return out.trim() ? out : md;
}

/*
  СТРАНИЦ-ХАБОВ У ТРЕКОВ БОЛЬШЕ НЕТ (решение дизайнера 5 августа 2026).

  «Для компаний» и «Для НКО» были собранными руками страницами: вступление к
  треку и карточки-ссылки на его страницы. Карточки повторяли меню слева, а
  вступление переехало лидом на первую страницу трека (см. поле intro у
  «Шага 1» и у «Запустить программу»). Сам адрес раздела теперь ведёт на эту
  первую страницу — так же, как «Основы» ведут на «О проекте».
*/
