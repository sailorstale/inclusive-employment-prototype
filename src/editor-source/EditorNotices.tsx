import * as React from "react";
import { AlertTriangle, HardDrive, X } from "lucide-react";
import { useEditor } from "./EditorProvider";
import { useComments } from "./CommentsProvider";

// Тост ошибки сохранения и баннер «локальный режим». Закрывают риски:
// тихий сбой сохранения (C3) и размытость «где правда» (локально vs сервер).

function Toast({ notice, dismiss }: { notice: string; dismiss: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(dismiss, 7000);
    return () => clearTimeout(t);
  }, [dismiss]);
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[min(92vw,420px)] -translate-x-1/2">
      <div className="flex items-start gap-2 rounded-lg border border-[hsl(var(--bad)/0.4)] bg-card px-3 py-2.5 text-sm text-card-foreground shadow-xl">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--bad))]" />
        <span className="flex-1 leading-snug">{notice}</span>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Закрыть"
          className="rounded-md p-0.5 text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function EditorToast() {
  const { notice, dismissNotice } = useEditor();
  const { notice: cNotice, dismissNotice: dismissCNotice } = useComments();
  // Ошибка правки в приоритете; иначе — ошибка комментария/удаления блока.
  if (notice) return <Toast notice={notice} dismiss={dismissNotice} />;
  if (cNotice) return <Toast notice={cNotice} dismiss={dismissCNotice} />;
  return null;
}

export function StoreModeBanner() {
  const { storeMode, loaded, editorMode } = useEditor();
  // Предупреждаем только когда это важно: загрузились, локальный режим, и человек
  // собирается редактировать.
  if (!loaded || storeMode !== "local" || !editorMode) return null;
  return (
    <div className="flex items-center justify-center gap-2 border-b border-[hsl(var(--warn)/0.3)] bg-[hsl(var(--warn)/0.12)] px-4 py-1.5 text-center text-[12.5px] text-[hsl(var(--warn))]">
      <HardDrive className="h-3.5 w-3.5 shrink-0" />
      <span>
        Локальный режим: сервер недоступен. Правки сохраняются только в этом
        браузере и не видны другим.
      </span>
    </div>
  );
}
