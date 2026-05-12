import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: userData } = await supabase
    .from("users")
    .select("full_name, email, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      final_text,
      language,
      created_at,
      businesses:business_id(name, logo_url, city)
    `
    )
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <ProfileClient
      user={userData ?? { full_name: null, email: user.email ?? null, avatar_url: null, created_at: new Date().toISOString() }}
      reviews={reviews ?? []}
    />
  );
}
