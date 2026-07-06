import * as React from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

// BackToTop (00 — кнопка «Наверх») — на длинных страницах: фиксирована в правом
// нижнем углу, появляется после прокрутки, с ТЕКСТОВОЙ подписью «Наверх»
// (не только иконка). Возврат к началу страницы плавной прокруткой.

export function BackToTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > 600);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full border bg-background/95 px-4 py-2.5 text-sm font-medium text-foreground shadow-md backdrop-blur transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-4 w-4" />
      Наверх
    </button>
  );
}
