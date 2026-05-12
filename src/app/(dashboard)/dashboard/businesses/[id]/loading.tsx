import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessLoading() {
  return (
    <div className="space-y-6 bg-canvas">
      {/* Business header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      {/* Tab bar */}
      <div className="flex gap-2 border-b border-hairline pb-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-t-lg" />
        ))}
      </div>
      {/* Tab content */}
      <div className="rounded-2xl border border-hairline bg-canvas p-6">
        <Skeleton className="h-5 w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
