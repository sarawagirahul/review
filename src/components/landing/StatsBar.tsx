"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

const businesses = [
  "Rahul's Cafe", "Green Leaf Salon", "City Dental", "Iron Fitness",
  "Spice Garden", "Pixel Studio", "Bloom Florist", "Star Bakery",
  "Prime Motors", "The Bookshelf", "Zen Yoga", "Quick Bites",
];

function CountUp({
  from, to, suffix = "", prefix = "", label, delay = 0,
  formatter,
}: {
  from: number; to: number; suffix?: string; prefix?: string;
  label: string; delay?: number; formatter?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const controls = animate(from, to, {
      duration: 1.8,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        el.textContent = formatter ? formatter(v) : Math.round(v).toLocaleString("en-IN");
      },
    });
    return () => controls.stop();
  }, [inView, from, to, delay, formatter]);

  return (
    <div ref={wrapRef} className="text-center">
      <p className="font-display text-3xl font-bold text-night-text md:text-4xl">
        {prefix}
        <span ref={ref}>{formatter ? formatter(from) : from.toLocaleString("en-IN")}</span>
        {suffix}
      </p>
      <p className="mt-1 text-sm text-night-muted">{label}</p>
    </div>
  );
}

export function StatsBar() {
  const doubled = [...businesses, ...businesses];

  return (
    <section className="bg-night-raised py-16">
      <div className="mx-auto mb-12 grid max-w-3xl grid-cols-2 gap-8 px-6 md:grid-cols-4 md:px-12">
        <CountUp from={0} to={1200} suffix="+" label="Businesses" delay={0} />
        <CountUp from={0} to={50000} suffix="+" label="Reviews managed" delay={0.1} />
        <CountUp from={0} to={30} suffix="s" label="To post a review" delay={0.2} />
        <CountUp
          from={999} to={999} prefix="₹" label="Per month"
          delay={0.3} formatter={() => "999"}
        />
      </div>

      <div className="relative overflow-hidden">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-night-subtle">
          Trusted by 1,200+ Indian businesses
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
