"use client";

import { motion } from "framer-motion";

const stats = [
  { val: "7-day", label: "Free trial" },
  { val: "₹599", label: "Per month" },
  { val: "∞", label: "QR codes" },
  { val: "EN / HI", label: "Hinglish too" },
];

const businesses = [
  "Rahul's Cafe", "Green Leaf Salon", "City Dental", "Iron Fitness",
  "Spice Garden", "Pixel Studio", "Bloom Florist", "Star Bakery",
  "Prime Motors", "The Bookshelf", "Zen Yoga", "Quick Bites",
];

export function StatsBar() {
  const doubled = [...businesses, ...businesses];

  return (
    <section className="bg-night-raised py-16">
      <div className="mx-auto mb-12 grid max-w-3xl grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-12">
        {stats.map(({ val, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <p className="font-display text-3xl font-bold text-night-text md:text-4xl">{val}</p>
            <p className="mt-1 text-sm text-night-muted">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-night-subtle">
          Built for businesses like yours
        </p>
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-night-raised to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-night-raised to-transparent" />
          <motion.div
            className="flex gap-4 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {doubled.map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-night-muted"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-night-accent/50" />
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
