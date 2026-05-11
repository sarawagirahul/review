"use client";

import { motion } from "framer-motion";
import { Star, Shield, MessageSquare, TrendingUp } from "lucide-react";

const recentReviews = [
  { name: "Priya S.", rating: 5, text: "Best chai in Bengaluru, bar none. Staff is so warm!", time: "2m ago" },
  { name: "Rohan M.", rating: 4, text: "Great ambience. Would love more seating on weekends.", time: "18m ago" },
  { name: "Ananya K.", rating: 5, text: "Quick service, lovely decor. My new WFH spot!", time: "1h ago" },
];

const weekBars = [28, 42, 35, 61, 54, 78, 91];
const days = ["M", "T", "W", "T", "F", "S", "S"];

export function DashboardShowcase() {
  return (
    <section className="bg-night py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-night-accent">Dashboard</p>
          <h2 className="mb-4 font-display text-4xl font-bold text-night-text md:text-5xl">
            Every review, one view.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-night-muted">
            A clean analytics view built for owners — not data scientists.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Glow behind the browser */}
          <div className="pointer-events-none absolute inset-x-1/4 top-0 h-32 bg-night-accent/[0.06] blur-[60px]" />

          {/* Browser chrome */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-night-card shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
            {/* Browser top bar */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] bg-white/[0.03] px-5 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex flex-1 items-center justify-center">
                <div className="rounded-md border border-white/[0.08] bg-white/[0.04] px-6 py-1 text-xs text-night-subtle">
                  app.justhustle.in / dashboard
                </div>
              </div>
              <div className="h-5 w-5 rounded-full bg-night-accent/[0.2] ring-2 ring-night-accent/30" />
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8">
              {/* Top stat cards */}
              <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { label: "Total scans", value: "1,284", delta: "+18% wk", icon: TrendingUp },
                  { label: "Reviews posted", value: "942", delta: "+24% wk", icon: Star },
                  { label: "Avg rating", value: "4.9★", delta: "+0.3", icon: Star },
                  { label: "Conversion", value: "73%", delta: "+5%", icon: TrendingUp },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-4"
                  >
                    <p className="text-xs text-night-muted">{stat.label}</p>
                    <p className="mt-1 text-xl font-bold text-night-text">{stat.value}</p>
                    <p className="mt-0.5 text-[11px] text-night-accent">{stat.delta}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Chart */}
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-semibold text-night-text">Reviews — last 7 days</p>
                    <span className="rounded-full border border-night-accent/20 bg-night-accent/[0.08] px-2.5 py-0.5 text-xs text-night-accent">
                      ↑ 34%
                    </span>
                  </div>
                  <div className="flex h-28 items-end gap-2">
                    {weekBars.map((h, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          className="w-full rounded-t-md bg-night-accent"
                          style={{ minHeight: 3 }}
                        />
                        <span className="text-[9px] text-night-subtle">{days[i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent reviews */}
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-5">
                  <p className="mb-4 text-sm font-semibold text-night-text">Recent</p>
                  <div className="space-y-3">
                    {recentReviews.map((r, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                        className="flex items-start gap-3 rounded-lg border border-white/[0.05] bg-white/[0.03] p-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-night-accent/[0.15] text-xs font-bold text-night-accent">
                          {r.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 flex items-center gap-2">
                            <span className="text-xs font-semibold text-night-text">{r.name}</span>
                            <div className="flex">
                              {[...Array(r.rating)].map((_, j) => (
                                <Star key={j} className="h-2.5 w-2.5 fill-current text-[#f59e0b]" />
                              ))}
                            </div>
                            <span className="ml-auto text-[10px] text-night-subtle">{r.time}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-night-muted">{r.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom toolbar */}
              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-night-muted">
                  <Shield className="h-3.5 w-3.5 text-night-accent" />
                  3 private feedbacks this week
                </div>
                <div className="mx-auto" />
                <div className="flex items-center gap-2 text-xs text-night-muted">
                  <MessageSquare className="h-3.5 w-3.5 text-night-accent" />
                  18 AI replies sent via Google API
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
