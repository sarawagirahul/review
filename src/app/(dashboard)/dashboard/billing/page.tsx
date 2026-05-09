import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const PLANS = [
  {
    name: "Starter",
    interval: "monthly",
    price: "₹499",
    period: "/month",
    features: [
      "Up to 100 QR scans/month",
      "Basic analytics",
      "Email support",
      "1 business location",
    ],
  },
  {
    name: "Professional",
    interval: "monthly",
    price: "₹999",
    period: "/month",
    popular: true,
    features: [
      "Unlimited QR scans",
      "Advanced analytics",
      "Priority support",
      "Up to 5 business locations",
      "AI review generation",
      "Review Shield (Review.ai)",
    ],
  },
  {
    name: "Enterprise",
    interval: "monthly",
    price: "₹2,499",
    period: "/month",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Dedicated account manager",
      "Up to 50 business locations",
      "White-label options",
      "API access",
    ],
  },
];

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch subscription status
  const { data: ownerDetails } = await supabase
    .from("owner_details")
    .select(
      "subscription_status, subscription_interval, trial_ends_at, razorpay_subscription_id",
    )
    .eq("user_id", user.id)
    .single();

  const isOnTrial = ownerDetails?.subscription_status === "trial";
  const isActive = ownerDetails?.subscription_status === "active";
  const daysUntilExpiry =
    isOnTrial && ownerDetails?.trial_ends_at
      ? Math.ceil(
          (new Date(ownerDetails.trial_ends_at).getTime() -
            new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

  return (
    <div className="space-y-12">
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
            Billing & Subscription
          </h1>
          <p className="text-muted mt-1">
            Manage your JustHustle subscription
          </p>
        </div>
      </div>

      {/* Trial Status */}
      {isOnTrial && daysUntilExpiry !== null && (
        <div
          className={`rounded-2xl border-2 p-6 ${
            daysUntilExpiry <= 2
              ? "border-signature-coral bg-signature-coral/5"
              : "border-blue-200 bg-blue-50"
          }`}
        >
          <p
            className={`font-semibold ${
              daysUntilExpiry <= 2 ? "text-signature-coral" : "text-blue-900"
            }`}
          >
            {daysUntilExpiry <= 0
              ? "Your trial has expired"
              : daysUntilExpiry === 1
                ? "Your trial expires today!"
                : `Your trial expires in ${daysUntilExpiry} days`}
          </p>
          <p className="text-sm mt-2 opacity-90">
            Upgrade now to continue using JustHustle without interruption
          </p>
        </div>
      )}

      {isActive && (
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-6">
          <p className="font-semibold text-green-900">
            ✓ Your subscription is active
          </p>
          <p className="text-sm mt-2 text-green-800">
            You have access to all{" "}
            {ownerDetails?.subscription_interval === "annual"
              ? "annual"
              : "monthly"}{" "}
            plan features
          </p>
        </div>
      )}

      {/* Pricing Plans */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink mb-8">
          Choose Your Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border-2 p-8 transition-all ${
                plan.popular
                  ? "border-primary bg-primary/5 shadow-lg scale-105"
                  : "border-hairline bg-white hover:border-primary/50"
              }`}
            >
              {plan.popular && (
                <div className="inline-block px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold mb-4">
                  Most Popular
                </div>
              )}

              <h3 className="font-display text-2xl font-semibold text-ink mb-2">
                {plan.name}
              </h3>

              <div className="mb-6">
                <span className="text-4xl font-bold text-ink">
                  {plan.price}
                </span>
                <span className="text-muted ml-2">{plan.period}</span>
              </div>

              <Button
                variant={plan.popular ? "primary" : "secondary"}
                size="lg"
                className="w-full mb-8"
              >
                Subscribe Now
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-ink">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Annual Plans */}
      <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8">
        <h3 className="font-display text-xl font-semibold text-ink mb-4">
          Save 20% with Annual Plans
        </h3>
        <p className="text-muted mb-6">
          Get 2 months free when you subscribe to an annual plan. Perfect for
          growing businesses!
        </p>
        <Button variant="primary">View Annual Pricing</Button>
      </div>

      {/* Subscription Management */}
      {isActive && (
        <div className="rounded-2xl border border-hairline bg-white p-8">
          <h3 className="font-display text-xl font-semibold text-ink mb-6">
            Current Subscription
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-muted">
              You can manage, upgrade, or cancel your subscription at any time.
            </p>
            <Button variant="secondary">Manage Subscription</Button>
            <Button variant="ghost">Cancel Subscription</Button>
          </div>
        </div>
      )}
    </div>
  );
}
