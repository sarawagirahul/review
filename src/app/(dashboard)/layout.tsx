import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is authenticated
  if (!user) {
    redirect("/login");
  }

  // Check if user has owner role
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "owner") {
    redirect("/login");
  }

  // Check trial status
  const { data: ownerDetails } = await supabase
    .from("owner_details")
    .select("trial_ends_at, subscription_status")
    .eq("user_id", user.id)
    .single();

  const isTrialExpired =
    ownerDetails?.trial_ends_at &&
    new Date(ownerDetails.trial_ends_at) < new Date();
  const daysUntilExpiry = ownerDetails?.trial_ends_at
    ? Math.ceil(
        (new Date(ownerDetails.trial_ends_at).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <div className="flex min-h-screen bg-canvas text-body font-sans flex-col">
      {/* Trial Banner */}
      {ownerDetails?.subscription_status === "trial" &&
        daysUntilExpiry !== null && (
          <div
            className={`px-6 py-3 text-center ${
              daysUntilExpiry <= 2
                ? "bg-signature-coral/10 border-b border-signature-coral/30"
                : daysUntilExpiry <= 5
                  ? "bg-yellow-50 border-b border-yellow-200"
                  : "bg-blue-50 border-b border-blue-200"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                daysUntilExpiry <= 2
                  ? "text-signature-coral"
                  : daysUntilExpiry <= 5
                    ? "text-yellow-700"
                    : "text-blue-700"
              }`}
            >
              {isTrialExpired ? (
                <>
                  Your trial has expired.{" "}
                  <Link
                    href="/dashboard/billing"
                    className="underline font-semibold"
                  >
                    Upgrade now
                  </Link>{" "}
                  to continue.
                </>
              ) : daysUntilExpiry === 0 ? (
                <>
                  Your trial expires today!{" "}
                  <Link
                    href="/dashboard/billing"
                    className="underline font-semibold"
                  >
                    Upgrade now
                  </Link>{" "}
                  to keep your business active.
                </>
              ) : (
                <>
                  Your trial expires in {daysUntilExpiry} day
                  {daysUntilExpiry !== 1 ? "s" : ""}.{" "}
                  <Link
                    href="/dashboard/billing"
                    className="underline font-semibold"
                  >
                    Upgrade now
                  </Link>{" "}
                  to continue using JustHustle.
                </>
              )}
            </p>
          </div>
        )}

      <div className="flex flex-1">
        <aside className="w-64 border-r border-hairline bg-surface-soft p-6 hidden md:flex md:flex-col">
          <div className="font-display text-xl font-bold text-ink mb-10 flex items-center gap-2">
            JustHustle
          </div>
          <nav className="space-y-2 text-sm font-medium text-muted flex-1 flex flex-col">
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-md hover:bg-white hover:text-ink hover:shadow-sm transition-all"
            >
              Dashboard Overview
            </Link>
            <Link
              href="/dashboard/businesses"
              className="px-3 py-2 rounded-md hover:bg-white hover:text-ink hover:shadow-sm transition-all"
            >
              My Businesses
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-3 py-2 rounded-md hover:bg-white hover:text-ink hover:shadow-sm transition-all"
            >
              Settings
            </Link>
            <Link
              href="/dashboard/billing"
              className="px-3 py-2 rounded-md hover:bg-white hover:text-ink hover:shadow-sm transition-all"
            >
              Billing
            </Link>
          </nav>

          <div className="mt-auto pt-6 border-t border-hairline">
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="px-3 py-2 text-sm font-medium text-signature-coral hover:bg-white rounded-md transition-all w-full text-left cursor-pointer"
              >
                Log Out
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 p-8 h-screen overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
