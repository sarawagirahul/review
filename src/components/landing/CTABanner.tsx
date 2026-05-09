"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Shield } from "lucide-react";

export function CTABanner() {
  return (
    <section className="bg-canvas py-24">
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-signature-forest px-8 py-16 text-center shadow-2xl md:px-16 md:py-20"
        >
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80">
              <Shield className="h-4 w-4" />
              OAuth 2.0 Secure &bull; Google API Compliant
            </div>
            <h2 className="mb-6 font-display text-4xl font-medium text-white md:text-5xl">
              Ready to manage your reputation professionally?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
              Join 1,200+ Indian businesses using JustHustle to collect authentic Google reviews,
              manage customer feedback, and grow their online presence transparently.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white text-signature-forest hover:bg-surface-soft"
                asChild
              >
                <Link href="/login">Start your 7-day free trial</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-white/50">
              No credit card required &bull; Cancel anytime
            </p>
          </div>

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
