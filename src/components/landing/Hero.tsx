"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Star } from "lucide-react";

export function Hero() {
  return (
    <section 
      className="relative overflow-hidden bg-canvas pb-24 md:pb-32"
      style={{ paddingTop: '160px' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 text-center md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="mb-6 flex items-center justify-center gap-2 text-sm font-medium text-ink">
            <span className="flex items-center gap-1 rounded-full bg-surface-soft px-3 py-1 border border-hairline">
              <Star className="h-4 w-4 fill-signature-mustard text-signature-mustard" />
              <span>Turn every customer into a 5-star review</span>
            </span>
          </div>
          
          <h1 className="mb-8 font-display text-5xl font-normal leading-[1.1] tracking-tight text-ink md:text-7xl">
            Get more Google reviews in under <span className="italic">30 seconds</span>.
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            Customers scan a QR code. AI writes the perfect review. You get more 5-star ratings without the awkward ask.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/login">Start 7-day free trial</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted">No credit card required • Cancel anytime</p>
        </motion.div>
      </div>
    </section>
  );
}
