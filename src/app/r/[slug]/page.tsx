import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ReviewPageClient } from "./ReviewPageClient";

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ReviewPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  let { data: business } = await supabase
    .from("businesses")
    .select("name, description, logo_url")
    .eq("qr_slug", slug)
    .eq("is_active", true)
    .single();

  if (!business) {
    const fallback = await supabase
      .from("businesses")
      .select("name, description, logo_url")
      .eq("id", slug)
      .eq("is_active", true)
      .single();

    business = fallback.data;
  }

  if (!business) {
    return {
      title: "Business Not Found",
      description: "This business review page is not available.",
    };
  }

  return {
    title: `Review ${business.name} | ReviewBoost`,
    description:
      business.description || `Share your experience with ${business.name}`,
    openGraph: {
      title: `Review ${business.name}`,
      description: `Tell ${business.name} how they're doing!`,
      type: "website",
    },
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  // Fetch business by QR slug, with fallback to ID-based lookup
  let businessQuery = await supabase
    .from("businesses")
    .select(
      `
      id,
      owner_id,
      name,
      description,
      logo_url,
      qr_slug,
      is_active,
      owner_details:owner_id(subscription_status, trial_ends_at),
      review_page_tagline,
      review_page_thank_you_message,
      social_instagram,
      social_whatsapp
    `,
    )
    .eq("qr_slug", slug)
    .single();

  let business = businessQuery.data;
  if (!business) {
    const fallbackQuery = await supabase
      .from("businesses")
      .select(
        `
        id,
        owner_id,
        name,
        description,
        logo_url,
        qr_slug,
        is_active,
        owner_details:owner_id(subscription_status, trial_ends_at),
        review_page_tagline,
        review_page_thank_you_message,
        social_instagram,
        social_whatsapp
      `,
      )
      .eq("id", slug)
      .single();

    business = fallbackQuery.data;
  }

  if (!business) {
    notFound();
  }

  // Check if business is active and subscription is valid
  const ownerDetails = business.owner_details as any;
  const isTrialExpired =
    ownerDetails?.subscription_status === "trial" &&
    ownerDetails?.trial_ends_at &&
    new Date(ownerDetails.trial_ends_at) < new Date();

  const isSubscriptionActive =
    ownerDetails?.subscription_status === "active" ||
    (ownerDetails?.subscription_status === "trial" && !isTrialExpired);

  if (!business.is_active || !isSubscriptionActive) {
    // Show fallback: basic Google review link
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-display font-semibold text-ink mb-4">
            {business.name}
          </h1>
          <p className="text-muted mb-6">
            This business is not currently accepting reviews. Please try again
            later or post your review directly on Google.
          </p>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(business.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition"
          >
            Find on Google
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-canvas via-surface-soft to-canvas">
      <ReviewPageClient business={business} />
    </div>
  );
}
