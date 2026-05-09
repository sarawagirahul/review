"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-soft via-canvas to-signature-cream/20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-signature-mint/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-signature-cream/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-24 md:px-12 md:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-surface-soft px-4 py-2 text-sm font-medium text-ink border border-hairline"
            >
              <Shield className="h-4 w-4 text-signature-forest" />
              <span>Trusted by 1,200+ Indian Businesses</span>
            </motion.div>

            <h1 className="mb-6 font-display text-5xl font-normal leading-[1.08] tracking-tight text-ink md:text-6xl lg:text-7xl">
              Professional Reputation Management for{" "}
              <span className="italic text-signature-forest">Indian Businesses</span>
            </h1>

            <p className="mb-10 text-lg leading-relaxed text-muted md:text-xl">
              Collect authentic Google reviews, manage customer feedback privately, and grow your
              online presence — all through a simple QR code flow built for local businesses.
            </p>

            <div className="flex flex-col items-start justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/login">
                  Start 7-day free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted">
              No credit card required &bull; Cancel anytime &bull; OAuth 2.0 secure
            </p>
          </motion.div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-hairline">
              <Image
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Business owner managing online reputation with JustHustle"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Overlay card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 backdrop-blur-md p-5 shadow-lg border border-hairline"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signature-forest">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-ink text-sm">Private Feedback Channel</p>
                    <p className="text-xs text-muted">Improve service before issues go public</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
