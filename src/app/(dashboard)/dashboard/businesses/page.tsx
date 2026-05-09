import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function BusinessesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-hairline bg-canvas p-8 shadow-sm text-center text-muted">
          Please sign in to view your businesses.
        </div>
      </div>
    );
  }

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, city, state, qr_slug, total_scans, total_reviews, total_feedback")
    .eq("owner_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="font-display text-3xl font-medium text-ink mb-2">My Businesses</h1>
        <p className="text-body">Manage your connected businesses here.</p>
      </div>

      {(!businesses || businesses.length === 0) ? (
        <div className="rounded-2xl border border-hairline bg-canvas p-8 shadow-sm text-center text-muted">
          No active businesses found. Head back to the dashboard to connect a location.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <div key={business.id} className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm flex flex-col">
              <div className="mb-4">
                <h2 className="font-medium text-ink text-xl">{business.name}</h2>
                <p className="text-sm text-muted">{business.city || business.state || "Location not set"}</p>
              </div>
              <div className="grid gap-3 mb-6 text-sm text-muted">
                <div>Scans: {business.total_scans || 0}</div>
                <div>Reviews: {business.total_reviews || 0}</div>
                <div>Feedback: {business.total_feedback || 0}</div>
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <Link href={`/dashboard/businesses/${business.id}`}>
                  <Button variant="secondary" className="w-full bg-white border border-hairline text-ink rounded-xl hover:bg-surface-soft">
                    Manage
                  </Button>
                </Link>
                <Link href={`/dashboard/businesses/${business.id}/reviews`}>
                  <Button variant="ghost" className="w-full rounded-xl text-ink hover:bg-surface-soft">
                    Reviews
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
