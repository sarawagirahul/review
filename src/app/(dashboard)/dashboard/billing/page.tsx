"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { createBrowserClient } from "@supabase/ssr";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const PLANS = [
  {
    interval: "monthly" as const,
    label: "Monthly",
    price: "₹599",
    priceNote: "per month",
    annualEquivalent: null,
  },
  {
    interval: "annual" as const,
    label: "Annual",
    price: "₹4,999",
    priceNote: "per year",
    annualEquivalent: "~₹417/month — save 30%",
  },
];

const FEATURES = [
  "Unlimited QR codes per business",
  "AI-generated review drafts (EN / HI / Hinglish)",
  "Review Shield — intercepts negative reviews",
  "Up to 3 business locations",
  "Analytics dashboard",
  "Email notifications",
];

interface OwnerDetails {
  subscription_status: string;
  subscription_interval: string | null;
  trial_ends_at: string | null;
  razorpay_subscription_id: string | null;
}

export default function BillingPage() {
  const [ownerDetails, setOwnerDetails] = useState<OwnerDetails | null>(null);
  const [isSubscribing, setIsSubscribing] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<{ name: string; email: string; phone: string } | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Load Razorpay script on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Check for payment success query param
  useEffect(() => {
    const success =
      new URLSearchParams(window.location.search).get("payment") === "success";
    setPaymentSuccess(success);
    setShowBanner(success);
  }, []);

  // Auto-hide success banner after 5 seconds
  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => setShowBanner(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess]);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      // Store user email/name for Razorpay prefill
      setOwnerInfo({
        name:
          (user.user_metadata?.full_name as string) || user.email || "",
        email: user.email || "",
        phone: "",
      });

      supabase
        .from("owner_details")
        .select(
          "subscription_status, subscription_interval, trial_ends_at, razorpay_subscription_id",
        )
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setOwnerDetails(data);
        });
    });
  }, []);

  const isOnTrial = ownerDetails?.subscription_status === "trial";
  const isActive = ownerDetails?.subscription_status === "active";

  const daysRemaining =
    isOnTrial && ownerDetails?.trial_ends_at
      ? Math.max(
          0,
          Math.ceil(
            (new Date(ownerDetails.trial_ends_at).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : null;

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    setIsSubscribing(plan);
    try {
      const res = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        alert("Failed to start subscription. Please try again.");
        return;
      }
      const { subscriptionId, key } = await res.json();

      const options = {
        key,
        subscription_id: subscriptionId,
        name: "JustHustle",
        description:
          plan === "annual"
            ? "Annual Plan — ₹4,999/year"
            : "Monthly Plan — ₹599/month",
        image: "/logo.svg",
        handler: function () {
          window.location.href = "/dashboard/billing?payment=success";
        },
        prefill: {
          name: ownerInfo?.name || "",
          email: ownerInfo?.email || "",
          contact: ownerInfo?.phone || "",
        },
        theme: { color: "#E68369" },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      alert("Failed to start subscription. Please try again.");
    } finally {
      setIsSubscribing(null);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-4"
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <div>
          <h1 className="font-display text-2xl font-normal text-ink">
            Billing &amp; Subscription
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Manage your JustHustle subscription
          </p>
        </div>
      </motion.div>

      {/* Payment success banner */}
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border-2 border-signature-forest/20 bg-signature-forest/5 p-4 flex items-center gap-3"
        >
          <Check className="h-5 w-5 text-signature-forest shrink-0" />
          <p className="text-sm font-semibold text-signature-forest">
            Payment successful! Your subscription is now active.
          </p>
        </motion.div>
      )}

      {/* Trial status banner */}
      {isOnTrial && daysRemaining !== null && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`rounded-2xl border-2 p-6 flex items-start gap-4 ${
            daysRemaining <= 2
              ? "border-signature-coral/40 bg-signature-coral/5"
              : "border-signature-forest/20 bg-signature-forest/5"
          }`}
        >
          <Clock
            className={`h-5 w-5 mt-0.5 shrink-0 ${
              daysRemaining <= 2
                ? "text-signature-coral"
                : "text-signature-forest"
            }`}
          />
          <div>
            <p
              className={`font-semibold text-sm ${
                daysRemaining <= 2
                  ? "text-signature-coral"
                  : "text-signature-forest"
              }`}
            >
              {daysRemaining === 0
                ? "Your trial expires today"
                : daysRemaining === 1
                  ? "1 day left in your trial"
                  : `${daysRemaining} days left in your trial`}
            </p>
            <p className="text-xs text-muted mt-1">
              7-day free trial — full features, no card required. Subscribe
              below to keep access after trial ends.
            </p>
          </div>
        </motion.div>
      )}

      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border-2 border-signature-forest/20 bg-signature-forest/5 p-6 flex items-center gap-3"
        >
          <Check className="h-5 w-5 text-signature-forest shrink-0" />
          <div>
            <p className="font-semibold text-sm text-signature-forest">
              Subscription active
            </p>
            <p className="text-xs text-muted mt-0.5">
              {ownerDetails?.subscription_interval === "annual"
                ? "Annual plan"
                : "Monthly plan"}{" "}
              — all features included
            </p>
          </div>
        </motion.div>
      )}

      {/* Plan cards */}
      <div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-lg font-normal text-ink mb-6"
        >
          Choose a plan
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.interval}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Card
                className={`relative rounded-2xl border transition-all h-full ${
                  plan.interval === "annual"
                    ? "border-signature-forest/30 shadow-md"
                    : "border-hairline"
                }`}
              >
                {plan.interval === "annual" && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-signature-forest text-white text-xs px-2.5 py-0.5 rounded-full">
                      Best value
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2 pt-6 px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-signature-forest">
                      {plan.label}
                    </p>
                    <Zap className="h-4 w-4 text-muted" />
                  </div>
                  <div className="mt-3">
                    <span className="text-3xl font-bold text-ink">
                      {plan.price}
                    </span>
                    <span className="text-sm text-muted ml-2">
                      {plan.priceNote}
                    </span>
                  </div>
                  {plan.annualEquivalent && (
                    <p className="text-xs text-signature-forest mt-1">
                      {plan.annualEquivalent}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <button
                    onClick={() => handleSubscribe(plan.interval)}
                    disabled={isSubscribing !== null || isActive}
                    className={`w-full mt-4 mb-5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      plan.interval === "annual"
                        ? "bg-signature-forest text-white hover:bg-signature-forest/90 disabled:opacity-50"
                        : "border border-hairline bg-canvas text-ink hover:border-signature-forest/40 disabled:opacity-50"
                    }`}
                  >
                    {isSubscribing === plan.interval
                      ? "Opening checkout…"
                      : isActive
                        ? "Current plan"
                        : "Subscribe"}
                  </button>

                  <div className="space-y-2.5">
                    {FEATURES.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-signature-forest shrink-0 mt-0.5" />
                        <p className="text-xs text-muted">{f}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trial note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xs text-muted max-w-2xl"
      >
        Trial: 7 days, full features, no card required. Base plan includes up to
        3 business locations. Cancel anytime.
      </motion.p>
    </div>
  );
}
