// СГЕНЕРИРОВАНО скриптом из заголовков M1–4. Не редактировать руками.
// Раздел «Основы»: страница сайта → секции источника (по якорям H2).
// Пока только ВЫБОР секций, без правок текста. Мета о курсе и заголовки
// «Модуль N» исключены; «Подведём итоги» перенесён как есть.

export type OsnovyPage = { slug: string; title: string; module: string; sections: string[] };

export const OSNOVY_PAGES: OsnovyPage[] = [
  { slug: '/general/start', title: 'Реалии и мифы', module: 'm1', sections: [
    'chto-takoe-invalidnost-medicinskiy-i-socialnyy-p',
    'kto-takie-soiskateli-s-invalidnostyu',
    'osobennosti-raznyh-form-invalidnosti',
    'vrozhdennaya-i-priobretennaya-invalidnost-pochem',
    'komu-nuzhna-pomosch-v-poiske-raboty',
    'mify-ob-inklyuzivnom-trudoustroystve',
    'chto-govoryat-lyudi-s-invalidnostyu-i-nko',
    'zachem-vnedryat-inklyuzivnoe-trudoustroystvo',
    'chto-govoryat-biznes-i-nko',
    'kak-vystroit-ustoychivye-processy',
    'chem-trudoustroystvo-lyudey-s-invalidnostyu-otli',
    'podvedem-itogi',
  ] },
  { slug: '/general/how', title: 'Как устроен наём', module: 'm4', sections: [
    'uchastniki-inklyuzivnogo-trudoustroystva-i-ih-ro',
    'scenarii-poiska-raboty',
    'gde-iskat-kandidatov-s-invalidnostyu',
    'pryamoy-poisk-i-netvorking',
    'chto-govorit-biznes',
    'vzaimodeystvie-rabotodateley-i-nko-kto-za-chto-o',
    'kak-vystroit-partnerskie-otnosheniya-mezhdu-rabo',
    'chto-govorit-biznes-i-nko',
    'chto-delat-esli-sotrudnichestvo-nko-i-rabotodate',
    'podvedem-itogi',
  ] },
  { slug: '/general/legal', title: 'Правовые основы', module: 'm2', sections: [
    'podvedem-itogi',
    'poleznye-dokumenty',
  ] },
  { slug: '/general/legal/contract', title: 'Договор и оформление', module: 'm2', sections: [
    'kak-oformit-sotrudnika-s-invalidnostyu-po-trudov',
    'spravka-ob-invalidnosti',
    'individualnaya-programma-reabilitacii-i-abilitac',
    'kak-propisat-usloviya-truda-v-trudovom-dogovore',
  ] },
  { slug: '/general/legal/benefits', title: 'Льготы и формы занятости', module: 'm2', sections: [
    'kakie-lgoty-polozheny-sotrudnikam-s-invalidnosty',
    'sohranyatsya-li-posobiya-i-lgoty-pri-trudoustroy',
    'dopolnitelnye-formaty-zanyatosti',
    'dogovor-grazhdansko-pravovogo-haraktera-gph',
    'samozanyatost',
  ] },
  { slug: '/general/legal/quotas', title: 'Квоты и господдержка', module: 'm2', sections: [
    'chto-takoe-kvoty-i-kak-ih-vypolnit',
    'kak-vypolnit-kvotu',
    'kak-i-kuda-podavat-otchetnost',
    'chto-proishodit-esli-kvota-ne-vypolnena',
    'na-kakie-subsidii-i-mery-gospodderzhki-mogut-ras',
    'kompensaciya-rashodov-na-osnaschenie-rabochego-m',
    'kompensaciya-zatrat-na-zarabotnuyu-platu',
    'subsidii-dlya-socialnogo-predprinimatelstva',
    'nalogovye-lgoty',
  ] },
  { slug: '/general/legal/status', title: 'Особые ситуации', module: 'm2', sections: [
    'mozhet-li-rabotat-chelovek-so-statusom-nedeespos',
    'mozhno-li-uvolit-sotrudnika-s-invalidnostyu',
  ] },
  { slug: '/general/legal/faq', title: 'Вопросы и ответы', module: 'm2', sections: [
    'proverte-sebya',
    'voprosy-i-otvety',
  ] },
  { slug: '/general/team', title: 'Команда и коммуникация', module: 'm3', sections: [
    'chto-govoryat-kompanii-i-nko',
    'kak-govorit-o-lyudyah-s-invalidnostyu',
    'vyberite-kakie-slova-i-formulirovki-dopustimo-is',
    'kak-obschatsya-s-lyudmi-s-invalidnostyu',
    'osobennosti-obscheniya-s-lyudmi-s-raznymi-formam',
    'chto-govoryat-sotrudniki-s-invalidnostyu',
    'kak-podgotovit-i-provesti-meropriyatie-s-uchasti',
    'podvedem-itogi',
  ] },
];

export const pageBySlug = (slug: string): OsnovyPage | undefined =>
  OSNOVY_PAGES.find((p) => p.slug === slug);
