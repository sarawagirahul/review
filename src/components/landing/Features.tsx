"use client";

import { motion } from "framer-motion";
import { Shield, MessageSquare, ChartBar as BarChart3, Languages, Lock, Eye } from "lucide-react";
import Image from "next/image";

export function Features() {
  return (
    <section id="features" className="bg-canvas py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-display text-4xl text-ink">
            Built for trust, designed for growth
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            More than just QR codes. A complete system to manage your online reputation
            transparently and securely.
          </p>
        </motion.div>

        {/* Private Feedback Channel - Signature Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 overflow-hidden rounded-3xl bg-signature-forest p-8 md:p-16 lg:grid lg:items-center lg:gap-12"
        >
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-4 font-display text-3xl text-white">
                Private Feedback Channel for Improved Customer Service
              </h3>
              <p className="mb-6 text-lg text-white/80">
                When a customer rates their experience below 3 stars, they are offered a private
                feedback form that goes directly to your email. This gives you a chance to address
                concerns and improve service — before issues escalate publicly.
              </p>
              <p className="text-sm text-white/60">
                Customers are always free to leave any review on Google. This channel simply offers
                an additional way to share feedback directly with the business.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:w-5/12">
              <div className="rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between border-b border-hairline pb-4">
                  <span className="font-medium text-ink">Private Feedback Received</span>
                  <span className="rounded-full bg-signature-coral px-2 py-1 text-xs font-bold text-white">
                    Just now
                  </span>
                </div>
                <p className="text-sm text-body">
                  &quot;The food was cold by the time it reached our table.&quot;
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex text-signature-mustard">
                    <StarIcon filled />
                    <StarIcon filled />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                  </div>
                  <span className="text-xs text-muted">2/5</span>
                </div>
                <div className="mt-4 rounded-lg bg-signature-mint/20 p-3">
                  <p className="text-xs font-medium text-signature-forest">
                    Sent to business owner&apos;s email for follow-up
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={MessageSquare}
            title="AI Reply Generator"
            description="Reply to all your existing Google reviews with one click. AI writes professional, empathetic responses."
            color="bg-signature-cream"
          />
          <FeatureCard
            icon={Languages}
            title="Multi-lingual Support"
            description="Customers can generate reviews in English, Hindi, or Hinglish — accessible to everyone."
            color="bg-surface-soft"
          />
          <FeatureCard
            icon={BarChart3}
            title="Real-time Analytics"
            description="Track QR scans, review counts, and conversion rates over time from one dashboard."
            color="bg-surface-soft"
          />
          <FeatureCard
            icon={Lock}
            title="Secure by Design"
            description="OAuth 2.0 authentication, no password storage, and full compliance with Google API policies."
            color="bg-signature-mint/20"
          />
        </div>

        {/* Data Security & Compliance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          id="trust"
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-hairline bg-surface-soft p-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-signature-forest/10">
              <Lock className="h-5 w-5 text-signature-forest" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-ink">Data Security</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signature-forest" />
                OAuth 2.0 for Google API access
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signature-forest" />
                No Google passwords stored
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signature-forest" />
                Data encrypted in transit and at rest
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface-soft p-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-signature-forest/10">
              <Eye className="h-5 w-5 text-signature-forest" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-ink">Transparency</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signature-forest" />
                Google API Services User Data Policy compliant
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signature-forest" />
                Clear data usage disclosure
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signature-forest" />
                No data sold to third parties
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-hairline bg-surface-soft p-8">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-signature-forest/10">
              <Shield className="h-5 w-5 text-signature-forest" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-ink">Compliance</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signature-forest" />
                No review gating — all customers can post freely
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signature-forest" />
                No fake or incentivized reviews
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signature-forest" />
                Adheres to Google Prohibited Content Policy
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl ${color} p-8 border border-hairline`}
    >
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
        <Icon className="h-6 w-6 text-ink" />
      </div>
      <h3 className="mb-3 text-xl font-medium text-ink">{title}</h3>
      <p className="text-body leading-relaxed">{description}</p>
    </motion.div>
  );
}

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      className={`w-4 h-4 ${filled ? "text-signature-mustard fill-current" : "text-gray-300"}`}
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
