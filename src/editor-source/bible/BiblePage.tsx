import * as React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CommentsProvider, useComments } from "@/editor-source/CommentsProvider";
import { cn } from "@/lib/utils";
import { BibleComments, type BibleCommentGroup } from "./BibleComments";
import { BibleDoc } from "./BibleDoc";
import { bibleBlocks, bibleToc } from "./bible.generated";
import { bibleCommentId, blocksOf, newUid } from "./commentIds";

/*
  СПРАВОЧНИК ФОРМАТА — страница /bible.

  Три колонки: оглавление, документ, замечания. Раскладка та же, что у
  инструмента сверки, и по той же причине: читаешь в середине, а всё
  вспомогательное держишь по краям, не закрывая текст.

  Страница живёт вне общей обвязки сайта (см. App.tsx): это документ для
  разработчика, а не раздел сайта, и меню разделов с баннером ему только мешают.

  Замечания идут отдельным потоком «bible» — своё хранилище на сервере
  (server/bibleComments.js). Разговор о формате не смешивается с очередью
  замечаний клиента по страницам.
*/

/** Имя автора спрашиваем один раз: паролей на стенде нет, подписаться нечем. */
const AUTHOR_KEY = "inclusion-bible-author";

const readAuthor = () => {
  try {
    return window.localStorage.getItem(AUTHOR_KEY) ?? "";
  } catch {
    return "";
  }
};

function BibleBody() {
  const { comments, storeMode, setComment, toggleClosed, addReply } = useComments();
  /*
    Выделение множественное: одно замечание нередко относится к нескольким
    кускам подряд. Обычный клик начинает выделение заново, клик с Shift, Cmd или
    Ctrl добавляет место к уже выделенным.
  */
  const [picked, setPicked] = React.useState<string[]>([]);
  /** Блоки замечания, открытого в панели: их подсвечиваем отдельной рамкой. */
  const [active, setActive] = React.useState<string[]>([]);
  const [scrollTo, setScrollTo] = React.useState<string | null>(null);
  const [author, setAuthorState] = React.useState(readAuthor);
  const [tocQuery, setTocQuery] = React.useState("");

  const textById = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const b of bibleBlocks) map.set(b.id, b.text);
    return map;
  }, []);

  const groups = React.useMemo<BibleCommentGroup[]>(
    () =>
      comments
        .filter((rec) => rec.id.includes("##") && (rec.text || "").trim())
        .map((rec) => ({ rec, paths: blocksOf(rec.id) }))
        .sort((a, b) => a.rec.createdAt.localeCompare(b.rec.createdAt)),
    [comments],
  );

  const commented = React.useMemo(
    () => new Set(groups.filter((g) => !g.rec.closed).flatMap((g) => g.paths)),
    [groups],
  );

  const saveAuthor = (name: string) => {
    setAuthorState(name);
    try {
      window.localStorage.setItem(AUTHOR_KEY, name);
    } catch {
      /* приватный режим браузера — просто не запомним имя */
    }
  };

  const pick = (id: string, addToPicked: boolean) =>
    setPicked((prev) => {
      if (!addToPicked) return prev.length === 1 && prev[0] === id ? [] : [id];
      return prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
    });

  const add = (text: string, who: string) => {
    if (!picked.length) return;
    /*
      Снимок берём по первому выделенному месту: в списке замечание подписано
      одной строкой, а сколько мест оно держит, панель скажет отдельно.
    */
    setComment(
      {
        id: bibleCommentId(picked, newUid()),
        page: "/bible",
        blockType: bibleBlocks.find((b) => b.id === picked[0])?.kind ?? null,
        original: textById.get(picked[0]) ?? null,
        author: who || author || null,
      },
      text,
    );
    setPicked([]);
  };

  const remove = (id: string) => {
    const rec = comments.find((c) => c.id === id);
    if (!rec) return;
    setComment({ id, page: "/bible", author: rec.author }, "");
  };

  const toc = bibleToc.filter(
    (t) => !tocQuery.trim() || t.text.toLowerCase().includes(tocQuery.trim().toLowerCase()),
  );

  const pickedSet = React.useMemo(() => new Set(picked), [picked]);
  const activeSet = React.useMemo(() => new Set(active), [active]);

  /*
    Раскладка сжимается по ширине окна, а не ломается. Три колонки помещаются
    примерно от 1100 точек; на окне поуже первым уходит оглавление (оно
    вспомогательное), а на совсем узком колонки встают друг под друга и страница
    прокручивается целиком. Без этого средняя колонка схлопывалась в ноль:
    боковые заданы в точках и вместе занимали больше, чем всё окно.
  */
  return (
    <div className="grid min-h-screen grid-cols-1 divide-x md:h-screen md:min-h-0 md:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[240px_minmax(0,1fr)_340px]">
      {/* ЛЕВО — оглавление с поиском: в справочнике 24 компонента, глазами их не найти. */}
      <nav className="hidden min-h-0 flex-col gap-2 overflow-y-auto bg-muted/30 p-3 xl:flex">
        <input
          value={tocQuery}
          onChange={(e) => setTocQuery(e.target.value)}
          placeholder="Найти компонент…"
          aria-label="Поиск по оглавлению"
          className="w-full rounded border bg-background px-2 py-1.5 text-sm"
        />
        <ul className="space-y-0.5">
          {toc.map((t) => (
            <li key={t.anchor}>
              <a
                href={`#${t.anchor}`}
                className={cn(
                  "block rounded px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                  t.level === 2 &&
                    "mt-3 text-[11px] font-medium uppercase tracking-wide text-foreground",
                )}
              >
                {t.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ЦЕНТР — сам документ. */}
      <div className="flex min-h-0 flex-col">
        <header className="flex items-center gap-3 border-b bg-muted/40 px-4 py-2">
          <Link
            to="/general/about"
            className="inline-flex items-center gap-1 rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-foreground/80 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden /> К сайту
          </Link>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">JSON — библия компонентов</h1>
            <p className="truncate text-xs text-muted-foreground">
              Описание формата выгрузки: устройство файла, все компоненты, правила
            </p>
          </div>
          <Link
            to="/checks"
            className="ml-auto rounded-md border bg-background px-2.5 py-1 text-xs font-medium text-foreground/80 hover:text-foreground"
          >
            Проверить выгрузку
          </Link>
        </header>

        {/* Своя прокрутка только там, где колонки стоят рядом: на узком экране
            прокручивается вся страница целиком. */}
        <div className="md:min-h-0 md:flex-1 md:overflow-y-auto">
          <BibleDoc
            picked={pickedSet}
            onPick={pick}
            commented={commented}
            active={activeSet}
            scrollTo={scrollTo}
          />
        </div>
      </div>

      {/* ПРАВО — замечания. */}
      <BibleComments
        picked={picked}
        pickedTexts={picked.map((id) => textById.get(id) ?? "")}
        onClearPicked={() => setPicked([])}
        groups={groups}
        author={author}
        onAuthor={saveAuthor}
        onAdd={add}
        onReply={(id, text) => addReply(id, author || "без имени", text)}
        onToggleClosed={toggleClosed}
        onDelete={remove}
        onGoTo={(paths) => {
          // Читаем чужое замечание — свои выделения при этом сбрасываем, иначе
          // форма осталась бы открытой на местах, о которых речь не идёт.
          setPicked([]);
          setActive(paths);
          setScrollTo(paths[0] ?? null);
        }}
        storeMode={storeMode}
      />
    </div>
  );
}

export function BiblePage() {
  return (
    <CommentsProvider scope="bible">
      <BibleBody />
    </CommentsProvider>
  );
}
