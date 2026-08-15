import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Scale,
  Clock,
  Wallet,
  Users,
  GraduationCap,
  AlertTriangle,
  ListChecks,
  Search,
  MessageSquare,
  ShieldCheck,
  Accessibility,
  Building2,
  Heart,
  Handshake,
  Target,
  Lightbulb,
  Info,
  Link,
  MonitorSmartphone,
  Ban,
  Check,
  X,
  Ear,
  Eye,
  Brain,
  Speech,
  HeartPulse,
  VolumeX,
} from "lucide-react";

/*
  Подбор релевантной иконки Lucide по тексту блока — для General Card с иконкой.
  Приложение к LLM не ходит, поэтому это ЭВРИСТИКА по ключевым словам (домен —
  инклюзивное трудоустройство). Первое правило, чьи слова встретились в тексте,
  побеждает; ничего не совпало — нейтральная Info. При «Применить» я в сессии
  могу уточнить выбор, но это разумный дефолт, который сохраняется в директиве.
*/

type Rule = { re: RegExp; name: string; Icon: LucideIcon };

const RULES: Rule[] = [
  { re: /договор|соглашен|оформл|трудоустрой|документ|заявлен|справк|анкет|резюме/i, name: "FileText", Icon: FileText },
  { re: /квот|закон|прав\b|правов|норматив|льгот|гарант|обязательств/i, name: "Scale", Icon: Scale },
  { re: /срок|время|этап|график|период|расписан|деньж?ла/i, name: "Clock", Icon: Clock },
  { re: /деньг|оплат|зарплат|стоимост|бюджет|финанс|компенсац|выплат|субсид/i, name: "Wallet", Icon: Wallet },
  { re: /обуч|тренинг|курс|развит|навык|стажир|адаптац/i, name: "GraduationCap", Icon: GraduationCap },
  { re: /важно|осторожн|предупрежд|риск|ошибк|не забуд|нельзя|внимани/i, name: "AlertTriangle", Icon: AlertTriangle },
  { re: /шаг|план|чек-?лист|последовательн|порядок|инструкц|алгоритм/i, name: "ListChecks", Icon: ListChecks },
  { re: /поиск|найти|подбор|ваканс|отклик|кандидат|соискател/i, name: "Search", Icon: Search },
  { re: /коммуникац|обще|диалог|разговор|встреч|собеседован|интервью|обратн[ао]я связь/i, name: "MessageSquare", Icon: MessageSquare },
  { re: /безопасн|защит|надёжн|проверк|контрол/i, name: "ShieldCheck", Icon: ShieldCheck },
  { re: /инвалид|доступн|особенн|барьер|ограничен|нарушен/i, name: "Accessibility", Icon: Accessibility },
  { re: /компан|организац|бизнес|работодател|офис|предприят/i, name: "Building2", Icon: Building2 },
  { re: /нко|фонд|благотвор|помощ|поддержк|волонт/i, name: "Heart", Icon: Heart },
  { re: /партнёр|сотрудничеств|взаимодейств|совместн/i, name: "Handshake", Icon: Handshake },
  { re: /команд|сотрудник|коллег|люди|наставник|персонал/i, name: "Users", Icon: Users },
  { re: /цел\b|цели|результат|задач|эффект|метрик/i, name: "Target", Icon: Target },
  { re: /совет|рекоменд|идея|подсказк|лайфхак|принцип/i, name: "Lightbulb", Icon: Lightbulb },
];

const DEFAULT: { name: string; Icon: LucideIcon } = { name: "Info", Icon: Info };

const BY_NAME = new Map<string, LucideIcon>([
  ...RULES.map((r) => [r.name, r.Icon] as const),
  [DEFAULT.name, DEFAULT.Icon],
  // Ссылка по тексту не угадывается — её выбирают явно («иконка ссылки»).
  ["Link", Link],
  /*
    Иконки, которые ставятся по названию карточки, а не угадываются по тексту
    (см. cardArt.ts). В правилах подбора их нет — незачем, — но нарисовать их
    надо уметь, иначе вместо иконки встаёт заглушка Info.
  */
  ["MonitorSmartphone", MonitorSmartphone],
  ["Ban", Ban],
  /*
    Пять групп кандидатов — замечание Юли от 12 августа 2026 к «Шагу 4»
    («рисунок уха + текст на карточке»). Ставятся по названию карточки, см.
    cardArt.ts. Значок доступности (Accessibility) для опорно-двигательного
    аппарата уже заведён выше — он приходит и из правил подбора по тексту.
  */
  ["Ear", Ear],
  ["Eye", Eye],
  ["Brain", Brain],
  ["Speech", Speech],
  ["HeartPulse", HeartPulse],
  /*
    Перечёркнутый динамик — сомнение работодателя «Ему нельзя работать в шуме»
    на «Разговоре с работодателем» (замечание Мити от 15 августа 2026). По
    тексту не угадывается, ставится по названию карточки — см. cardArt.ts.
    Соседние два сомнения берут значки, которые уже заведены выше.
  */
  ["VolumeX", VolumeX],
  /*
    Галочка ставится у пунктов чек-листа («иконка галочка» в разметке) —
    решение дизайнера 11 августа 2026 по замечанию клиента к «Шагу 1».
    По тексту не угадывается: галочка говорит не о чём пункт, а о том, что
    его нужно отметить.
  */
  ["Check", Check],
  /*
    Крестик ставится у списка того, чего избегать («иконка крестик» в разметке) —
    замечание Мити от 11 августа 2026 к «Этике и коммуникации». По тексту не
    угадывается: он говорит не о чём пункт, а о том, что так делать не надо.
  */
  ["X", X],
]);

/** Иконка по тексту блока: {name, Icon}. */
export function iconForText(text: string): { name: string; Icon: LucideIcon } {
  const t = text || "";
  for (const r of RULES) if (r.re.test(t)) return { name: r.name, Icon: r.Icon };
  return DEFAULT;
}

/** Иконка по сохранённому имени (для показа/применения). */
export function iconByName(name?: string | null): LucideIcon {
  return (name && BY_NAME.get(name)) || DEFAULT.Icon;
}

/*
  ИМЕНА ИКОНОК ДЛЯ ПРОВЕРКИ ВЫГРУЗКИ — те же, что здесь, но в том виде, в каком
  они едут разработчику: строчными через дефис (MonitorSmartphone →
  monitor-smartphone).

  Список ОТКРЫТЫЙ — решение дизайнера: новые иконки Lucide берём свободно, когда
  они нужны. Но взять иконку — значит завести её здесь: имя, которого в этом
  файле нет, прототип нарисовать не может и молча ставит заглушку «Info», а
  разработчик получает имя, которое никто не подключал. Проверка ловит ровно
  это — опечатку и незаведённую иконку, а не сам факт новизны.
*/
export const KNOWN_ICONS = new Set(
  [...BY_NAME.keys()].map((n) => n.replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase()),
);
