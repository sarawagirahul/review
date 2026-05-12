"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Check } from "lucide-react";

export function CTABanner() {
  return (
    <section className="bg-night-raised py-24">
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-night-accent/20 bg-white/[0.04] px-8 py-16 text-center shadow-[0_0_80px_rgba(34,197,94,0.08)] md:px-16 md:py-20"
        >
          {/* Ambient glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-night-accent/[0.08] blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#8b5cf6]/[0.06] blur-[80px]" />

          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-2 text-sm text-night-muted">
              <Lock className="h-4 w-4 text-night-accent" />
              Powered by Google Places API &bull; No review gating
            </div>

            <h2 className="mb-6 font-display text-4xl font-bold text-night-text md:text-5xl">
              Ready to grow your Google rating?
            </h2>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-night-muted">
              Place a QR at your counter, collect AI-assisted reviews in seconds, and catch negative feedback privately — before it reaches Google.
            </p>

            <div className="mb-10 flex flex-wrap justify-center gap-3">
              {["Google API Compliant", "No Review Gating", "OAuth 2.0 Verified", "Data never sold"].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-night-muted"
                >
                  <Check className="h-3 w-3 text-night-accent" />
                  {badge}
                </span>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/login"
                className="inline-flex items-center rounded-full bg-night-accent px-10 py-4 text-base font-semibold text-night transition-all hover:bg-night-accent-hover"
              >
                Start your 7-day free trial
              </Link>
            </motion.div>

            <p className="mt-4 text-sm text-night-subtle">
              No credit card required &bull; Cancel anytime &bull; All features included
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
