export function SkeletonCard() {
  return (
    <div className="border border-border bg-card overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-muted" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-14 bg-muted rounded-sm" />
          <div className="h-5 w-10 bg-muted rounded-sm" />
        </div>
        <div className="h-6 w-3/4 bg-muted rounded-sm" />
        <div className="h-4 w-1/2 bg-muted rounded-sm" />
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div>
            <div className="h-3 w-16 bg-muted rounded-sm mb-1" />
            <div className="h-6 w-24 bg-muted rounded-sm" />
          </div>
          <div className="h-10 w-32 bg-muted rounded-sm" />
        </div>
      </div>
    </div>
  );
}
