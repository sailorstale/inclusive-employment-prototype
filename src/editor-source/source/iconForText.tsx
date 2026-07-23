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
