"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "Unlimited QR codes",
  "AI review generation (EN / HI / Hinglish)",
  "Review Shield",
  "Competitor analysis",
  "Live analytics dashboard",
  "Up to 3 businesses",
  "Email notifications",
  "Print-ready QR downloads",
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="bg-night py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-night-accent">Pricing</p>
          <h2 className="mb-4 font-display text-4xl font-bold text-night-text">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-night-muted">
            Start with a 7-day free trial. No credit card required. All features included.
          </p>
        </motion.div>

        {/* Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="relative flex rounded-full border border-white/[0.1] bg-white/[0.04] p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative w-32 rounded-full py-2 text-sm font-medium transition-colors cursor-pointer ${
                !isAnnual ? "text-night" : "text-night-muted hover:text-night-text"
              }`}
            >
              {!isAnnual && (
                <motion.div
                  layoutId="pricing-pill"
                  className="absolute inset-0 rounded-full bg-night-accent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative w-32 rounded-full py-2 text-sm font-medium transition-colors cursor-pointer ${
                isAnnual ? "text-night" : "text-night-muted hover:text-night-text"
              }`}
            >
              {isAnnual && (
                <motion.div
                  layoutId="pricing-pill"
                  className="absolute inset-0 rounded-full bg-night-accent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">Annually</span>
            </button>
            <div className="absolute -right-6 -top-3 rotate-12 rounded-full bg-night-accent px-2 py-0.5 text-xs font-bold text-night shadow-sm">
              Save ~30%
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl border border-night-accent/20 bg-white/[0.04] p-8 shadow-[0_0_60px_rgba(34,197,94,0.08)] md:p-12"
          >
            {/* top glow */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-night-accent/[0.12] blur-[60px]" />

            <div className="relative">
              <div className="mb-6">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-night-accent/20 bg-night-accent/[0.08] px-3 py-1 text-xs font-semibold text-night-accent">
                  {isAnnual ? "Annual Plan" : "Monthly Plan"}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-night-text">
                    ₹{isAnnual ? "4,999" : "599"}
                  </span>
                  <span className="text-sm font-medium text-night-muted">
                    /{isAnnual ? "year" : "month"}
                  </span>
                </div>
                {isAnnual && (
                  <p className="mt-1 text-sm text-night-muted">
                    ~₹417/month billed annually
                  </p>
                )}
              </div>

              {/* Trial callout */}
              <div className="mb-6 rounded-2xl border border-night-accent/20 bg-night-accent/[0.06] px-4 py-3 text-center">
                <p className="text-sm font-semibold text-night-accent">7-day free trial — no card required</p>
              </div>

              <ul className="mb-8 space-y-3.5">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-night-muted">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-night-accent/[0.15]">
                      <Check className="h-3 w-3 text-night-accent" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.a
                href="/login"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center rounded-full bg-night-accent py-4 text-base font-semibold text-night transition-all hover:bg-night-accent-hover cursor-pointer"
              >
                Start 7-day free trial
              </motion.a>
              <p className="mt-3 text-center text-xs text-night-subtle">
                No credit card required · Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
