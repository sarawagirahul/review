import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 bg-canvas">
      {/* Profile header */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-28" />
      </div>
      {/* Reviews section */}
      <Skeleton className="h-5 w-28 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-hairline bg-canvas p-4">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-20 mb-3" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
