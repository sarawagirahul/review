"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    business: "Mehta Dental Clinic, Pune",
    text: "Our Google rating went from 4.1 to 4.7 in 6 weeks. JustHustle made it dead simple for patients to leave reviews after their appointment.",
    rating: 5,
    initials: "AM",
  },
  {
    name: "Sunita Rao",
    business: "Bloom Florals, Bengaluru",
    text: "The private feedback feature saved us from 3 potentially bad reviews. Customers messaged directly and we resolved the issues immediately.",
    rating: 5,
    initials: "SR",
  },
  {
    name: "Kiran Patel",
    business: "Prime Auto Service, Ahmedabad",
    text: "I was hesitant about using an AI tool, but the review drafts are spot on. Customers actually post them without editing. Brilliant product.",
    rating: 5,
    initials: "KP",
  },
  {
    name: "Divya Nair",
    business: "Zen Yoga Studio, Chennai",
    text: "Setup took 10 minutes. QR code at the reception desk, and reviews started coming in the same evening. Can't believe it was this easy.",
    rating: 5,
    initials: "DN",
  },
  {
    name: "Rahul Sharma",
    business: "Sharma's Cafe, Hyderabad",
    text: "The AI reply feature is a time-saver. I used to spend 30 minutes replying to reviews. Now it's 2 minutes and the replies sound better than mine.",
    rating: 5,
    initials: "RS",
  },
  {
    name: "Priya Krishnan",
    business: "PixelArts Studio, Mumbai",
    text: "Finally a tool that doesn't break Google's policies. The OAuth integration is seamless and I feel confident everything is above board.",
    rating: 5,
    initials: "PK",
  },
  {
    name: "Vikram Singh",
    business: "Iron Fitness Gym, Delhi",
    text: "₹999/month for the kind of results we're seeing is insane value. Our new member signups track directly with our improved Google ranking.",
    rating: 5,
    initials: "VS",
  },
  {
    name: "Meena Iyer",
    business: "Spice Garden Restaurant, Coimbatore",
    text: "Multi-lingual support was the deciding factor for us. Our Tamil and Hindi speaking customers can leave reviews comfortably now.",
    rating: 5,
    initials: "MI",
  },
];

const row1 = testimonials.slice(0, 4);
const row2 = testimonials.slice(4, 8);

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="w-80 shrink-0 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-sm">
      <div className="mb-4 flex gap-0.5">
        {[...Array(t.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current text-[#f59e0b]" />
        ))}
      </div>
      <p className="mb-5 text-sm leading-relaxed text-night-muted">&ldquo;{t.text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-night-accent/[0.15] text-xs font-bold text-night-accent">
          {t.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-night-text">{t.name}</p>
          <p className="text-xs text-night-subtle">{t.business}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: typeof testimonials; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-night-raised to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-night-raised to-transparent" />
      <motion.div
        className="flex gap-5"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative bg-night-raised py-24">
      <div className="mx-auto mb-16 max-w-7xl px-6 text-center md:px-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-night-accent">Testimonials</p>
        <h2 className="mb-4 font-display text-4xl font-bold text-night-text">
          Businesses that trust JustHustle
        </h2>
        <p className="mx-auto max-w-xl text-lg text-night-muted">
          From salons to clinics, Indian businesses across 60+ cities use JustHustle every day.
        </p>
      </div>

      <div className="flex flex-col gap-5 overflow-hidden">
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>
    </section>
  );
}
