import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6 bg-canvas">
      <Skeleton className="h-8 w-32" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-hairline bg-canvas p-4">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-hairline bg-canvas p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
