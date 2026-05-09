"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: string;
  label: string;
  delay?: number;
}

export function AnimatedCounter({ target, label, delay = 0 }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22,1,0.36,1] } },
      }}
      className="glass-card relative overflow-hidden p-7 text-center"
    >
      {/* Subtle glow orb behind */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
      </div>
      <p className="relative font-display text-5xl font-bold text-signature-forest">{target}</p>
      <p className="relative mt-2 text-sm uppercase tracking-widest text-ink-muted">{label}</p>
    </motion.div>
  );
}
