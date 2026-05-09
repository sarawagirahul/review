import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all feedback for user's businesses
  const { data: feedback } = await supabase
    .from("private_feedback")
    .select(
      `
      id,
      business_id,
      feedback_text,
      rating,
      created_at,
      businesses:business_id(name)
    `,
    )
    .order("created_at", { ascending: false });

  // Filter to only user's businesses
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id);

  const businessIds = businesses?.map((b) => b.id) || [];
  const userFeedback =
    feedback?.filter((f) => businessIds.includes(f.business_id)) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">
            Private Feedback
          </h1>
          <p className="text-muted mt-1">
            Feedback from customers who gave ratings below 3 stars
          </p>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {userFeedback.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-hairline bg-canvas p-12 text-center">
            <p className="text-muted">No feedback yet</p>
            <p className="text-sm text-muted mt-2">
              Customer feedback will appear here when you receive below-3-star
              ratings
            </p>
          </div>
        ) : (
          userFeedback.map((item: any) => (
            <div
              key={item.id}
              className="rounded-2xl border border-hairline bg-white p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-ink">
                      {item.businesses?.name}
                    </h3>
                    {item.rating && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-signature-coral/10 text-signature-coral">
                        {item.rating} stars
                      </span>
                    )}
                  </div>
                  <p className="text-muted text-sm mb-3">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                  <p className="text-ink leading-relaxed">
                    {item.feedback_text}
                  </p>
                </div>
                <button className="p-2 hover:bg-surface-soft rounded-lg transition text-muted hover:text-signature-coral">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
