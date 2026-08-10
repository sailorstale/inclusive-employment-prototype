import type { Comment } from "@/editor-source/comments";
import { appliedAllFor, awaitingRound } from "./appliedComments";

/*
  ИСХОД ЗАМЕЧАНИЯ — одно место, где он считается.

  Исход показывают сразу двое: карточка в панели (PageComments) и рамка поверх
  страницы (CommentFrames). Считать его в каждом из них по отдельности нельзя —
  правила разойдутся, и получится, что рамка зелёная, а карточка красная.

  Четыре исхода:

  open    — замечание ждёт работы;
  round   — мы разобрали замечание, а клиент ответил и ждёт правки ещё раз;
  skipped — «не применяем», дизайнер разбирает замечание сам;
  done    — правка внесена, разговор закончен.
*/
export type CommentState = "open" | "round" | "skipped" | "done";

/*
  «Сделано» сильнее «не применяем»: если правка уже внесена, спор о том, браться
  ли за неё, потерял смысл.

  А ответ клиента сильнее «сделано»: он прочитал наш разбор и сказал, что всё
  равно не то. Значит, работа по замечанию открылась заново.

  Признак «сделано» берём из журнала разбора (appliedComments.ts), который лежит
  в коде рядом с самой правкой. Старое серверное поле resolved тоже уважаем: им
  помечены замечания, разобранные до появления журнала.
*/
export function commentState(rec: Comment): CommentState {
  const applied = appliedAllFor(rec.id).length > 0 || rec.resolved;
  if (applied && awaitingRound(rec.id, (rec.replies ?? []).length)) return "round";
  if (applied) return "done";
  if (rec.skipped) return "skipped";
  return "open";
}
