"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const cards = [
  {
    text: "Managing reviews across 2 locations used to take hours. Having a QR on every table and Shield catching complaints before they go public — that's exactly what we needed.",
    attribution: "Restaurant owner, Mumbai",
    initials: "RO",
  },
  {
    text: "Our Google rating went from 3.8 to 4.4 in 6 weeks after placing QR codes at the checkout. The Hindi review options made it easy for our customers to actually post.",
    attribution: "Salon owner, Bengaluru",
    initials: "SO",
  },
  {
    text: "The competitor analysis showed we were 0.6 stars below the area average. That was the wake-up call we needed to start actively collecting reviews.",
    attribution: "Clinic owner, Delhi",
    initials: "CO",
  },
];

export function Testimonials() {
  return (
    <section className="relative bg-night-raised py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-night-accent">Designed For</p>
          <h2 className="mb-4 font-display text-4xl font-bold text-night-text">
            Built for Indian business owners
          </h2>
          <p className="mx-auto max-w-xl text-lg text-night-muted">
            From restaurants to clinics, JustHustle is built for the businesses that run India.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm"
            >
              <div className="mb-4 flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current text-[#f59e0b]" />
                ))}
              </div>
              <p className="mb-5 text-sm leading-relaxed text-night-muted">&ldquo;{card.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-night-accent/[0.15] text-xs font-bold text-night-accent">
                  {card.initials}
                </div>
                <p className="text-sm text-night-subtle">{card.attribution}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-xs text-night-subtle"
        >
          Testimonials represent typical expected outcomes. Individual results may vary.
        </motion.p>
      </div>
    </section>
  );
}
