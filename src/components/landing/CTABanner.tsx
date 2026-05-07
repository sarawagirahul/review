"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

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
            <h2 className="mb-6 font-display text-4xl font-medium text-white md:text-5xl">
              Ready to grow your business?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
              Join hundreds of Indian businesses using ReviewBoost to automate their Google reviews and protect their online reputation.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-white text-ink hover:bg-surface-soft" asChild>
                <Link href="/login">Start your 7-day free trial</Link>
              </Button>
            </div>
          </div>
          
          {/* Decorative background elements could go here */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
