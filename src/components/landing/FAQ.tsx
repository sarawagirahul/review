"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How does the review collection work?",
    a: "A customer scans your QR code, rates their experience, and our AI generates 3 review options for them. They pick one, it copies to their clipboard, and Google opens automatically — they just paste and submit.",
  },
  {
    q: "What happens with bad reviews?",
    a: "Ratings of 1 or 2 stars trigger Review Shield — instead of being directed to Google, the customer sees a private feedback form that goes directly to you. You can resolve the issue without it ever appearing on your Google listing.",
  },
  {
    q: "Do I need Google's approval to use this?",
    a: "No. JustHustle works with Google Places API which is publicly available. No special approval needed to start collecting reviews.",
  },
  {
    q: "Can I manage multiple businesses?",
    a: "Yes. The base plan supports up to 3 businesses, each with its own branded review page, QR codes, and analytics.",
  },
  {
    q: "Is there a contract or lock-in?",
    a: "No contracts. Monthly plans can be cancelled anytime. Annual plans are billed once and run for 12 months.",
  },
  {
    q: "What languages are supported?",
    a: "AI-generated reviews are available in English, Hindi, and Hinglish. The dashboard and owner interface are in English.",
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-white/[0.08] last:border-0"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 py-5 text-left cursor-pointer"
      >
        <span className="text-base font-medium text-night-text">{faq.q}</span>
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-night-muted transition-colors">
          {open ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-night-muted">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="bg-night py-24">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-night-accent">FAQ</p>
          <h2 className="mb-4 font-display text-4xl font-bold text-night-text">
            Questions we actually get asked
          </h2>
          <p className="text-lg text-night-muted">
            Especially the ones about how Google reviews work.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 md:px-8"
        >
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
