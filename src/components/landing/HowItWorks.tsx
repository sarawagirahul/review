"use client";

import { motion } from "framer-motion";

function QRVisual() {
  return (
    <div className="relative flex items-end justify-center pb-4 pt-6">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-32 rounded-full bg-night-accent/[0.12] blur-[40px]" />
      </div>
      {/* Card */}
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-36 rounded-2xl border border-white/[0.12] bg-white/[0.06] p-3 shadow-2xl"
      >
        {/* QR pattern */}
        <div className="rounded-xl bg-white p-2.5">
          <svg viewBox="0 0 80 80" className="h-full w-full">
            {/* TL corner */}
            <rect x="2" y="2" width="22" height="22" rx="3" fill="#0f1629"/>
            <rect x="6" y="6" width="14" height="14" rx="1" fill="white"/>
            <rect x="9" y="9" width="8" height="8" rx="1" fill="#0f1629"/>
            {/* TR corner */}
            <rect x="56" y="2" width="22" height="22" rx="3" fill="#0f1629"/>
            <rect x="60" y="6" width="14" height="14" rx="1" fill="white"/>
            <rect x="63" y="9" width="8" height="8" rx="1" fill="#0f1629"/>
            {/* BL corner */}
            <rect x="2" y="56" width="22" height="22" rx="3" fill="#0f1629"/>
            <rect x="6" y="60" width="14" height="14" rx="1" fill="white"/>
            <rect x="9" y="63" width="8" height="8" rx="1" fill="#0f1629"/>
            {/* Data dots */}
            <rect x="30" y="2" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="38" y="2" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="46" y="2" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="30" y="10" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="46" y="10" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="38" y="18" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="2" y="30" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="10" y="30" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="18" y="38" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="30" y="30" width="12" height="5" rx="1" fill="#0f1629"/>
            <rect x="46" y="30" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="56" y="30" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="70" y="30" width="8" height="5" rx="1" fill="#0f1629"/>
            <rect x="30" y="38" width="5" height="12" rx="1" fill="#0f1629"/>
            <rect x="38" y="38" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="56" y="38" width="5" height="12" rx="1" fill="#0f1629"/>
            <rect x="30" y="56" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="38" y="56" width="12" height="5" rx="1" fill="#0f1629"/>
            <rect x="56" y="56" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="70" y="56" width="8" height="5" rx="1" fill="#0f1629"/>
            <rect x="30" y="68" width="5" height="10" rx="1" fill="#0f1629"/>
            <rect x="38" y="68" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="46" y="68" width="5" height="10" rx="1" fill="#0f1629"/>
            <rect x="56" y="68" width="5" height="5" rx="1" fill="#0f1629"/>
            <rect x="64" y="68" width="14" height="5" rx="1" fill="#0f1629"/>
            {/* Brand dot */}
            <circle cx="40" cy="40" r="5" fill="#22c55e" />
          </svg>
        </div>
        <p className="mt-2 text-center text-[10px] font-semibold text-night-accent">Scan to leave a review</p>
      </motion.div>
      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, x: 12, y: -4 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="absolute right-4 top-6 rounded-xl border border-white/[0.1] bg-night-card px-2.5 py-1.5 text-[11px] text-night-muted shadow-xl"
      >
        📱 No app needed
      </motion.div>
    </div>
  );
}

function PhoneVisual() {
  const reviews = [
    { text: "Amazing coffee! Cozy vibes and super friendly staff.", selected: true },
    { text: "Great place to work — fast WiFi, quiet atmosphere.", selected: false },
  ];
  return (
    <div className="relative flex items-end justify-center pb-4 pt-6">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-40 rounded-full bg-[#8b5cf6]/[0.1] blur-[40px]" />
      </div>
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-52 overflow-hidden rounded-2xl border border-white/[0.1] bg-night-card shadow-2xl"
      >
        {/* Phone top notch area */}
        <div className="flex items-center justify-between bg-white/[0.03] px-4 py-2.5">
          <span className="text-xs font-semibold text-night-text">Rahul&apos;s Cafe</span>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <motion.svg
                key={s}
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + s * 0.08, duration: 0.3, type: "spring", stiffness: 400 }}
              >
                <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 5.2l4-.6z" fill="#f59e0b" />
              </motion.svg>
            ))}
          </div>
        </div>
        <div className="p-3 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-night-subtle">Choose a review to post</p>
          {reviews.map(({ text, selected }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
              className={`rounded-xl border p-2.5 text-[11px] leading-relaxed ${
                selected
                  ? "border-night-accent/30 bg-night-accent/[0.08] text-night-text"
                  : "border-white/[0.06] bg-white/[0.03] text-night-muted"
              }`}
            >
              {selected && (
                <div className="mb-1 flex items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-night-accent" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-night-accent">Selected</span>
                </div>
              )}
              {text}
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85, duration: 0.4 }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-night-accent py-2.5 text-[11px] font-semibold text-night"
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current"><path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 5.2l4-.6z"/></svg>
            Post to Google
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.4 }}
        className="absolute left-4 bottom-8 rounded-xl border border-white/[0.1] bg-night-card px-2.5 py-1.5 text-[11px] font-medium text-night-accent shadow-xl"
      >
        ⚡ 30 seconds
      </motion.div>
    </div>
  );
}

