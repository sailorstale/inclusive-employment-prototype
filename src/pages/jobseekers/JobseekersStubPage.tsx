import { PageHero } from "@/components/PageHero";

// Заглушка раздела «Для соискателей». Раздел намеренно не проработан:
// без подразделов, только страница-заполнитель. Старые адреса
// /jobseekers/* редиректятся сюда (см. App.tsx).

export function JobseekersStubPage() {
  return (
    <PageHero
      variant="track-hub"
      title="Для соискателей"
      lead="Раздел в разработке. Материалы для соискателей появятся позже — сейчас у него нет подразделов."
    />
  );
}
