import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Download, Eye, Settings } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface BusinessPageProps {
  params: Promise<{ id: string }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch business
  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (error || !business) {
    notFound();
  }

  // Fetch stats
  const statsRes = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/businesses/${id}/stats`,
  );
  const stats = statsRes.ok ? await statsRes.json() : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-medium text-ink">
            {business.name}
          </h1>
          <p className="text-muted mt-1">
            {business.city}, {business.state}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <a
          href={`/r/${business.qr_slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90"
        >
          <Eye className="w-4 h-4" />
          Preview
        </a>
        <Link href={`/dashboard/businesses/${id}/settings`}>
          <Button variant="secondary" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-hairline bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-muted">QR Scans (30d)</p>
            <p className="text-4xl font-semibold text-ink mt-3">
              {stats.stats?.eventCounts?.qr_scan || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-hairline bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-muted">Reviews Posted</p>
            <p className="text-4xl font-semibold text-ink mt-3">
              {stats.stats?.eventCounts?.review_posted || 0}
            </p>
          </div>
          <div className="rounded-2xl border border-hairline bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-muted">Feedback Received</p>
            <p className="text-4xl font-semibold text-ink mt-3">
              {stats.stats?.eventCounts?.feedback_submitted || 0}
            </p>
          </div>
        </div>
      )}

      {/* QR Code Section */}
      <div className="rounded-2xl border border-hairline bg-white p-8">
        <h2 className="font-display text-2xl font-semibold text-ink mb-6">
          QR Code
        </h2>
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted mb-4">Review URL</p>
          <code className="px-4 py-2 rounded-lg bg-surface-soft text-ink font-mono text-sm">
            reviewboost.in/r/{business.qr_slug}
          </code>
          <div className="mt-6 p-6 rounded-lg bg-white border-2 border-gray-200">
            {/* QR code will be rendered here */}
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-muted text-sm">QR Code</p>
            </div>
          </div>
          <Button variant="secondary" className="mt-6 gap-2">
            <Download className="w-4 h-4" />
            Download QR
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      {stats?.recentReviews && stats.recentReviews.length > 0 && (
        <div className="rounded-2xl border border-hairline bg-white p-8">
          <h2 className="font-display text-2xl font-semibold text-ink mb-6">
            Recent Reviews
          </h2>
          <div className="space-y-4">
            {stats.recentReviews.map((review: any) => (
              <div
                key={review.id}
                className="p-4 rounded-lg border border-hairline hover:bg-surface-soft transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-ink">
                    {review.customer_name || "Anonymous"}
                  </p>
                  <span className="text-sm text-muted">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted">{review.review_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
