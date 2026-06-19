import { PageHero } from "@/components/PageHero";
import { CtaButton } from "@/components/PromoBanner";

// 404 (33 — Страница не найдена). Сквозная, без бокового меню.
export function NotFound() {
  return (
    <div className="py-12">
      <PageHero
        variant="404"
        eyebrow="Ошибка 404"
        title="Страница не найдена"
        lead="Возможно, ссылка устарела или адрес введён с ошибкой. Вернитесь на главную или воспользуйтесь меню вверху."
      />
      <div className="mt-6">
        <CtaButton label="На главную" to="/" />
      </div>
    </div>
  );
}
