"use client";

import { motion } from "framer-motion";
import { Shield, MessageSquare, ChartBar as BarChart3, Languages, Lock } from "lucide-react";

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${filled ? "fill-current text-[#f59e0b]" : "text-white/20"}`}
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export function Features() {
  const languages = ["English", "Hindi", "Hinglish"];

  return (
    <section id="features" className="bg-night-raised py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-night-accent">Features</p>
          <h2 className="mb-4 font-display text-4xl font-bold text-night-text">
            Built for trust, designed for growth
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-night-muted">
            A complete reputation system — not just a QR code generator.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {/* Review Shield — large */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2e0e] to-[#071a09] p-8 md:p-10 lg:col-span-2"
          >
            {/* background glow */}
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-night-accent/[0.1] blur-[80px]" />

            <div className="relative flex h-full flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="lg:max-w-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-3 font-display text-2xl font-bold text-white">Review Shield</h3>
                <p className="mb-4 leading-relaxed text-white/70">
                  Ratings below 3 stars go to a private feedback form — directly to your inbox. Fix the issue before it ever reaches Google.
                </p>
                <p className="text-xs text-white/40">
                  ✓ Customers are always free to leave any review on Google
                </p>
              </div>

              <div className="shrink-0 rounded-2xl bg-white p-5 shadow-2xl lg:w-72">
                <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm font-semibold text-gray-900">Private Feedback</span>
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">Just now</span>
                </div>
                <p className="mb-3 text-sm text-gray-600">&ldquo;The food was cold by the time it reached our table.&rdquo;</p>
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex">
                    <StarIcon filled /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                  </div>
                  <span className="text-xs text-gray-400">1/5 — private</span>
                </div>
                <div className="rounded-lg bg-green-50 px-3 py-2">
                  <p className="text-xs font-medium text-green-700">Sent to your inbox — never posted publicly</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Reply Generator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="rounded-3xl border border-white/[0.07] bg-white/[0.04] p-8"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.06]">
              <MessageSquare className="h-5 w-5 text-night-accent" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-night-text">AI Reply Generator</h3>
            <p className="mb-5 text-sm leading-relaxed text-night-muted">
              Reply to all your Google reviews with one click. AI writes professional, empathetic responses that match your brand voice.
            </p>
            <div className="space-y-2">
              {[
                { label: "Customer review", text: "The coffee was amazing! Loved the cozy ambience.", stars: 5, owner: false },
                { label: "AI-generated reply", text: "Thank you so much! We pour love into every cup — see you soon! ☕", owner: true },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i === 0 ? -8 : 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                  className={`rounded-xl border p-3 ${
                    item.owner
                      ? "border-night-accent/20 bg-night-accent/[0.06]"
                      : "border-white/[0.08] bg-white/[0.04]"
                  }`}
                >
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-night-subtle">{item.label}</p>
                  {item.stars && (
                    <div className="mb-1 flex gap-0.5">
                      {[...Array(item.stars)].map((_, j) => <StarIcon key={j} filled />)}
                    </div>
                  )}
                  <p className="text-xs text-night-muted">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Multi-lingual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="rounded-3xl border border-white/[0.07] bg-white/[0.04] p-8"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.06]">
              <Languages className="h-5 w-5 text-night-accent" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-night-text">English · Hindi · Hinglish</h3>
            <p className="mb-5 text-sm leading-relaxed text-night-muted">
              Customers pick their preferred language and get AI-generated reviews they&apos;re comfortable posting.
            </p>
            <div className="flex gap-2">
              {languages.map((lang, i) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`flex-1 rounded-xl border py-2.5 text-center text-xs font-medium transition-colors ${
                    i === 0
                      ? "border-night-accent/30 bg-night-accent/[0.12] text-night-accent"
                      : "border-white/[0.08] bg-white/[0.03] text-night-muted"
                  }`}
                >
                  {lang}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3">
              <p className="text-xs leading-relaxed text-night-muted">
                &ldquo;Amazing coffee! Cozy ambience and super friendly staff. Definitely coming back!&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-3xl border border-white/[0.07] bg-white/[0.04] p-8"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.06]">
              <BarChart3 className="h-5 w-5 text-night-accent" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-night-text">Real-time Analytics</h3>
            <p className="mb-5 text-sm leading-relaxed text-night-muted">
              Track QR scans, review clicks, and conversion rates. See your growth week over week.
            </p>
            <div className="flex h-16 items-end gap-1.5">
              {[40, 55, 45, 70, 60, 85, 95].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1 rounded-t-md bg-night-accent"
                  style={{ minHeight: 2 }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-night-subtle">Weekly reviews</span>
              <span className="text-xs font-semibold text-night-accent">↑ 34% this week</span>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1128] to-[#07091a] p-8 md:col-span-2 lg:col-span-1"
          >
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-[#8b5cf6]/[0.1] blur-[60px]" />
            <div className="relative">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.08]">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Secure by design</h3>
              <p className="mb-5 text-sm leading-relaxed text-white/60">
                OAuth 2.0 for Google API access. No passwords stored. Full compliance with Google API policies.
              </p>
              <ul className="space-y-2.5">
                {[
                  "OAuth 2.0 — no password storage",
                  "Google API Services User Data Policy compliant",
                  "Data encrypted in transit and at rest",
                  "No data sold to third parties",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-start gap-2.5 text-sm text-white/70"
                  >
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-night-accent" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