function GrowthVisual() {
  const bars = [38, 45, 42, 55, 62, 70, 84];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="relative flex items-end justify-center pb-4 pt-6">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-32 w-40 rounded-full bg-night-accent/[0.08] blur-[40px]" />
      </div>
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-52 rounded-2xl border border-white/[0.1] bg-night-card p-4 shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-night-subtle">Google Rating</p>
            <p className="text-xl font-bold text-night-text">4.8 <span className="text-night-accent text-sm">★</span></p>
          </div>
          <div className="rounded-lg border border-night-accent/20 bg-night-accent/[0.08] px-2 py-1 text-[10px] font-semibold text-night-accent">
            ↑ +0.7 this month
          </div>
        </div>
        <div className="flex h-16 items-end gap-1.5">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-md"
                style={{ background: i === 6 ? "#22c55e" : "rgba(34,197,94,0.35)" }}
              />
              <span className="text-[8px] text-night-subtle">{days[i]}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-night-accent/[0.15]">
            <svg viewBox="0 0 16 16" className="h-3 w-3 fill-night-accent"><path d="M2 11l4-5 3 3 3-4 4 6H2z"/></svg>
          </div>
          <p className="text-[10px] text-night-muted">Best week yet — 18 new reviews</p>
        </div>
      </motion.div>
    </div>
  );
}

const steps = [
  {
    number: "01",
    emoji: "🪧",
    title: "Place your QR code",
    description: "We generate a custom QR stand for your business. Print it, put it on your counter. Setup done in under 5 minutes.",
    visual: <QRVisual />,
  },
  {
    number: "02",
    emoji: "📱",
    title: "Customer reviews in 30 seconds",
    description: "They scan with any phone camera. Three AI-written review options appear. They pick one and tap 'Post to Google'. No app, no signup, no friction.",
    visual: <PhoneVisual />,
  },
  {
    number: "03",
    emoji: "📈",
    title: "Your rating grows on autopilot",
    description: "Track every new review, reply with one-click AI responses, and watch your Google ranking climb — all from one dashboard.",
    visual: <GrowthVisual />,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-night py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-night-accent">How it works</p>
          <h2 className="mb-4 font-display text-4xl font-bold text-night-text md:text-5xl">
            Simple as putting up a sign
          </h2>
          <p className="mx-auto max-w-xl text-lg text-night-muted">
            Three steps. No technical setup. No training your staff. Just more reviews.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Connecting dashed line (desktop only) */}
          <div className="pointer-events-none absolute top-[30%] left-[33%] right-[33%] hidden h-px border-t border-dashed border-white/[0.12] md:block" />
          <div className="pointer-events-none absolute top-[30%] right-[33%] hidden h-px w-[calc(33%-2rem)] border-t border-dashed border-white/[0.12] md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]"
            >
              {/* Step number badge */}
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-night-accent/30 bg-night-accent/[0.08] text-xs font-bold text-night-accent">
                  {step.number}
                </div>
                <div className="h-px flex-1 border-t border-dashed border-white/[0.08]" />
                <span className="text-xl">{step.emoji}</span>
              </div>

              {/* Visual */}
              <div className="mb-5 h-52 overflow-hidden rounded-2xl border border-white/[0.06] bg-night">
                {step.visual}
              </div>

              {/* Text */}
              <h3 className="mb-2 text-lg font-bold text-night-text">{step.title}</h3>
              <p className="text-sm leading-relaxed text-night-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center text-sm text-night-subtle"
        >
          Backed by the official Google Business Profile API · OAuth 2.0 secure · No review gating
        </motion.p>
      </div>
    </section>
  );
}
