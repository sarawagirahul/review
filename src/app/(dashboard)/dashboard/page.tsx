import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus, BarChart3, MessageSquare, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user has any businesses
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .eq("is_active", true);

  if (!businesses || businesses.length === 0) {
    redirect("/dashboard/setup");
  }

  // Calculate totals
  const totalScans = businesses.reduce((sum, b) => sum + (b.total_scans || 0), 0);
  
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink mb-2">Overview</h1>
          <p className="text-body text-sm">Here's what's happening across your businesses today.</p>
        </div>
        <Link href="/dashboard/setup">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Business
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-muted">
            <BarChart3 className="h-5 w-5" />
            <span className="font-medium">Total QR Scans</span>
          </div>
          <p className="font-display text-4xl font-medium text-ink">{totalScans}</p>
        </div>
        <div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-muted">
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">Review Page Clicks</span>
          </div>
          <p className="font-display text-4xl font-medium text-ink">0</p>
        </div>
        <div className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-muted">
            <ShieldAlert className="h-5 w-5" />
            <span className="font-medium">Private Feedback</span>
          </div>
          <p className="font-display text-4xl font-medium text-ink">0</p>
        </div>
      </div>

      <h2 className="font-display text-xl font-medium text-ink mb-6">Your Businesses</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <div key={business.id} className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-ink text-lg">{business.name}</h3>
                <p className="text-sm text-muted">{business.city}</p>
              </div>
            </div>
            
            <div className="mt-auto pt-6 border-t border-hairline flex gap-2">
              <Link href={`/dashboard/businesses/${business.id}`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  Manage
                </Button>
              </Link>
              <Link href={`/dashboard/businesses/${business.id}/reviews`}>
                <Button variant="ghost" size="sm">
                  Reviews
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
