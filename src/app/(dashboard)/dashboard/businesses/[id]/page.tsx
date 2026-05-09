import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function BusinessDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <div className="text-sm text-muted mb-2">
            <Link href="/dashboard" className="hover:text-ink">Dashboard</Link> / Business Details
          </div>
          <h1 className="font-display text-3xl font-medium text-ink mb-2">Manage Business</h1>
          <p className="text-body">Settings and details for business ID: {id}</p>
        </div>
        <Link href={`/dashboard/businesses/${id}/reviews`}>
          <Button variant="secondary" className="bg-white border border-hairline text-ink rounded-xl hover:bg-surface-soft">
            View Reviews
          </Button>
        </Link>
      </div>
      
      <div className="rounded-2xl border border-hairline bg-canvas p-8 shadow-sm min-h-[400px] flex items-center justify-center text-muted">
        Business settings panel coming soon.
      </div>
    </div>
  )
}
