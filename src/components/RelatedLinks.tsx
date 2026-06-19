import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// RelatedLinks (00b §2.1) — блок «Читайте также»: три карточки-ссылки на смежные
// страницы (заголовок + короткое описание). Набор задаётся на самой странице.

export type RelatedItem = {
  title: string;
  to: string;
  description: string;
};

export function RelatedLinks({ items }: { items: RelatedItem[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="mb-4 text-xl font-semibold text-foreground">
        Читайте также
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group flex flex-col rounded-lg border bg-card p-5 transition-colors hover:border-ring hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="flex items-center gap-1 font-medium text-foreground">
              {item.title}
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
