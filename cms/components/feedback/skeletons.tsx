export function CardSkeleton() {
  return <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />;
}

export function TableSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      ))}
    </div>
  );
}
