import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Building2 } from "lucide-react";

export default async function BusinessesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, name, city, state, qr_slug, logo_url, google_rating, total_scans")
    .eq("owner_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink mb-2">My Businesses</h1>
          <p className="text-body">Manage your connected businesses here.</p>
        </div>
        <Link href="/dashboard/setup">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
            <Plus className="h-4 w-4" /> Add Business
          </button>
        </Link>
      </div>

      {(!businesses || businesses.length === 0) ? (
        <div className="rounded-2xl border border-hairline bg-canvas p-12 text-center">
          <Building2 className="h-10 w-10 text-muted mx-auto mb-4" />
          <h2 className="text-lg font-medium text-ink mb-2">No businesses yet</h2>
          <p className="text-sm text-muted mb-6">Add your first business to start collecting reviews.</p>
          <Link href="/dashboard/setup">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
              <Plus className="h-4 w-4" /> Add Business
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => {
            const logoInitial = business.name?.charAt(0).toUpperCase() || "B";
            const location = business.city || business.state || "Location not set";

            return (
              <div key={business.id} className="rounded-2xl border border-hairline bg-canvas p-6 shadow-sm flex flex-col">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {business.logo_url ? (
                      <img
                        src={business.logo_url}
                        alt={business.name}
                        className="h-8 w-8 rounded-full object-cover bg-accent-light"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-accent-light text-accent flex items-center justify-center text-xs font-semibold">
                        {logoInitial}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-medium text-ink text-lg">{business.name}</h2>
                    <p className="text-xs text-muted">{location}</p>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wide">All-time scans</p>
                    <p className="text-xl font-semibold text-ink">{business.total_scans || 0}</p>
                  </div>
                  {business.google_rating && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-ink">{business.google_rating}</p>
                      <p className="text-sm text-accent">★</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto">
                  <Link href={`/dashboard/businesses/${business.id}`}>
                    <button className="w-full px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
                      Manage
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
