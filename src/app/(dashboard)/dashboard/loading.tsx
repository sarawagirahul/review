import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 bg-canvas">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-hairline bg-canvas p-4">
            <Skeleton className="h-3 w-20 mb-3" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      {/* Chart skeleton */}
      <div className="rounded-2xl border border-hairline bg-canvas p-6">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="flex items-end gap-2 h-48">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded"
              style={{ height: `${30 + Math.random() * 70}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
