"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="bg-canvas py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 font-display text-4xl text-ink">Simple, transparent pricing</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            Start with a 7-day free trial. No credit card required. All features included.
          </p>
        </motion.div>

        <div className="mb-12 flex justify-center">
          <div className="relative flex rounded-full bg-surface-soft p-1 shadow-sm border border-hairline">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative w-32 rounded-full py-2 text-sm font-medium transition-colors ${
                !isAnnual ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {!isAnnual && (
                <motion.div
                  layoutId="pricing-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative w-32 rounded-full py-2 text-sm font-medium transition-colors ${
                isAnnual ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {isAnnual && (
                <motion.div
                  layoutId="pricing-pill"
                  className="absolute inset-0 rounded-full bg-white shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Annually</span>
            </button>
            <div className="absolute -right-6 -top-3 rotate-12 rounded-full bg-signature-forest px-2 py-0.5 text-xs font-bold text-white shadow-sm">
              Save ~33%
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-canvas p-8 shadow-subtle border border-hairline md:p-12"
          >
            <div className="mb-6">
              <h3 className="text-xl font-medium text-ink">Pro Plan</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-ink">
                  ₹{isAnnual ? "7,999" : "999"}
                </span>
                <span className="text-sm font-medium text-muted">
                  /{isAnnual ? "year" : "month"}
                </span>
              </div>
            </div>

            <ul className="mb-8 space-y-4">
              {[
                "Authentic Google review collection",
                "Private Feedback Channel (improve service)",
                "AI Reply Generator for all reviews",
                "Custom QR code designs",
                "Multi-lingual review generation (EN/HI/Hinglish)",
                "Analytics & tracking dashboard",
                "Unlimited business locations",
                "OAuth 2.0 secure Google API access",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-body">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signature-forest/10 text-signature-forest">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-signature-forest hover:bg-signature-forest/90"
              asChild
            >
              <a href="/login">Start 7-day free trial</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
