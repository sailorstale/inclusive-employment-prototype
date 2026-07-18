// Заглушка раздела «Для соискателей». Раздел намеренно не проработан:
// без подразделов, только страница-заполнитель. Старые адреса
// /jobseekers/* редиректятся сюда (см. App.tsx).

export function JobseekersStubPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Для соискателей
      </h1>
      <p className="mt-4 text-base text-muted-foreground">
        Раздел в разработке. Материалы для соискателей появятся позже —
        сейчас у него нет подразделов.
      </p>
    </div>
  );
}
