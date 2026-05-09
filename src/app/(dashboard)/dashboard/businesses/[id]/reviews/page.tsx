import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function BusinessReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted mb-2">
            <Link href="/dashboard" className="hover:text-ink">Dashboard</Link> / <Link href={`/dashboard/businesses/${id}`} className="hover:text-ink">Business</Link> / Reviews
          </div>
          <h1 className="font-display text-3xl font-medium text-ink mb-2">Reviews</h1>
          <p className="text-body">Review history and AI replies for business ID: {id}</p>
        </div>
      </div>
      
      <div className="rounded-2xl border border-hairline bg-canvas p-8 shadow-sm min-h-[400px] flex items-center justify-center text-muted">
        Reviews panel coming soon.
      </div>
    </div>
  )
}
