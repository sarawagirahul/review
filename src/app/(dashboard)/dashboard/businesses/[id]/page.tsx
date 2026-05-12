import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import BusinessTabs from "./BusinessTabs";

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

  const { data: business, error } = await supabase
    .from("businesses")
    .select(
      `id, name, city, state, logo_url, google_rating, google_place_id,
       review_link, qr_slug, description, brand_color_primary,
       brand_color_secondary, review_page_tagline,
       review_page_thank_you_message, contact_email, contact_phone,
       whatsapp_business, notify_email, notify_new_review,
       notify_shield_catch, notify_weekly_summary, is_active,
       total_scans, google_review_count, latitude, longitude,
       primary_category`,
    )
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();

  if (error || !business) {
    notFound();
  }

  return <BusinessTabs business={business} />;
}
