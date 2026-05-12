import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get owner's business IDs
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id);

  const businessIds = businesses?.map((b) => b.id) ?? [];

  // Fetch all private_feedback for those businesses with business info
  let feedbackList: any[] = [];
  if (businessIds.length > 0) {
    const { data: feedback } = await supabase
      .from("private_feedback")
      .select(
        `
        id,
        business_id,
        message,
        rating,
        customer_name,
        customer_contact,
        is_resolved,
        created_at,
        businesses:business_id(name, logo_url)
      `
      )
      .in("business_id", businessIds)
      .order("created_at", { ascending: false });
    feedbackList = feedback ?? [];
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">
            Shield Inbox
          </h1>
          <p className="text-muted mt-1">
            Private feedback from customers who gave below-3-star ratings
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {feedbackList.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-hairline bg-canvas p-12 text-center">
            <p className="text-muted">No feedback yet</p>
            <p className="text-sm text-muted mt-2">
              Customer feedback will appear here when you receive below-3-star ratings
            </p>
          </div>
        ) : (
          feedbackList.map((item: any) => (
            <div
              key={item.id}
              className="rounded-2xl border border-hairline bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Business logo / initial */}
                <div className="h-10 w-10 rounded-full bg-surface-soft flex items-center justify-center text-sm font-semibold text-ink shrink-0">
                  {item.businesses?.name?.charAt(0) ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-ink">
                      {item.businesses?.name ?? "Unknown business"}
                    </span>
                    {item.rating && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-signature-coral/10 text-signature-coral">
                        {item.rating} ★
                      </span>
                    )}
                    {item.is_resolved ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-signature-forest/10 text-signature-forest">
                        Resolved
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                        Open
                      </span>
                    )}
                  </div>
                  {item.customer_name && (
                    <p className="text-xs text-muted mb-1">{item.customer_name}</p>
                  )}
                  <p className="text-sm text-muted mb-1">
                    {new Date(item.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-ink text-sm leading-relaxed">{item.message}</p>
                  {item.customer_contact && (
                    <p className="text-xs text-muted mt-2">
                      Contact: {item.customer_contact}
                    </p>
                  )}
                  <div className="mt-3">
                    <Link
                      href={`/dashboard/businesses/${item.business_id}`}
                      className="text-xs font-medium text-signature-forest hover:underline"
                    >
                      Manage in Shield Inbox →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
