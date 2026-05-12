import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Layer 1 auth: verify user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Layer 2 auth: verify owner role
  const { data: userData } = await supabase
    .from("users")
    .select("role, full_name, avatar_url, email")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "owner") redirect("/login");

  // Fetch owner subscription/trial details
  const { data: ownerDetails } = await supabase
    .from("owner_details")
    .select("trial_ends_at, subscription_status")
    .eq("user_id", user.id)
    .single();

  // Fetch unread (unresolved) Shield Inbox count for all of this owner's businesses
  const { count: unreadFeedbackCount } = await supabase
    .from("private_feedback")
    .select("id", { count: "exact", head: true })
    .eq("is_resolved", false)
    .in(
      "business_id",
      (
        await supabase
          .from("businesses")
          .select("id")
          .eq("owner_id", user.id)
      ).data?.map((b: { id: string }) => b.id) ?? [],
    );

  return (
    <DashboardShell
      user={{ id: user.id, email: user.email }}
      userData={userData}
      ownerDetails={ownerDetails}
      unreadFeedbackCount={unreadFeedbackCount ?? 0}
    >
      {children}
    </DashboardShell>
  );
}
