"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Is this compliant with Google's review policies?",
    a: "Yes. JustHustle never posts reviews on behalf of customers, never blocks negative reviews from reaching Google, and never offers incentives for reviews. Customers always choose freely and post themselves. We follow Google's Review Content Guidelines and Limited Use policy to the letter.",
  },
  {
    q: "Do you automatically post reviews for customers?",
    a: "Never. Google's policies forbid programmatic review submission. When a customer picks a review option, it copies to their clipboard and opens Google Maps — they paste and submit themselves. We make it effortless, not automated.",
  },
  {
    q: "What happens when a customer rates us 1 or 2 stars?",
    a: "We offer them a private feedback form as an additional channel to share concerns directly with you. They remain completely free to post any review on Google at any time — we never block or hide negative reviews. The private channel is an extra option, not a gate.",
  },
  {
    q: "How do you connect to my Google Business Profile?",
    a: "Through Google's official OAuth 2.0 flow — the same secure handshake used by apps like Gmail and Google Calendar. You sign in with your Google account, authorise the specific permissions we need, and we get a limited access token. No passwords are ever stored.",
  },
  {
    q: "Do I need to install an app or train my staff?",
    a: "No app, no training. You print your QR code and place it on your counter. That's it. Your staff don't need to do anything — customers handle the entire review flow on their own phones in under 30 seconds.",
  },
  {
    q: "Can I manage multiple business locations?",
    a: "Yes. The Pro plan includes unlimited business locations. If you run a chain of restaurants, clinics, or salons, all your Google Business Profile locations are managed from one dashboard.",
  },
  {
    q: "What customer data do you store?",
    a: "Very little. We don't require customers to create accounts. We only store the review text the customer chose (to track conversion) and the scan event timestamp for your analytics. We never sell or share customer data. See our Privacy Policy for the full disclosure.",
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
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-medium text-night-text">{faq.q}</span>
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-night-muted transition-colors group-hover:border-night-accent/30">
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
            Especially the ones about Google compliance.
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
