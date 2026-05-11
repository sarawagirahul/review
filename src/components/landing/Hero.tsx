"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Check, Shield, Lock } from "lucide-react";
import { useState, useEffect } from "react";

const trustBadges = [
  { icon: Lock, label: "OAuth 2.0 Verified" },
  { icon: Shield, label: "Google API Compliant" },
  { icon: Check, label: "No Review Gating" },
];

const stats = [
  { val: "1,200+", label: "Businesses" },
  { val: "50,000+", label: "Reviews managed" },
  { val: "₹999", label: "Per month" },
];

export function Hero() {
  const [stars, setStars] = useState(0);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      let n = 0;
      const iv = setInterval(() => {
        n++;
        setStars(n);
        if (n >= 5) clearInterval(iv);
      }, 180);
    }, 1000);
    const t2 = setTimeout(() => setReviewsVisible(true), 1900);
    const t3 = setTimeout(() => setButtonVisible(true), 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-night">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[600px] w-[600px] rounded-full bg-night-accent/[0.06] blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-[#8b5cf6]/[0.05] blur-[120px]" />
        <div className="absolute -bottom-20 left-10 h-[300px] w-[300px] rounded-full bg-night-accent/[0.04] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-36 pb-24 md:px-12 md:pb-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Google API badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-night-accent/30 bg-night-accent/[0.08] px-4 py-2 text-sm font-medium text-night-accent"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-night-accent" />
              Official Google Business Profile API Integration
            </motion.div>

            <h1 className="mb-6 font-display text-5xl font-bold leading-[1.06] tracking-tight text-night-text md:text-6xl lg:text-[5rem]">
              Professional<br />Reputation<br />
              <span className="text-night-accent">Management.</span>
            </h1>

            <p className="mb-10 max-w-lg text-lg leading-relaxed text-night-muted md:text-xl">
              Connect your Google Business Profile via secure OAuth 2.0. Collect authentic customer reviews, manage feedback privately, and respond to all reviews — from one professional platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-night-accent px-7 py-3.5 text-base font-semibold text-night transition-all hover:bg-night-accent-hover"
                >
                  Start free — 7 days
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.05] px-7 py-3.5 text-base font-medium text-night-text transition-all hover:bg-white/[0.08]"
                >
                  See how it works
                </Link>
              </motion.div>
            </div>

            <p className="mt-4 text-sm text-night-subtle">
              No credit card · Cancel anytime · Made for Indian businesses
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap gap-8 border-t border-white/[0.08] pt-10">
              {stats.map(({ val, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
                >
                  <p className="font-display text-2xl font-bold text-night-text">{val}</p>
                  <p className="mt-0.5 text-xs text-night-subtle">{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {trustBadges.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-night-muted"
                >
                  <Icon className="h-3.5 w-3.5 text-night-accent" />
                  {label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex min-h-[540px] items-center justify-center"
          >
            {/* Phone glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-80 w-80 rounded-full bg-night-accent/[0.1] blur-[80px]" />
            </div>

            <div className="relative w-[272px] select-none">
              <div className="overflow-hidden rounded-[2.5rem] border-[7px] border-white/[0.15] bg-[#0f1629] shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
                <div className="flex justify-center py-3">
                  <div className="h-5 w-20 rounded-full bg-white/10" />
                </div>
                <div className="px-4 pb-7">
                  <div className="mb-4 flex items-center gap-2.5 border-b border-white/[0.08] pb-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-night-accent">
                      <span className="text-[10px] font-bold text-night">RC</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-white">Rahul&apos;s Cafe</p>
                      <p className="text-[9px] text-white/50">Bengaluru · Google Business ✓</p>
                    </div>
                  </div>

                  <p className="mb-4 text-center text-[11px] font-medium text-white">How was your experience?</p>

                  <div className="mb-5 flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.div
                        key={s}
                        animate={stars >= s ? { scale: [0.7, 1.35, 1] } : { scale: 0.7 }}
                        transition={
                          stars >= s
                            ? { type: "tween", duration: 0.3, ease: "easeOut", delay: s * 0.16 }
                            : { duration: 0 }
                        }
                      >
                        <Star
                          className={`h-7 w-7 transition-colors duration-200 ${
                            stars >= s ? "fill-current text-[#f59e0b]" : "text-white/20"
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <p className="mb-2 text-center text-[9px] uppercase tracking-wide text-white/40">
                    Choose a review to post
                  </p>
                  <div className="mb-3 space-y-2">
                    {[
                      { text: "Amazing coffee! Cozy ambience and super friendly staff. Definitely coming back!", selected: true },
                      { text: "Great place to work — fast WiFi, excellent coffee, quiet vibe.", selected: false },
                    ].map(({ text, selected }, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={reviewsVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: i * 0.2, duration: 0.4 }}
                        className={`rounded-xl border p-2.5 ${
                          selected
                            ? "border-night-accent/40 bg-night-accent/[0.08] ring-1 ring-night-accent/20"
                            : "border-white/[0.08] bg-white/[0.04]"
                        }`}
                      >
                        {selected && (
                          <div className="mb-1 flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-night-accent" />
                            <span className="text-[8px] font-semibold uppercase tracking-wide text-night-accent">
                              Selected
                            </span>
                          </div>
                        )}
                        <p className="text-[9px] leading-relaxed text-white/70">{text}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={buttonVisible ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <button className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-night-accent py-3 text-[11px] font-semibold text-night">
                      <Check className="h-3.5 w-3.5" />
                      Post to Google
                    </button>
                  </motion.div>
                </div>
              </div>
              <div className="mt-2 flex justify-center">
                <div className="h-1.5 w-24 rounded-full bg-white/10" />
              </div>
            </div>

            {/* Floating: New review */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 2.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-2 top-10 w-48 rounded-2xl border border-white/[0.1] bg-night-card p-3 shadow-xl lg:-right-10"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-night-accent/[0.15]">
                  <Star className="h-4 w-4 fill-current text-[#f59e0b]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-night-text">New review on Google!</p>
                  <p className="mt-0.5 text-[9px] text-night-muted">Rahul&apos;s Cafe · just now</p>
                </div>
              </div>
            </motion.div>

            {/* Floating: Shield */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 3.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -left-2 bottom-24 w-48 rounded-2xl border border-white/[0.1] bg-night-card p-3 shadow-xl lg:-left-10"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-night-accent/[0.12]">
                  <Shield className="h-4 w-4 text-night-accent" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-night-text">Private feedback received</p>
                  <p className="mt-0.5 text-[9px] text-night-muted">Sent to owner&apos;s inbox only</p>
                </div>
              </div>
            </motion.div>

            {/* Floating: OAuth */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.4, duration: 0.5 }}
              className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-2xl border border-white/[0.1] bg-night-card px-4 py-2.5 shadow-xl"
            >
              <Lock className="h-3.5 w-3.5 text-night-accent" />
              <span className="text-xs font-medium text-night-text">Connected via OAuth 2.0</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
