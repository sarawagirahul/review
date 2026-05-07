"use client";

import { motion } from "framer-motion";
import { QrCode, Wand2, Star } from "lucide-react";

const steps = [
  {
    icon: QrCode,
    title: "Customer scans the QR code",
    description: "Place our beautifully designed QR stand at your counter. Customers simply point their phone camera at it.",
    color: "bg-signature-peach",
  },
  {
    icon: Wand2,
    title: "AI writes the perfect review",
    description: "Our AI generates 3 customized, high-quality reviews based on your business. The customer picks their favorite.",
    color: "bg-signature-mint",
  },
  {
    icon: Star,
    title: "Posted to Google instantly",
    description: "With one tap, the review is copied and they are redirected to your Google page to paste and submit.",
    color: "bg-signature-mustard",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-soft py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-display text-4xl text-ink">How it works</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted">
            We removed all the friction from leaving a review. It takes less than 30 seconds.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative flex flex-col items-center rounded-2xl bg-canvas p-8 text-center shadow-subtle border border-hairline"
            >
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}>
                <step.icon className="h-8 w-8 text-ink" />
              </div>
              <h3 className="mb-3 text-xl font-medium text-ink">{step.title}</h3>
              <p className="text-body leading-relaxed">{step.description}</p>
              
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden absolute top-16 -right-4 w-8 h-px bg-hairline md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
