import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface BusinessSettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BusinessSettingsPage({
  params,
}: BusinessSettingsPageProps) {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/businesses/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">
            Business Settings
          </h1>
          <p className="text-muted mt-1">{business.name}</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="rounded-2xl border border-hairline bg-white p-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-6">
              Basic Information
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  defaultValue={business.name}
                  className="w-full px-4 py-3 rounded-lg border border-hairline bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Description
                </label>
                <textarea
                  defaultValue={business.description || ""}
                  className="w-full px-4 py-3 rounded-lg border border-hairline bg-white focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[100px]"
                />
              </div>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </form>
          </div>

          {/* Review Page Customization */}
          <div className="rounded-2xl border border-hairline bg-white p-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-6">
              Review Page Customization
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g., We'd love to hear from you!"
                  defaultValue={business.review_page_tagline || ""}
                  className="w-full px-4 py-3 rounded-lg border border-hairline bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Thank You Message
                </label>
                <textarea
                  placeholder="e.g., Thanks for taking the time to share your feedback!"
                  defaultValue={business.review_page_thank_you_message || ""}
                  className="w-full px-4 py-3 rounded-lg border border-hairline bg-white focus:outline-none focus:ring-2 focus:ring-primary resize-none min-h-[100px]"
                />
              </div>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </form>
          </div>

          {/* Social Links */}
          <div className="rounded-2xl border border-hairline bg-white p-8">
            <h2 className="font-display text-xl font-semibold text-ink mb-6">
              Social Links
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/yourbusiness"
                  defaultValue={business.social_instagram || ""}
                  className="w-full px-4 py-3 rounded-lg border border-hairline bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  defaultValue={business.social_whatsapp || ""}
                  className="w-full px-4 py-3 rounded-lg border border-hairline bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-hairline bg-white p-6">
            <h3 className="font-semibold text-ink mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <a
                href={`/r/${business.qr_slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition text-center text-sm"
              >
                Preview Review Page
              </a>
              <button className="w-full px-4 py-3 rounded-lg border border-hairline hover:bg-surface-soft transition text-sm font-medium">
                Download QR Code
              </button>
              <button className="w-full px-4 py-3 rounded-lg border border-hairline hover:bg-surface-soft transition text-sm font-medium">
                View Analytics
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-hairline bg-white p-6">
            <h3 className="font-semibold text-ink mb-2">Business ID</h3>
            <code className="block text-xs bg-surface-soft px-3 py-2 rounded font-mono break-all">
              {business.id}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
